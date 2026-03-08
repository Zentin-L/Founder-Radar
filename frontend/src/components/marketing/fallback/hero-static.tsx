"use client";

export function HeroStaticFallback() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: "radial-gradient(ellipse 80% 80% at 50% 0%, #1e3a5f 0%, #0f172a 40%, #020617 100%)",
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "linear-gradient(180deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 30%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(3px 3px at 20px 30px, rgba(99,102,241,0.9), transparent),
            radial-gradient(3px 3px at 80px 120px, rgba(16,185,129,0.7), transparent),
            radial-gradient(3px 3px at 160px 60px, rgba(139,92,246,0.7), transparent),
            radial-gradient(3px 3px at 240px 180px, rgba(245,158,11,0.6), transparent),
            radial-gradient(3px 3px at 320px 90px, rgba(236,72,153,0.6), transparent)`,
          backgroundSize: "360px 240px",
          animation: "hero-static-shimmer 25s linear infinite",
        }}
      />
    </div>
  );
}
