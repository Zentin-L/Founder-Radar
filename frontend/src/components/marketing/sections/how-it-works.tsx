"use client";

const steps = [
  {
    title: "Collect",
    body: "Ingest hiring and LinkedIn growth signals across tracked startups every cycle.",
  },
  {
    title: "Score",
    body: "Normalize velocity and growth into a 0-100 momentum score with direction deltas.",
  },
  {
    title: "Prioritize",
    body: "Surface high-momentum companies in a ranked feed so analysts can act first.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="min-h-screen py-24 flex items-center">
      <div className="w-full max-w-5xl space-y-8">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">How it works</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">Three steps from raw signal noise to investment conviction.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-gray-800 bg-gray-900/70 p-5">
              <p className="text-indigo-300 text-xs">0{index + 1}</p>
              <h3 className="mt-2 text-xl text-white font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
