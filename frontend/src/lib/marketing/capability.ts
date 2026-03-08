"use client";

import { useEffect, useState } from "react";

export type CapabilityState = {
  webgl: boolean;
  reducedMotion: boolean;
  touch: boolean;
  deviceMemory: number;
};

const DEFAULT_CAPABILITY: CapabilityState = {
  webgl: false,
  reducedMotion: false,
  touch: false,
  deviceMemory: 4,
};

function detectCapability(): CapabilityState {
  if (typeof window === "undefined") return DEFAULT_CAPABILITY;

  const canvas = document.createElement("canvas");
  const webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));

  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const memory =
    "deviceMemory" in navigator
      ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4)
      : 4;

  return { webgl, reducedMotion, touch, deviceMemory: memory };
}

export function useCapability(): CapabilityState {
  const [capability, setCapability] = useState(DEFAULT_CAPABILITY);

  useEffect(() => {
    setCapability(detectCapability());
  }, []);

  return capability;
}
