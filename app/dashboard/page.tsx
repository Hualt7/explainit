"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import {
    Video,
    Settings,
    LogOut,
    Plus,
    Play,
    Download,
    Layout,
    Type,
    Image as ImageIcon,
    Layers
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../store/useProjectStore";
import dynamic from "next/dynamic";
import { ExplainItVideo, SLIDE_DURATION_FRAMES } from "../remotion/Root";

import { useSettingsStore } from "../store/useSettingsStore";

const VideoPreview = dynamic(() => import("../remotion/VideoPreview"), {
    ssr: false,
    loading: () => (
        <div className="aspect-video bg-black/80 rounded-2xl border border-white/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    ),
});

export default function Dashboard() {
    const storeScriptText = useProjectStore((state) => state.scriptText);
    const storeSetScriptText = useProjectStore((state) => state.setScriptText);
    const [scriptText, setScriptTextLocal] = useState(storeScriptText);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const generatedSlides = useProjectStore((state) => state.generatedSlides);
    const setGeneratedSlides = useProjectStore((state) => state.setGeneratedSlides);
    const currentProjectId = useProjectStore((state) => state.currentProjectId);
    const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId);
    const projectTitle = useProjectStore((state) => state.projectTitle);
    const aiSettings = useSettingsStore((state) => state.ai);
    const router = useRouter();

    const setScriptText = (text: string) => {
        setScriptTextLocal(text);
        storeSetScriptText(text);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script: scriptText, settings: aiSettings }),
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedSlides(data.slides);
            } else {
                console.error("Failed to generate:", data.error);
                alert("Failed to generate slides. Please try again.");
            }
        } catch (error) {
            console.error("Error calling generate API:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = async () => {
        if (generatedSlides.length === 0) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            const { renderMediaOnWeb } = await import("@remotion/web-renderer");
            const totalFrames = generatedSlides.length * SLIDE_DURATION_FRAMES;

            const { getBlob } = await renderMediaOnWeb({
                composition: {
                    component: () => <ExplainItVideo slides={generatedSlides} />,
                    durationInFrames: totalFrames,
                    fps: 30,
                    width: 1920,
                    height: 1080,
                    id: "ExplainItVideo",
                    defaultProps: { slides: generatedSlides },
                },
                inputProps: { slides: generatedSlides },
                onProgress: ({ renderedFrames }) => {
                    setExportProgress(Math.round((renderedFrames / totalFrames) * 100));
                },
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
            console.error("Export error:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (currentProjectId) {
                await fetch('/api/projects', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: currentProjectId,
                        script: scriptText,
                        slides: generatedSlides,
                    }),
                });
            } else {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: generatedSlides[0]?.content || 'Untitled Project',
                        script: scriptText,
                        slides: generatedSlides,
                    }),
                });
                const data = await res.json();
                if (data.project) {
                    setCurrentProjectId(data.project.id);
                }
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Layout': return Layout;
            case 'ImageIcon': return ImageIcon;
            case 'Type': return Type;
            case 'Layers': return Layers;
            default: return Layout;
        }
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 p-4 flex flex-col hidden md:flex">
                <div className="flex items-center gap-2 px-2 py-4 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">ExplainIt</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 font-medium transition-colors">
                        <Layout className="w-5 h-5" /> Projects
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-white font-medium">
                        <Plus className="w-5 h-5" /> New Project
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 font-medium transition-colors">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 font-medium transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" /> Log out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <h1 className="font-semibold text-lg">{currentProjectId ? projectTitle : "New Project"}</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || (scriptText.length === 0 && generatedSlides.length === 0)}
                            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={scriptText.length === 0 || isGenerating}
                            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? "Generating..." : "Generate Magic"}
                            {!isGenerating && <SparklesIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </header>

                {/* Workspace */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane (Left) */}
                    <div className="w-1/2 p-6 flex flex-col border-r border-white/10">
                        <label className="text-sm font-medium text-gray-400 mb-2 block">
                            Paste your script or idea here:
                        </label>
                        <textarea
                            value={scriptText}
                            onChange={(e) => setScriptText(e.target.value)}
                            placeholder="e.g. I want to explain how React Context works to beginners. First, introduce the problem of prop drilling..."
                            className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-sans leading-relaxed"
                        />
                    </div>

                    {/* Preview Pane (Right) */}
                    <div className="w-1/2 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-black relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 mix-blend-overlay"></div>

                        <div className="absolute inset-0 overflow-y-auto p-6 flex flex-col items-center">
                            {generatedSlides.length === 0 ? (
                                <div className="m-auto flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        {isGenerating ? (
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Layout className="w-6 h-6" />
                                        )}
                                    </div>
                                    <p className="max-w-[200px]">
                                        {isGenerating ? "Analyzing text and building slides..." : "Type a script on the left and hit generate to see the preview."}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full max-w-md space-y-6">
                                    {/* Remotion Video Player */}
                                    <VideoPreview slides={generatedSlides} />

                                    {/* Slides Timeline */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-400">Generated Scenes</h3>
                                            <div className="flex gap-2">
                                                <Link href="/presentation" className="text-xs bg-white text-black px-3 py-1 rounded-full flex gap-1 items-center hover:bg-gray-200 transition-colors font-medium">
                                                    <Play className="w-3 h-3 fill-black" /> Play Course
                                                </Link>
                                                <button
                                                    onClick={handleExport}
                                                    disabled={isExporting}
                                                    className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full flex gap-1 items-center hover:bg-purple-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isExporting ? (
                                                        <>
                                                            <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                                            {exportProgress}%
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download className="w-3 h-3" /> Export MP4
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {generatedSlides.map((slide, i) => {
                                                const IconComponent = getIcon(slide.icon);
                                                return (
                                                    <motion.div
                                                        key={slide.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center border border-white/5">
                                                            <IconComponent className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Scene {i + 1} ({slide.type})</div>
                                                            <div className="text-sm font-medium truncate">{slide.content}</div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
    );
}
