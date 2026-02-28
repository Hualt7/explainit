import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProviderKey } from "../lib/video/types";

export type VideoStylePreset = "teacher" | "youtube-tech" | "corporate" | "custom";

export interface AISettings {
    tone: "professional" | "casual" | "academic" | "fun" | "storytelling" | "tech-deep-dive";
    slideCount: "auto" | "short" | "medium" | "long"; // auto, 6-8, 12-15, 16-20
    style: "visual" | "text-heavy" | "balanced";
    videoStylePreset: VideoStylePreset; // applies tone+style+slideCount when set
    includeCode: boolean;
    includeQuotes: boolean;
    includeFunFacts: boolean;
    includeStatistics: boolean;
    customInstructions: string;
}

export type MusicMood = "calm" | "uplifting" | "corporate" | "playful" | "none";

export interface PresentationSettings {
    defaultAccent: string;
    autoPlay: boolean;
    slideDuration: number; // seconds per slide
    enableVoice: boolean; // Text-to-speech for slides
    enableMusic: boolean;
    musicMood: MusicMood;
    musicVolume: number; // 0–1, ducked further when voice is on
}

export interface VideoGenSettings {
    provider: ProviderKey;
    aspectRatio: "16:9" | "9:16" | "1:1";
    quality: "standard" | "high";
}

interface SettingsState {
    ai: AISettings;
    presentation: PresentationSettings;
    video: VideoGenSettings;
    setAI: (settings: Partial<AISettings>) => void;
    setPresentation: (settings: Partial<PresentationSettings>) => void;
    setVideo: (settings: Partial<VideoGenSettings>) => void;
    resetAll: () => void;
}

const defaultAI: AISettings = {
    tone: "professional",
    slideCount: "medium",
    style: "balanced",
    videoStylePreset: "custom",
    includeCode: true,
    includeQuotes: true,
    includeFunFacts: true,
    includeStatistics: true,
    customInstructions: "",
};

const defaultPresentation: PresentationSettings = {
    defaultAccent: "purple",
    autoPlay: true,
    slideDuration: 5,
    enableVoice: false,
    enableMusic: true,
    musicMood: "calm",
    musicVolume: 0.25,
};

const defaultVideo: VideoGenSettings = {
    provider: "veo",
    aspectRatio: "16:9",
    quality: "standard",
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ai: defaultAI,
            presentation: defaultPresentation,
            video: defaultVideo,
            setAI: (updates) =>
                set((state) => ({ ai: { ...state.ai, ...updates } })),
            setPresentation: (updates) =>
                set((state) => ({
                    presentation: { ...state.presentation, ...updates },
                })),
            setVideo: (updates) =>
                set((state) => ({
                    video: { ...state.video, ...updates },
                })),
            resetAll: () =>
                set({ ai: defaultAI, presentation: defaultPresentation, video: defaultVideo }),
        }),
        { name: "explainit-settings" }
    )
);
