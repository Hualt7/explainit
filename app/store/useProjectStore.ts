import { create } from "zustand";
import type { Slide } from "../types";

interface ProjectState {
    currentProjectId: string | null;
    projectTitle: string;
    generatedSlides: Slide[];
    scriptText: string;

    // Actions
    setCurrentProjectId: (id: string | null) => void;
    setProjectTitle: (title: string) => void;
    setGeneratedSlides: (slides: Slide[]) => void;
    setScriptText: (text: string) => void;
    resetProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    currentProjectId: null,
    projectTitle: "Untitled Project",
    generatedSlides: [],
    scriptText: "",

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
        }),
}));
