"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Video, Settings, LogOut, Plus, Layout } from "lucide-react";
import { createClient } from "../lib/supabase/client";

const navItems = [
    { href: "/dashboard/projects", label: "Projects", icon: Layout },
    { href: "/dashboard", label: "New Project", icon: Plus, exact: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <aside className="w-64 border-r border-white/10 bg-black/50 p-4 flex-col hidden md:flex">
            <div className="flex items-center gap-2 px-2 py-4 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">ExplainIt</span>
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
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
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
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 font-medium transition-colors mt-auto"
            >
                <LogOut className="w-5 h-5" /> Log out
            </button>
        </aside>
    );
}
