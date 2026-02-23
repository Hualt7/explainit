"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /settings to /dashboard/settings so links and Next.js route validation resolve.
 */
export default function SettingsRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/dashboard/settings");
    }, [router]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
            <p>Redirecting to settings…</p>
        </div>
    );
}
