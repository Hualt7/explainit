"use client";

import PresentationPlayer from "./player";
import { useProjectStore } from "../store/useProjectStore";

const mockSlides = [
    { id: 1, type: "title", content: "Understanding React Context", icon: "Layout" },
    { id: 2, type: "content", content: "Prop drilling makes passing data through many layers very tedious.", icon: "Layers" },
    { id: 3, type: "diagram", content: "Context Provider vs Consumer", icon: "ImageIcon" },
    { id: 4, type: "content", content: "The Provider component holds the state at the top of the tree.", icon: "Layers" },
    { id: 5, type: "summary", content: "Use Context to share global state like themes or user sessions without passing props manually.", icon: "Type" },
];

export default function PresentationPage() {
    const generatedSlides = useProjectStore((state) => state.generatedSlides);
    const slides = generatedSlides.length > 0 ? generatedSlides : mockSlides;

    return (
        <PresentationPlayer slides={slides} />
    )
}
