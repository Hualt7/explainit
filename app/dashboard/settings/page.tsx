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
    Music2,
    Tv,
} from "lucide-react";
import { useSettingsStore, type AISettings, type PresentationSettings, type VideoStylePreset, type VideoGenSettings } from "../../store/useSettingsStore";
import { Film } from "lucide-react";

const toneOptions: { value: AISettings["tone"]; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4" />, desc: "Clean, corporate tone" },
    { value: "casual", label: "Casual", icon: <Smile className="w-4 h-4" />, desc: "Friendly & approachable" },
    { value: "academic", label: "Academic", icon: <GraduationCap className="w-4 h-4" />, desc: "Research-oriented" },
    { value: "fun", label: "Fun", icon: <Sparkles className="w-4 h-4" />, desc: "Playful & engaging" },
    { value: "storytelling", label: "Storytelling", icon: <BookOpen className="w-4 h-4" />, desc: "Narrative-driven" },
    { value: "tech-deep-dive", label: "Tech Deep Dive", icon: <Code className="w-4 h-4" />, desc: "Technical & in-depth" },
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

const videoStylePresets: { value: VideoStylePreset; label: string; desc: string; tone: AISettings["tone"]; style: AISettings["style"]; slideCount: AISettings["slideCount"] }[] = [
    { value: "custom", label: "Custom", desc: "Use tone, style & length below", tone: "professional", style: "balanced", slideCount: "medium" },
    { value: "teacher", label: "Teacher-style explainer", desc: "Educational, clear, medium length", tone: "casual", style: "balanced", slideCount: "medium" },
    { value: "youtube-tech", label: "YouTube tech channel", desc: "Engaging, visual, in-depth", tone: "tech-deep-dive", style: "visual", slideCount: "long" },
    { value: "corporate", label: "Corporate training", desc: "Professional, polished, concise", tone: "professional", style: "text-heavy", slideCount: "short" },
];

const musicMoodOptions: { value: PresentationSettings["musicMood"]; label: string }[] = [
    { value: "none", label: "No music" },
    { value: "calm", label: "Calm" },
    { value: "uplifting", label: "Uplifting" },
    { value: "corporate", label: "Corporate" },
    { value: "playful", label: "Playful" },
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
    const { ai, presentation, video, setAI, setPresentation, setVideo, resetAll } = useSettingsStore();

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
                            <Tv className="w-4 h-4" /> Video style preset
                        </h2>
                        <p className="text-xs text-gray-500">One-click tone + visual style + length. Or choose Custom and set below.</p>
                        <div className="grid grid-cols-2 gap-2">
                            {videoStylePresets.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => {
                                        setAI({
                                            videoStylePreset: preset.value,
                                            ...(preset.value !== "custom" && { tone: preset.tone, style: preset.style, slideCount: preset.slideCount }),
                                        });
                                        showSaved();
                                    }}
                                    className={`p-3 rounded-xl border text-left transition-all ${(ai.videoStylePreset ?? "custom") === preset.value ? "bg-purple-500/20 border-purple-500/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                                >
                                    <p className="font-semibold text-sm">{preset.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{preset.desc}</p>
                                </button>
                            ))}
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
                                    onClick={() => { setAI({ tone: opt.value, videoStylePreset: "custom" }); showSaved(); }}
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
                                    onClick={() => { setAI({ slideCount: opt.value, videoStylePreset: "custom" }); showSaved(); }}
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
                                    onClick={() => { setAI({ style: opt.value, videoStylePreset: "custom" }); showSaved(); }}
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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Music2 className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium">Background music</span>
                                </div>
                                <button
                                    onClick={() => { setPresentation({ enableMusic: !(presentation.enableMusic ?? true) }); showSaved(); }}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${(presentation.enableMusic ?? true) ? "bg-purple-500" : "bg-white/10"}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${(presentation.enableMusic ?? true) ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                </button>
                            </div>
                            {(presentation.enableMusic ?? true) && (
                                <>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm text-gray-400">Mood</span>
                                        <select
                                            value={presentation.musicMood ?? "calm"}
                                            onChange={(e) => { setPresentation({ musicMood: e.target.value as PresentationSettings["musicMood"] }); showSaved(); }}
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
                                        >
                                            {musicMoodOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Music volume</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.05}
                                                value={presentation.musicVolume ?? 0.25}
                                                onChange={(e) => setPresentation({ musicVolume: parseFloat(e.target.value) })}
                                                onMouseUp={() => showSaved()}
                                                className="w-24 accent-purple-500"
                                            />
                                            <span className="text-sm text-gray-400 w-8 text-right">{Math.round((presentation.musicVolume ?? 0.25) * 100)}%</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Film className="w-4 h-4" /> Cinematic Video Generation
                        </h2>
                        <p className="text-xs text-gray-500">Configure the AI video provider for cinematic video generation.</p>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Video Provider</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {([
                                        { value: "veo" as const, label: "Google Veo 3.1", desc: "60s clips, native audio" },
                                        { value: "runway" as const, label: "Runway Gen-4", desc: "Best quality, 10s clips" },
                                        { value: "kling" as const, label: "Kling 2.6", desc: "Affordable, 10s clips" },
                                    ]).map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setVideo({ provider: opt.value }); showSaved(); }}
                                            className={`p-3 rounded-xl border text-left transition-all ${video.provider === opt.value ? "bg-purple-500/20 border-purple-500/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                                        >
                                            <p className="font-semibold text-sm">{opt.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Aspect Ratio</label>
                                <div className="flex gap-2">
                                    {([
                                        { value: "16:9" as const, label: "16:9 Landscape" },
                                        { value: "9:16" as const, label: "9:16 Portrait" },
                                        { value: "1:1" as const, label: "1:1 Square" },
                                    ]).map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setVideo({ aspectRatio: opt.value }); showSaved(); }}
                                            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${video.aspectRatio === opt.value ? "bg-purple-500/20 border-purple-500/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Quality</label>
                                <div className="flex gap-2">
                                    {([
                                        { value: "standard" as const, label: "Standard (720p)", desc: "Faster, lower cost" },
                                        { value: "high" as const, label: "High (1080p)", desc: "Best quality" },
                                    ]).map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setVideo({ quality: opt.value }); showSaved(); }}
                                            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${video.quality === opt.value ? "bg-purple-500/20 border-purple-500/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/5">
                                <p className="text-xs text-gray-600">
                                    API keys are configured via environment variables (.env.local):
                                    GOOGLE_VEO_API_KEY, RUNWAY_API_KEY, KLING_API_KEY / KLING_API_SECRET
                                </p>
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
