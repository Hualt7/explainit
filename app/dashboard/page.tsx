"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Play,
    Download,
    Layout,
    Film,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    Video,
} from "lucide-react";
import Link from "next/link";
import { useProjectStore } from "../store/useProjectStore";
import dynamic from "next/dynamic";
import { ExplainItVideo, SLIDE_DURATION_FRAMES } from "../remotion/Root";
import { useSettingsStore } from "../store/useSettingsStore";
import { useToastStore } from "../store/useToastStore";
import SlideEditor from "../components/SlideEditor";
import type { VideoJob } from "../lib/video/types";

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
    const videoSettings = useSettingsStore((state) => state.video);
    const addToast = useToastStore((state) => state.addToast);

    // Video generation state
    const videoBlueprint = useProjectStore((s) => s.videoBlueprint);
    const setVideoBlueprint = useProjectStore((s) => s.setVideoBlueprint);
    const videoJobs = useProjectStore((s) => s.videoJobs);
    const setVideoJobs = useProjectStore((s) => s.setVideoJobs);
    const videoPhase = useProjectStore((s) => s.videoPhase);
    const setVideoPhase = useProjectStore((s) => s.setVideoPhase);
    const videoProgress = useProjectStore((s) => s.videoProgress);
    const setVideoProgress = useProjectStore((s) => s.setVideoProgress);
    const setVideoError = useProjectStore((s) => s.setVideoError);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Tab: "slides" or "cinematic"
    const [activeTab, setActiveTab] = useState<"slides" | "cinematic">("slides");

    const setScriptText = (text: string) => {
        setScriptTextLocal(text);
        storeSetScriptText(text);
    };

    // ── Slide generation (existing) ──

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
                setActiveTab("slides");
                addToast(`Generated ${data.slides.length} slides`, "success");
            } else {
                addToast("Failed to generate slides. Please try again.", "error");
            }
        } catch {
            addToast("Network error while generating slides.", "error");
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
            addToast(`Export failed: ${error.message}`, "error");
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
                    body: JSON.stringify({ id: currentProjectId, script: scriptText, slides: generatedSlides }),
                });
            } else {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: generatedSlides[0]?.title || 'Untitled Project', script: scriptText, slides: generatedSlides }),
                });
                const data = await res.json();
                if (data.project) setCurrentProjectId(data.project.id);
            }
            addToast("Project saved", "success");
        } catch {
            addToast("Failed to save project.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Cinematic video generation ──

    const handleGenerateVideo = async () => {
        if (!scriptText.trim()) return;

        setVideoPhase("blueprinting");
        setVideoProgress(0);
        setVideoError(null);
        setVideoBlueprint(null);
        setVideoJobs([]);
        setActiveTab("cinematic");

        try {
            const response = await fetch("/api/video/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    script: scriptText,
                    settings: {
                        videoProvider: videoSettings.provider,
                        videoQuality: videoSettings.quality,
                        aspectRatio: videoSettings.aspectRatio,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate video");
            }

            setVideoBlueprint(data.blueprint);
            setVideoJobs(data.jobs);
            setVideoPhase("generating");
            addToast(`Blueprint created: ${data.blueprint.shots.length} shots`, "success");

            // Start polling
            startPolling(data.jobs);
        } catch (error: any) {
            setVideoPhase("error");
            setVideoError(error.message);
            addToast(`Video generation failed: ${error.message}`, "error");
        }
    };

    const startPolling = useCallback((initialJobs: VideoJob[]) => {
        // Clear existing poll
        if (pollRef.current) clearInterval(pollRef.current);

        let currentJobs = initialJobs;

        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch("/api/video/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jobs: currentJobs,
                        provider: videoSettings.provider,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    currentJobs = data.jobs;
                    setVideoJobs(data.jobs);
                    setVideoProgress(data.progress);

                    if (data.complete) {
                        if (pollRef.current) clearInterval(pollRef.current);
                        pollRef.current = null;

                        const hasAnySuccess = data.jobs.some((j: VideoJob) => j.status === "completed");
                        if (hasAnySuccess) {
                            setVideoPhase("complete");
                            addToast("Video generation complete!", "success");
                        } else {
                            setVideoPhase("error");
                            setVideoError("All shots failed to generate");
                            addToast("All shots failed to generate", "error");
                        }
                    }
                }
            } catch {
                // Silently retry on network errors
            }
        }, 10000); // Poll every 10 seconds
    }, [videoSettings.provider, setVideoJobs, setVideoProgress, setVideoPhase, setVideoError, addToast]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const handleRegenerateShot = async (shotId: number) => {
        if (!videoBlueprint) return;

        const shot = videoBlueprint.shots.find((s) => s.id === shotId);
        if (!shot) return;

        // Mark shot as queued while we retry
        const updatedJobs = videoJobs.map((j) =>
            j.shotId === shotId ? { ...j, status: "queued" as const, resultUrl: undefined, error: undefined } : j
        );
        setVideoJobs(updatedJobs);

        try {
            const res = await fetch("/api/video/retry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shot: {
                        id: shot.id,
                        visual: shot.visual,
                        cameraMove: shot.cameraMove,
                        textOverlay: shot.textOverlay,
                        duration: shot.duration,
                    },
                    settings: {
                        videoProvider: videoSettings.provider,
                        videoQuality: videoSettings.quality,
                        aspectRatio: videoBlueprint.aspectRatio,
                    },
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.job) {
                    const newJobs = updatedJobs.map((j) =>
                        j.shotId === shotId ? data.job : j
                    );
                    setVideoJobs(newJobs);
                    setVideoPhase("generating");
                    startPolling(newJobs);
                    addToast(`Retrying shot #${shotId}`, "success");
                }
            } else {
                const errData = await res.json();
                addToast(`Retry failed: ${errData.error || "Unknown error"}`, "error");
                setVideoJobs(
                    updatedJobs.map((j) =>
                        j.shotId === shotId ? { ...j, status: "failed" as const, error: errData.details || errData.error } : j
                    )
                );
            }
        } catch {
            addToast("Failed to regenerate shot", "error");
            setVideoJobs(
                updatedJobs.map((j) =>
                    j.shotId === shotId ? { ...j, status: "failed" as const, error: "Network error" } : j
                )
            );
        }
    };

    // ── Render ──

    const showVideoResults = videoPhase !== "idle" && activeTab === "cinematic";

    return (
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
                        {isSaving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={scriptText.length === 0 || isGenerating}
                        className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? "Generating..." : "Generate Slides"}
                        {!isGenerating && <SparklesIcon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleGenerateVideo}
                        disabled={scriptText.length === 0 || videoPhase === "blueprinting" || videoPhase === "generating"}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {videoPhase === "blueprinting" ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Directing...
                            </>
                        ) : videoPhase === "generating" ? (
                            <>
                                <Film className="w-4 h-4 animate-pulse" /> {videoProgress}%
                            </>
                        ) : (
                            <>
                                <Film className="w-4 h-4" /> Cinematic Video
                            </>
                        )}
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

                    {/* Tab switcher */}
                    {(generatedSlides.length > 0 || showVideoResults) && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex bg-white/5 border border-white/10 rounded-full p-0.5">
                            <button
                                onClick={() => setActiveTab("slides")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                                    activeTab === "slides"
                                        ? "bg-white text-black"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Layout className="w-3 h-3 inline mr-1" />
                                Slides
                            </button>
                            <button
                                onClick={() => setActiveTab("cinematic")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                                    activeTab === "cinematic"
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Film className="w-3 h-3 inline mr-1" />
                                Cinematic
                            </button>
                        </div>
                    )}

                    <div className="absolute inset-0 overflow-y-auto p-6 pt-14 flex flex-col items-center">
                        {activeTab === "slides" ? (
                            /* ── Slides Tab ── */
                            generatedSlides.length === 0 ? (
                                <div className="m-auto flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        {isGenerating ? (
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Layout className="w-6 h-6" />
                                        )}
                                    </div>
                                    <p className="max-w-[200px]">
                                        {isGenerating
                                            ? "Analyzing text and building slides..."
                                            : "Type a script on the left and hit generate to see the preview."}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full max-w-md space-y-6">
                                    <VideoPreview slides={generatedSlides} />
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-400">Generated Scenes</h3>
                                            <div className="flex gap-2">
                                                <Link
                                                    href="/presentation"
                                                    className="text-xs bg-white text-black px-3 py-1 rounded-full flex gap-1 items-center hover:bg-gray-200 transition-colors font-medium"
                                                >
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
                                        <SlideEditor slides={generatedSlides} onSlidesChange={setGeneratedSlides} />
                                    </div>
                                </div>
                            )
                        ) : (
                            /* ── Cinematic Video Tab ── */
                            <div className="w-full max-w-lg space-y-6">
                                {videoPhase === "idle" && (
                                    <div className="m-auto flex flex-col items-center justify-center text-center text-gray-500 space-y-4 mt-20">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border border-purple-500/20">
                                            <Film className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <p className="max-w-[260px]">
                                            Click "Cinematic Video" to generate Apple/Samsung-grade video from your script.
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Provider: {videoSettings.provider.toUpperCase()} | Quality: {videoSettings.quality}
                                        </p>
                                    </div>
                                )}

                                {videoPhase === "blueprinting" && (
                                    <div className="m-auto flex flex-col items-center justify-center text-center space-y-4 mt-20">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                                            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                        </div>
                                        <p className="text-gray-300 font-medium">Claude is directing your video...</p>
                                        <p className="text-xs text-gray-500 max-w-[300px]">
                                            Designing shot compositions, camera angles, lighting, and transitions
                                        </p>
                                    </div>
                                )}

                                {(videoPhase === "generating" || videoPhase === "complete" || videoPhase === "error") &&
                                    videoBlueprint && (
                                        <>
                                            {/* Blueprint header */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-white">{videoBlueprint.title}</h3>
                                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                                        {videoBlueprint.style.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div className="flex gap-4 text-xs text-gray-400">
                                                    <span>{videoBlueprint.shots.length} shots</span>
                                                    <span>~{videoBlueprint.totalDuration}s total</span>
                                                    <span>{videoBlueprint.aspectRatio}</span>
                                                </div>

                                                {/* Overall progress bar */}
                                                {videoPhase === "generating" && (
                                                    <div className="mt-3">
                                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${videoProgress}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Generating... {videoProgress}%
                                                        </p>
                                                    </div>
                                                )}

                                                {videoPhase === "complete" && (
                                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Generation complete
                                                    </p>
                                                )}
                                            </div>

                                            {/* Shot list */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-gray-400">Shots</h4>
                                                {videoBlueprint.shots.map((shot) => {
                                                    const job = videoJobs.find((j) => j.shotId === shot.id);
                                                    return (
                                                        <ShotCard
                                                            key={shot.id}
                                                            shot={shot}
                                                            job={job}
                                                            onRegenerate={() => handleRegenerateShot(shot.id)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// ── Shot Card Component ──

function ShotCard({
    shot,
    job,
    onRegenerate,
}: {
    shot: { id: number; duration: number; visual: string; cameraMove?: string; transition: string };
    job?: VideoJob;
    onRegenerate: () => void;
}) {
    const status = job?.status || "queued";

    const statusIcon = {
        queued: <Clock className="w-4 h-4 text-gray-500" />,
        processing: <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />,
        completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        failed: <XCircle className="w-4 h-4 text-red-400" />,
    }[status];

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0">
                    {statusIcon}
                    <span className="text-xs font-mono text-gray-500">#{shot.id}</span>
                </div>
                <p className="text-sm text-gray-300 flex-1 line-clamp-2">{shot.visual}</p>
                <div className="flex items-center gap-2 shrink-0">
                    {status === "failed" && (
                        <button
                            onClick={onRegenerate}
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" /> Retry
                        </button>
                    )}
                    {status === "completed" && job?.resultUrl && (
                        <a
                            href={job.resultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                            <Video className="w-3 h-3" /> View
                        </a>
                    )}
                </div>
            </div>

            <div className="flex gap-3 text-xs text-gray-500">
                <span>{shot.duration}s</span>
                {shot.cameraMove && <span>{shot.cameraMove}</span>}
                <span>{shot.transition}</span>
            </div>

            {status === "completed" && job?.resultUrl && (
                <video
                    src={job.resultUrl}
                    className="w-full rounded-lg mt-2 aspect-video bg-black"
                    controls
                    preload="metadata"
                />
            )}

            {status === "failed" && job?.error && (
                <p className="text-xs text-red-400/80 mt-1">{job.error}</p>
            )}
        </div>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
        </svg>
    );
}
