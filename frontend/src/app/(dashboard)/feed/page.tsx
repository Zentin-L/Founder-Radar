"use client";

import { useMemo, useState } from "react";
import { FeedCard } from "@/components/feed-card";
import { useStartups } from "@/lib/startups";

export default function FeedPage() {
    const [q, setQ] = useState("");
    const [sector, setSector] = useState("");
    const [stage, setStage] = useState("");
    const [minScore, setMinScore] = useState("");
    const [maxScore, setMaxScore] = useState("");

    const filters = useMemo(
        () => ({
            q: q.trim() || undefined,
            sector: sector.trim() || undefined,
            stage: stage.trim() || undefined,
            min_score: minScore.trim() ? Number(minScore) : undefined,
            max_score: maxScore.trim() ? Number(maxScore) : undefined,
            limit: 20,
        }),
        [q, sector, stage, minScore, maxScore]
    );

    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        dataUpdatedAt,
    } = useStartups(filters);

    const items = data?.pages.flatMap((page) => page.items) ?? [];
    const total = data?.pages[0]?.total ?? 0;
    const lastUpdatedText = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "Not loaded";

    function resetFilters() {
        setQ("");
        setSector("");
        setStage("");
        setMinScore("");
        setMaxScore("");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white">Signal Feed</h2>
                    <p className="text-gray-400 text-sm mt-1">Ranked by Momentum Score with hiring and LinkedIn highlights.</p>
                </div>
                <div className="text-right">
                    <button
                        onClick={() => refetch()}
                        className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:border-indigo-500/50"
                    >
                        Refresh
                    </button>
                    <p className="mt-2 text-xs text-gray-500">Updated {lastUpdatedText} · Score recompute every ~12h</p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Search startup name"
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    />
                    <input
                        value={sector}
                        onChange={(event) => setSector(event.target.value)}
                        placeholder="Sector"
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    />
                    <input
                        value={stage}
                        onChange={(event) => setStage(event.target.value)}
                        placeholder="Stage"
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    />
                    <input
                        value={minScore}
                        onChange={(event) => setMinScore(event.target.value)}
                        placeholder="Min score"
                        type="number"
                        min={0}
                        max={100}
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    />
                    <input
                        value={maxScore}
                        onChange={(event) => setMaxScore(event.target.value)}
                        placeholder="Max score"
                        type="number"
                        min={0}
                        max={100}
                        className="rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{total} startups matched</p>
                    <button onClick={resetFilters} className="text-xs text-indigo-300 hover:text-indigo-200">
                        Clear filters
                    </button>
                </div>
            </div>

            {isLoading && <div className="text-sm text-gray-400">Loading feed...</div>}

            {isError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    Could not load feed right now. Try refresh.
                </div>
            )}

            {!isLoading && !isError && items.length === 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">
                    No startups matched this filter set.
                </div>
            )}

            <div className="space-y-3">
                {items.map((startup) => (
                    <FeedCard key={startup.id} startup={startup} />
                ))}
            </div>

            {hasNextPage && (
                <div className="pt-2">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:border-indigo-500/50 disabled:opacity-60"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}
