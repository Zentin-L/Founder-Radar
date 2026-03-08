"use client";

const logos = ["Sequoia Scout", "Northstar Ventures", "Apex Capital", "Launch Syndicate", "Frontline Angels", "Signal Labs"];

export function SocialProofSection() {
  return (
    <section id="proof" className="min-h-screen py-24 flex items-center">
      <div className="w-full max-w-6xl space-y-6">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">Social proof</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">Used by analysts, scouts, and angel syndicates that move fast.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {logos.map((logo) => (
            <div key={logo} className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-5 text-center text-sm text-gray-300">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
