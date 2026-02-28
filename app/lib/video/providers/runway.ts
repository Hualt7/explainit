import type { VideoProvider, GenerateOptions, JobStatus } from "../types";

const BASE = "https://api.dev.runwayml.com/v1";
const API_VERSION = "2024-11-06";

function getApiKey(): string {
    const key = process.env.RUNWAY_API_KEY;
    if (!key) throw new Error("RUNWAY_API_KEY is not set");
    return key;
}

function mapRatio(ratio: string): string {
    switch (ratio) {
        case "9:16": return "720:1280";
        case "1:1": return "960:960";
        default: return "1280:720"; // 16:9
    }
}

// Clamp duration: Runway supports 2-10 seconds
function clampDuration(seconds: number): number {
    return Math.max(2, Math.min(10, seconds));
}

export const runwayProvider: VideoProvider = {
    id: "runway",
    name: "Runway Gen-4 Turbo",
    maxDuration: 10,

    async generate(prompt: string, options: GenerateOptions) {
        const apiKey = getApiKey();

        const body: Record<string, unknown> = {
            promptText: prompt,
            model: "gen4_turbo",
            ratio: mapRatio(options.aspectRatio),
            duration: clampDuration(options.duration),
        };

        // If a reference image is provided, use image-to-video mode
        if (options.imageRef) {
            body.promptImage = options.imageRef;
        }

        const res = await fetch(`${BASE}/image_to_video`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "X-Runway-Version": API_VERSION,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Runway generate failed (${res.status}): ${err}`);
        }

        const data = await res.json();
        const taskId: string = data.id;

        if (!taskId) {
            throw new Error("Runway response missing task id");
        }

        return { jobId: taskId };
    },

    async checkStatus(jobId: string) {
        const apiKey = getApiKey();

        const res = await fetch(`${BASE}/tasks/${jobId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "X-Runway-Version": API_VERSION,
            },
        });

        if (!res.ok) {
            if (res.status === 404) {
                return { status: "failed" as JobStatus, error: "Task not found or expired" };
            }
            const err = await res.text();
            throw new Error(`Runway status check failed (${res.status}): ${err}`);
        }

        const data = await res.json();

        switch (data.status) {
            case "SUCCEEDED": {
                // Output contains the video URL
                const resultUrl = data.output?.[0] || data.artifactUrl;
                return { status: "completed" as JobStatus, resultUrl };
            }
            case "FAILED":
                return {
                    status: "failed" as JobStatus,
                    error: data.failure || data.failReason || "Runway generation failed",
                };
            case "RUNNING":
                return { status: "processing" as JobStatus, progress: data.progress ? Math.round(data.progress * 100) : undefined };
            case "PENDING":
            case "THROTTLED":
            default:
                return { status: "queued" as JobStatus };
        }
    },
};
