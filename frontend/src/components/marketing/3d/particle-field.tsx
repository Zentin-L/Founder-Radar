import { useMemo, useRef } from "react";
import { MathUtils, Points, Color, AdditiveBlending, PointsMaterial } from "three";
import { useFrame } from "@react-three/fiber";

type ParticleFieldProps = {
  tier: "full" | "lite" | "static";
  progress?: number;
  velocity?: number;
};

export function ParticleField({ tier, progress = 0, velocity = 0 }: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const count = tier === "full" ? 2000 : tier === "lite" ? 800 : 0;

  const { positions, colors, sizes } = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    const sectorColors = [
      new Color("#3b82f6"), // AI - blue
      new Color("#10b981"), // Fintech - green
      new Color("#8b5cf6"), // Healthcare - purple
      new Color("#f59e0b"), // DevTools - orange
      new Color("#ec4899"), // Other - pink
    ];

    for (let i = 0; i < count; i++) {
      // Positions (wider spread, more depth)
      posArray[i * 3] = MathUtils.randFloatSpread(20);
      posArray[i * 3 + 1] = MathUtils.randFloatSpread(12);
      posArray[i * 3 + 2] = MathUtils.randFloatSpread(14) - 2;

      // Colors (sector-based)
      const sectorColor = sectorColors[i % sectorColors.length];
      colorArray[i * 3] = sectorColor.r;
      colorArray[i * 3 + 1] = sectorColor.g;
      colorArray[i * 3 + 2] = sectorColor.b;

      // Sizes (varied for depth)
      sizeArray[i] = MathUtils.randFloat(0.02, 0.08);
    }

    return {
      positions: posArray,
      colors: colorArray,
      sizes: sizeArray,
    };
  }, [count]);

  const velocities = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = MathUtils.randFloat(-0.0005, 0.0005);
      array[i * 3 + 1] = MathUtils.randFloat(-0.0003, 0.0003);
      array[i * 3 + 2] = MathUtils.randFloat(-0.0004, 0.0004);
    }
    return array;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position;

    const scrollEnergy = MathUtils.clamp(Math.abs(velocity) * 12, 0, 1);
    const activity = MathUtils.clamp(0.6 + progress * 0.8 + scrollEnergy, 0.6, 2);

    // Gentle rotation that responds to scroll energy
    pointsRef.current.rotation.y = time * 0.02 * activity;
    pointsRef.current.rotation.x = Math.sin(time * 0.01 * activity) * 0.05;

    // Mouse interaction (subtle repulsion)
    const mouseX = pointer.x * 5;
    const mouseY = pointer.y * 5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Drift animation (amplified when scrolling faster / deeper)
      positionsAttr.array[i3] += velocities[i3] * activity;
      positionsAttr.array[i3 + 1] += velocities[i3 + 1] * activity;
      positionsAttr.array[i3 + 2] += velocities[i3 + 2] * activity;

      // Boundary wrapping
      if (Math.abs(positionsAttr.array[i3]) > 10) {
        positionsAttr.array[i3] *= -1;
      }
      if (Math.abs(positionsAttr.array[i3 + 1]) > 6) {
        positionsAttr.array[i3 + 1] *= -1;
      }
      if (Math.abs(positionsAttr.array[i3 + 2]) > 7) {
        positionsAttr.array[i3 + 2] *= -1;
      }

      // Mouse repulsion (subtle)
      const dx = positionsAttr.array[i3] - mouseX;
      const dy = positionsAttr.array[i3 + 1] - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        const force = (3 - distance) / 3;
        positionsAttr.array[i3] += dx * force * 0.01;
        positionsAttr.array[i3 + 1] += dy * force * 0.01;
      }
    }

    positionsAttr.needsUpdate = true;

    // Pulse + fade effect based on scroll progress (keep visible at hero, fade near bottom)
    const material = pointsRef.current.material as PointsMaterial;
    if (material) {
      const fadeOut = MathUtils.smoothstep(0.7, 0.95, progress);
      const base = 0.4 + Math.sin(time * 0.5 + progress * Math.PI) * 0.12;
      const targetOpacity = MathUtils.clamp(base * (1 - fadeOut), 0.25, 0.65);

      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, 0.06);
    }
  }, 1);

  if (tier === "static") return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={tier === "full" ? 0.05 : 0.04}
        sizeAttenuation
        transparent
        opacity={0.6}
        vertexColors
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={true}
      />
    </points>
  );
}