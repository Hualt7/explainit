import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ExplainIt – Turn text into stunning videos",
    description:
        "ExplainIt takes your plain text scripts and automatically generates beautiful, animated web presentations and high-quality MP4 videos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
