// ── Video Blueprint: the structured output Claude generates ──

export interface VideoBlueprint {
    title: string;
    style: "cinematic_product" | "narrative_story" | "motion_graphics" | "mixed";
    aspectRatio: "16:9" | "9:16" | "1:1";
    totalDuration: number; // estimated total seconds
    shots: Shot[];
    voiceover?: {
        fullScript: string;
        voice: string; // e.g. "deep_male", "warm_female"
    };
    music?: {
        style: string; // e.g. "hans_zimmer_minimal", "lo-fi_ambient"
        mood: string;
        bpm?: number;
    };
}

export interface Shot {
    id: number;
    duration: number; // seconds
    visual: string; // detailed scene description for the AI video API
    cameraMove?: string; // "push-in", "orbit", "static", "pan-left", "dolly-zoom"
    textOverlay?: string;
    transition: "cut" | "fade" | "dissolve" | "whip";
    audio?: {
        sfx?: string;
        musicMood?: string;
        narration?: string; // per-shot voiceover line
    };
}

// ── Provider abstraction ──

export interface GenerateOptions {
    duration: number;
    aspectRatio: string;
    resolution?: string;
    negativePrompt?: string;
    imageRef?: string; // reference image URL/base64 for consistency
}

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface VideoJob {
    jobId: string;
    provider: string;
    shotId: number;
    status: JobStatus;
    resultUrl?: string;
    progress?: number;
    error?: string;
}

export interface VideoProvider {
    id: string;
    name: string;
    maxDuration: number; // max seconds per single generation
    generate(prompt: string, options: GenerateOptions): Promise<{ jobId: string }>;
    checkStatus(jobId: string): Promise<{ status: JobStatus; resultUrl?: string; progress?: number; error?: string }>;
}

// ── Provider config (stored server-side via env vars) ──

export type ProviderKey = "veo" | "runway" | "kling";

export interface VideoSettings {
    provider: ProviderKey;
    aspectRatio: "16:9" | "9:16" | "1:1";
    quality: "standard" | "high";
}

// ── Engine types ──

export interface VideoGenerationState {
    blueprint: VideoBlueprint | null;
    jobs: VideoJob[];
    isGenerating: boolean;
    progress: number; // 0-100 overall
    phase: "idle" | "blueprinting" | "generating" | "complete" | "error";
    error?: string;
}
