import React from "react";
import { Composition, Series } from "remotion";
import {
    TitleSlide, SectionHeaderSlide, OutroSlide, ContentSlide, ComparisonSlide, TimelineSlide,
    StatisticSlide, QuoteSlide, DiagramSlide, ListSlide,
    CalloutSlide, SummarySlide, CodeSlide, DefinitionSlide,
    ProsConsSlide, EquationSlide, MindmapSlide, TableSlide,
    ExampleSlide, FunfactSlide, StepsSlide, HighlightSlide,
    BarChartSlide, PieChartSlide, ProgressSlide, BigNumberGridSlide, IconGridSlide,
    GenericSlide,
} from "./Slide";
import type { Slide } from "../types";

const SLIDE_DURATION_FRAMES = 150; // 5 seconds at 30fps

const slideMap: Record<string, React.FC<{ slide: Slide }>> = {
    title: TitleSlide, section_header: SectionHeaderSlide, outro: OutroSlide,
    content: ContentSlide, comparison: ComparisonSlide, timeline: TimelineSlide,
    statistic: StatisticSlide, quote: QuoteSlide, diagram: DiagramSlide, list: ListSlide,
    callout: CalloutSlide, summary: SummarySlide, code: CodeSlide, definition: DefinitionSlide,
    pros_cons: ProsConsSlide, equation: EquationSlide, mindmap: MindmapSlide,
    table: TableSlide, example: ExampleSlide, funfact: FunfactSlide,
    steps: StepsSlide, highlight: HighlightSlide,
    bar_chart: BarChartSlide, pie_chart: PieChartSlide, progress: ProgressSlide,
    big_number_grid: BigNumberGridSlide, icon_grid: IconGridSlide,
};

const SlideRouter: React.FC<{ slide: Slide }> = ({ slide }) => {
    const Component = slideMap[slide.type] || GenericSlide;
    return <Component slide={slide} />;
};

export const ExplainItVideo: React.FC<{ slides: Slide[] }> = ({ slides }) => {
    return (
        <Series>
            {slides.map((slide) => (
                <Series.Sequence key={slide.id} durationInFrames={SLIDE_DURATION_FRAMES}>
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
        { id: 4, type: "comparison", title: "Supervised vs Unsupervised", labelA: "Supervised", labelB: "Unsupervised", bulletsA: ["Labeled data", "Classification"], bulletsB: ["No labels", "Clustering"], accent: "cyan" },
        { id: 5, type: "summary", title: "Key Takeaways", keyPoints: ["AI learns patterns from data", "Multiple approaches exist", "The field is evolving rapidly"], closingLine: "AI is transforming every industry.", accent: "purple" },
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
