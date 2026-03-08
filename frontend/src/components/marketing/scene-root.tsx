"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LightingRig } from "@/components/marketing/lighting-rig";
import { CameraRig } from "@/components/marketing/camera-rig";
import { FloatingStartupCards } from "@/components/marketing/3d/floating-startup-cards";
import { MomentumGauge3D } from "@/components/marketing/3d/momentum-gauge-3d";
import { ParticleField } from "@/components/marketing/3d/particle-field";
import { LogoCloud3D } from "@/components/marketing/3d/logo-cloud-3d";
import { HeroStaticFallback } from "@/components/marketing/fallback/hero-static";
import { featureFlags } from "@/lib/marketing/feature-flags";

const Canvas = dynamic(() => import("@react-three/fiber").then((module) => module.Canvas), {
  ssr: false,
});

type SceneRootProps = {
  tier: "full" | "lite" | "static";
  progress: number;
  velocity: number;
  reducedMotion: boolean;
};

export function SceneRoot({ tier, progress, velocity, reducedMotion }: SceneRootProps) {
  if (!featureFlags.enable3D || tier === "static") {
    return <HeroStaticFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={<HeroStaticFallback />}>
        <Canvas dpr={tier === "full" ? [1, 1.6] : [1, 1.2]} camera={{ fov: 48, position: [0, 1, 8] }}>
          <color attach="background" args={["#070b14"]} />
          <fog attach="fog" args={["#070b14", 7, 14]} />
          <LightingRig />
          <CameraRig progress={progress} velocity={velocity} reducedMotion={reducedMotion} />
          <ParticleField tier={tier} progress={progress} velocity={velocity} />
          <FloatingStartupCards progress={progress} tier={tier} />
          <MomentumGauge3D progress={progress} />
          <LogoCloud3D progress={progress} />
        </Canvas>
      </Suspense>
    </div>
  );
}
