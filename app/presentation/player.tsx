"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"

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
            alert(`Export failed: ${error.message}. Make sure ffmpeg is installed.`);
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
            autoPlayTimer.current = setTimeout(nextSlide, 4000);
        }
        return () => {
            if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
        };
    }, [isPlaying, currentSlide, nextSlide]);

    // Anime.js micro-animations on slide change
    useEffect(() => {
        if (!slideRef.current) return;

        // Animate all child elements with staggered entrance
        const targets = slideRef.current.querySelectorAll(".animate-in");
        animate(targets, {
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.97, 1],
            ease: "outExpo",
            duration: 900,
            delay: stagger(150, { start: 100 }),
        });

        // Floating background orb animation
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
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {/* Main Stage */}
            <main className="flex-1 flex items-center justify-center relative p-8 md:p-24 overflow-hidden">
                {/* Animated Background Orb */}
                <div
                    ref={bgRef}
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -z-0"
                    style={{
                        background: slide.type === "title"
                            ? "radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)"
                            : slide.type === "summary"
                                ? "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)"
                                : "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay z-0 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="w-full flex items-center justify-center"
                    >
                        <div ref={slideRef} className="w-full flex items-center justify-center">
                            {slide.type === "title" && (
                                <div className="text-center z-10 max-w-4xl mx-auto space-y-6">
                                    <div className="animate-in inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mb-8 shadow-2xl shadow-purple-500/50">
                                        <Play className="w-9 h-9 text-white ml-1" />
                                    </div>
                                    <h1 className="animate-in text-5xl md:text-8xl font-black tracking-tight leading-tight">
                                        {slide.content}
                                    </h1>
                                    <p className="animate-in text-xl text-gray-400 font-medium">ExplainIt Auto-Generated Course</p>
                                    <div className="animate-in flex items-center justify-center gap-2 mt-4">
                                        <span className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                                    </div>
                                </div>
                            )}

                            {slide.type === "content" && (
                                <div className="z-10 w-full max-w-5xl">
                                    <div className="flex items-stretch gap-8">
                                        <div className="animate-in w-1 rounded-full bg-gradient-to-b from-purple-500 to-purple-500/0 flex-shrink-0"></div>
                                        <div>
                                            <h2 className="animate-in text-4xl md:text-6xl font-bold leading-tight">
                                                {slide.content}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {slide.type === "diagram" && (
                                <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12">
                                    <div className="flex-1 space-y-4">
                                        <h2 className="animate-in text-3xl md:text-5xl font-bold leading-tight">
                                            {slide.content}
                                        </h2>
                                        <p className="animate-in text-gray-400 text-lg">Visualizing the concept.</p>
                                    </div>
                                    <div className="animate-in flex-1">
                                        <div className="aspect-square max-w-md mx-auto relative rounded-3xl bg-white/5 border border-white/10 p-8 flex items-center justify-center shadow-2xl overflow-hidden glass-panel">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                                            <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                                                <div className="diagram-node aspect-square rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                                                    <div className="w-5 h-5 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
                                                </div>
                                                <div className="diagram-node aspect-square rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                                                    <div className="w-5 h-5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
                                                </div>
                                                <div className="diagram-node col-span-2 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center gap-2">
                                                    <div className="flex-1 h-px bg-white/20 ml-4"></div>
                                                    <div className="w-3 h-3 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50"></div>
                                                    <div className="flex-1 h-px bg-white/20 mr-4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {slide.type === "summary" && (
                                <div className="text-center z-10 max-w-3xl mx-auto space-y-8">
                                    <h2 className="animate-in text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">
                                        In Summary
                                    </h2>
                                    <div className="animate-in glass-panel p-8 md:p-12 rounded-3xl text-2xl md:text-3xl font-medium leading-relaxed shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                                        <p className="relative z-10">&ldquo;{slide.content}&rdquo;</p>
                                    </div>
                                </div>
                            )}
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
                                ? "w-10 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"
                                : i < currentSlide
                                    ? "w-4 bg-purple-500/40"
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
