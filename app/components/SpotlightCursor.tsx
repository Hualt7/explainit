"use client";
import { HTMLAttributes } from "react";
import useSpotlightEffect from "./useSpotlightEffect";

interface SpotlightConfig {
    spotlightSize?: number;
    spotlightIntensity?: number;
    fadeSpeed?: number;
    glowColor?: string;
    pulseSpeed?: number;
}

interface SpotlightCursorProps extends HTMLAttributes<HTMLCanvasElement> {
    config?: SpotlightConfig;
}

const SpotlightCursor = ({ config = {}, className, ...rest }: SpotlightCursorProps) => {
    const spotlightConfig = {
        spotlightSize: 300,
        spotlightIntensity: 0.8,
        glowColor: "147, 51, 234", // purple glow to match our brand
        fadeSpeed: 0.08,
        pulseSpeed: 3000,
        ...config,
    };

    const canvasRef = useSpotlightEffect(spotlightConfig);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full ${className || ""}`}
            {...rest}
        />
    );
};

export default SpotlightCursor;
