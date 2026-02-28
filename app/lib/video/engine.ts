import type { VideoBlueprint, VideoJob, VideoProvider, JobStatus, ProviderKey } from "./types";
import { getProvider } from "./providers";

interface EngineOptions {
    provider: ProviderKey;
    quality: "standard" | "high";
}

/** Delay helper */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Build the full prompt for a shot */
export function buildShotPrompt(shot: { visual: string; cameraMove?: string; textOverlay?: string }): string {
    const parts: string[] = [shot.visual];
    if (shot.cameraMove && shot.cameraMove !== "static") {
        parts.push(`Camera movement: ${shot.cameraMove}.`);
    }
    if (shot.textOverlay) {
        parts.push(`Text overlay visible in frame: "${shot.textOverlay}".`);
    }
    return parts.join(" ");
}

/**
 * Submit all shots from a blueprint to the selected video provider.
 * Staggers requests with a delay to avoid rate limiting (429 errors).
 */
export async function submitBlueprint(
    blueprint: VideoBlueprint,
    options: EngineOptions
): Promise<VideoJob[]> {
    const provider = getProvider(options.provider);
    const jobs: VideoJob[] = [];

    // Stagger delay between submissions to avoid rate limits (ms)
    const STAGGER_DELAY_MS = 6000; // 6 seconds between shots

    for (let i = 0; i < blueprint.shots.length; i++) {
        const shot = blueprint.shots[i];

        // Wait between submissions (skip delay for the first shot)
        if (i > 0) {
            await delay(STAGGER_DELAY_MS);
        }

        const fullPrompt = buildShotPrompt(shot);
        const duration = Math.min(shot.duration, provider.maxDuration);

        try {
            const result = await provider.generate(fullPrompt, {
                duration,
                aspectRatio: blueprint.aspectRatio,
                resolution: options.quality === "high" ? "1080p" : "720p",
            });

            jobs.push({
                jobId: result.jobId,
                provider: provider.id,
                shotId: shot.id,
                status: "queued",
            });
        } catch (error: any) {
            // On rate limit (429), wait longer and retry once
            if (error.message?.includes("429")) {
                await delay(15000); // Wait 15 seconds
                try {
                    const result = await provider.generate(fullPrompt, {
                        duration,
                        aspectRatio: blueprint.aspectRatio,
                        resolution: options.quality === "high" ? "1080p" : "720p",
                    });
                    jobs.push({
                        jobId: result.jobId,
                        provider: provider.id,
                        shotId: shot.id,
                        status: "queued",
                    });
                    continue;
                } catch (retryError: any) {
                    // Retry also failed, fall through to failure
                    error = retryError;
                }
            }

            jobs.push({
                jobId: "",
                provider: provider.id,
                shotId: shot.id,
                status: "failed",
                error: error.message || "Failed to submit shot",
            });
        }
    }

    return jobs;
}

/**
 * Poll the status of all pending/processing jobs.
 * Returns updated job array with new statuses.
 */
export async function pollJobs(
    jobs: VideoJob[],
    providerKey: ProviderKey
): Promise<VideoJob[]> {
    const provider = getProvider(providerKey);
    const updated: VideoJob[] = [];

    for (const job of jobs) {
        // Skip already completed or failed jobs
        if (job.status === "completed" || job.status === "failed" || !job.jobId) {
            updated.push(job);
            continue;
        }

        try {
            const status = await provider.checkStatus(job.jobId);
            updated.push({
                ...job,
                status: status.status,
                resultUrl: status.resultUrl || job.resultUrl,
                progress: status.progress,
                error: status.error,
            });
        } catch (error: any) {
            updated.push({
                ...job,
                status: "failed",
                error: error.message || "Status check failed",
            });
        }
    }

    return updated;
}

/**
 * Regenerate a single shot by its shotId.
 * Returns a new VideoJob for that shot.
 */
export async function regenerateShot(
    blueprint: VideoBlueprint,
    shotId: number,
    options: EngineOptions
): Promise<VideoJob> {
    const provider = getProvider(options.provider);
    const shot = blueprint.shots.find((s) => s.id === shotId);

    if (!shot) {
        throw new Error(`Shot ${shotId} not found in blueprint`);
    }

    const promptParts: string[] = [shot.visual];
    if (shot.cameraMove && shot.cameraMove !== "static") {
        promptParts.push(`Camera movement: ${shot.cameraMove}.`);
    }
    if (shot.textOverlay) {
        promptParts.push(`Text overlay visible in frame: "${shot.textOverlay}".`);
    }

    const duration = Math.min(shot.duration, provider.maxDuration);

    const result = await provider.generate(promptParts.join(" "), {
        duration,
        aspectRatio: blueprint.aspectRatio,
        resolution: options.quality === "high" ? "1080p" : "720p",
    });

    return {
        jobId: result.jobId,
        provider: provider.id,
        shotId: shot.id,
        status: "queued",
    };
}

/**
 * Calculate overall progress from job array.
 */
export function calculateProgress(jobs: VideoJob[]): number {
    if (jobs.length === 0) return 0;

    const weights: Record<JobStatus, number> = {
        queued: 0,
        processing: 0.5,
        completed: 1,
        failed: 1, // count failed as "done" for progress calculation
    };

    const total = jobs.reduce((sum, job) => sum + (weights[job.status] ?? 0), 0);
    return Math.round((total / jobs.length) * 100);
}

/**
 * Check if all jobs are in a terminal state.
 */
export function isComplete(jobs: VideoJob[]): boolean {
    return jobs.length > 0 && jobs.every((j) => j.status === "completed" || j.status === "failed");
}
