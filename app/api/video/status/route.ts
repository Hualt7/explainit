import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import { pollJobs } from "../../../lib/video/engine";
import type { VideoJob, ProviderKey } from "../../../lib/video/types";

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobs, provider }: { jobs: VideoJob[]; provider: ProviderKey } = await req.json();

        if (!jobs || !Array.isArray(jobs)) {
            return NextResponse.json({ error: "jobs array is required" }, { status: 400 });
        }

        if (!provider) {
            return NextResponse.json({ error: "provider is required" }, { status: 400 });
        }

        const updatedJobs = await pollJobs(jobs, provider);

        // Calculate overall progress
        const total = updatedJobs.length;
        const completed = updatedJobs.filter(
            (j) => j.status === "completed" || j.status === "failed"
        ).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const allDone = updatedJobs.every(
            (j) => j.status === "completed" || j.status === "failed"
        );

        return NextResponse.json({
            jobs: updatedJobs,
            progress,
            complete: allDone,
        });
    } catch (error: any) {
        console.error("Video status poll error:", error);
        return NextResponse.json(
            { error: "Status check failed", details: error?.message },
            { status: 500 }
        );
    }
}
