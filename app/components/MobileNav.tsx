"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Video, Settings, LogOut, Plus, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../lib/supabase/client";

const navItems = [
    { href: "/dashboard/projects", label: "Projects", icon: Layout },
    { href: "/dashboard", label: "New Project", icon: Plus, exact: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"
            >
                <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 p-4 flex flex-col z-50"
                        >
                            <div className="flex items-center justify-between px-2 py-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Video className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-white">ExplainIt</span>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "hover:bg-white/5 text-gray-400"
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" /> {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-gray-400 font-medium transition-colors mt-auto"
                            >
                                <LogOut className="w-5 h-5" /> Log out
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
