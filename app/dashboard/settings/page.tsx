"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import {
    User,
    Sparkles,
    LogOut,
    RotateCcw,
    Check,
    MessageSquare,
    BookOpen,
    Smile,
    GraduationCap,
    Briefcase,
    Palette,
    Play,
    Clock,
    Code,
    Quote,
    Lightbulb,
    BarChart3,
    Volume2,
} from "lucide-react";
import { useSettingsStore, type AISettings } from "../../store/useSettingsStore";

const toneOptions: { value: AISettings["tone"]; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4" />, desc: "Clean, corporate tone" },
    { value: "casual", label: "Casual", icon: <Smile className="w-4 h-4" />, desc: "Friendly & approachable" },
    { value: "academic", label: "Academic", icon: <GraduationCap className="w-4 h-4" />, desc: "Research-oriented" },
    { value: "fun", label: "Fun", icon: <Sparkles className="w-4 h-4" />, desc: "Playful & engaging" },
    { value: "storytelling", label: "Storytelling", icon: <BookOpen className="w-4 h-4" />, desc: "Narrative-driven" },
];

const slideCountOptions: { value: AISettings["slideCount"]; label: string; range: string }[] = [
    { value: "auto", label: "Auto", range: "Unlimited slides" },
    { value: "short", label: "Short", range: "6-8 slides" },
    { value: "medium", label: "Medium", range: "12-15 slides" },
    { value: "long", label: "Long", range: "16-20 slides" },
];

const styleOptions: { value: AISettings["style"]; label: string; desc: string }[] = [
    { value: "visual", label: "Visual Heavy", desc: "More diagrams, charts, comparisons" },
    { value: "balanced", label: "Balanced", desc: "Mix of text and visuals" },
    { value: "text-heavy", label: "Text Heavy", desc: "More detailed explanations" },
];

const accentColors = [
    { value: "purple", color: "#a855f7" },
    { value: "blue", color: "#3b82f6" },
    { value: "pink", color: "#ec4899" },
    { value: "emerald", color: "#10b981" },
    { value: "amber", color: "#f59e0b" },
    { value: "cyan", color: "#06b6d4" },
    { value: "indigo", color: "#6366f1" },
    { value: "rose", color: "#f43f5e" },
    { value: "teal", color: "#14b8a6" },
    { value: "orange", color: "#f97316" },
];

export default function SettingsPage() {
    const [email, setEmail] = useState("");
    const [saved, setSaved] = useState(false);
    const { ai, presentation, setAI, setPresentation, resetAll } = useSettingsStore();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email || "");
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const showSaved = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <main className="flex-1 flex flex-col h-full">
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                <h1 className="font-semibold text-lg">Settings</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => { resetAll(); showSaved(); }}
                        className="px-4 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset All
                    </button>
                    {saved && (
                        <span className="flex items-center gap-1 text-sm text-emerald-400 animate-pulse">
                            <Check className="w-4 h-4" /> Saved
                        </span>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h2>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{email || "Loading..."}</p>
                                    <p className="text-sm text-gray-500">Signed in via Supabase</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI Tone
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {toneOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setAI({ tone: opt.value }); showSaved(); }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${ai.tone === opt.value
                                        ? "bg-purple-500/20 border-purple-500/50 text-white"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ai.tone === opt.value ? "bg-purple-500/30" : "bg-white/5"}`}>
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{opt.label}</p>
                                        <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Presentation Length</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {slideCountOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setAI({ slideCount: opt.value }); showSaved(); }}
                                    className={`p-4 rounded-xl border text-center transition-all ${ai.slideCount === opt.value
                                        ? "bg-purple-500/20 border-purple-500/50 text-white"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    <p className="font-semibold">{opt.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{opt.range}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Visual Style</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {styleOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setAI({ style: opt.value }); showSaved(); }}
                                    className={`p-4 rounded-xl border text-center transition-all ${ai.style === opt.value
                                        ? "bg-purple-500/20 border-purple-500/50 text-white"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    <p className="font-semibold text-sm">{opt.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Include Slide Types</h2>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
                            {([
                                { key: "includeCode" as const, label: "Code Examples", icon: <Code className="w-4 h-4" /> },
                                { key: "includeQuotes" as const, label: "Quotes & Insights", icon: <Quote className="w-4 h-4" /> },
                                { key: "includeFunFacts" as const, label: "Fun Facts", icon: <Lightbulb className="w-4 h-4" /> },
                                { key: "includeStatistics" as const, label: "Statistics & Data", icon: <BarChart3 className="w-4 h-4" /> },
                            ]).map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">{item.icon}</div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => { setAI({ [item.key]: !ai[item.key] }); showSaved(); }}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${ai[item.key] ? "bg-purple-500" : "bg-white/10"}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${ai[item.key] ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Custom Instructions
                        </h2>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-1">
                            <textarea
                                value={ai.customInstructions}
                                onChange={(e) => { setAI({ customInstructions: e.target.value }); }}
                                onBlur={showSaved}
                                placeholder="e.g. Always use real-world examples. Focus on beginner-friendly explanations. Avoid jargon..."
                                rows={3}
                                className="w-full bg-transparent border-none p-4 text-white placeholder-gray-600 focus:outline-none resize-none text-sm leading-relaxed"
                            />
                        </div>
                        <p className="text-xs text-gray-600">These instructions will be included in every AI generation.</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Default Accent Color
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            {accentColors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => { setPresentation({ defaultAccent: c.value }); showSaved(); }}
                                    className={`w-10 h-10 rounded-xl transition-all ${presentation.defaultAccent === c.value
                                        ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                                        : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: c.color }}
                                    title={c.value}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Playback</h2>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Play className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium">Auto-play presentations</span>
                                </div>
                                <button
                                    onClick={() => { setPresentation({ autoPlay: !presentation.autoPlay }); showSaved(); }}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${presentation.autoPlay ? "bg-purple-500" : "bg-white/10"}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${presentation.autoPlay ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Volume2 className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium">Enable AI Voice (Text-to-Speech)</span>
                                </div>
                                <button
                                    onClick={() => { setPresentation({ enableVoice: !presentation.enableVoice }); showSaved(); }}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${presentation.enableVoice ? "bg-purple-500" : "bg-white/10"}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${presentation.enableVoice ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <span className="text-sm font-medium">Slide duration</span>
                                        <p className="text-xs text-gray-500">{presentation.slideDuration}s per slide</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min={3}
                                        max={15}
                                        value={presentation.slideDuration}
                                        onChange={(e) => setPresentation({ slideDuration: parseInt(e.target.value) })}
                                        onMouseUp={() => showSaved()}
                                        className="w-24 accent-purple-500"
                                    />
                                    <span className="text-sm text-gray-400 w-6 text-right">{presentation.slideDuration}s</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3 pb-8">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Session</h2>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign out of your account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
