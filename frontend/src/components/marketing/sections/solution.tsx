"use client";

import { SolutionStaticFallback } from "@/components/marketing/fallback/solution-static";

type SolutionSectionProps = {
  tier: "full" | "lite" | "static";
};

export function SolutionSection({ tier }: SolutionSectionProps) {
  return (
    <section id="solution" className="min-h-screen py-24 flex items-center">
      <div className="w-full max-w-5xl space-y-6">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">The Solution</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">Interactive momentum intelligence designed for investment speed.</h2>
        <p className="text-gray-300 text-lg max-w-3xl">
          A reactive momentum gauge combines hiring and LinkedIn trends into a single confidence signal, updated every cycle.
        </p>
        {tier === "static" && <SolutionStaticFallback />}
      </div>
    </section>
  );
}
