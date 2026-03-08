export const marketingSections = [
  "hero",
  "problem",
  "solution",
  "how",
  "proof",
  "pricing",
  "access",
] as const;

export type MarketingSection = (typeof marketingSections)[number];
