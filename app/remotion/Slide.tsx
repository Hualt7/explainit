import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

interface SlideProps {
    type: string;
    content: string;
}

export const TitleSlide: React.FC<SlideProps> = ({ content }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleY = interpolate(
        spring({ frame, fps, config: { damping: 200 } }),
        [0, 1],
        [60, 0]
    );
    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });

    const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Background glow */}
            <div
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 60%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Icon */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #9333ea, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 40,
                    opacity: titleOpacity,
                    boxShadow: "0 25px 50px rgba(147,51,234,0.4)",
                }}
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>

            <div
                style={{
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                    fontSize: 72,
                    fontWeight: 900,
                    color: "white",
                    textAlign: "center",
                    maxWidth: "80%",
                    lineHeight: 1.1,
                    letterSpacing: -2,
                }}
            >
                {content}
            </div>
            <div
                style={{
                    opacity: subtitleOpacity,
                    fontSize: 24,
                    color: "#9ca3af",
                    marginTop: 24,
                    fontWeight: 500,
                }}
            >
                ExplainIt Auto-Generated Course
            </div>
        </AbsoluteFill>
    );
};

export const ContentSlide: React.FC<SlideProps> = ({ content }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const lineWidth = interpolate(
        spring({ frame, fps, config: { damping: 200 } }),
        [0, 1],
        [0, 4]
    );
    const textOpacity = interpolate(frame, [5, 25], [0, 1], {
        extrapolateRight: "clamp",
    });
    const textX = interpolate(frame, [5, 25], [40, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000",
                justifyContent: "center",
                padding: "0 120px",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div style={{ display: "flex", alignItems: "stretch", gap: 32 }}>
                <div
                    style={{
                        width: lineWidth,
                        backgroundColor: "#9333ea",
                        borderRadius: 4,
                        flexShrink: 0,
                    }}
                />
                <div
                    style={{
                        opacity: textOpacity,
                        transform: `translateX(${textX}px)`,
                        fontSize: 56,
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1.3,
                        letterSpacing: -1,
                    }}
                >
                    {content}
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const DiagramSlide: React.FC<SlideProps> = ({ content }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });
    const boxScale = interpolate(
        spring({ frame: frame - 10, fps, config: { damping: 200 } }),
        [0, 1],
        [0.8, 1]
    );
    const boxOpacity = interpolate(frame, [10, 30], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "0 80px",
                gap: 60,
            }}
        >
            <div style={{ flex: 1, opacity: textOpacity }}>
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1.2,
                        marginBottom: 16,
                    }}
                >
                    {content}
                </div>
                <div style={{ fontSize: 20, color: "#9ca3af" }}>
                    Visualizing the concept.
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    opacity: boxOpacity,
                    transform: `scale(${boxScale})`,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: 400,
                        height: 400,
                        borderRadius: 24,
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: 32,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                    }}
                >
                    <div
                        style={{
                            borderRadius: 16,
                            backgroundColor: "rgba(147,51,234,0.15)",
                            border: "1px solid rgba(147,51,234,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#a78bfa",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            borderRadius: 16,
                            backgroundColor: "rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#60a5fa",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            gridColumn: "span 2",
                            borderRadius: 16,
                            backgroundColor: "rgba(236,72,153,0.15)",
                            border: "1px solid rgba(236,72,153,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                marginLeft: 20,
                            }}
                        />
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "#f472b6",
                            }}
                        />
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                marginRight: 20,
                            }}
                        />
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const SummarySlide: React.FC<SlideProps> = ({ content }) => {
    const frame = useCurrentFrame();

    const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });
    const quoteOpacity = interpolate(frame, [15, 35], [0, 1], {
        extrapolateRight: "clamp",
    });
    const quoteY = interpolate(frame, [15, 35], [30, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    opacity: headingOpacity,
                    fontSize: 64,
                    fontWeight: 800,
                    background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    marginBottom: 40,
                    letterSpacing: -2,
                }}
            >
                In Summary
            </div>
            <div
                style={{
                    opacity: quoteOpacity,
                    transform: `translateY(${quoteY}px)`,
                    fontSize: 32,
                    fontWeight: 500,
                    color: "white",
                    textAlign: "center",
                    maxWidth: "70%",
                    lineHeight: 1.5,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24,
                    padding: "40px 48px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                }}
            >
                "{content}"
            </div>
        </AbsoluteFill>
    );
};
