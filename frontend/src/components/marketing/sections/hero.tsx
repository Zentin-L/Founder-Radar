"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type HeroSectionProps = {
  onCtaClick: () => void;
};

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section id="hero" className="min-h-screen flex items-center">
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
          Bloomberg Terminal for startup momentum
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Find breakout startups
          <span className="block text-indigo-300">before everyone else does.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          Founder Radar tracks hiring velocity and LinkedIn growth to surface startup momentum in one premium signal feed.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={onCtaClick}>Request Access</Button>
          <Button size="lg" variant="secondary" onClick={() => router.push("/login")}>Open Dashboard</Button>
        </div>
      </div>
    </section>
  );
}
