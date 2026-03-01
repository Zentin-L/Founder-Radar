import Link from "next/link";
import { Startup } from "@/lib/startups";

function scoreColor(score: number) {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-rose-400";
}

function changeColor(direction: string | null) {
    if (direction === "up") return "text-emerald-300";
    if (direction === "down") return "text-rose-300";
    return "text-gray-300";
}

function formatDelta(value: number | null | undefined) {
    if (value === null || value === undefined) return "—";
    const rounded = Math.round(value * 100) / 100;
    if (rounded > 0) return `+${rounded}`;
    return `${rounded}`;
}

export function FeedCard({ startup }: { startup: Startup }) {
    const score = Math.max(0, Math.min(100, Math.round(startup.momentum_score ?? 0)));
    const scoreChange = startup.score_change ?? 0;
    const scoreChangeLabel = scoreChange > 0 ? `+${scoreChange.toFixed(1)}` : scoreChange.toFixed(1);

    return (
        <Link
            href={`/startups/${startup.id}`}
            className="block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-indigo-500/40 transition-colors"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white truncate">{startup.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">{startup.sector ?? "—"}</span>
                        <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">{startup.stage ?? "—"}</span>
                        <span className={`rounded-md border border-gray-700 px-2 py-0.5 text-xs ${changeColor(startup.score_direction)}`}>
                            Score {startup.score_direction ?? "flat"} ({scoreChangeLabel})
                        </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                        <div className="rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
                            Hiring Δ: <span className="text-gray-300">{formatDelta(startup.hiring_signal_delta)}</span>
                        </div>
                        <div className="rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
                            LinkedIn Δ: <span className="text-gray-300">{formatDelta(startup.linkedin_signal_delta)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-gray-500">Momentum</div>
                    <div className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</div>
                </div>
            </div>
        </Link>
    );
}
