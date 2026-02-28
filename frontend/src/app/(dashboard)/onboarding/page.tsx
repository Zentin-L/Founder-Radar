"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const sectors = [
    { id: "ai_ml", label: "AI / Machine Learning", emoji: "🤖" },
    { id: "fintech", label: "Fintech", emoji: "💳" },
    { id: "healthtech", label: "Healthtech", emoji: "🏥" },
    { id: "saas_b2b", label: "SaaS / B2B", emoji: "☁️" },
    { id: "ecommerce", label: "E-commerce / D2C", emoji: "🛒" },
    { id: "climate", label: "Climate / Cleantech", emoji: "🌱" },
    { id: "cybersecurity", label: "Cybersecurity", emoji: "🔒" },
    { id: "edtech", label: "Edtech", emoji: "📚" },
    { id: "other", label: "Other", emoji: "✨" },
];

export default function OnboardingPage() {
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const { updateProfile } = useAuth();
    const router = useRouter();

    const toggle = (id: string) => {
        setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateProfile({ sector_preferences: selected });
            router.push("/feed");
        } catch {
            router.push("/feed");
        }
    };

    const selectedCount = Object.values(selected).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center px-4">
            <div className="w-full max-w-lg text-center space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">What sectors are you watching?</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        Select your focus areas to personalize your signal feed
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {sectors.map((sector) => (
                        <button
                            key={sector.id}
                            onClick={() => toggle(sector.id)}
                            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all duration-200 ${selected[sector.id]
                                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-200 shadow-lg shadow-indigo-500/10"
                                    : "bg-gray-800/30 border-gray-700/50 text-gray-400 hover:bg-gray-800/60 hover:border-gray-600"
                                }`}
                        >
                            <span className="text-2xl">{sector.emoji}</span>
                            <span className="text-xs font-medium leading-tight">{sector.label}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? "Saving..." : `Continue to Feed${selectedCount > 0 ? ` (${selectedCount} selected)` : ""}`}
                    </button>
                    <button
                        onClick={() => router.push("/feed")}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}
