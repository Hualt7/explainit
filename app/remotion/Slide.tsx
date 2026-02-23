import React from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
} from "remotion";
import type { Slide } from "../types";

/* ─── Accent Colors ─── */
const accentMap: Record<string, string> = {
    purple: "#a855f7", blue: "#3b82f6", pink: "#ec4899", emerald: "#10b981",
    amber: "#f59e0b", rose: "#f43f5e", cyan: "#06b6d4", indigo: "#6366f1",
    violet: "#8b5cf6", teal: "#14b8a6", orange: "#f97316", lime: "#84cc16",
};
function getColor(accent?: string) { return accentMap[accent || "purple"] || accentMap.purple; }
const ec = { extrapolateRight: "clamp" as const };

/* ─── Title ─── */
export const TitleSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1], ec);
    const y = interpolate(frame, [0, 25], [40, 0], ec);
    const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <div style={{ textAlign: "center", opacity, transform: `translateY(${y}px)` }}>
                <div style={{ width: 70, height: 70, borderRadius: 16, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", boxShadow: `0 15px 40px ${color}40` }}><span style={{ fontSize: 32, color: "#fff" }}>▶</span></div>
                <h1 style={{ fontSize: 72, fontWeight: 900, color: "#fff", lineHeight: 1.1, fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h1>
                {slide.subtitle && <p style={{ fontSize: 28, color: "#9ca3af", marginTop: 20 }}>{slide.subtitle}</p>}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Content ─── */
export const ContentSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const layout = slide.layout || "default";
    const bullets = slide.bullets || [];

    if (layout === "cards") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 120px" }}>
                <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, width: "100%" }}>
                    {bullets.map((b: string, i: number) => {
                        const d = 12 + i * 8;
                        return (
                            <div key={i} style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 20, padding: 28, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                                <span style={{ fontSize: 24, color: "#fff", fontWeight: 600 }}>{b}</span>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>
        );
    }
    if (layout === "numbered") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", padding: "80px 120px" }}>
                <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ width: 6, borderRadius: 999, background: `linear-gradient(to bottom, ${color}, transparent)`, flexShrink: 0 }} />
                    <div>
                        <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                        {bullets.map((b: string, i: number) => {
                            const d = 10 + i * 8;
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 28, opacity: interpolate(frame, [d, d + 12], [0, 1], ec) }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{i + 1}</div>
                                    <span style={{ fontSize: 32, color: "#d1d5db" }}>{b}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AbsoluteFill>
        );
    }
    if (layout === "icon-list") {
        const icons = ["◆", "●", "★", "◇", "▲"];
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", padding: "80px 120px" }}>
                <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ width: 6, borderRadius: 999, background: `linear-gradient(to bottom, ${color}, transparent)`, flexShrink: 0 }} />
                    <div>
                        <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                        {bullets.map((b: string, i: number) => {
                            const d = 10 + i * 8;
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 28, opacity: interpolate(frame, [d, d + 12], [0, 1], ec) }}>
                                    <span style={{ fontSize: 28, color, flexShrink: 0 }}>{icons[i % icons.length]}</span>
                                    <span style={{ fontSize: 32, color: "#d1d5db" }}>{b}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AbsoluteFill>
        );
    }
    // default
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", padding: "80px 120px" }}>
            <div style={{ display: "flex", gap: 32 }}>
                <div style={{ width: 6, borderRadius: 999, background: `linear-gradient(to bottom, ${color}, transparent)`, flexShrink: 0 }} />
                <div>
                    <h2 style={{ fontSize: 56, fontWeight: 700, color: "#fff", opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                    {bullets.map((b: string, i: number) => {
                        const d = 10 + i * 8;
                        return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginTop: 28, opacity: interpolate(frame, [d, d + 12], [0, 1], ec), transform: `translateX(${interpolate(frame, [d, d + 12], [30, 0], ec)}px)` }}><div style={{ width: 10, height: 10, borderRadius: 999, background: color, marginTop: 10, flexShrink: 0 }} /><span style={{ fontSize: 32, color: "#d1d5db" }}>{b}</span></div>);
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Comparison ─── */
export const ComparisonSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    const layout = slide.layout || "side-by-side";
    const bulletsA = slide.bulletsA || [];
    const bulletsB = slide.bulletsB || [];

    const ColA = () => (
        <div style={{ flex: 1, background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 24, padding: 40 }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 20 }}>{slide.labelA || "A"}</h3>
            {bulletsA.map((b: string, i: number) => (<p key={i} style={{ fontSize: 22, color: "#d1d5db", marginTop: 12, opacity: interpolate(frame, [15 + i * 6, 25 + i * 6], [0, 1], ec) }}>✓ {b}</p>))}
        </div>
    );
    const ColB = () => (
        <div style={{ flex: 1, background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 24, padding: 40 }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#9ca3af", marginBottom: 20 }}>{slide.labelB || "B"}</h3>
            {bulletsB.map((b: string, i: number) => (<p key={i} style={{ fontSize: 22, color: "#d1d5db", marginTop: 12, opacity: interpolate(frame, [15 + i * 6, 25 + i * 6], [0, 1], ec) }}>✓ {b}</p>))}
        </div>
    );

    if (layout === "stacked") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
                <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 1000 }}>
                    <ColA /><ColB />
                </div>
            </AbsoluteFill>
        );
    }
    if (layout === "versus") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
                <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 32, width: "100%" }}>
                    <ColA />
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff30" }}>VS</div>
                    <ColB />
                </div>
            </AbsoluteFill>
        );
    }
    if (layout === "versus") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
                <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 32, width: "100%" }}>
                    <ColA />
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff30" }}>VS</div>
                    <ColB />
                </div>
            </AbsoluteFill>
        );
    }
    // side-by-side (default)
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "flex", gap: 24, width: "100%" }}>
                <ColA /><ColB />
            </div>
        </AbsoluteFill>
    );
};

/* ─── Timeline ─── */
export const TimelineSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    const layout = slide.layout || "vertical";
    const steps = slide.steps || [];

    const StepItem: React.FC<{ s: any; i: number }> = ({ s, i }) => {
        const d = 10 + i * 12;
        return (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ paddingTop: 8 }}><p style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{typeof s === "string" ? s : s.step}</p>{s.detail && <p style={{ fontSize: 20, color: "#9ca3af", marginTop: 4 }}>{s.detail}</p>}</div>
            </div>
        );
    };

    if (layout === "horizontal") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
                <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                    {steps.map((s: any, i: number) => (
                        <React.Fragment key={i}>
                            <StepItem s={s} i={i} />
                            {i < steps.length - 1 && <span style={{ color: "#ffffff30", fontSize: 24 }}>→</span>}
                        </React.Fragment>
                    ))}
                </div>
            </AbsoluteFill>
        );
    }
    if (layout === "zigzag") {
        return (
            <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
                <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 900 }}>
                    {steps.map((s: any, i: number) => (
                        <div key={i} style={{ alignSelf: i % 2 === 0 ? "flex-start" : "flex-end", marginLeft: i % 2 === 0 ? 0 : 80, marginRight: i % 2 === 0 ? 80 : 0 }}>
                            <StepItem s={s} i={i} />
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        );
    }
    // vertical (default)
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            {steps.map((s: any, i: number) => (
                <div key={i} style={{ marginBottom: 20 }}><StepItem s={s} i={i} /></div>
            ))}
        </AbsoluteFill>
    );
};

/* ─── Statistic ─── */
export const StatisticSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#9ca3af", marginBottom: 20, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</p>
            <p style={{ fontSize: 140, fontWeight: 900, background: `linear-gradient(90deg, ${color}, ${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, opacity: interpolate(frame, [5, 20], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.number}</p>
            {slide.unit && <p style={{ fontSize: 28, color, marginTop: 10, fontWeight: 600 }}>{slide.unit}</p>}
            {slide.description && <p style={{ fontSize: 24, color: "#9ca3af", marginTop: 20, maxWidth: 600 }}>{slide.description}</p>}
        </AbsoluteFill>
    );
};

/* ─── Quote ─── */
export const QuoteSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 100 }}>
            <div style={{ textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                <p style={{ fontSize: 120, color: `${color}40`, lineHeight: 0.5, fontFamily: "Georgia, serif" }}>&ldquo;</p>
                <p style={{ fontSize: 40, color: "#fff", fontWeight: 500, lineHeight: 1.4, maxWidth: 900, margin: "20px auto" }}>{slide.quote}</p>
                {slide.attribution && <p style={{ fontSize: 22, color, marginTop: 30, fontWeight: 600 }}>— {slide.attribution}</p>}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Diagram ─── */
export const DiagramSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <div style={{ display: "flex", gap: 60, width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1, opacity: interpolate(frame, [0, 15], [0, 1], ec) }}>
                    <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                    {slide.description && <p style={{ fontSize: 22, color: "#9ca3af", marginTop: 16 }}>{slide.description}</p>}
                </div>
                <div style={{ flex: 1, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 24, padding: 40 }}>
                    {(slide.nodes || []).map((node: any, i: number) => {
                        const d = 10 + i * 8; return (
                            <React.Fragment key={i}>
                                <div style={{ background: "#ffffff1a", border: "1px solid #ffffff1a", borderRadius: 12, padding: "16px 24px", textAlign: "center", color: "#fff", fontWeight: 600, fontSize: 20, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>{typeof node === "string" ? node : node.label}</div>
                                {i < (slide.nodes || []).length - 1 && <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><div style={{ width: 2, height: 24, background: `${color}50` }} /></div>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── List ─── */
export const ListSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
                {(slide.items || []).map((item: any, i: number) => {
                    const d = 8 + i * 6; return (
                        <div key={i} style={{ background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 16, padding: 24, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{i + 1}</div><span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{item.term}</span></div>
                            <p style={{ fontSize: 18, color: "#9ca3af", marginTop: 8, paddingLeft: 44 }}>{item.definition}</p>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Callout ─── */
export const CalloutSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    const labels: Record<string, string> = { tip: "💡 Pro Tip", warning: "⚠️ Warning", insight: "✨ Key Insight" };
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 100 }}>
            <div style={{ textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                <p style={{ fontSize: 20, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 4, marginBottom: 30 }}>{(slide.calloutType && labels[slide.calloutType]) || "✨ Note"}</p>
                <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 24, padding: "60px 80px" }}><p style={{ fontSize: 36, color: "#fff", fontWeight: 500, lineHeight: 1.5 }}>{slide.message}</p></div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Summary ─── */
export const SummarySlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center" }}>
            <h2 style={{ fontSize: 64, fontWeight: 700, background: `linear-gradient(90deg, ${color}, ${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title || "Key Takeaways"}</h2>
            {(slide.keyPoints || []).map((point: string, i: number) => {
                const d = 10 + i * 8; return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 16, padding: "20px 32px", marginBottom: 12, width: "100%", maxWidth: 800, textAlign: "left", opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <p style={{ fontSize: 22, color: "#d1d5db" }}>{point}</p>
                    </div>
                );
            })}
            {slide.closingLine && <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 16, padding: "24px 40px", marginTop: 20, maxWidth: 800 }}><p style={{ fontSize: 24, color: "#fff", fontWeight: 500 }}>&ldquo;{slide.closingLine}&rdquo;</p></div>}
        </AbsoluteFill>
    );
};

/* ═══════ NEW v3 TYPES ═══════ */

/* ─── Code ─── */
export const CodeSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 30, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ width: "100%", maxWidth: 1000, background: "#0d1117", border: "1px solid #ffffff1a", borderRadius: 16, overflow: "hidden", opacity: interpolate(frame, [8, 20], [0, 1], ec) }}>
                <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#ffffff08", borderBottom: "1px solid #ffffff1a" }}><div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f56" }} /><div style={{ width: 12, height: 12, borderRadius: 999, background: "#ffbd2e" }} /><div style={{ width: 12, height: 12, borderRadius: 999, background: "#27c93f" }} /></div>
                <pre style={{ padding: 32, fontSize: 20, fontFamily: "monospace", color: "#7ee787", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{slide.code}</pre>
            </div>
            {slide.explanation && <p style={{ fontSize: 22, color: "#9ca3af", marginTop: 20, maxWidth: 800, opacity: interpolate(frame, [20, 30], [0, 1], ec) }}>{slide.explanation}</p>}
        </AbsoluteFill>
    );
};

/* ─── Definition ─── */
export const DefinitionSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 100 }}>
            <div style={{ maxWidth: 900, opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                <p style={{ fontSize: 18, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 4, marginBottom: 20 }}>Definition</p>
                <h2 style={{ fontSize: 56, fontWeight: 900, color, fontFamily: "'Space Grotesk', sans-serif" }}>{slide.term}</h2>
                <p style={{ fontSize: 28, color: "#d1d5db", marginTop: 24, lineHeight: 1.5 }}>{slide.definition}</p>
                {slide.example && <div style={{ background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 16, padding: 24, marginTop: 24 }}><p style={{ fontSize: 22, color: "#9ca3af" }}>Example: {slide.example}</p></div>}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Pros & Cons ─── */
export const ProsConsSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 40, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "flex", gap: 24, width: "100%" }}>
                <div style={{ flex: 1, background: "#10b98120", border: "1px solid #10b98140", borderRadius: 24, padding: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, color: "#10b981", marginBottom: 20 }}>✅ Pros</h3>
                    {(slide.pros || []).map((p: string, i: number) => <p key={i} style={{ fontSize: 22, color: "#d1d5db", marginTop: 12, opacity: interpolate(frame, [15 + i * 6, 25 + i * 6], [0, 1], ec) }}>{p}</p>)}
                </div>
                <div style={{ flex: 1, background: "#f43f5e20", border: "1px solid #f43f5e40", borderRadius: 24, padding: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, color: "#f43f5e", marginBottom: 20 }}>❌ Cons</h3>
                    {(slide.cons || []).map((c: string, i: number) => <p key={i} style={{ fontSize: 22, color: "#d1d5db", marginTop: 12, opacity: interpolate(frame, [15 + i * 6, 25 + i * 6], [0, 1], ec) }}>{c}</p>)}
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Equation ─── */
export const EquationSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 100, textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#9ca3af", marginBottom: 30, opacity: interpolate(frame, [0, 15], [0, 1], ec) }}>{slide.title}</p>
            <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 24, padding: "50px 80px", opacity: interpolate(frame, [8, 20], [0, 1], ec) }}>
                <p style={{ fontSize: 56, fontFamily: "monospace", fontWeight: 700, color }}>{slide.equation}</p>
            </div>
            {slide.explanation && <p style={{ fontSize: 24, color: "#9ca3af", marginTop: 30, maxWidth: 700, opacity: interpolate(frame, [15, 25], [0, 1], ec) }}>{slide.explanation}</p>}
        </AbsoluteFill>
    );
};

/* ─── Mindmap ─── */
export const MindmapSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 44, fontWeight: 700, color: "#fff", marginBottom: 30, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)`, borderRadius: 16, padding: "20px 40px", color: "#fff", fontWeight: 700, fontSize: 28, marginBottom: 30, opacity: interpolate(frame, [5, 15], [0, 1], ec) }}>{slide.center}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, width: "100%" }}>
                {(slide.branches || []).map((b: any, i: number) => {
                    const d = 12 + i * 6; return (
                        <div key={i} style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 16, padding: 20, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                            <p style={{ fontWeight: 700, fontSize: 20, color }}>{typeof b === "string" ? b : b.label}</p>
                            {b.children && b.children.map((c: string, j: number) => <p key={j} style={{ fontSize: 16, color: "#9ca3af", marginTop: 6, paddingLeft: 12, borderLeft: "2px solid #ffffff1a" }}>{c}</p>)}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Table ─── */
export const TableSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 30, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid #ffffff1a", opacity: interpolate(frame, [8, 20], [0, 1], ec) }}>
                {slide.headers && <div style={{ display: "flex", background: `linear-gradient(90deg, ${color}, ${color}cc)` }}>{slide.headers.map((h: string, i: number) => <div key={i} style={{ flex: 1, padding: "16px 24px", color: "#fff", fontWeight: 700, fontSize: 20 }}>{h}</div>)}</div>}
                {(slide.rows || []).map((row: string[], ri: number) => <div key={ri} style={{ display: "flex", background: ri % 2 === 0 ? "#ffffff08" : "#ffffff04", borderTop: "1px solid #ffffff0a" }}>{row.map((cell: string, ci: number) => <div key={ci} style={{ flex: 1, padding: "14px 24px", color: "#d1d5db", fontSize: 18 }}>{cell}</div>)}</div>)}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Example ─── */
export const ExampleSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <div style={{ maxWidth: 900, opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                <h2 style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 24, fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                <div style={{ background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 16, padding: 24, marginBottom: 20 }}><p style={{ fontSize: 24, color: "#fff" }}>📋 {slide.scenario}</p></div>
                <p style={{ fontSize: 22, color: "#d1d5db", lineHeight: 1.5 }}>{slide.explanation}</p>
                {slide.lesson && <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 12, padding: 20, marginTop: 20 }}><p style={{ fontSize: 20, fontWeight: 600, color }}>💡 {slide.lesson}</p></div>}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Fun Fact ─── */
export const FunfactSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 100 }}>
            <div style={{ textAlign: "center", maxWidth: 900, opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                <p style={{ fontSize: 18, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 4, marginBottom: 30 }}>{slide.title || "Did You Know?"}</p>
                <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 24, padding: "50px 60px", position: "relative" }}>
                    <span style={{ position: "absolute", top: 16, right: 24, fontSize: 48, opacity: 0.2 }}>🤯</span>
                    <p style={{ fontSize: 36, color: "#fff", fontWeight: 500, lineHeight: 1.5 }}>{slide.fact}</p>
                </div>
                {slide.source && <p style={{ fontSize: 18, color, marginTop: 20 }}>Source: {slide.source}</p>}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Steps (horizontal) ─── */
export const StepsSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {(slide.steps || []).map((s: any, i: number) => {
                    const d = 10 + i * 8; return (
                        <React.Fragment key={i}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(frame, [d, d + 10], [0, 1], ec) }}>
                                <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>{i + 1}</div>
                                <div style={{ background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 12, padding: "12px 20px" }}><p style={{ color: "#fff", fontWeight: 500, fontSize: 18 }}>{typeof s === "string" ? s : s.step || s.label || ""}</p></div>
                            </div>
                            {i < (slide.steps || []).length - 1 && <span style={{ color: "#ffffff30", fontSize: 24 }}>→</span>}
                        </React.Fragment>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Highlight ─── */
export const HighlightSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center" }}>
            {slide.title && <p style={{ fontSize: 22, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 4, marginBottom: 20, opacity: interpolate(frame, [0, 10], [0, 1], ec) }}>{slide.title}</p>}
            <h1 style={{ fontSize: 120, fontWeight: 900, background: `linear-gradient(90deg, ${color}, ${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1, opacity: interpolate(frame, [5, 20], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.highlight}</h1>
            {slide.subtext && <p style={{ fontSize: 26, color: "#9ca3af", marginTop: 30, maxWidth: 600, opacity: interpolate(frame, [15, 25], [0, 1], ec) }}>{slide.subtext}</p>}
        </AbsoluteFill>
    );
};

/* ─── Bar Chart ─── */
export const BarChartSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const data = slide.data || [];
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 280 }}>
                {data.map((d: { label: string; value: number }, i: number) => {
                    const dly = 15 + i * 10;
                    const h = (d.value / maxVal) * 200;
                    const animH = interpolate(frame, [dly, dly + 15], [0, h], ec);
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 60, height: 220, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                <div style={{ width: 48, height: animH, background: `linear-gradient(to top, ${color}80, ${color})`, borderRadius: "8px 8px 0 0", boxShadow: `0 4px 20px ${color}40` }} />
                            </div>
                            <span style={{ fontSize: 16, color: "#9ca3af", textAlign: "center", maxWidth: 80 }}>{d.label}</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color }}>{d.value}{slide.unit ? ` ${slide.unit}` : ""}</span>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Pie Chart ─── */
const PIE_COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
export const PieChartSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const data = slide.data || [];
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const r = 120;
    const cx = 200;
    const cy = 140;
    let offset = 0;
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <div style={{ display: "flex", gap: 60, width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1, opacity: interpolate(frame, [0, 15], [0, 1], ec) }}>
                    <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
                    <div style={{ marginTop: 24 }}>
                        {data.map((d: { label: string; value: number; color?: string }, i: number) => {
                            const pct = (d.value / total) * 100;
                            const dly = 15 + i * 8;
                            const opacity = interpolate(frame, [dly, dly + 10], [0, 1], ec);
                            const c = d.color || PIE_COLORS[i % PIE_COLORS.length];
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, opacity }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 4, background: c }} />
                                    <span style={{ fontSize: 20, color: "#d1d5db" }}>{d.label}: {pct.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <svg width={400} height={280} viewBox="0 0 400 280" style={{ opacity: interpolate(frame, [8, 20], [0, 1], ec) }}>
                        {data.map((d: { label: string; value: number; color?: string }, i: number) => {
                            const pct = d.value / total;
                            const dashLen = 2 * Math.PI * r * pct;
                            const dashOffset = 2 * Math.PI * r - offset;
                            offset += 2 * Math.PI * r * pct;
                            const dly = 20 + i * 12;
                            const animOffset = interpolate(frame, [dly, dly + 20], [2 * Math.PI * r, dashOffset], ec);
                            const c = d.color || PIE_COLORS[i % PIE_COLORS.length];
                            return (
                                <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={48} strokeDasharray={2 * Math.PI * r} strokeDashoffset={animOffset} transform={`rotate(-90 ${cx} ${cy})`} style={{ transformOrigin: `${cx}px ${cy}px` }} />
                            );
                        })}
                        <circle cx={cx} cy={cy} r={r - 36} fill="#000" />
                    </svg>
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ─── Progress ─── */
export const ProgressSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const items = (slide.items || []).filter((i: any) => i.label != null);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ width: "100%", maxWidth: 700, display: "flex", flexDirection: "column", gap: 28 }}>
                {items.map((item: any, i: number) => {
                    const max = item.max ?? 100;
                    const val = item.value ?? 0;
                    const pct = Math.min(100, (val / max) * 100);
                    const dly = 15 + i * 12;
                    const animPct = interpolate(frame, [dly, dly + 15], [0, pct], ec);
                    return (
                        <div key={i} style={{ opacity: interpolate(frame, [dly - 5, dly], [0, 1], ec) }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 20, color: "#fff", fontWeight: 600 }}>{item.label}</span>
                                <span style={{ fontSize: 18, color }}>{val} / {max}</span>
                            </div>
                            <div style={{ height: 12, background: "#ffffff15", borderRadius: 999, overflow: "hidden" }}>
                                <div style={{ width: `${animPct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 999, transition: "width 0.3s" }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Big Number Grid ─── */
export const BigNumberGridSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const stats = slide.stats || [];
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: stats.length <= 2 ? "1fr 1fr" : "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, width: "100%", maxWidth: 900 }}>
                {stats.map((s: { number: string; label: string }, i: number) => {
                    const dly = 12 + i * 10;
                    return (
                        <div key={i} style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 24, padding: 40, textAlign: "center", opacity: interpolate(frame, [dly, dly + 12], [0, 1], ec) }}>
                            <p style={{ fontSize: 64, fontWeight: 900, background: `linear-gradient(90deg, ${color}, ${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{s.number}</p>
                            <p style={{ fontSize: 20, color: "#9ca3af", marginTop: 12, fontWeight: 600 }}>{s.label}</p>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Icon Grid ─── */
export const IconGridSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame();
    const color = getColor(slide.accent);
    const items = (slide.items || []).filter((i: any) => i.label != null);
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 50, opacity: interpolate(frame, [0, 15], [0, 1], ec), fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, width: "100%", maxWidth: 1000 }}>
                {items.map((item: any, i: number) => {
                    const dly = 10 + i * 8;
                    return (
                        <div key={i} style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 20, padding: 28, opacity: interpolate(frame, [dly, dly + 10], [0, 1], ec) }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{item.icon || "◆"}</div>
                            <h4 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.label}</h4>
                            {item.description && <p style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.4 }}>{item.description}</p>}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ─── Generic Fallback ─── */
export const GenericSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
    const frame = useCurrentFrame(); const color = getColor(slide.accent);
    const entries = Object.entries(slide).filter(([k]) => !["id", "type", "accent", "icon"].includes(k));
    return (
        <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
            <div style={{ maxWidth: 900, opacity: interpolate(frame, [0, 20], [0, 1], ec) }}>
                {slide.title && <h2 style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 30, fontFamily: "'Space Grotesk', sans-serif" }}>{slide.title}</h2>}
                {entries.filter(([k]) => k !== "title").map(([key, value]) => {
                    if (Array.isArray(value)) return (<div key={key}><p style={{ fontSize: 18, color, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>{key}</p>{value.map((item, i) => <div key={i} style={{ background: "#ffffff0d", border: "1px solid #ffffff1a", borderRadius: 12, padding: "12px 20px", marginBottom: 8, color: "#d1d5db", fontSize: 20 }}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</div>)}</div>);
                    if (typeof value === "string") return <p key={key} style={{ fontSize: 24, color: "#d1d5db", marginBottom: 16, lineHeight: 1.5 }}>{value as string}</p>;
                    return null;
                })}
            </div>
        </AbsoluteFill>
    );
};

