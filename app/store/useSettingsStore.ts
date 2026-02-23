import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AISettings {
    tone: "professional" | "casual" | "academic" | "fun" | "storytelling";
    slideCount: "auto" | "short" | "medium" | "long"; // auto, 6-8, 12-15, 16-20
    style: "visual" | "text-heavy" | "balanced";
    includeCode: boolean;
    includeQuotes: boolean;
    includeFunFacts: boolean;
    includeStatistics: boolean;
    customInstructions: string;
}

export interface PresentationSettings {
    defaultAccent: string;
    autoPlay: boolean;
    slideDuration: number; // seconds per slide
    enableVoice: boolean; // Text-to-speech for slides
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
