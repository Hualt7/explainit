"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import Link from "next/link";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"login" | "signup">("login");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();

        if (mode === "login") {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            } else {
                window.location.href = "/dashboard";
            }
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            } else {
                setError("");
                if (data.session) {
                    // Automatically signed in because email confirmation is disabled
                    window.location.href = "/dashboard";
                } else {
                    alert("Check your email for a confirmation link!");
                }
            }
        }

        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl -top-48 -left-48 pointer-events-none"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl -bottom-32 -right-32 pointer-events-none"></div>

            <div className="w-full max-w-md mx-4 relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">ExplainIt</span>
                </div>

                {/* Card */}
                <div className="glass-panel rounded-2xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">
                            {mode === "login" ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {mode === "login"
                                ? "Sign in to continue creating amazing videos"
                                : "Start turning your ideas into stunning visuals"}
                        </p>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-xs text-gray-500 uppercase font-medium">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            {mode === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-600 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
