import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import { buildShotPrompt } from "../../../lib/video/engine";
import { getProvider } from "../../../lib/video/providers";
import type { ProviderKey } from "../../../lib/video/types";

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { shot, settings } = await req.json();

        if (!shot || !shot.visual) {
            return NextResponse.json({ error: "Shot data is required" }, { status: 400 });
        }

        const providerKey: ProviderKey = settings?.videoProvider || "veo";
        const quality = settings?.videoQuality || "standard";
        const aspectRatio = settings?.aspectRatio || "16:9";

        const provider = getProvider(providerKey);
        const fullPrompt = buildShotPrompt(shot);
        const duration = Math.min(shot.duration || 6, provider.maxDuration);

        const result = await provider.generate(fullPrompt, {
            duration,
            aspectRatio,
            resolution: quality === "high" ? "1080p" : "720p",
        });

        return NextResponse.json({
            job: {
                jobId: result.jobId,
                provider: provider.id,
                shotId: shot.id,
                status: "queued",
            },
        });
    } catch (error: any) {
        console.error("Video retry error:", error);
        return NextResponse.json(
            { error: "Retry failed", details: error?.message },
            { status: 500 }
        );
    }
}
