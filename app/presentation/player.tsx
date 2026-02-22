"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Download, CheckCircle, AlertTriangle, Lightbulb, ArrowRight as ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"

/* ─── Accent color map ─── */
const accentColors: Record<string, { gradient: string; bg: string; border: string; text: string; glow: string }> = {
    purple: { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/30" },
    blue: { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/30" },
    pink: { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500/15", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/30" },
    emerald: { gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/30" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/30" },
    rose: { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/30" },
    cyan: { gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/30" },
    indigo: { gradient: "from-indigo-500 to-purple-600", bg: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-400", glow: "shadow-indigo-500/30" },
};

function getAccent(accent?: string) {
    return accentColors[accent || "purple"] || accentColors.purple;
}

/* ─── Slide Renderers ─── */

function TitleSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="text-center z-10 max-w-5xl mx-auto space-y-8">
            <div className={`animate-in inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr ${a.gradient} mb-4 shadow-2xl ${a.glow}`}>
                <Play className="w-9 h-9 text-white ml-1" />
            </div>
            <h1 className="animate-in text-5xl md:text-8xl font-black tracking-tight leading-[1.05]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title}
            </h1>
            {slide.subtitle && (
                <p className="animate-in text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto">{slide.subtitle}</p>
            )}
            <div className="animate-in flex items-center justify-center gap-2 mt-4">
                <span className={`h-1 w-16 rounded-full bg-gradient-to-r ${a.gradient}`}></span>
            </div>
        </div>
    );
}

function ContentSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl">
            <div className="flex items-stretch gap-8">
                <div className={`animate-in w-1.5 rounded-full bg-gradient-to-b ${a.gradient} flex-shrink-0`}></div>
                <div className="space-y-8">
                    <h2 className="animate-in text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {slide.title}
                    </h2>
                    {slide.bullets && (
                        <ul className="space-y-4">
                            {slide.bullets.map((b: string, i: number) => (
                                <li key={i} className="animate-in flex items-start gap-4 text-lg md:text-2xl text-gray-300">
                                    <span className={`mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r ${a.gradient} flex-shrink-0 shadow-lg ${a.glow}`}></span>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {slide.content && !slide.bullets && (
                        <p className="animate-in text-xl md:text-3xl text-gray-300 leading-relaxed">{slide.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ComparisonSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-6xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Side A */}
                <div className={`animate-in rounded-2xl ${a.bg} border ${a.border} p-8 space-y-5`}>
                    <h3 className={`text-2xl font-bold ${a.text}`}>{slide.labelA || "Option A"}</h3>
                    <ul className="space-y-3">
                        {(slide.bulletsA || []).map((b: string, i: number) => (
                            <li key={i} className="animate-in flex items-start gap-3 text-lg text-gray-300">
                                <CheckCircle className={`w-5 h-5 mt-0.5 ${a.text} flex-shrink-0`} />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Side B */}
                <div className="animate-in rounded-2xl bg-white/5 border border-white/10 p-8 space-y-5">
                    <h3 className="text-2xl font-bold text-gray-300">{slide.labelB || "Option B"}</h3>
                    <ul className="space-y-3">
                        {(slide.bulletsB || []).map((b: string, i: number) => (
                            <li key={i} className="animate-in flex items-start gap-3 text-lg text-gray-300">
                                <CheckCircle className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function TimelineSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title}
            </h2>
            <div className="space-y-1">
                {(slide.steps || []).map((s: any, i: number) => (
                    <div key={i} className="animate-in flex items-start gap-6">
                        {/* Timeline node */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold text-lg shadow-xl ${a.glow}`}>
                                {i + 1}
                            </div>
                            {i < (slide.steps || []).length - 1 && (
                                <div className={`w-0.5 h-16 bg-gradient-to-b ${a.gradient} opacity-30`}></div>
                            )}
                        </div>
                        {/* Content */}
                        <div className="pt-2 pb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-white">{s.step}</h3>
                            <p className="text-gray-400 text-lg mt-1">{s.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatisticSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    const numberRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!numberRef.current) return;
        // Try to extract a numeric value for counter animation
        const numMatch = slide.number?.match?.(/[\d.]+/);
        if (numMatch) {
            const target = parseFloat(numMatch[0]);
            const prefix = slide.number.substring(0, slide.number.indexOf(numMatch[0]));
            const suffix = slide.number.substring(slide.number.indexOf(numMatch[0]) + numMatch[0].length);
            const isDecimal = numMatch[0].includes(".");
            const el = numberRef.current;
            animate(el, {
                innerHTML: [0, target],
                duration: 1500,
                easing: "outExpo",
                round: isDecimal ? 10 : 1,
                modifier(value: number) {
                    el.textContent = `${prefix}${isDecimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
                },
            } as any);
        }
    }, [slide.number]);

    return (
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
            <h2 className="animate-in text-2xl md:text-3xl font-bold text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title}
            </h2>
            <div className="animate-in">
                <span
                    ref={numberRef}
                    className={`text-7xl md:text-[10rem] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient} leading-none`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {slide.number}
                </span>
            </div>
            {slide.unit && (
                <p className={`animate-in text-2xl font-semibold ${a.text}`}>{slide.unit}</p>
            )}
            {slide.description && (
                <p className="animate-in text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">{slide.description}</p>
            )}
        </div>
    );
}

function QuoteSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="animate-in text-xl font-medium text-gray-500 uppercase tracking-widest">{slide.title}</h2>
            <div className={`animate-in relative rounded-3xl ${a.bg} border ${a.border} p-10 md:p-16`}>
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-8xl ${a.text} opacity-30 leading-none`} style={{ fontFamily: "Georgia, serif" }}>&ldquo;</div>
                <blockquote className="text-2xl md:text-4xl font-medium leading-relaxed text-white relative z-10">
                    {slide.quote}
                </blockquote>
                {slide.attribution && (
                    <p className={`mt-6 text-lg ${a.text} font-medium`}>— {slide.attribution}</p>
                )}
            </div>
        </div>
    );
}

function DiagramSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
                <h2 className="animate-in text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {slide.title}
                </h2>
                {slide.description && (
                    <p className="animate-in text-gray-400 text-lg">{slide.description}</p>
                )}
            </div>
            <div className="animate-in flex-1 w-full">
                <div className={`rounded-3xl ${a.bg} border ${a.border} p-8 space-y-4 shadow-2xl`}>
                    {(slide.nodes || []).map((node: any, i: number) => (
                        <div key={i}>
                            <div className={`animate-in rounded-xl bg-white/10 border border-white/10 px-6 py-4 text-center font-semibold text-lg text-white`}>
                                {node.label}
                            </div>
                            {i < (slide.nodes || []).length - 1 && (
                                <div className="flex justify-center py-2">
                                    <div className={`w-0.5 h-6 bg-gradient-to-b ${a.gradient} opacity-50`}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ListSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(slide.items || []).map((item: any, i: number) => (
                    <div key={i} className={`animate-in rounded-2xl bg-white/5 border border-white/10 p-6 space-y-2 hover:${a.bg} transition-colors`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ${a.glow}`}>
                                {i + 1}
                            </div>
                            <h3 className="text-xl font-bold text-white">{item.term}</h3>
                        </div>
                        <p className="text-gray-400 text-lg pl-11">{item.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CalloutSlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    const icons: Record<string, any> = {
        tip: <Lightbulb className="w-10 h-10" />,
        warning: <AlertTriangle className="w-10 h-10" />,
        insight: <Lightbulb className="w-10 h-10" />,
    };
    const calloutLabels: Record<string, string> = {
        tip: "💡 Pro Tip",
        warning: "⚠️ Warning",
        insight: "✨ Key Insight",
    };

    return (
        <div className="z-10 max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="animate-in text-2xl font-bold text-gray-400">{slide.title}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-10 md:p-16 space-y-6 shadow-2xl relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-5`}></div>
                <div className="relative z-10 space-y-6">
                    <p className={`text-lg font-bold ${a.text} uppercase tracking-widest`}>
                        {calloutLabels[slide.calloutType] || "✨ Note"}
                    </p>
                    <p className="text-2xl md:text-4xl font-medium text-white leading-relaxed">
                        {slide.message}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SummarySlide({ slide }: { slide: any }) {
    const a = getAccent(slide.accent);
    return (
        <div className="text-center z-10 max-w-4xl mx-auto space-y-10">
            <h2 className={`animate-in text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {slide.title || "Key Takeaways"}
            </h2>
            {slide.keyPoints && (
                <div className="space-y-4">
                    {slide.keyPoints.map((point: string, i: number) => (
                        <div key={i} className={`animate-in flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-8 py-5 text-left`}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg ${a.glow}`}>
                                {i + 1}
                            </div>
                            <p className="text-xl text-gray-300">{point}</p>
                        </div>
                    ))}
                </div>
            )}
            {slide.closingLine && (
                <div className={`animate-in rounded-2xl ${a.bg} border ${a.border} p-8`}>
                    <p className="text-2xl font-medium text-white">&ldquo;{slide.closingLine}&rdquo;</p>
                </div>
            )}
        </div>
    );
}

/* ─── Slide Router ─── */
function renderSlide(slide: any) {
    switch (slide.type) {
        case "title": return <TitleSlide slide={slide} />;
        case "content": return <ContentSlide slide={slide} />;
        case "comparison": return <ComparisonSlide slide={slide} />;
        case "timeline": return <TimelineSlide slide={slide} />;
        case "statistic": return <StatisticSlide slide={slide} />;
        case "quote": return <QuoteSlide slide={slide} />;
        case "diagram": return <DiagramSlide slide={slide} />;
        case "list": return <ListSlide slide={slide} />;
        case "callout": return <CalloutSlide slide={slide} />;
        case "summary": return <SummarySlide slide={slide} />;
        default: return <ContentSlide slide={slide} />;
    }
}

/* ─── Main Player ─── */
export default function PresentationPlayer({ slides }: { slides: any[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const slideRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

    const handleExport = async () => {
        if (!slides || slides.length === 0) return;
        setIsExporting(true);
        try {
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Export failed');
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'explainit-presentation.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Export error:', error);
            alert(`Export failed: ${error.message}.`);
        } finally {
            setIsExporting(false);
        }
    };

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    }, [currentSlide, slides.length]);

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    }

    // Auto-play timer
    useEffect(() => {
        if (isPlaying) {
            autoPlayTimer.current = setTimeout(nextSlide, 5000);
        }
        return () => {
            if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
        };
    }, [isPlaying, currentSlide, nextSlide]);

    // Anime.js micro-animations on slide change
    useEffect(() => {
        if (!slideRef.current) return;

        const targets = slideRef.current.querySelectorAll(".animate-in");
        animate(targets, {
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.97, 1],
            ease: "outExpo",
            duration: 900,
            delay: stagger(120, { start: 80 }),
        });

        if (bgRef.current) {
            animate(bgRef.current, {
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
                ease: "inOutSine",
                duration: 6000,
                loop: true,
            });
        }
    }, [currentSlide]);

    if (!slides || slides.length === 0) {
        return <div className="flex h-screen items-center justify-center text-white bg-black">No slides to display.</div>
    }

    const slide = slides[currentSlide];
    const progress = ((currentSlide + 1) / slides.length) * 100;
    const a = getAccent(slide.accent);

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative selection:bg-purple-500/30">

            {/* Top Bar */}
            <header className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 z-50 bg-gradient-to-b from-black/80 to-transparent">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Editor
                </Link>
                {isExporting ? (
                    <button disabled className="flex items-center gap-2 bg-purple-600/50 text-white/70 px-5 py-2.5 rounded-full font-medium cursor-not-allowed">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Rendering...
                    </button>
                ) : (
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Export Video
                    </button>
                )}
            </header>

            {/* Progress Bar */}
            <div className="absolute top-16 inset-x-0 h-0.5 bg-white/5 z-50">
                <motion.div
                    className={`h-full bg-gradient-to-r ${a.gradient}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {/* Slide type badge */}
            <div className="absolute top-20 left-6 z-50">
                <span className={`text-xs font-mono uppercase tracking-wider ${a.text} ${a.bg} ${a.border} border rounded-full px-3 py-1`}>
                    {slide.type}
                </span>
            </div>

            {/* Main Stage */}
            <main className="flex-1 flex items-center justify-center relative p-8 md:p-24 overflow-hidden">
                {/* Animated Background Orb */}
                <div
                    ref={bgRef}
                    className="absolute w-[700px] h-[700px] rounded-full pointer-events-none -z-0"
                    style={{
                        background: `radial-gradient(circle, ${slide.accent === 'emerald' ? 'rgba(16,185,129,0.15)' :
                            slide.accent === 'blue' ? 'rgba(59,130,246,0.15)' :
                                slide.accent === 'pink' ? 'rgba(236,72,153,0.15)' :
                                    slide.accent === 'amber' ? 'rgba(245,158,11,0.15)' :
                                        slide.accent === 'cyan' ? 'rgba(6,182,212,0.15)' :
                                            slide.accent === 'rose' ? 'rgba(244,63,94,0.15)' :
                                                slide.accent === 'indigo' ? 'rgba(99,102,241,0.15)' :
                                                    'rgba(147,51,234,0.15)'} 0%, transparent 70%)`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="w-full flex items-center justify-center"
                    >
                        <div ref={slideRef} className="w-full flex items-center justify-center">
                            {renderSlide(slide)}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Controls Bar */}
            <footer className="absolute bottom-6 inset-x-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${i === currentSlide
                                ? `w-10 bg-gradient-to-r ${a.gradient} shadow-lg ${a.glow}`
                                : i < currentSlide
                                    ? `w-4 bg-gradient-to-r ${a.gradient} opacity-40`
                                    : "w-4 bg-white/15 hover:bg-white/30"
                                }`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="text-white hover:text-purple-400 disabled:opacity-30 disabled:hover:text-white transition-all p-2 hover:scale-110 active:scale-95"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className="text-white hover:text-purple-400 disabled:opacity-30 disabled:hover:text-white transition-all p-2 hover:scale-110 active:scale-95"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-24 text-right text-gray-500 font-mono text-sm tabular-nums">
                    {currentSlide + 1} / {slides.length}
                </div>
            </footer>
        </div>
    )
}
