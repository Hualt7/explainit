"use client";

import "./DecryptedText.css";
import { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
    text: string;
    speed?: number;
    characters?: string;
    className?: string;
    revealOnView?: boolean;
}

export default function DecryptedText({
    text,
    speed = 50,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",
    className = "",
    revealOnView = true,
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text.replace(/./g, " "));
    const [isRevealed, setIsRevealed] = useState(!revealOnView);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!revealOnView) {
            setIsRevealed(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [revealOnView]);

    useEffect(() => {
        if (!isRevealed) return;
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, i) => {
                        if (char === " ") return " ";
                        if (i < iteration) return text[i];
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );
            iteration += 1 / 3;
            if (iteration >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [isRevealed, text, speed, characters]);

    return (
        <span ref={ref} className={`decrypted-text ${className}`}>
            {displayText}
        </span>
    );
}
