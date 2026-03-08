"use client";

import { CapabilityState } from "@/lib/marketing/capability";

export type DeviceTier = "full" | "lite" | "static";

export function getDeviceTier(capability: CapabilityState): DeviceTier {
  if (!capability.webgl) {
    return "static";
  }

  if (capability.reducedMotion) {
    return "static";
  }

  if (capability.touch || capability.deviceMemory <= 4) {
    return "lite";
  }

  return "full";
}
