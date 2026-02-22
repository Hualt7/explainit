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

        const prompt = `You are ExplainIt, an AI that converts text scripts into structured presentation slides.

Given the following script, break it down into 4-8 presentation slides. Each slide must have:
- "type": one of "title", "content", "diagram", or "summary"
- "content": the text to display on the slide (keep it concise, max 2 sentences)
- "icon": one of "Layout", "ImageIcon", "Type", or "Layers"

Rules:
1. The FIRST slide must be type "title" — extract or create a compelling title from the script
2. The LAST slide must be type "summary" — synthesize the key takeaway
3. Middle slides should be "content" or "diagram" type
4. Use "diagram" for slides that describe processes, flows, comparisons, or visual concepts
5. Use "content" for explanations, definitions, facts, or arguments
6. Each slide content should be clear, concise, and impactful
7. Assign icons: "Layout" for title, "Type" for content, "ImageIcon" for diagram, "Layers" for summary

Respond ONLY with a valid JSON array. No markdown, no explanation. Example format:
[
  {"id": 1, "type": "title", "content": "The title here", "icon": "Layout"},
  {"id": 2, "type": "content", "content": "Key point explained clearly", "icon": "Type"},
  {"id": 3, "type": "diagram", "content": "Visual process description", "icon": "ImageIcon"},
  {"id": 4, "type": "summary", "content": "The main takeaway", "icon": "Layers"}
]

Here is the script:
"""
${script}
"""`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://explainit.app",
                "X-Title": "ExplainIt",
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.5-sonnet", // Using 3.5 Sonnet as it's Anthropic's latest/best
                messages: [
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("OpenRouter error:", response.status, errorBody);
            // Fall back to simple parsing
            return NextResponse.json({ slides: fallbackParse(script), _fallback: true });
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || "";

        // Parse JSON from the response (handle potential markdown wrapping)
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

        // Fall back to simple parsing
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

// Fallback parser (simple sentence split)
function fallbackParse(script: string) {
    const sentences = script
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

    const iconMap: Record<string, string> = {
        title: "Layout",
        content: "Type",
        diagram: "ImageIcon",
        summary: "Layers",
    };

    return sentences.map((sentence: string, index: number) => {
        let type = "content";
        if (index === 0) type = "title";
        else if (index === sentences.length - 1) type = "summary";
        else if (
            sentence.toLowerCase().includes("flow") ||
            sentence.toLowerCase().includes("diagram") ||
            sentence.toLowerCase().includes("process")
        )
            type = "diagram";

        return {
            id: index + 1,
            type,
            content: sentence,
            icon: iconMap[type],
        };
    });
}
