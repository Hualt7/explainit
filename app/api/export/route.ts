import { NextResponse } from "next/server";

// NOTE: Remotion server-side rendering requires @remotion/renderer and @remotion/bundler
// which depend on platform-specific binaries (ffmpeg, Chromium). These cannot run on
// Vercel's serverless functions. For production MP4 export, use Remotion Lambda or
// a dedicated rendering server.
//
// This route returns a helpful message in production and works locally when deps are available.

export async function POST(req: Request) {
    try {
        const { slides } = await req.json();

        if (!slides || slides.length === 0) {
            return NextResponse.json(
                { error: "No slides provided" },
                { status: 400 }
            );
        }

        // Check if we're in a serverless environment
        const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

        if (isServerless) {
            return NextResponse.json(
                {
                    error: "Video export is not available in serverless environments",
                    details: "MP4 export requires a dedicated rendering server with ffmpeg and Chromium. Use the local development server or set up Remotion Lambda for cloud rendering.",
                    suggestion: "Run the app locally with `npm run dev` to export videos, or integrate Remotion Lambda for cloud-based rendering."
                },
                { status: 501 }
            );
        }

        // Dynamic imports to avoid bundling issues on serverless
        const { bundle } = await import("@remotion/bundler");
        const { renderMedia, selectComposition } = await import("@remotion/renderer");
        const path = await import("path");
        const fs = await import("fs");
        const os = await import("os");

        const COMP_NAME = "ExplainItVideo";
        const FPS = 30;
        const SLIDE_DURATION_FRAMES = 150;

        const entryPoint = path.join(process.cwd(), "remotion", "index.ts");
        const bundleLocation = await bundle({
            entryPoint,
            webpackOverride: (config) => config,
        });

        const inputProps = { slides };
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: COMP_NAME,
            inputProps,
        });

        composition.durationInFrames = slides.length * SLIDE_DURATION_FRAMES;
        composition.fps = FPS;
        composition.width = 1920;
        composition.height = 1080;

        const tmpDir = os.tmpdir();
        const outputLocation = path.join(tmpDir, `explainit-${Date.now()}.mp4`);

        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation,
            inputProps,
        });

        const fileBuffer = fs.readFileSync(outputLocation);
        fs.unlinkSync(outputLocation);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": 'attachment; filename="explainit-presentation.mp4"',
            },
        });
    } catch (error: any) {
        console.error("Export error:", error);
        return NextResponse.json(
            {
                error: "Export failed",
                details: error?.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
