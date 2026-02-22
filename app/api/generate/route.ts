import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { script } = await req.json();

        if (!script || script.trim().length === 0) {
            return NextResponse.json(
                { error: "Script text is required" },
                { status: 400 }
            );
        }

        const prompt = `You are ExplainIt, a world-class educational content designer. Your job is to transform a raw script into a visually stunning, structured presentation with rich, varied slide types.

IMPORTANT RULES:
1. Do NOT just copy the user's text verbatim onto slides. REWRITE and RESTRUCTURE the content to be educational, engaging, and visual.
2. Add insights, examples, and structure that go BEYOND what the user wrote — you are an expert educator.
3. Use a VARIETY of slide types — never use the same type twice in a row.
4. Each slide should feel unique with different layouts and purposes.
5. Generate 6-12 slides depending on content complexity.

AVAILABLE SLIDE TYPES:

1. "title" — Opening splash slide
   Required fields: title, subtitle
   
2. "content" — Key point with supporting bullets
   Required fields: title, bullets (array of 3-4 short points)
   
3. "comparison" — Side-by-side A vs B
   Required fields: title, labelA, labelB, bulletsA (array), bulletsB (array)
   
4. "timeline" — Step-by-step process or sequence
   Required fields: title, steps (array of {step: string, detail: string})
   
5. "statistic" — A key number or data point
   Required fields: title, number (string like "93%" or "2.5M"), unit (string), description
   
6. "quote" — Important quote or key insight
   Required fields: title, quote, attribution
   
7. "diagram" — A flowchart or process
   Required fields: title, nodes (array of {label: string}), description
   
8. "list" — Checklist or key terms with definitions
   Required fields: title, items (array of {term: string, definition: string})
   
9. "callout" — Important tip, warning, or insight
   Required fields: title, calloutType ("tip" | "warning" | "insight"), message
   
10. "summary" — Closing takeaway
    Required fields: title, keyPoints (array of strings), closingLine

ACCENT COLORS — assign one per slide (vary them):
"purple", "blue", "pink", "emerald", "amber", "rose", "cyan", "indigo"

RESPONSE FORMAT — Respond ONLY with a valid JSON array. No markdown, no explanation:
[
  {"id": 1, "type": "title", "title": "How Photosynthesis Works", "subtitle": "The engine of life on Earth", "accent": "emerald"},
  {"id": 2, "type": "statistic", "title": "Energy Production", "number": "6CO₂", "unit": "+ 6H₂O → C₆H₁₂O₆", "description": "The fundamental equation that powers all plant life", "accent": "blue"},
  {"id": 3, "type": "timeline", "title": "The Process", "steps": [{"step": "Light Absorption", "detail": "Chlorophyll captures photons from sunlight"}, {"step": "Water Splitting", "detail": "H₂O molecules are broken into hydrogen and oxygen"}, {"step": "Sugar Synthesis", "detail": "Carbon dioxide is converted into glucose"}], "accent": "purple"},
  {"id": 4, "type": "comparison", "title": "Light vs Dark Reactions", "labelA": "Light Reactions", "labelB": "Dark Reactions", "bulletsA": ["Require sunlight", "Occur in thylakoids", "Produce ATP & NADPH"], "bulletsB": ["Don't need light", "Occur in stroma", "Produce glucose"], "accent": "cyan"},
  {"id": 5, "type": "summary", "title": "Key Takeaways", "keyPoints": ["Photosynthesis converts light energy to chemical energy", "It produces both glucose and oxygen", "It's essential for nearly all life on Earth"], "closingLine": "Without photosynthesis, life as we know it would not exist.", "accent": "emerald"}
]

Here is the script to transform:
"""
${script}
"""`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://explainit-seven.vercel.app",
                "X-Title": "ExplainIt",
            },
            body: JSON.stringify({
                model: "anthropic/claude-opus-4",
                messages: [
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 4096,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("OpenRouter error:", response.status, errorBody);
            return NextResponse.json({ slides: fallbackParse(script), _fallback: true });
        }

        const data = await response.json();
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

        // Ensure IDs are sequential
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

// Fallback parser — generates varied slide types from raw text
function fallbackParse(script: string) {
    const sentences = script
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

    const accents = ["purple", "blue", "pink", "emerald", "amber", "cyan", "indigo", "rose"];

    const slides: any[] = [];

    // Title slide
    slides.push({
        id: 1,
        type: "title",
        title: sentences[0] || "Untitled Presentation",
        subtitle: "Generated by ExplainIt",
        accent: "purple",
    });

    // Content slides from middle sentences
    for (let i = 1; i < sentences.length - 1 && i < 7; i++) {
        const types = ["content", "callout", "content", "list", "content", "quote"];
        const type = types[(i - 1) % types.length];
        const accent = accents[i % accents.length];

        if (type === "content") {
            slides.push({
                id: slides.length + 1,
                type: "content",
                title: `Key Point ${Math.ceil(i / 2)}`,
                bullets: [sentences[i], sentences[i + 1] || ""].filter(Boolean),
                accent,
            });
        } else if (type === "callout") {
            slides.push({
                id: slides.length + 1,
                type: "callout",
                title: "Important",
                calloutType: "insight",
                message: sentences[i],
                accent,
            });
        } else if (type === "quote") {
            slides.push({
                id: slides.length + 1,
                type: "quote",
                title: "Key Insight",
                quote: sentences[i],
                attribution: "ExplainIt",
                accent,
            });
        } else {
            slides.push({
                id: slides.length + 1,
                type: "list",
                title: "Key Terms",
                items: [{ term: "Point", definition: sentences[i] }],
                accent,
            });
        }
    }

    // Summary slide
    slides.push({
        id: slides.length + 1,
        type: "summary",
        title: "Summary",
        keyPoints: sentences.slice(0, 3),
        closingLine: sentences[sentences.length - 1] || "That's a wrap!",
        accent: "emerald",
    });

    return slides;
}
