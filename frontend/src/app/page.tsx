import { SkipLinks } from "@/components/marketing/a11y/skip-links";
import { ScreenReaderSummary } from "@/components/marketing/a11y/screenreader-summary";
import { StoryScroll } from "@/components/marketing/story-scroll";
import { HeroScene } from "@/components/founder-radar-hero/hero-scene";

export default function HomePage() {
  return (
    <>
      <SkipLinks />
      <ScreenReaderSummary />
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <HeroScene backgroundOnly />
        </div>
        <div className="relative z-10">
          <StoryScroll />
        </div>
      </div>
    </>
  );
}
