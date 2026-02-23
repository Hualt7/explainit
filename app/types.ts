export interface Slide {
    id: number;
    type: string;
    accent?: string;
    layout?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    bullets?: string[];
    icon?: string;
    // Comparison
    labelA?: string;
    labelB?: string;
    bulletsA?: string[];
    bulletsB?: string[];
    // Timeline / Steps
    steps?: Array<string | { step?: string; label?: string; detail?: string }>;
    // Statistic
    number?: string;
    description?: string;
    // Quote
    quote?: string;
    attribution?: string;
    // Diagram
    nodes?: Array<string | { label: string }>;
    // List
    items?: Array<{ term?: string; definition?: string; icon?: string; label?: string; description?: string; value?: number; max?: number }>;
    // Charts & stats
    data?: Array<{ label: string; value: number; color?: string }>;
    stats?: Array<{ number: string; label: string }>;
    unit?: string;
    max?: number;
    // Callout
    calloutType?: "tip" | "warning" | "insight";
    message?: string;
    // Code
    language?: string;
    code?: string;
    explanation?: string;
    // Definition
    term?: string;
    definition?: string;
    example?: string;
    // Pros/Cons
    pros?: string[];
    cons?: string[];
    // Equation
    equation?: string;
    // Mindmap
    center?: string;
    branches?: Array<string | { label: string; children?: string[] }>;
    // Table
    headers?: string[];
    rows?: string[][];
    // Example
    scenario?: string;
    lesson?: string;
    // Fun Fact
    fact?: string;
    source?: string;
    // Highlight
    highlight?: string;
    subtext?: string;
    // Summary
    keyPoints?: string[];
    closingLine?: string;
    // Allow extra AI-invented fields
    [key: string]: unknown;
}

export interface Project {
    id: string;
    title: string;
    script: string;
    slides: Slide[];
    created_at: string;
    updated_at: string;
}
