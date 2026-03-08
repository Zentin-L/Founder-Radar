"use client";

import { Button } from "@/components/ui/button";

type PricingSectionProps = {
  onCtaClick: () => void;
};

export function PricingSection({ onCtaClick }: PricingSectionProps) {
  return (
    <section id="pricing" className="min-h-screen py-24 flex items-center">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-900/80 p-8 md:p-10">
        <p className="text-indigo-300 text-sm uppercase tracking-[0.2em]">Pricing</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white">$299 / month</h2>
        <p className="mt-4 text-gray-300 max-w-2xl">
          One seat for VC analysts and scouts. Includes full momentum feed, startup dashboards, and priority signal updates.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-gray-300">
          <li>• Signal feed sorted by momentum score</li>
          <li>• Startup detail trends (hiring + LinkedIn)</li>
          <li>• Priority onboarding and beta support</li>
        </ul>
        <div className="mt-8">
          <Button size="lg" onClick={onCtaClick}>Request Beta Access</Button>
        </div>
      </div>
    </section>
  );
}
