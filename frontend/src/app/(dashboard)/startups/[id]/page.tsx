"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStartup, useStartupScoreHistory, useStartupSignalTimeline } from "@/lib/startups";

function scoreColor(score: number) {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-rose-400";
}

export default function StartupDetailPage() {
    const params = useParams<{ id: string }>();
    const startupId = params?.id ?? null;
    const { data: startup, isLoading, isError } = useStartup(startupId);
    const { data: hiringTimeline } = useStartupSignalTimeline(startupId, "hiring");
    const { data: linkedinTimeline } = useStartupSignalTimeline(startupId, "linkedin");
    const { data: scoreHistory } = useStartupScoreHistory(startupId);

    if (isLoading) {
        return <div className="text-gray-400">Loading startup...</div>;
    }

    if (isError || !startup) {
        return (
            <div className="space-y-4">
                <Link href="/feed" className="text-sm text-indigo-300 hover:text-indigo-200">
                    ← Back to feed
                </Link>
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-gray-300">Startup not found.</div>
            </div>
        );
    }

    const score = Math.max(0, Math.min(100, Math.round(startup.momentum_score ?? 0)));

    return (
        <div className="space-y-6">
            <Link href="/feed" className="text-sm text-indigo-300 hover:text-indigo-200">
                ← Back to feed
            </Link>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{startup.name}</h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">{startup.sector ?? "—"}</span>
                            <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">{startup.stage ?? "—"}</span>
                            {startup.signals_status === "pending" && (
                                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">Signals pending</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Momentum Score</div>
                        <div className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                        <div className="text-gray-500">Domain</div>
                        {startup.domain ? (
                            <a
                                href={`https://${startup.domain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-300 hover:text-indigo-200"
                            >
                                {startup.domain}
                            </a>
                        ) : (
                            <div className="text-gray-300">—</div>
                        )}
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                        <div className="text-gray-500">Founded Year</div>
                        <div className="text-gray-300">{startup.founded_year ?? "—"}</div>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                        <div className="text-gray-500">Team Size</div>
                        <div className="text-gray-300">{startup.team_size ?? "—"}</div>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                        <div className="text-gray-500">LinkedIn</div>
                        {startup.linkedin_url ? (
                            <a href={startup.linkedin_url} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-200">
                                Company page
                            </a>
                        ) : (
                            <div className="text-gray-300">—</div>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <div className="text-gray-500 text-sm">Description</div>
                    <p className="mt-1 text-sm text-gray-300">{startup.description ?? "—"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                    <h2 className="text-white font-semibold">Hiring Signal History</h2>
                    <div className="mt-3 space-y-2">
                        {(hiringTimeline?.items ?? []).slice(0, 8).map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-xs">
                                <span className="text-gray-400">{new Date(item.collected_at).toLocaleDateString()}</span>
                                <span className="text-gray-300">Value: {Math.round(item.value * 100) / 100}</span>
                                <span className="text-gray-300">Δ {item.delta === null ? "—" : Math.round(item.delta * 100) / 100}</span>
                            </div>
                        ))}
                        {(hiringTimeline?.items?.length ?? 0) === 0 && <p className="text-sm text-gray-500">No hiring history yet.</p>}
                    </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                    <h2 className="text-white font-semibold">LinkedIn Growth History</h2>
                    <div className="mt-3 space-y-2">
                        {(linkedinTimeline?.items ?? []).slice(0, 8).map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-xs">
                                <span className="text-gray-400">{new Date(item.collected_at).toLocaleDateString()}</span>
                                <span className="text-gray-300">Value: {Math.round(item.value * 100) / 100}</span>
                                <span className="text-gray-300">Δ {item.delta === null ? "—" : Math.round(item.delta * 100) / 100}</span>
                            </div>
                        ))}
                        {(linkedinTimeline?.items?.length ?? 0) === 0 && <p className="text-sm text-gray-500">No LinkedIn history yet.</p>}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <h2 className="text-white font-semibold">Momentum Score Trend</h2>
                <div className="mt-3 space-y-2">
                    {(scoreHistory?.items ?? []).slice(0, 12).map((item, index) => (
                        <div
                            key={`${item.calculated_at}-${index}`}
                            className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-xs"
                        >
                            <span className="text-gray-400">{new Date(item.calculated_at).toLocaleDateString()}</span>
                            <span className="text-gray-300">Score: {Math.round(item.score * 10) / 10}</span>
                            <span className="text-gray-300">{item.score_direction} ({Math.round(item.score_change * 10) / 10})</span>
                        </div>
                    ))}
                    {(scoreHistory?.items?.length ?? 0) === 0 && <p className="text-sm text-gray-500">No score history yet.</p>}
                </div>
            </div>
        </div>
    );
}
