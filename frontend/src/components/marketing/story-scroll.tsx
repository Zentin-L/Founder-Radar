"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useVelocity, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";

import { HeroSection } from "@/components/marketing/sections/hero";
import { ProblemSection } from "@/components/marketing/sections/problem";
import { SolutionSection } from "@/components/marketing/sections/solution";
import { HowItWorksSection } from "@/components/marketing/sections/how-it-works";
import { SocialProofSection } from "@/components/marketing/sections/social-proof";
import { PricingSection } from "@/components/marketing/sections/pricing";
import { RequestAccessSection } from "@/components/marketing/sections/request-access";
import { useCapability } from "@/lib/marketing/capability";
import { getDeviceTier } from "@/lib/marketing/device-tier";
import { useMarketingPerfMonitor } from "@/lib/marketing/perf-monitor";
import { trackMarketingEvent } from "@/lib/marketing/analytics";

export function StoryScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const capability = useCapability();
  const tier = useMemo(() => getDeviceTier(capability), [capability]);

  const [progress, setProgress] = useState(0);
  const [velocityValue, setVelocityValue] = useState(0);

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const velocity = useVelocity(scrollYProgress);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
    if (latest > 0.8) {
      trackMarketingEvent("section_depth_reached", { depth: "80%" });
    }
  });

  useMotionValueEvent(velocity, "change", (latest) => {
    setVelocityValue(latest);
  });

  useEffect(() => {
    if (capability.reducedMotion) return;
    const lenis = new Lenis({ smoothWheel: true, duration: 1.1 });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [capability.reducedMotion]);

  useMarketingPerfMonitor(tier !== "static");

  const jumpToAccess = () => {
    const node = document.getElementById("access");
    if (!node) return;
    node.scrollIntoView({ behavior: capability.reducedMotion ? "auto" : "smooth", block: "start" });
    trackMarketingEvent("hero_cta_click");
  };

  return (
    <div ref={rootRef} className="relative min-h-full">
      <main id="main-content" className="relative z-10 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <HeroSection onCtaClick={jumpToAccess} />
        <ProblemSection />
        <SolutionSection tier={tier} />
        <HowItWorksSection />
        <SocialProofSection />
        <PricingSection onCtaClick={() => {
          trackMarketingEvent("pricing_cta_click");
          jumpToAccess();
        }} />
        <RequestAccessSection />
      </main>
    </div>
  );
}
