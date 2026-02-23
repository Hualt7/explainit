"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Download, CheckCircle, AlertTriangle, Lightbulb, Volume2, VolumeX, X as XIcon, ThumbsUp, ThumbsDown, Keyboard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"
import { useSettingsStore } from "../store/useSettingsStore"
import type { Slide } from "../types"

/* ─── Accent color map ─── */
const accentColors: Record<string, { gradient: string; bg: string; border: string; text: string; glow: string; rgb: string }> = {
    purple: { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/30", rgb: "147,51,234" },
    blue: { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/30", rgb: "59,130,246" },
    pink: { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500/15", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/30", rgb: "236,72,153" },
    emerald: { gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/30", rgb: "16,185,129" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/30", rgb: "245,158,11" },
    rose: { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/30", rgb: "244,63,94" },
    cyan: { gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/30", rgb: "6,182,212" },
    indigo: { gradient: "from-indigo-500 to-purple-600", bg: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-400", glow: "shadow-indigo-500/30", rgb: "99,102,241" },
    violet: { gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/15", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/30", rgb: "139,92,246" },
    teal: { gradient: "from-teal-500 to-emerald-500", bg: "bg-teal-500/15", border: "border-teal-500/30", text: "text-teal-400", glow: "shadow-teal-500/30", rgb: "20,184,166" },
    orange: { gradient: "from-orange-500 to-amber-500", bg: "bg-orange-500/15", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/30", rgb: "249,115,22" },
    lime: { gradient: "from-lime-500 to-green-500", bg: "bg-lime-500/15", border: "border-lime-500/30", text: "text-lime-400", glow: "shadow-lime-500/30", rgb: "132,204,22" },
};
function getAccent(accent?: string) { return accentColors[accent || "purple"] || accentColors.purple; }
const SF = { fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" };

/* ═══════════════ SLIDE RENDERERS ═══════════════ */

function TitleSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="text-center z-10 max-w-5xl mx-auto space-y-8">
            <div className={`animate-in inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr ${a.gradient} mb-4 shadow-2xl ${a.glow}`}><Play className="w-9 h-9 text-white ml-1" /></div>
            <h1 className="animate-in text-5xl md:text-8xl font-black tracking-tight leading-[1.05]" style={SF}>{slide.title}</h1>
            {slide.subtitle && <p className="animate-in text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto">{slide.subtitle}</p>}
            <div className="animate-in flex items-center justify-center gap-2 mt-4"><span className={`h-1 w-16 rounded-full bg-gradient-to-r ${a.gradient}`}></span></div>
        </div>
    );
}

function ContentSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl">
            <div className="flex items-stretch gap-8">
                <div className={`animate-in w-1.5 rounded-full bg-gradient-to-b ${a.gradient} flex-shrink-0`}></div>
                <div className="space-y-8">
                    <h2 className="animate-in text-3xl md:text-5xl font-bold leading-tight" style={SF}>{slide.title}</h2>
                    {slide.bullets && <ul className="space-y-4">{slide.bullets.map((b: string, i: number) => (
                        <li key={i} className="animate-in flex items-start gap-4 text-lg md:text-2xl text-gray-300">
                            <span className={`mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r ${a.gradient} flex-shrink-0 shadow-lg ${a.glow}`}></span><span>{b}</span>
                        </li>
                    ))}</ul>}
                    {slide.content && !slide.bullets && <p className="animate-in text-xl md:text-3xl text-gray-300 leading-relaxed">{slide.content}</p>}
                </div>
            </div>
        </div>
    );
}

function ComparisonSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-6xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`animate-in rounded-2xl ${a.bg} border ${a.border} p-8 space-y-5`}>
                    <h3 className={`text-2xl font-bold ${a.text}`}>{slide.labelA || "A"}</h3>
                    <ul className="space-y-3">{(slide.bulletsA || []).map((b: string, i: number) => (<li key={i} className="animate-in flex items-start gap-3 text-lg text-gray-300"><CheckCircle className={`w-5 h-5 mt-0.5 ${a.text} flex-shrink-0`} /><span>{b}</span></li>))}</ul>
                </div>
                <div className="animate-in rounded-2xl bg-white/5 border border-white/10 p-8 space-y-5">
                    <h3 className="text-2xl font-bold text-gray-300">{slide.labelB || "B"}</h3>
                    <ul className="space-y-3">{(slide.bulletsB || []).map((b: string, i: number) => (<li key={i} className="animate-in flex items-start gap-3 text-lg text-gray-300"><CheckCircle className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" /><span>{b}</span></li>))}</ul>
                </div>
            </div>
        </div>
    );
}

function TimelineSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="space-y-1">{(slide.steps || []).map((s: any, i: number) => (
                <div key={i} className="animate-in flex items-start gap-6">
                    <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold text-lg shadow-xl ${a.glow}`}>{i + 1}</div>
                        {i < (slide.steps || []).length - 1 && <div className={`w-0.5 h-16 bg-gradient-to-b ${a.gradient} opacity-30`}></div>}
                    </div>
                    <div className="pt-2 pb-6"><h3 className="text-xl md:text-2xl font-bold text-white">{typeof s === "string" ? s : s.step}</h3>{s.detail && <p className="text-gray-400 text-lg mt-1">{s.detail}</p>}</div>
                </div>
            ))}</div>
        </div>
    );
}

function StatisticSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    const numberRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!numberRef.current) return;
        const raw = String(slide.number).replace(/[^0-9.]/g, "");
        const target = parseFloat(raw);
        if (isNaN(target)) return;
        const prefix = String(slide.number).match(/^[^0-9.]*/)?.[0] || "";
        const suffix = String(slide.number).match(/[^0-9.]*$/)?.[0] || "";
        const hasDecimals = raw.includes(".");
        const decimals = hasDecimals ? (raw.split(".")[1]?.length || 0) : 0;
        const obj = { val: 0 };
        animate(obj, {
            val: target,
            duration: 1800,
            ease: "outExpo",
            onUpdate: () => {
                if (numberRef.current) {
                    numberRef.current.textContent = `${prefix}${hasDecimals ? obj.val.toFixed(decimals) : Math.round(obj.val)}${suffix}`;
                }
            },
        });
    }, [slide.number]);

    return (
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
            <h2 className="animate-in text-2xl md:text-3xl font-bold text-gray-400" style={SF}>{slide.title}</h2>
            <div className="animate-in"><span ref={numberRef} className={`text-7xl md:text-[10rem] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient} leading-none`} style={SF}>0</span></div>
            {slide.unit && <p className={`animate-in text-2xl font-semibold ${a.text}`}>{slide.unit}</p>}
            {slide.description && <p className="animate-in text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">{slide.description}</p>}
        </div>
    );
}

function QuoteSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="animate-in text-xl font-medium text-gray-500 uppercase tracking-widest">{slide.title}</h2>
            <div className={`animate-in relative rounded-3xl ${a.bg} border ${a.border} p-10 md:p-16`}>
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-8xl ${a.text} opacity-30 leading-none`} style={{ fontFamily: "Georgia, serif" }}>&ldquo;</div>
                <blockquote className="text-2xl md:text-4xl font-medium leading-relaxed text-white relative z-10">{slide.quote}</blockquote>
                {slide.attribution && <p className={`mt-6 text-lg ${a.text} font-medium`}>— {slide.attribution}</p>}
            </div>
        </div>
    );
}

function DiagramSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
                <h2 className="animate-in text-3xl md:text-5xl font-bold leading-tight" style={SF}>{slide.title}</h2>
                {slide.description && <p className="animate-in text-gray-400 text-lg">{slide.description}</p>}
            </div>
            <div className="animate-in flex-1 w-full">
                <div className={`rounded-3xl ${a.bg} border ${a.border} p-8 space-y-4 shadow-2xl`}>
                    {(slide.nodes || []).map((node: any, i: number) => (
                        <div key={i}>
                            <div className="animate-in rounded-xl bg-white/10 border border-white/10 px-6 py-4 text-center font-semibold text-lg text-white">{typeof node === "string" ? node : node.label}</div>
                            {i < (slide.nodes || []).length - 1 && <div className="flex justify-center py-2"><div className={`w-0.5 h-6 bg-gradient-to-b ${a.gradient} opacity-50`}></div></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ListSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(slide.items || []).map((item: any, i: number) => (
                <div key={i} className="animate-in rounded-2xl bg-white/5 border border-white/10 p-6 space-y-2">
                    <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ${a.glow}`}>{i + 1}</div><h3 className="text-xl font-bold text-white">{item.term}</h3></div>
                    <p className="text-gray-400 text-lg pl-11">{item.definition}</p>
                </div>
            ))}</div>
        </div>
    );
}

function CalloutSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    const labels: Record<string, string> = { tip: "💡 Pro Tip", warning: "⚠️ Warning", insight: "✨ Key Insight" };
    return (
        <div className="z-10 max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="animate-in text-2xl font-bold text-gray-400">{slide.title}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-10 md:p-16 space-y-6 shadow-2xl relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-5`}></div>
                <div className="relative z-10 space-y-6">
                    <p className={`text-lg font-bold ${a.text} uppercase tracking-widest`}>{(slide.calloutType && labels[slide.calloutType]) || "✨ Note"}</p>
                    <p className="text-2xl md:text-4xl font-medium text-white leading-relaxed">{slide.message}</p>
                </div>
            </div>
        </div>
    );
}

function SummarySlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="text-center z-10 max-w-4xl mx-auto space-y-10">
            <h2 className={`animate-in text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient}`} style={SF}>{slide.title || "Key Takeaways"}</h2>
            {slide.keyPoints && <div className="space-y-4">{slide.keyPoints.map((point: string, i: number) => (
                <div key={i} className="animate-in flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-8 py-5 text-left">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg ${a.glow}`}>{i + 1}</div>
                    <p className="text-xl text-gray-300">{point}</p>
                </div>
            ))}</div>}
            {slide.closingLine && <div className={`animate-in rounded-2xl ${a.bg} border ${a.border} p-8`}><p className="text-2xl font-medium text-white">&ldquo;{slide.closingLine}&rdquo;</p></div>}
        </div>
    );
}

/* ─── NEW v3 TYPES ─── */

function CodeSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-6">
            <h2 className="animate-in text-3xl md:text-4xl font-bold" style={SF}>{slide.title}</h2>
            <div className="animate-in rounded-2xl bg-gray-950 border border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="ml-3 text-xs text-gray-500 font-mono">{slide.language || "code"}</span>
                </div>
                <pre className="p-6 text-sm md:text-base font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">{slide.code}</pre>
            </div>
            {slide.explanation && <p className="animate-in text-lg text-gray-400">{slide.explanation}</p>}
        </div>
    );
}

function DefinitionSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="animate-in text-xl font-medium text-gray-500 uppercase tracking-widest">{slide.title || "Definition"}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-10 md:p-14 text-left space-y-6`}>
                <h3 className={`text-4xl md:text-5xl font-black ${a.text}`} style={SF}>{slide.term}</h3>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">{slide.definition}</p>
                {slide.example && <div className="rounded-xl bg-white/5 border border-white/10 p-5"><p className="text-gray-400 text-lg"><span className="font-semibold text-gray-300">Example:</span> {slide.example}</p></div>}
            </div>
        </div>
    );
}

function ProsConsSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-6xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-in rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-emerald-400">✅ Pros</h3>
                    {(slide.pros || []).map((p: string, i: number) => <p key={i} className="animate-in text-lg text-gray-300 flex items-start gap-3"><ThumbsUp className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />{p}</p>)}
                </div>
                <div className="animate-in rounded-2xl bg-red-500/10 border border-red-500/30 p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-red-400">❌ Cons</h3>
                    {(slide.cons || []).map((c: string, i: number) => <p key={i} className="animate-in text-lg text-gray-300 flex items-start gap-3"><ThumbsDown className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />{c}</p>)}
                </div>
            </div>
        </div>
    );
}

function EquationSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
            <h2 className="animate-in text-2xl md:text-3xl font-bold text-gray-400" style={SF}>{slide.title}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-12 md:p-16`}>
                <p className={`text-4xl md:text-6xl font-mono font-bold ${a.text}`}>{slide.equation}</p>
            </div>
            {slide.explanation && <p className="animate-in text-xl text-gray-400 max-w-xl mx-auto">{slide.explanation}</p>}
        </div>
    );
}

function MindmapSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-4xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="flex flex-col items-center gap-6">
                <div className={`animate-in rounded-2xl bg-gradient-to-br ${a.gradient} px-10 py-6 text-white font-bold text-2xl shadow-2xl ${a.glow}`}>{slide.center}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {(slide.branches || []).map((b: any, i: number) => (
                        <div key={i} className={`animate-in rounded-2xl ${a.bg} border ${a.border} p-5 space-y-3`}>
                            <h4 className={`font-bold text-lg ${a.text}`}>{typeof b === "string" ? b : b.label}</h4>
                            {b.children && b.children.map((c: string, j: number) => <p key={j} className="text-sm text-gray-400 pl-3 border-l border-white/10">{c}</p>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TableSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-5xl space-y-8">
            <h2 className="animate-in text-3xl md:text-4xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="animate-in rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <table className="w-full">
                    {slide.headers && <thead><tr className={`bg-gradient-to-r ${a.gradient}`}>{slide.headers.map((h: string, i: number) => <th key={i} className="px-6 py-4 text-left text-white font-bold text-lg">{h}</th>)}</tr></thead>}
                    <tbody>{(slide.rows || []).map((row: string[], ri: number) => (
                        <tr key={ri} className={`${ri % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"} border-t border-white/5`}>
                            {row.map((cell: string, ci: number) => <td key={ci} className="px-6 py-4 text-gray-300">{cell}</td>)}
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
}

function ExampleSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 max-w-4xl mx-auto space-y-6">
            <h2 className="animate-in text-3xl md:text-4xl font-bold" style={SF}>{slide.title}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-10 space-y-6`}>
                <div className="rounded-xl bg-white/5 border border-white/10 p-6"><p className="text-xl text-white font-medium">📋 {slide.scenario}</p></div>
                <p className="text-lg text-gray-300 leading-relaxed">{slide.explanation}</p>
                {slide.lesson && <div className={`rounded-xl ${a.bg} border ${a.border} p-5`}><p className={`text-lg font-semibold ${a.text}`}>💡 Lesson: {slide.lesson}</p></div>}
            </div>
        </div>
    );
}

function FunfactSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
            <h2 className="animate-in text-xl font-bold text-gray-500 uppercase tracking-widest">{slide.title || "Did You Know?"}</h2>
            <div className={`animate-in rounded-3xl ${a.bg} border ${a.border} p-10 md:p-16 relative overflow-hidden`}>
                <span className="absolute top-4 right-6 text-6xl opacity-20">🤯</span>
                <p className="text-2xl md:text-4xl font-medium text-white leading-relaxed relative z-10">{slide.fact}</p>
                {slide.source && <p className={`mt-6 text-sm ${a.text}`}>Source: {slide.source}</p>}
            </div>
        </div>
    );
}

function StepsSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 w-full max-w-6xl space-y-8">
            <h2 className="animate-in text-3xl md:text-5xl font-bold text-center" style={SF}>{slide.title}</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {(slide.steps || []).map((s: any, i: number) => (
                    <div key={i} className="animate-in flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white font-bold text-xl shadow-xl ${a.glow}`}>{i + 1}</div>
                        <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 max-w-[200px]"><p className="text-white font-medium">{typeof s === "string" ? s : s.step || s.label || JSON.stringify(s)}</p></div>
                        {i < (slide.steps || []).length - 1 && <span className="text-gray-600 text-2xl">→</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function HighlightSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    return (
        <div className="z-10 text-center max-w-5xl mx-auto space-y-6">
            {slide.title && <h2 className="animate-in text-xl text-gray-500 font-medium uppercase tracking-widest">{slide.title}</h2>}
            <h1 className={`animate-in text-6xl md:text-[9rem] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${a.gradient} leading-none`} style={SF}>{slide.highlight}</h1>
            {slide.subtext && <p className="animate-in text-xl md:text-2xl text-gray-400 max-w-xl mx-auto">{slide.subtext}</p>}
        </div>
    );
}

/* ─── GENERIC FALLBACK for AI-invented types ─── */
function GenericSlide({ slide }: { slide: Slide }) {
    const a = getAccent(slide.accent);
    const entries = Object.entries(slide).filter(([k]) => !["id", "type", "accent", "icon"].includes(k));
    return (
        <div className="z-10 w-full max-w-5xl space-y-6">
            {slide.title && <h2 className="animate-in text-3xl md:text-5xl font-bold" style={SF}>{slide.title}</h2>}
            {entries.filter(([k]) => k !== "title").map(([key, value]) => {
                if (Array.isArray(value)) return (
                    <div key={key} className="animate-in space-y-3">
                        <h3 className={`text-lg font-semibold ${a.text} uppercase tracking-wider`}>{key}</h3>
                        {value.map((item, i) => <div key={i} className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-gray-300">{typeof item === "object" ? JSON.stringify(item) : String(item)}</div>)}
                    </div>
                );
                if (typeof value === "string") return <p key={key} className="animate-in text-xl text-gray-300 leading-relaxed">{value}</p>;
                return null;
            })}
        </div>
    );
}

/* ═══════════════ SLIDE ROUTER ═══════════════ */
function renderSlide(slide: Slide) {
    const map: Record<string, React.FC<{ slide: Slide }>> = {
        title: TitleSlide, content: ContentSlide, comparison: ComparisonSlide, timeline: TimelineSlide,
        statistic: StatisticSlide, quote: QuoteSlide, diagram: DiagramSlide, list: ListSlide,
        callout: CalloutSlide, summary: SummarySlide, code: CodeSlide, definition: DefinitionSlide,
        pros_cons: ProsConsSlide, equation: EquationSlide, mindmap: MindmapSlide, table: TableSlide,
        example: ExampleSlide, funfact: FunfactSlide, steps: StepsSlide, highlight: HighlightSlide,
    };
    const Component = map[slide.type] || GenericSlide;
    return <Component slide={slide} />;
}

/* ═══════════════ BACKGROUND AUDIO ═══════════════ */
const AMBIENT_AUDIO = "https://cdn.pixabay.com/audio/2024/11/28/audio_7a0827a05a.mp3";

/* ═══════════════ MAIN PLAYER ═══════════════ */
export default function PresentationPlayer({ slides }: { slides: Slide[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const slideRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

    // TTS Audio reference
    const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

    // Get settings store directly in component since it's a client component
    const presentationSettings = useSettingsStore((state) => state.presentation);
    const enableVoice = presentationSettings?.enableVoice || false;
    const [showShortcuts, setShowShortcuts] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const audio = new Audio(AMBIENT_AUDIO);
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;
        return () => {
            audio.pause();
            audio.src = "";
            if (ttsAudioRef.current) {
                ttsAudioRef.current.pause();
                ttsAudioRef.current.src = "";
            }
        };
    }, []);

    // Sync ambient and TTS audio with play/mute state changes
    useEffect(() => {
        if (!audioRef.current) return;

        // Lower ambient volume if voice is enabled to make speech clearer
        const targetVolume = enableVoice ? volume * 0.3 : volume;
        audioRef.current.volume = isMuted ? 0 : targetVolume;

        if (ttsAudioRef.current) {
            ttsAudioRef.current.volume = isMuted ? 0 : 1;
        }

        if (isPlaying) {
            audioRef.current.play().catch(() => { });
            if (ttsAudioRef.current && enableVoice) ttsAudioRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
            if (ttsAudioRef.current) ttsAudioRef.current.pause();
        }
    }, [isPlaying, isMuted, volume, enableVoice]);

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
        else setIsPlaying(false);
    }, [currentSlide, slides.length]);

    const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(prev => prev - 1); };

    // Handle Text-to-Speech for current slide & Auto-Advance
    useEffect(() => {
        // Clean up previous TTS audio and timers
        if (ttsAudioRef.current) {
            ttsAudioRef.current.pause();
            ttsAudioRef.current.src = "";
            ttsAudioRef.current = null;
        }
        if (autoPlayTimer.current) {
            clearTimeout(autoPlayTimer.current);
        }

        if (!isPlaying || !slides || slides.length === 0) return;

        const slide = slides[currentSlide];
        if (!slide) return;

        const slideDurationMs = (presentationSettings?.slideDuration || 5) * 1000;

        if (!enableVoice) {
            autoPlayTimer.current = setTimeout(nextSlide, slideDurationMs);
            return;
        }

        // Build text to read based on slide type
        let textToRead = "";

        if (slide.title) textToRead += slide.title + ". ";
        if (slide.subtitle) textToRead += slide.subtitle + ". ";
        if (slide.content) textToRead += slide.content + ". ";
        if (slide.bullets) textToRead += slide.bullets.join(". ") + ". ";
        if (slide.quote) textToRead += slide.quote + ". ";
        if (slide.definition) textToRead += slide.definition + ". ";
        if (slide.explanation) textToRead += slide.explanation + ". ";
        if (slide.fact) textToRead += slide.fact + ". ";

        if (!textToRead.trim()) {
            autoPlayTimer.current = setTimeout(nextSlide, slideDurationMs);
            return;
        }

        // Fetch TTS audio and play it, advancing slide ON ENDED
        let isActive = true;
        const fetchTTS = async () => {
            try {
                const res = await fetch("/api/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: textToRead, voice: "alloy" })
                });

                if (!res.ok || !isActive) throw new Error("TTS failed or aborted");

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);

                const audio = new Audio(url);
                // Check mute state from out of scope (might be slightly stale if changed during fetch, but handled by effect above later)
                // However, assigning it to ref ensures the effect above manages it going forward.

                audio.onended = () => {
                    URL.revokeObjectURL(url);
                    if (isActive) nextSlide();
                };

                ttsAudioRef.current = audio;

                // Only start playing if we are still in "isPlaying" state when fetch returns
                if (isActive) {
                    audio.play().catch(console.error);
                }
            } catch (error) {
                console.error("Failed to fetch TTS:", error);
                if (isActive) autoPlayTimer.current = setTimeout(nextSlide, slideDurationMs);
            }
        };

        fetchTTS();

        return () => {
            isActive = false;
            if (ttsAudioRef.current) {
                ttsAudioRef.current.pause();
                ttsAudioRef.current.src = "";
            }
            if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
        };
    }, [currentSlide, isPlaying, enableVoice, nextSlide]);

    const handleExport = async () => {
        if (!slides || slides.length === 0) return;
        setIsExporting(true);
        try {
            const { renderMediaOnWeb } = await import("@remotion/web-renderer");
            const { ExplainItVideo, SLIDE_DURATION_FRAMES } = await import("../remotion/Root");
            const totalFrames = slides.length * SLIDE_DURATION_FRAMES;

            const { getBlob } = await renderMediaOnWeb({
                composition: {
                    component: () => <ExplainItVideo slides={slides} />,
                    durationInFrames: totalFrames,
                    fps: 30,
                    width: 1920,
                    height: 1080,
                    id: "ExplainItVideo",
                    defaultProps: { slides },
                },
                inputProps: { slides },
                onProgress: () => {},
            });

            const blob = await getBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "explainit-presentation.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            alert(`Export failed: ${error.message}.`);
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        if (!slideRef.current) return;
        const targets = slideRef.current.querySelectorAll(".animate-in");
        const type = slides[currentSlide]?.type;

        // Per-type animation variants
        if (type === "timeline") {
            // Zigzag stagger entrance for timeline steps
            animate(targets, {
                opacity: [0, 1],
                translateX: (_: any, i: number) => [i % 2 === 0 ? -60 : 60, 0],
                translateY: [20, 0],
                ease: "outExpo",
                duration: 1000,
                delay: stagger(150, { start: 80 }),
            });
        } else if (type === "comparison" || type === "pros_cons") {
            // Side panels slide in from edges
            animate(targets, {
                opacity: [0, 1],
                translateX: (_: any, i: number) => [i % 2 === 0 ? -80 : 80, 0],
                scale: [0.9, 1],
                ease: "outExpo",
                duration: 1100,
                delay: stagger(120, { start: 60 }),
            });
        } else if (type === "diagram" || type === "mindmap") {
            // Scale + slight rotation for nodes
            animate(targets, {
                opacity: [0, 1],
                scale: [0.7, 1],
                rotate: ["-5deg", "0deg"],
                ease: "outElastic(1, 0.6)",
                duration: 1200,
                delay: stagger(100, { start: 100 }),
            });
        } else if (type === "highlight" || type === "statistic") {
            // Big dramatic scale entrance
            animate(targets, {
                opacity: [0, 1],
                scale: [0.5, 1],
                translateY: [60, 0],
                ease: "outExpo",
                duration: 1400,
                delay: stagger(200, { start: 0 }),
            });
        } else if (type === "code") {
            // Slide down like a terminal opening
            animate(targets, {
                opacity: [0, 1],
                translateY: [-40, 0],
                scaleY: [0.8, 1],
                ease: "outExpo",
                duration: 900,
                delay: stagger(150, { start: 100 }),
            });
        } else {
            // Default rich entrance
            animate(targets, {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.97, 1],
                ease: "outExpo",
                duration: 900,
                delay: stagger(100, { start: 60 }),
            });
        }

        // Enhanced background glow animation
        if (bgRef.current) {
            animate(bgRef.current, {
                scale: [1, 1.2, 1.05, 1.15, 1],
                opacity: [0.2, 0.5, 0.35, 0.45, 0.25],
                ease: "inOutSine",
                duration: 8000,
                loop: true,
            });
        }
    }, [currentSlide]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            switch (e.key) {
                case "ArrowRight":
                    e.preventDefault();
                    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
                    break;
                case " ":
                    e.preventDefault();
                    setIsPlaying(prev => !prev);
                    break;
                case "Escape":
                    e.preventDefault();
                    router.push("/dashboard");
                    break;
                case "m":
                case "M":
                    setIsMuted(prev => !prev);
                    break;
                case "f":
                case "F":
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        document.documentElement.requestFullscreen();
                    }
                    break;
                case "?":
                    setShowShortcuts(prev => !prev);
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlide, slides.length, router]);

    if (!slides || slides.length === 0) return <div className="flex h-screen items-center justify-center text-white bg-black">No slides to display.</div>;

    const slide = slides[currentSlide];
    const progress = ((currentSlide + 1) / slides.length) * 100;
    const a = getAccent(slide.accent);

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Top Bar */}
            <header className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 z-50 bg-gradient-to-b from-black/80 to-transparent">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"><ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back</Link>
                <div className="flex items-center gap-3">
                    {/* Audio controls */}
                    <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition-colors p-2">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                        className="w-20 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white" />
                    <button onClick={() => setShowShortcuts(true)} className="text-gray-400 hover:text-white transition-colors p-2 hidden md:block" title="Keyboard shortcuts (?)">
                        <Keyboard className="w-5 h-5" />
                    </button>
                    {isExporting ? (
                        <button disabled className="flex items-center gap-2 bg-purple-600/50 text-white/70 px-5 py-2.5 rounded-full font-medium cursor-not-allowed"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Rendering...</button>
                    ) : (
                        <button onClick={handleExport} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"><Download className="w-4 h-4" /> Export</button>
                    )}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="absolute top-16 inset-x-0 h-0.5 bg-white/5 z-50"><motion.div className={`h-full bg-gradient-to-r ${a.gradient}`} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} /></div>

            {/* Slide type badge */}
            <div className="absolute top-20 left-6 z-50"><span className={`text-xs font-mono uppercase tracking-wider ${a.text} ${a.bg} ${a.border} border rounded-full px-3 py-1`}>{slide.type}</span></div>

            {/* Main Stage */}
            <main className="flex-1 flex items-center justify-center relative p-8 md:p-24 overflow-hidden overflow-y-auto">
                <div ref={bgRef} className="absolute w-[700px] h-[700px] rounded-full pointer-events-none -z-0" style={{
                    background: `radial-gradient(circle, rgba(${a.rgb},0.15) 0%, transparent 70%)`,
                    top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                }} />

                <AnimatePresence mode="wait">
                    <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="w-full flex items-center justify-center">
                        <div ref={slideRef} className="w-full flex items-center justify-center">{renderSlide(slide)}</div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Controls Bar */}
            <footer className="absolute bottom-6 inset-x-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-1.5">{slides.map((_, i) => (
                    <div key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${i === currentSlide ? `w-10 bg-gradient-to-r ${a.gradient} shadow-lg ${a.glow}` : i < currentSlide ? `w-4 bg-gradient-to-r ${a.gradient} opacity-40` : "w-4 bg-white/15 hover:bg-white/30"}`} />
                ))}</div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
                    <button onClick={prevSlide} disabled={currentSlide === 0} className="text-white hover:text-purple-400 disabled:opacity-30 transition-all p-2 hover:scale-110 active:scale-95"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
                        {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                    </button>
                    <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="text-white hover:text-purple-400 disabled:opacity-30 transition-all p-2 hover:scale-110 active:scale-95"><SkipForward className="w-5 h-5" /></button>
                </div>

                <div className="w-24 text-right text-gray-500 font-mono text-sm tabular-nums">{currentSlide + 1} / {slides.length}</div>
            </footer>

            <AnimatePresence>
                {showShortcuts && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShortcuts(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 border border-white/10 rounded-2xl p-8 z-[60] w-full max-w-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
                                <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-white"><XIcon className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-3 text-sm">
                                {[
                                    ["Arrow Left / Right", "Previous / Next slide"],
                                    ["Space", "Play / Pause"],
                                    ["M", "Toggle mute"],
                                    ["F", "Toggle fullscreen"],
                                    ["Esc", "Back to dashboard"],
                                    ["?", "Show this dialog"],
                                ].map(([key, desc]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-gray-400">{desc}</span>
                                        <kbd className="bg-white/10 border border-white/10 px-2 py-1 rounded text-xs font-mono text-gray-300">{key}</kbd>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
