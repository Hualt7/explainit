import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

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
            <body className={`antialiased ${inter.variable} ${spaceGrotesk.variable}`} style={{ fontFamily: "'Inter', sans-serif" }}>{children}</body>
        </html>
    );
}
