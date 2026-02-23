import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, voice = "alloy" } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Use the API key from environment variables to prevent leaking
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("Missing OPENROUTER_API_KEY or OPENAI_API_KEY");
            return NextResponse.json(
                { error: "API key is missing. Please configure OPENROUTER_API_KEY in .env.local" },
                { status: 500 }
            );
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "ExplainIt",
            },
            body: JSON.stringify({
                model: "openai/gpt-audio",
                messages: [
                    {
                        role: "user",
                        content: text
                    }
                ],
                modalities: ["text", "audio"],
                audio: {
                    voice: voice,
                    format: "mp3"
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenRouter TTS error:", response.status, errorData);
            return NextResponse.json(
                { error: "Failed to generate text-to-speech audio via OpenRouter" },
                { status: response.status }
            );
        }

        const data = await response.json();
        const base64Audio = data.choices?.[0]?.message?.audio?.data;

        if (!base64Audio) {
            console.error("No audio data returned from OpenRouter", data);
            return NextResponse.json(
                { error: "OpenRouter response did not contain audio data" },
                { status: 500 }
            );
        }

        const buffer = Buffer.from(base64Audio, "base64");

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": buffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("TTS generation error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred during TTS generation." },
            { status: 500 }
        );
    }
}
