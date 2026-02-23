import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { script, settings } = await req.json();

        if (!script || script.trim().length === 0) {
            return NextResponse.json(
                { error: "Script text is required" },
                { status: 400 }
            );
        }

        // Build dynamic settings from user preferences
        const tone = settings?.tone || "professional";
        const slideCount = settings?.slideCount || "medium";
        const style = settings?.style || "balanced";
        const includeCode = settings?.includeCode !== false;
        const includeQuotes = settings?.includeQuotes !== false;
        const includeFunFacts = settings?.includeFunFacts !== false;
        const includeStatistics = settings?.includeStatistics !== false;
        const customInstructions = settings?.customInstructions || "";

        const slideCountRange = slideCount === "short" ? "6-8" : slideCount === "long" ? "16-20" : slideCount === "auto" ? "AS MANY SLIDES AS NECESSARY to fully explain the topic in deep detail. Do not hold back, generate a comprehensive set of slides." : "12-15";

        const toneInstructions: Record<string, string> = {
            professional: "Use a clean, corporate, and authoritative tone. Be precise and polished.",
            casual: "Use a friendly, approachable, conversational tone. Like explaining to a friend.",
            academic: "Use a research-oriented, scholarly tone with proper terminology and citations.",
            fun: "Use a playful, energetic, entertaining tone. Add humor and enthusiasm. Use emojis if appropriate.",
            storytelling: "Use a narrative-driven approach. Tell a story, build suspense, use analogies.",
        };

        const styleInstructions: Record<string, string> = {
            visual: "Emphasize highly visual slides — more comparisons, diagrams, timelines, mindmaps, and tables. Minimize long text blocks.",
            balanced: "Use a balanced mix of text-based and visual slides for variety.",
            "text-heavy": "Provide more detailed text explanations with thorough content slides and definitions.",
        };

        const excludedTypes: string[] = [];
        if (!includeCode) excludedTypes.push('"code"');
        if (!includeQuotes) excludedTypes.push('"quote"');
        if (!includeFunFacts) excludedTypes.push('"funfact"');
        if (!includeStatistics) excludedTypes.push('"statistic"');

        const excludeLine = excludedTypes.length > 0
            ? `\nDO NOT use these slide types: ${excludedTypes.join(", ")}.`
            : "";

        const customLine = customInstructions.trim()
            ? `\nADDITIONAL USER INSTRUCTIONS (CRITICAL: You MUST follow these instructions carefully. If the user asks you to act like a pirate, Do it! Act like a pirate! Ensure they apply exactly to the generated content):\n${customInstructions.trim()}`
            : "";

        const prompt = `You are ExplainIt, a world-class educational content designer and visual storyteller. Your job is to transform raw text into a RICH, DETAILED, VISUALLY DIVERSE presentation that feels like a premium educational video.

0. MANDATORY SETTINGS:
TONE: ${toneInstructions[tone] || toneInstructions.professional}
VISUAL STYLE: ${styleInstructions[style] || styleInstructions.balanced}
You MUST strictly adhere to the Tone and Visual Style set above.

CRITICAL RULES:
1. Do NOT just copy the user's text. REWRITE, EXPAND, and ENRICH the content with your own expert knowledge while strictly following the requested tone.
2. Add examples, analogies, data, and insights that go FAR BEYOND what the user wrote.
3. Length/Slide Count: Generate ${slideCountRange} Make it thorough and educational.
4. NEVER use the same slide type twice in a row.
5. You MUST use at least 12 different slide types. Track which types you've used and prioritize unused ones.
6. Never use the same type more than 3 times total across the entire presentation.
7. Every 5 slides, you MUST include at least one visual-heavy type (comparison, diagram, mindmap, table, bar_chart, pie_chart, timeline, pros_cons).
8. Each slide should have a unique accent color.${excludeLine}${customLine}

AVAILABLE SLIDE TYPES (use as many different types as possible):

"title" — Opening splash. Fields: title, subtitle
"content" — Key point + bullets. Fields: title, bullets[], layout?("default"|"cards"|"numbered"|"icon-list")
"comparison" — Side-by-side A vs B. Fields: title, labelA, labelB, bulletsA[], bulletsB[], layout?("side-by-side"|"stacked"|"versus")
"timeline" — Step-by-step process. Fields: title, steps[{step, detail}], layout?("vertical"|"horizontal"|"zigzag")
"statistic" — Big number/data. Fields: title, number, unit, description
"quote" — Key insight/quote. Fields: title, quote, attribution
"diagram" — Flowchart. Fields: title, nodes[{label}], description
"list" — Terms + definitions. Fields: title, items[{term, definition}]
"callout" — Tip/warning/insight card. Fields: title, calloutType("tip"|"warning"|"insight"), message
"code" — Code example. Fields: title, language, code, explanation
"definition" — Term definition card. Fields: title, term, definition, example
"pros_cons" — Pros vs Cons. Fields: title, pros[], cons[]
"equation" — Formula/equation. Fields: title, equation, explanation
"mindmap" — Central idea + branches. Fields: title, center, branches[{label, children[]}]
"table" — Data table. Fields: title, headers[], rows[][]
"example" — Real-world example. Fields: title, scenario, explanation, lesson
"funfact" — Surprising fact. Fields: title, fact, source
"steps" — Horizontal numbered steps. Fields: title, steps[]
"highlight" — Single big emphasis word/phrase. Fields: title, highlight, subtext
"summary" — Closing takeaways. Fields: title, keyPoints[], closingLine
"bar_chart" — Bar chart with labeled data. Fields: title, data[{label, value}], unit
"pie_chart" — Pie/donut chart. Fields: title, data[{label, value, color}]
"progress" — Progress bars. Fields: title, items[{label, value, max}]
"icon_grid" — Grid of icons with labels (for feature lists). Fields: title, items[{icon, label, description}]
"big_number_grid" — Multiple stats side by side. Fields: title, stats[{number, label}]

You are NOT limited to these types. If the content calls for a different type, INVENT one — just provide a "type" string and whatever fields make sense. The renderer will handle unknown types gracefully.

ACCENT COLORS — vary these across slides:
"purple", "blue", "pink", "emerald", "amber", "rose", "cyan", "indigo", "violet", "teal", "orange", "lime"

RESPONSE FORMAT — JSON array only. No markdown, no explanation:
[
  {"id": 1, "type": "title", "title": "...", "subtitle": "...", "accent": "..."},
  ...
]

Here is the script to transform into a rich, educational, visually diverse presentation:
"""
${script}
"""`;

        const models = ["anthropic/claude-opus-4.6", "google/gemini-3.1-pro-preview"] as const;
        let data: { choices?: Array<{ message?: { content?: string } }> } | null = null;
        let lastError: string = "";

        for (const model of models) {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://explainit-seven.vercel.app",
                    "X-Title": "ExplainIt",
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.75,
                    max_tokens: 8192,
                }),
            });

            if (response.ok) {
                data = await response.json();
                break;
            }
            const errorBody = await response.text();
            lastError = `${model}: ${response.status} ${errorBody}`;
            console.error("OpenRouter error:", lastError);
        }

        if (!data) {
            return NextResponse.json({ slides: fallbackParse(script), _fallback: true });
        }
        const responseText = data.choices?.[0]?.message?.content || "";

        let slides;
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                slides = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON array found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse LLM response:", responseText);
            return NextResponse.json({ slides: fallbackParse(script), _fallback: true });
        }

        slides = slides.map((slide: any, index: number) => ({
            ...slide,
            id: index + 1,
        }));

        return NextResponse.json({ slides });
    } catch (error: any) {
        console.error("Generation error:", error);
        try {
            const body = await req.clone().json();
            return NextResponse.json({ slides: fallbackParse(body.script), _fallback: true });
        } catch {
            return NextResponse.json(
                { error: "Failed to generate slides", details: error?.message },
                { status: 500 }
            );
        }
    }
}

function fallbackParse(script: string) {
    const sentences = script.split(/[.!?]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    const accents = ["purple", "blue", "pink", "emerald", "amber", "cyan", "indigo", "rose", "teal", "violet"];
    const slides: any[] = [];

    slides.push({ id: 1, type: "title", title: sentences[0] || "Untitled", subtitle: "Generated by ExplainIt", accent: "purple" });

    const types = ["content", "callout", "definition", "highlight", "content", "pros_cons", "funfact", "content", "quote", "example"];
    for (let i = 1; i < sentences.length - 1 && i < 15; i++) {
        const type = types[(i - 1) % types.length];
        const accent = accents[i % accents.length];
        if (type === "content") {
            slides.push({ id: slides.length + 1, type: "content", title: `Key Point`, bullets: [sentences[i]], accent });
        } else if (type === "callout") {
            slides.push({ id: slides.length + 1, type: "callout", title: "Important", calloutType: "insight", message: sentences[i], accent });
        } else if (type === "definition") {
            slides.push({ id: slides.length + 1, type: "definition", title: "Definition", term: sentences[i].split(" ").slice(0, 3).join(" "), definition: sentences[i], example: "", accent });
        } else if (type === "highlight") {
            slides.push({ id: slides.length + 1, type: "highlight", title: "", highlight: sentences[i].split(" ").slice(0, 4).join(" "), subtext: sentences[i], accent });
        } else if (type === "funfact") {
            slides.push({ id: slides.length + 1, type: "funfact", title: "Did You Know?", fact: sentences[i], source: "", accent });
        } else if (type === "quote") {
            slides.push({ id: slides.length + 1, type: "quote", title: "Key Insight", quote: sentences[i], attribution: "", accent });
        } else {
            slides.push({ id: slides.length + 1, type: "content", title: "Point", bullets: [sentences[i]], accent });
        }
    }

    slides.push({ id: slides.length + 1, type: "summary", title: "Summary", keyPoints: sentences.slice(0, 3), closingLine: sentences[sentences.length - 1] || "That's a wrap!", accent: "emerald" });
    return slides;
}
