"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { ArrowLeft, User, Mail, Palette, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email || "");
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Account */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h2>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-white">{email || "Loading..."}</p>
                                <p className="text-sm text-gray-500">Signed in via Supabase</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Preferences</h2>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-white">Theme</p>
                                    <p className="text-sm text-gray-500">Dark mode is enabled by default</p>
                                </div>
                            </div>
                            <span className="text-sm text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">Dark</span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Session</h2>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign out of your account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
