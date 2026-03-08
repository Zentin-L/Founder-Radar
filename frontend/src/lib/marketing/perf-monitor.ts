"use client";

import { useEffect } from "react";

export function useMarketingPerfMonitor(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let frames = 0;
    let start = performance.now();
    let rafId = 0;

    const tick = () => {
      frames += 1;
      const now = performance.now();
      if (now - start >= 2000) {
        const fps = Math.round((frames * 1000) / (now - start));
        if (process.env.NODE_ENV !== "production") {
          console.debug("[marketing] approx fps", fps);
        }
        start = now;
        frames = 0;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
}
