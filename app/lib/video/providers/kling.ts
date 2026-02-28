import type { VideoProvider, GenerateOptions, JobStatus } from "../types";

const BASE = "https://api.klingai.com/v1";

function getApiKey(): string {
    const key = process.env.KLING_API_KEY;
    if (!key) throw new Error("KLING_API_KEY is not set");
    return key;
}

function getApiSecret(): string {
    const secret = process.env.KLING_API_SECRET;
    if (!secret) throw new Error("KLING_API_SECRET is not set");
    return secret;
}

// Kling uses JWT for auth — we build a simple one here.
// In production you'd use a proper JWT library, but for simplicity:
async function getAuthToken(): Promise<string> {
    const apiKey = getApiKey();
    const apiSecret = getApiSecret();

    // Kling accepts the API key directly as a Bearer token in their newer API
    // If JWT is required, we encode: header.payload.signature
    // For the simpler auth flow, the key itself is the token
    // Check if it looks like a JWT already
    if (apiKey.includes(".")) {
        return apiKey; // Already a JWT/token
    }

    // Build a minimal JWT (HS256)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
        iss: apiKey,
        iat: now,
        exp: now + 3600, // 1 hour
    }));

    // Sign with HMAC-SHA256 using Web Crypto API
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(apiSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(`${header}.${payload}`)
    );

    const signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return `${header}.${payload}.${signature}`;
}

function mapAspectRatio(ratio: string): string {
    switch (ratio) {
        case "9:16": return "9:16";
        case "1:1": return "1:1";
        default: return "16:9";
    }
}

// Kling supports 5 or 10 second clips
function clampDuration(seconds: number): string {
    return seconds <= 7 ? "5" : "10";
}

export const klingProvider: VideoProvider = {
    id: "kling",
    name: "Kling 2.6",
    maxDuration: 10,

    async generate(prompt: string, options: GenerateOptions) {
        const token = await getAuthToken();

        const body = {
            prompt,
            model_name: "kling-v2.6",
            mode: options.resolution === "high" ? "master" : "standard",
            aspect_ratio: mapAspectRatio(options.aspectRatio),
            duration: clampDuration(options.duration),
            ...(options.negativePrompt && { negative_prompt: options.negativePrompt }),
        };

        const res = await fetch(`${BASE}/videos/text2video`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Kling generate failed (${res.status}): ${err}`);
        }

        const data = await res.json();
        const taskId: string = data.data?.task_id || data.task_id;

        if (!taskId) {
            throw new Error("Kling response missing task_id");
        }

        return { jobId: taskId };
    },

    async checkStatus(jobId: string) {
        const token = await getAuthToken();

        const res = await fetch(`${BASE}/videos/text2video/${jobId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Kling status check failed (${res.status}): ${err}`);
        }

        const data = await res.json();
        const taskData = data.data || data;

        switch (taskData.task_status) {
            case "succeed": {
                const videoUrl = taskData.task_result?.videos?.[0]?.url;
                return { status: "completed" as JobStatus, resultUrl: videoUrl };
            }
            case "failed":
                return {
                    status: "failed" as JobStatus,
                    error: taskData.task_status_msg || "Kling generation failed",
                };
            case "processing":
                return { status: "processing" as JobStatus };
            case "submitted":
            default:
                return { status: "queued" as JobStatus };
        }
    },
};
