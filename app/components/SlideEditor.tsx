"use client";

import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
    GripVertical,
    Trash2,
    ChevronDown,
    ChevronUp,
    Layout,
    Type,
    Image as ImageIcon,
    Layers,
    X,
    Check,
    Pencil,
} from "lucide-react";
import type { Slide } from "../types";

const typeIcons: Record<string, typeof Layout> = {
    title: Layout,
    content: Layers,
    comparison: Layers,
    timeline: Layers,
    statistic: Type,
    quote: Type,
    diagram: ImageIcon,
    list: Layers,
    callout: Type,
    summary: Layers,
    code: Type,
    definition: Type,
    pros_cons: Layers,
    equation: Type,
    mindmap: ImageIcon,
    table: Layers,
    example: Type,
    funfact: Type,
    steps: Layers,
    highlight: Type,
};

interface SlideEditorProps {
    slides: Slide[];
    onSlidesChange: (slides: Slide[]) => void;
}

export default function SlideEditor({ slides, onSlidesChange }: SlideEditorProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const handleDelete = (id: number) => {
        const updated = slides
            .filter((s) => s.id !== id)
            .map((s, i) => ({ ...s, id: i + 1 }));
        onSlidesChange(updated);
    };

    const startEditing = (slide: Slide) => {
        setEditingId(slide.id);
        const values: Record<string, string> = {};
        if (slide.title) values.title = slide.title;
        if (slide.subtitle) values.subtitle = slide.subtitle;
        if (slide.content) values.content = slide.content;
        if (slide.message) values.message = slide.message;
        if (slide.quote) values.quote = slide.quote;
        if (slide.fact) values.fact = slide.fact;
        if (slide.highlight) values.highlight = slide.highlight;
        if (slide.subtext) values.subtext = slide.subtext;
        if (slide.term) values.term = slide.term;
        if (slide.definition) values.definition = slide.definition;
        if (slide.equation) values.equation = slide.equation;
        if (slide.explanation) values.explanation = slide.explanation;
        if (slide.closingLine) values.closingLine = slide.closingLine;
        if (slide.bullets) values.bullets = slide.bullets.join("\n");
        if (slide.keyPoints) values.keyPoints = slide.keyPoints.join("\n");
        if (slide.pros) values.pros = slide.pros.join("\n");
        if (slide.cons) values.cons = slide.cons.join("\n");
        setEditValues(values);
    };

    const saveEditing = () => {
        if (editingId === null) return;
        const updated = slides.map((s) => {
            if (s.id !== editingId) return s;
            const patched = { ...s };
            Object.entries(editValues).forEach(([key, val]) => {
                if (["bullets", "keyPoints", "pros", "cons"].includes(key)) {
                    (patched as Record<string, unknown>)[key] = val
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean);
                } else {
                    (patched as Record<string, unknown>)[key] = val;
                }
            });
            return patched;
        });
        onSlidesChange(updated);
        setEditingId(null);
        setEditValues({});
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValues({});
    };

    const getEditableFields = (slide: Slide): string[] => {
        const fields: string[] = [];
        if ("title" in slide && slide.title !== undefined) fields.push("title");
        if ("subtitle" in slide && slide.subtitle !== undefined) fields.push("subtitle");
        if ("content" in slide && slide.content !== undefined) fields.push("content");
        if ("bullets" in slide && slide.bullets !== undefined) fields.push("bullets");
        if ("message" in slide && slide.message !== undefined) fields.push("message");
        if ("quote" in slide && slide.quote !== undefined) fields.push("quote");
        if ("fact" in slide && slide.fact !== undefined) fields.push("fact");
        if ("highlight" in slide && slide.highlight !== undefined) fields.push("highlight");
        if ("subtext" in slide && slide.subtext !== undefined) fields.push("subtext");
        if ("term" in slide && slide.term !== undefined) fields.push("term");
        if ("definition" in slide && slide.definition !== undefined) fields.push("definition");
        if ("equation" in slide && slide.equation !== undefined) fields.push("equation");
        if ("explanation" in slide && slide.explanation !== undefined) fields.push("explanation");
        if ("closingLine" in slide && slide.closingLine !== undefined) fields.push("closingLine");
        if ("keyPoints" in slide && slide.keyPoints !== undefined) fields.push("keyPoints");
        if ("pros" in slide && slide.pros !== undefined) fields.push("pros");
        if ("cons" in slide && slide.cons !== undefined) fields.push("cons");
        return fields;
    };

    const isMultiline = (key: string) =>
        ["bullets", "keyPoints", "pros", "cons"].includes(key);

    const friendlyLabel = (key: string) =>
        key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())
            .trim();

    return (
        <div className="space-y-3">
            <Reorder.Group
                axis="y"
                values={slides}
                onReorder={(newOrder) => {
                    const reindexed = newOrder.map((s, i) => ({ ...s, id: i + 1 }));
                    onSlidesChange(reindexed);
                }}
                className="space-y-2"
            >
                <AnimatePresence>
                    {slides.map((slide, i) => {
                        const Icon = typeIcons[slide.type] || Layout;
                        const isEditing = editingId === slide.id;

                        return (
                            <Reorder.Item
                                key={slide.id}
                                value={slide}
                                className="list-none"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`bg-white/5 border rounded-xl transition-colors ${
                                        isEditing
                                            ? "border-purple-500/40 bg-white/10"
                                            : "border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 p-3">
                                        <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div className="w-9 h-9 rounded-lg bg-black/50 flex items-center justify-center border border-white/5 flex-shrink-0">
                                            <Icon className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 uppercase font-semibold">
                                                Scene {i + 1} ({slide.type})
                                            </div>
                                            <div className="text-sm font-medium truncate">
                                                {slide.title || slide.content || slide.highlight || "Untitled"}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {!isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(slide)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                                        title="Edit slide"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slide.id)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                        title="Delete slide"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={saveEditing}
                                                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                                        title="Save changes"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-3 pb-3 pt-1 space-y-2 border-t border-white/5 mt-1">
                                                    {getEditableFields(slide).map((field) => (
                                                        <div key={field}>
                                                            <label className="text-xs text-gray-500 font-medium block mb-1">
                                                                {friendlyLabel(field)}
                                                                {isMultiline(field) && (
                                                                    <span className="text-gray-600 ml-1">(one per line)</span>
                                                                )}
                                                            </label>
                                                            {isMultiline(field) ? (
                                                                <textarea
                                                                    value={editValues[field] || ""}
                                                                    onChange={(e) =>
                                                                        setEditValues((prev) => ({
                                                                            ...prev,
                                                                            [field]: e.target.value,
                                                                        }))
                                                                    }
                                                                    rows={3}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={editValues[field] || ""}
                                                                    onChange={(e) =>
                                                                        setEditValues((prev) => ({
                                                                            ...prev,
                                                                            [field]: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Reorder.Item>
                        );
                    })}
                </AnimatePresence>
            </Reorder.Group>
        </div>
    );
}
