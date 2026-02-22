import React from "react";
import { Composition, Series } from "remotion";
import {
    TitleSlide,
    ContentSlide,
    ComparisonSlide,
    TimelineSlide,
    StatisticSlide,
    QuoteSlide,
    DiagramSlide,
    ListSlide,
    CalloutSlide,
    SummarySlide,
} from "./Slide";

interface Slide {
    id: number;
    type: string;
    [key: string]: any;
}

const SLIDE_DURATION_FRAMES = 150; // 5 seconds at 30fps

const SlideRouter: React.FC<{ slide: any }> = ({ slide }) => {
    switch (slide.type) {
        case "title": return <TitleSlide slide={slide} />;
        case "content": return <ContentSlide slide={slide} />;
        case "comparison": return <ComparisonSlide slide={slide} />;
        case "timeline": return <TimelineSlide slide={slide} />;
        case "statistic": return <StatisticSlide slide={slide} />;
        case "quote": return <QuoteSlide slide={slide} />;
        case "diagram": return <DiagramSlide slide={slide} />;
        case "list": return <ListSlide slide={slide} />;
        case "callout": return <CalloutSlide slide={slide} />;
        case "summary": return <SummarySlide slide={slide} />;
        default: return <ContentSlide slide={slide} />;
    }
};

export const ExplainItVideo: React.FC<{ slides: Slide[] }> = ({ slides }) => {
    return (
        <Series>
            {slides.map((slide) => (
                <Series.Sequence
                    key={slide.id}
                    durationInFrames={SLIDE_DURATION_FRAMES}
                >
                    <SlideRouter slide={slide} />
                </Series.Sequence>
            ))}
        </Series>
    );
};

export const RemotionRoot: React.FC = () => {
    const defaultSlides: Slide[] = [
        { id: 1, type: "title", title: "How AI Works", subtitle: "A simplified overview", accent: "purple" },
        { id: 2, type: "content", title: "Machine Learning Basics", bullets: ["Algorithms learn from data", "Models improve with training", "Predictions get more accurate over time"], accent: "blue" },
        { id: 3, type: "statistic", title: "AI Growth", number: "97%", unit: "accuracy rate", description: "Modern LLMs achieve near-human accuracy on many benchmarks", accent: "emerald" },
        { id: 4, type: "comparison", title: "Supervised vs Unsupervised", labelA: "Supervised", labelB: "Unsupervised", bulletsA: ["Labeled data", "Classification", "Regression"], bulletsB: ["No labels", "Clustering", "Pattern recognition"], accent: "cyan" },
        { id: 5, type: "summary", title: "Key Takeaways", keyPoints: ["AI learns patterns from data", "Multiple approaches exist for different problems", "The field is evolving rapidly"], closingLine: "AI is transforming every industry.", accent: "purple" },
    ];

    return (
        <>
            <Composition
                id="ExplainItVideo"
                component={() => <ExplainItVideo slides={defaultSlides} />}
                durationInFrames={defaultSlides.length * SLIDE_DURATION_FRAMES}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{ slides: defaultSlides }}
            />
        </>
    );
};

export { SLIDE_DURATION_FRAMES };
