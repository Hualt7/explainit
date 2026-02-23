import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface SettingsState {
    ai: AISettings;
    presentation: PresentationSettings;
    setAI: (settings: Partial<AISettings>) => void;
    setPresentation: (settings: Partial<PresentationSettings>) => void;
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

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ai: defaultAI,
            presentation: defaultPresentation,
            setAI: (updates) =>
                set((state) => ({ ai: { ...state.ai, ...updates } })),
            setPresentation: (updates) =>
                set((state) => ({
                    presentation: { ...state.presentation, ...updates },
                })),
            resetAll: () =>
                set({ ai: defaultAI, presentation: defaultPresentation }),
        }),
        { name: "explainit-settings" }
    )
);
