type MarketingEvent =
  | "hero_cta_click"
  | "section_depth_reached"
  | "pricing_cta_click"
  | "request_access_submitted"
  | "request_access_failed"
  | "request_access_verified";

export function trackMarketingEvent(event: MarketingEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const plausible = (window as Window & { plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void }).plausible;
  if (plausible) {
    plausible(event, { props: properties });
  }

  const posthog = (window as Window & { posthog?: { capture: (name: string, props?: Record<string, unknown>) => void } }).posthog;
  if (posthog?.capture) {
    posthog.capture(event, properties);
  }
}
