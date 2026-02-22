"use client";

import { Player } from "@remotion/player";
import { ExplainItVideo, SLIDE_DURATION_FRAMES } from "./Root";

interface Slide {
    id: number;
    type: string;
    content: string;
    icon: string;
}

export default function VideoPreview({ slides }: { slides: Slide[] }) {
    return (
        <Player
            component={() => <ExplainItVideo slides={slides} />}
            inputProps={{ slides }}
            durationInFrames={slides.length * SLIDE_DURATION_FRAMES}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
                width: "100%",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
            controls
            autoPlay
            loop
        />
    );
}
