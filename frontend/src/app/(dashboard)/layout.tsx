"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navItems = [
    { name: "Signal Feed", href: "/feed", icon: "📡" },
    { name: "Explore", href: "/explore", icon: "🔍" },
    { name: "Watchlist", href: "/watchlist", icon: "⭐" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-900/50 flex flex-col">
                <div className="p-5 border-b border-gray-800">
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                        Founder Radar
                    </h1>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                            {user?.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.subscription_tier} plan</p>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                            title="Sign out"
                        >
                            ↗
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {/* Email verification banner */}
                {user && !user.email_verified && (
                    <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-sm text-amber-300 flex items-center gap-2">
                        <span>📧</span>
                        Please verify your email to unlock all features.
                    </div>
                )}
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
