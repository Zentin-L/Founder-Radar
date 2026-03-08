"use client";

export function ProblemSection() {
  return (
    <section id="problem" className="min-h-screen py-24 flex items-center">
      <div className="max-w-4xl space-y-5">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">The Problem</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">VC teams miss inflection points when signal data is scattered.</h2>
        <p className="text-gray-300 text-lg max-w-3xl">
          Hiring spikes, employee growth shifts, and sector heat happen fast. Manual monitoring and static spreadsheets miss the first move.
        </p>
      </div>
    </section>
  );
}
