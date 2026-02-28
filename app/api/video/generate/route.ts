import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import { submitBlueprint } from "../../../lib/video/engine";
import type { VideoBlueprint, ProviderKey } from "../../../lib/video/types";

const CINEMATIC_DIRECTOR_PROMPT = `You are a world-class cinematic director and ad creative director working at the level of Apple, Samsung, and Nike commercials. Your job is to transform a script into a shot-by-shot VIDEO BLUEPRINT that will be sent to an AI video generation API.

CRITICAL: You are NOT making slides. You are directing a REAL cinematic video. Think Apple "Shot on iPhone" campaign. Think Samsung Galaxy Unpacked reveals. Think Nike "Just Do It" cinematics.

EVERY shot description must be hyper-specific and visual:
- CAMERA: Exact angle (low-angle hero shot, overhead bird's eye, Dutch tilt), lens (wide 16mm, portrait 85mm, macro), movement (slow dolly push-in, smooth orbit, crane up)
- LIGHTING: Exact style (Rembrandt lighting, golden hour backlight, harsh top-down spotlight, neon rim light, volumetric fog with god rays)
- MATERIALS & TEXTURES: What surfaces look like (brushed titanium, frosted glass, matte black, liquid mercury)
- DEPTH & FOCUS: Shallow DOF with bokeh, rack focus from foreground to subject, deep focus establishing shot
- MOOD & COLOR: Color palette (teal and orange, desaturated with pops of red, monochrome with gold accents)
- MOTION: What moves and how (product slowly rotating on invisible turntable, particles dispersing in slow motion, fabric rippling in wind)
- ENVIRONMENT: Specific setting (infinite black void with single spotlight, futuristic glass laboratory, misty mountain ridge at dawn)

SHOT PACING RULES:
- Opening shot: 6-8 seconds — establish mood, mystery, anticipation
- Reveal shots: 4-6 seconds — dramatic product/subject reveal
- Detail shots: 3-5 seconds — close-up features, textures
- Action shots: 4-6 seconds — dynamic movement, transformation
- Closing shot: 5-8 seconds — hero shot, logo, emotional peak

TRANSITIONS:
- "cut" — hard cut for energy and rhythm changes
- "fade" — slow dissolve for emotional beats
- "dissolve" — cross-dissolve for time transitions
- "whip" — fast whip pan for high energy

RESPONSE FORMAT — JSON object only. No markdown, no explanation:
{
  "title": "string",
  "style": "cinematic_product" | "narrative_story" | "motion_graphics" | "mixed",
  "aspectRatio": "16:9",
  "totalDuration": number,
  "shots": [
    {
      "id": 1,
      "duration": number,
      "visual": "DETAILED scene description — this is the EXACT prompt sent to the AI video API, make it rich and specific",
      "cameraMove": "push-in" | "orbit" | "static" | "pan-left" | "pan-right" | "crane-up" | "dolly-zoom" | "tracking" | "handheld",
      "textOverlay": "optional text shown on screen" | null,
      "transition": "cut" | "fade" | "dissolve" | "whip",
      "audio": {
        "sfx": "optional sound effect description",
        "musicMood": "tension" | "triumph" | "minimal" | "epic" | "ethereal",
        "narration": "optional voiceover line for this shot"
      }
    }
  ],
  "voiceover": {
    "fullScript": "complete narration script",
    "voice": "deep_male" | "warm_female" | "authoritative" | "youthful"
  },
  "music": {
    "style": "hans_zimmer_minimal" | "lo-fi_ambient" | "electronic_build" | "orchestral_epic" | "acoustic_intimate",
    "mood": "string",
    "bpm": number
  }
}

Generate 4-8 shots for a 30-60 second cinematic video. Quality over quantity.`;

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { script, settings } = await req.json();

        if (!script || script.trim().length === 0) {
            return NextResponse.json({ error: "Script is required" }, { status: 400 });
        }

        const provider: ProviderKey = settings?.videoProvider || "veo";
        const quality = settings?.videoQuality || "standard";
        const aspectRatio = settings?.aspectRatio || "16:9";

        // Step 1: Generate the video blueprint via Claude
        const blueprintPrompt = `${CINEMATIC_DIRECTOR_PROMPT}

ASPECT RATIO: ${aspectRatio}
QUALITY TIER: ${quality}

Here is the script to transform into a cinematic video blueprint:
"""
${script}
"""`;

        const models = ["anthropic/claude-opus-4.6", "google/gemini-3.1-pro-preview"] as const;
        let blueprintData: { choices?: Array<{ message?: { content?: string } }> } | null = null;
        let lastError = "";

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
                    messages: [{ role: "user", content: blueprintPrompt }],
                    temperature: 0.7,
                    max_tokens: 4096,
                }),
            });

            if (response.ok) {
                blueprintData = await response.json();
                break;
            }

            const errorBody = await response.text();
            lastError = `${model}: ${response.status} ${errorBody}`;
            console.error("OpenRouter error:", lastError);
        }

        if (!blueprintData) {
            return NextResponse.json(
                { error: "Failed to generate video blueprint", details: lastError },
                { status: 502 }
            );
        }

        const responseText = blueprintData.choices?.[0]?.message?.content || "";

        let blueprint: VideoBlueprint;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                blueprint = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON object found in AI response");
            }
        } catch (parseError) {
            console.error("Failed to parse blueprint:", responseText);
            return NextResponse.json(
                { error: "Failed to parse video blueprint from AI" },
                { status: 500 }
            );
        }

        // Validate blueprint structure
        if (!blueprint.shots || blueprint.shots.length === 0) {
            return NextResponse.json(
                { error: "Blueprint has no shots" },
                { status: 500 }
            );
        }

        // Ensure shot IDs are sequential
        blueprint.shots = blueprint.shots.map((shot, i) => ({ ...shot, id: i + 1 }));

        // Step 2: Submit all shots to the selected provider
        const jobs = await submitBlueprint(blueprint, { provider, quality });

        return NextResponse.json({ blueprint, jobs });
    } catch (error: any) {
        console.error("Video generation error:", error);
        return NextResponse.json(
            { error: "Video generation failed", details: error?.message },
            { status: 500 }
        );
    }
}
