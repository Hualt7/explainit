import DashboardSidebar from "../components/DashboardSidebar";
import MobileNav from "../components/MobileNav";
import ErrorBoundary from "../components/ErrorBoundary";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <DashboardSidebar />
            <MobileNav />
            <ErrorBoundary fallbackMessage="Something went wrong in the dashboard. Try reloading.">
                {children}
            </ErrorBoundary>
        </div>
    );
}
