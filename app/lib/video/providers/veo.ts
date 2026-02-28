import type { VideoProvider, GenerateOptions, JobStatus } from "../types";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

function getApiKey(): string {
    const key = process.env.GOOGLE_VEO_API_KEY;
    if (!key) throw new Error("GOOGLE_VEO_API_KEY is not set");
    return key;
}

// Clamp duration to Veo's supported values (4, 6, or 8 seconds)
function clampDuration(seconds: number): number {
    if (seconds <= 5) return 4;
    if (seconds <= 7) return 6;
    return 8;
}

function mapAspectRatio(ratio: string): string {
    if (ratio === "9:16") return "9:16";
    return "16:9"; // default
}

export const veoProvider: VideoProvider = {
    id: "veo",
    name: "Google Veo 3.1",
    maxDuration: 8,

    async generate(prompt: string, options: GenerateOptions) {
        const apiKey = getApiKey();

        const body = {
            instances: [{ prompt }],
            parameters: {
                aspectRatio: mapAspectRatio(options.aspectRatio),
                durationSeconds: clampDuration(options.duration),
                sampleCount: 1,
                ...(options.negativePrompt && { negativePrompt: options.negativePrompt }),
            },
        };

        const res = await fetch(
            `${BASE}/models/veo-3.1-generate-preview:predictLongRunning?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Veo generate failed (${res.status}): ${err}`);
        }

        const data = await res.json();
        // The response contains an operation name like "operations/xxx"
        const operationName: string = data.name;

        if (!operationName) {
            throw new Error("Veo response missing operation name");
        }

        return { jobId: operationName };
    },

    async checkStatus(jobId: string) {
        const apiKey = getApiKey();

        const res = await fetch(`${BASE}/${jobId}?key=${apiKey}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Veo status check failed (${res.status}): ${err}`);
        }

        const data = await res.json();

        if (data.done === true) {
            const samples = data.response?.generateVideoResponse?.generatedSamples;
            const videoUri = samples?.[0]?.video?.uri;

            if (videoUri) {
                // Append API key for authenticated download
                const downloadUrl = `${videoUri}&key=${apiKey}`;
                return { status: "completed" as JobStatus, resultUrl: downloadUrl };
            }

            // Check for errors in completed operation
            if (data.error) {
                return {
                    status: "failed" as JobStatus,
                    error: data.error.message || "Veo generation failed",
                };
            }

            return { status: "failed" as JobStatus, error: "No video in response" };
        }

        // Still processing
        const metadata = data.metadata;
        const progress = metadata?.progress ? Math.round(metadata.progress * 100) : undefined;

        return { status: "processing" as JobStatus, progress };
    },
};
