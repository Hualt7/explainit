"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Video, Code2, Zap, Shield, Palette } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const SpotlightCursor = dynamic(() => import("./components/SpotlightCursor"), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 relative">
      <SpotlightCursor config={{ spotlightSize: 350, spotlightIntensity: 0.7, glowColor: "147, 51, 234", pulseSpeed: 4000 }} />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ExplainIt</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 lg:px-12 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400"
            >
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              AI-Powered with Gemini
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Turn text into
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-gradient">
                stunning videos.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg text-gray-400 max-w-xl leading-relaxed"
            >
              ExplainIt takes your plain text scripts and automatically generates beautiful, animated web presentations and high-quality MP4 videos. Perfect for creators, teachers, and developers.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-colors"
              >
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="pt-8 flex items-center gap-8 text-sm text-gray-500 font-medium"
            >
              <div className="flex items-center gap-2"><Wand2 className="w-4 h-4" /> AI-powered layouts</div>
              <div className="flex items-center gap-2"><Video className="w-4 h-4" /> HD Video Exports</div>
              <div className="flex items-center gap-2"><Code2 className="w-4 h-4" /> React & Anime.js</div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative isolate"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl rounded-full scale-150"></div>
            <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium">script.txt — Generating...</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-shimmer"></div>
                  <div className="h-4 w-full bg-white/5 rounded animate-shimmer" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-4 w-5/6 bg-white/5 rounded animate-shimmer" style={{ animationDelay: "0.4s" }}></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded animate-shimmer" style={{ animationDelay: "0.6s" }}></div>
                  <div className="h-4 w-full bg-white/5 rounded animate-shimmer" style={{ animationDelay: "0.8s" }}></div>
                  <div className="h-4 w-1/2 bg-white/5 rounded animate-shimmer" style={{ animationDelay: "1s" }}></div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <Video className="w-8 h-8 text-purple-400 animate-float" />
                  </div>
                  <div className="h-8 rounded bg-white/10 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">create</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From script to stunning video in minutes. No design skills required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Wand2,
              title: "AI Slide Generation",
              desc: "Gemini AI analyzes your script and creates intelligent, well-structured presentation slides automatically.",
              color: "purple",
            },
            {
              icon: Zap,
              title: "Instant Video Export",
              desc: "Export your presentation as a high-quality MP4 video with smooth animations powered by Remotion.",
              color: "blue",
            },
            {
              icon: Palette,
              title: "Beautiful Animations",
              desc: "Every slide comes alive with Anime.js micro-animations, spring physics, and cinematic transitions.",
              color: "pink",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 hover:bg-white/[0.06] transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Three steps to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">magic</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Paste Your Script", desc: "Drop in any text — lecture notes, blog posts, documentation, or bullet points." },
            { step: "02", title: "Generate Magic", desc: "Our AI creates beautiful slides with the right types, layouts, and visual flow." },
            { step: "03", title: "Export & Share", desc: "Preview in the browser, present live, or export as a polished MP4 video." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center space-y-4"
            >
              <div className="text-6xl font-black text-white/5">{item.step}</div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold">Ready to create something amazing?</h2>
            <p className="text-gray-400 text-lg">Start turning your ideas into stunning presentations and videos today.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              Get Started — It&apos;s Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-medium">ExplainIt</span>
          </div>
          <span>Built with Next.js, Remotion & Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}
