"use client";

import PresentationPlayer from "./player";
import ErrorBoundary from "../components/ErrorBoundary";
import { useProjectStore } from "../store/useProjectStore";

const mockSlides = [
    { id: 1, type: "title", title: "Understanding React Context", subtitle: "A primer on state management" },
    { id: 2, type: "content", title: "The Prop Drilling Problem", bullets: ["Passing data through many layers is tedious", "Intermediate components don't need the data", "Code becomes harder to maintain"] },
    { id: 3, type: "diagram", title: "Context Provider vs Consumer", nodes: [{ label: "Provider" }, { label: "Context" }, { label: "Consumer" }], description: "Context wraps the tree so consumers can access data directly." },
    { id: 4, type: "content", title: "How Context Works", bullets: ["Provider holds the state at the top of the tree", "Any nested component can consume the context", "No need to pass props through intermediate layers"] },
    { id: 5, type: "summary", title: "Key Takeaways", keyPoints: ["Context solves prop drilling", "Use it for global state like themes or auth", "Don't overuse it for local state"], closingLine: "Context is a powerful tool when used wisely." },
];

export default function PresentationPage() {
    const generatedSlides = useProjectStore((state) => state.generatedSlides);
    const slides = generatedSlides.length > 0 ? generatedSlides : mockSlides;

    return (
        <ErrorBoundary fallbackMessage="Something went wrong during the presentation. Try going back to the dashboard.">
            <PresentationPlayer slides={slides} />
        </ErrorBoundary>
    );
}
