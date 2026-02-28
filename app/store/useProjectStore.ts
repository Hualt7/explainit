import { create } from "zustand";
import type { Slide } from "../types";
import type { VideoBlueprint, VideoJob } from "../lib/video/types";

interface ProjectState {
    currentProjectId: string | null;
    projectTitle: string;
    generatedSlides: Slide[];
    scriptText: string;

    // Cinematic video state
    videoBlueprint: VideoBlueprint | null;
    videoJobs: VideoJob[];
    isGeneratingVideo: boolean;
    videoProgress: number; // 0-100
    videoPhase: "idle" | "blueprinting" | "generating" | "complete" | "error";
    videoError: string | null;

    // Actions — slides
    setCurrentProjectId: (id: string | null) => void;
    setProjectTitle: (title: string) => void;
    setGeneratedSlides: (slides: Slide[]) => void;
    setScriptText: (text: string) => void;
    resetProject: () => void;

    // Actions — video
    setVideoBlueprint: (blueprint: VideoBlueprint | null) => void;
    setVideoJobs: (jobs: VideoJob[]) => void;
    setIsGeneratingVideo: (val: boolean) => void;
    setVideoProgress: (val: number) => void;
    setVideoPhase: (phase: "idle" | "blueprinting" | "generating" | "complete" | "error") => void;
    setVideoError: (error: string | null) => void;
    resetVideo: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    currentProjectId: null,
    projectTitle: "Untitled Project",
    generatedSlides: [],
    scriptText: "",

    // Video defaults
    videoBlueprint: null,
    videoJobs: [],
    isGeneratingVideo: false,
    videoProgress: 0,
    videoPhase: "idle",
    videoError: null,

    // Slide actions
    setCurrentProjectId: (id) => set({ currentProjectId: id }),
    setProjectTitle: (title) => set({ projectTitle: title }),
    setGeneratedSlides: (slides) => set({ generatedSlides: slides }),
    setScriptText: (text) => set({ scriptText: text }),
    resetProject: () =>
        set({
            currentProjectId: null,
            projectTitle: "Untitled Project",
            generatedSlides: [],
            scriptText: "",
            videoBlueprint: null,
            videoJobs: [],
            isGeneratingVideo: false,
            videoProgress: 0,
            videoPhase: "idle",
            videoError: null,
        }),

    // Video actions
    setVideoBlueprint: (blueprint) => set({ videoBlueprint: blueprint }),
    setVideoJobs: (jobs) => set({ videoJobs: jobs }),
    setIsGeneratingVideo: (val) => set({ isGeneratingVideo: val }),
    setVideoProgress: (val) => set({ videoProgress: val }),
    setVideoPhase: (phase) => set({ videoPhase: phase }),
    setVideoError: (error) => set({ videoError: error }),
    resetVideo: () =>
        set({
            videoBlueprint: null,
            videoJobs: [],
            isGeneratingVideo: false,
            videoProgress: 0,
            videoPhase: "idle",
            videoError: null,
        }),
}));
