import React from "react";
import { Composition, Series } from "remotion";
import { TitleSlide, ContentSlide, DiagramSlide, SummarySlide } from "./Slide";

interface Slide {
    id: number;
    type: string;
    content: string;
    icon: string;
}

const SLIDE_DURATION_FRAMES = 90; // 3 seconds at 30fps

const SlideRouter: React.FC<{ type: string; content: string }> = ({
    type,
    content,
}) => {
    switch (type) {
        case "title":
            return <TitleSlide type={type} content={content} />;
        case "diagram":
            return <DiagramSlide type={type} content={content} />;
        case "summary":
            return <SummarySlide type={type} content={content} />;
        default:
            return <ContentSlide type={type} content={content} />;
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
                    <SlideRouter type={slide.type} content={slide.content} />
                </Series.Sequence>
            ))}
        </Series>
    );
};

export const RemotionRoot: React.FC = () => {
    const defaultSlides: Slide[] = [
        {
            id: 1,
            type: "title",
            content: "Understanding React Context",
            icon: "Layout",
        },
        {
            id: 2,
            type: "content",
            content:
                "Prop drilling makes passing data through many layers very tedious.",
            icon: "Layers",
        },
        {
            id: 3,
            type: "diagram",
            content: "Context Provider vs Consumer",
            icon: "ImageIcon",
        },
        {
            id: 4,
            type: "content",
            content:
                "The Provider component holds the state at the top of the tree.",
            icon: "Layers",
        },
        {
            id: 5,
            type: "summary",
            content:
                "Use Context to share global state like themes or user sessions without passing props manually.",
            icon: "Type",
        },
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
