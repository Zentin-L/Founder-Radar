"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StartupCard } from "@/components/startup-card";
import { SubmitModal } from "@/components/submit-modal";
import { useSearchStartups, useStartups } from "@/lib/startups";

const sectorOptions = ["", "ai_ml", "fintech", "healthtech", "saas_b2b", "ecommerce", "climate", "cybersecurity", "edtech", "other"];
const stageOptions = ["", "Pre-seed", "Seed", "Series A", "Series B+"];

export default function ExplorePage() {
    const [sector, setSector] = useState("");
    const [stage, setStage] = useState("");
    const [minScore, setMinScore] = useState(0);
    const [maxScore, setMaxScore] = useState(100);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const startupsQuery = useStartups({
        sector: sector || undefined,
        stage: stage || undefined,
        min_score: minScore,
        max_score: maxScore,
        limit: 20,
    });

    const searchQuery = useSearchStartups(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => setSearchTerm(searchInput.trim()), 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && startupsQuery.hasNextPage && !startupsQuery.isFetchingNextPage) {
                    startupsQuery.fetchNextPage();
                }
            },
            { threshold: 0.4 }
        );

        const node = sentinelRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
            observer.disconnect();
        };
    }, [startupsQuery]);

    const paginatedItems = useMemo(
        () => startupsQuery.data?.pages.flatMap((page) => page.items) ?? [],
        [startupsQuery.data]
    );

    const displayItems = searchTerm ? (searchQuery.data ?? []) : paginatedItems;
    const total = startupsQuery.data?.pages[0]?.total ?? 0;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Explore Startups</h2>
                    <p className="text-sm text-gray-400 mt-1">{total} startups tracked</p>
                </div>
                <button
                    onClick={() => setIsSubmitOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                    Submit Startup
                </button>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-4">
                <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by startup name"
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        value={sector}
                        onChange={(event) => setSector(event.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200"
                    >
                        {sectorOptions.map((value) => (
                            <option key={value || "all"} value={value}>
                                {value || "All sectors"}
                            </option>
                        ))}
                    </select>

                    <select
                        value={stage}
                        onChange={(event) => setStage(event.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200"
                    >
                        {stageOptions.map((value) => (
                            <option key={value || "all"} value={value}>
                                {value || "All stages"}
                            </option>
                        ))}
                    </select>

                    <div className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2">
                        <label className="text-xs text-gray-400">Min score: {minScore}</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={minScore}
                            onChange={(event) => setMinScore(Math.min(Number(event.target.value), maxScore))}
                            className="w-full"
                        />
                    </div>

                    <div className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2">
                        <label className="text-xs text-gray-400">Max score: {maxScore}</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={maxScore}
                            onChange={(event) => setMaxScore(Math.max(Number(event.target.value), minScore))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {startupsQuery.isLoading ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">Loading startups...</div>
            ) : displayItems.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">No startups found.</div>
            ) : (
                <div className="space-y-3">
                    {displayItems.map((startup) => (
                        <StartupCard key={startup.id} startup={startup} />
                    ))}
                    {!searchTerm && (
                        <div ref={sentinelRef} className="h-12 flex items-center justify-center text-sm text-gray-500">
                            {startupsQuery.isFetchingNextPage ? "Loading more..." : startupsQuery.hasNextPage ? "Scroll to load more" : "End of results"}
                        </div>
                    )}
                </div>
            )}

            <SubmitModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
        </div>
    );
}
