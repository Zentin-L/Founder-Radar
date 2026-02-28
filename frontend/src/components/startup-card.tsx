import Link from "next/link";
import { Startup } from "@/lib/startups";

function scoreColor(score: number) {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-rose-400";
}

export function StartupCard({ startup }: { startup: Startup }) {
    const score = Math.max(0, Math.min(100, Math.round(startup.momentum_score ?? 0)));

    return (
        <Link
            href={`/startups/${startup.id}`}
            className="block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-indigo-500/40 transition-colors"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">{startup.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
                            {startup.sector ?? "—"}
                        </span>
                        <span className="rounded-md border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
                            {startup.stage ?? "—"}
                        </span>
                        {startup.signals_status === "pending" && (
                            <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                                Signals pending
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-400 truncate">{startup.domain ?? "No domain"}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500">Momentum</div>
                    <div className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</div>
                </div>
            </div>
        </Link>
    );
}
