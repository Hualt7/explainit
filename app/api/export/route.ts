import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function POST(req: Request) {
    try {
        const { slides } = await req.json();

        if (!slides || slides.length === 0) {
            return NextResponse.json({ error: "Slides are required" }, { status: 400 });
        }

        // Dynamic import to avoid client-side bundling issues
        const { bundle } = await import('@remotion/bundler');
        const { renderMedia, selectComposition } = await import('@remotion/renderer');

        const SLIDE_DURATION_FRAMES = 90;
        const durationInFrames = slides.length * SLIDE_DURATION_FRAMES;

        // Bundle the Remotion project
        const bundleLocation = await bundle({
            entryPoint: path.resolve(process.cwd(), 'remotion/index.ts'),
            webpackOverride: (config) => config,
        });

        // Select the composition
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: 'ExplainItVideo',
            inputProps: { slides },
        });

        // Override with correct duration based on actual slides
        composition.durationInFrames = durationInFrames;
        composition.fps = 30;
        composition.width = 1920;
        composition.height = 1080;

        // Render the video
        const outputDir = path.join(os.tmpdir(), 'explainit-exports');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `explainit-${Date.now()}.mp4`);

        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps: { slides },
        });

        // Read the file and return as a downloadable response
        const fileBuffer = fs.readFileSync(outputPath);

        // Clean up the temp file
        fs.unlinkSync(outputPath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="explainit-presentation.mp4"`,
                'Content-Length': fileBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("Error rendering video:", error);
        return NextResponse.json(
            { error: "Failed to render video", details: error?.message },
            { status: 500 }
        );
    }
}

// Allow larger request body for slides data
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
