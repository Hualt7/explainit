"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trash2,
    Clock,
    FileText,
    Layers,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../../store/useProjectStore";
import type { Project } from "../../types";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();
    const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);
    const setGeneratedSlides = useProjectStore((s) => s.setGeneratedSlides);
    const setScriptText = useProjectStore((s) => s.setScriptText);
    const setProjectTitle = useProjectStore((s) => s.setProjectTitle);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            if (data.projects) setProjects(data.projects);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = (project: Project) => {
        setCurrentProjectId(project.id);
        setGeneratedSlides(project.slides || []);
        setScriptText(project.script || "");
        setProjectTitle(project.title || "Untitled Project");
        router.push("/dashboard");
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Delete this project? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await fetch("/api/projects", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <main className="flex-1 flex flex-col h-full">
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <h1 className="font-semibold text-lg">My Projects</h1>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Project
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                                    </div>
                                    <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
                                    <div className="space-y-1.5 mb-4">
                                        <div className="h-3 w-full bg-white/5 rounded" />
                                        <div className="h-3 w-2/3 bg-white/5 rounded" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-3 w-16 bg-white/5 rounded" />
                                        <div className="h-3 w-12 bg-white/5 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <FileText className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-medium text-gray-400">No projects yet</p>
                            <p className="max-w-sm text-sm">
                                Create your first project — paste a script, generate slides, and
                                save it as a draft.
                            </p>
                            <Link
                                href="/dashboard"
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                Create First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {projects.map((project, i) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleOpen(project)}
                                        className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:border-purple-500/30 transition-all duration-200"
                                    >
                                        {/* Gradient accent bar */}
                                        <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                                <Layers className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, project.id)}
                                                disabled={deletingId === project.id}
                                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                                title="Delete project"
                                            >
                                                {deletingId === project.id ? (
                                                    <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        <h3 className="font-semibold text-white truncate mb-1">
                                            {project.title || "Untitled Project"}
                                        </h3>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                                            {project.script
                                                ? project.script.substring(0, 120) + (project.script.length > 120 ? "..." : "")
                                                : "No script"}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-3 h-3" />
                                                {project.slides?.length || 0} slides
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {timeAgo(project.updated_at)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
        </main>
    );
}
