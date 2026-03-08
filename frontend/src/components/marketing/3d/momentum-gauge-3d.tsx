import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Mesh, MeshStandardMaterial } from "three";
import { useRef, useState, useMemo } from "react";
import { Html } from "@react-three/drei";

type MomentumGauge3DProps = {
  progress: number;
  score?: number;
  tier?: "full" | "lite" | "static";
};

export function MomentumGauge3D({ 
  progress, 
  score = 94,
  tier = "full" 
}: MomentumGauge3DProps) {
  const group = useRef<Group>(null);
  const pointer = useRef<Group>(null);
  const gaugeRef = useRef<Mesh>(null);
  const [currentScore, setCurrentScore] = useState(0);

  const active = progress > 0.38 && progress < 0.68;
  const localProgress = MathUtils.clamp((progress - 0.38) / 0.3, 0, 1);

  const scoreColor = useMemo(() => {
    if (score >= 85) return "#10b981";
    if (score >= 70) return "#3b82f6";
    if (score >= 50) return "#f59e0b";
    return "#6b7280";
  }, [score]);

  useFrame(({ clock, pointer: mousePointer }) => {
    if (!group.current || !pointer.current) return;

    group.current.visible = active;

    if (active) {
      const targetScore = Math.floor(localProgress * score);
      setCurrentScore(prev => MathUtils.lerp(prev, targetScore, 0.05));

      const targetRotation = MathUtils.degToRad(-135 + (currentScore / 100) * 270);
      pointer.current.rotation.z = MathUtils.lerp(
        pointer.current.rotation.z,
        targetRotation,
        0.08
      );

      group.current.rotation.y = MathUtils.lerp(
        group.current.rotation.y,
        0.25 + mousePointer.x * 0.1,
        0.06
      );

      group.current.rotation.x = MathUtils.lerp(
        group.current.rotation.x,
        mousePointer.y * 0.05,
        0.06
      );

      if (gaugeRef.current && tier === "full") {
        const pulseIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
        (gaugeRef.current.material as MeshStandardMaterial).emissiveIntensity = pulseIntensity;
      }
    }
  });

  if (tier === "static") return null;

  return (
    <group ref={group} position={[0.2, -0.25, -0.4]}>
      {/* Main gauge arc */}
      <mesh ref={gaugeRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.2, 0.08, 16, 64, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#5f7efc"
          emissive="#2d47aa"
          emissiveIntensity={0.55}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Background arc (darker) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.06, 16, 64, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#1a2238"
          emissive="#0f1624"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Pointer/needle */}
      <group ref={pointer}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.04, 1.2, 0.04]} />
          <meshStandardMaterial
            color={scoreColor}
            emissive={scoreColor}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Pointer tip (arrow) */}
        <mesh position={[0, 1.4, 0]}>
          <coneGeometry args={[0.06, 0.12, 8]} />
          <meshStandardMaterial
            color={scoreColor}
            emissive={scoreColor}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Center hub */}
      <mesh castShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshPhysicalMaterial
          color="#d7e3ff"
          emissive="#6f93ff"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Score display */}
      <Html center position={[0, -0.6, 0]} distanceFactor={1.5}>
        <div
          style={{
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: scoreColor,
              textShadow: `0 0 20px ${scoreColor}80`,
              marginBottom: "4px",
            }}
          >
            {currentScore < 1 ? "—" : Math.round(currentScore)}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#9ca3af",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Momentum Score
          </div>
        </div>
      </Html>

      {/* Gauge markers */}
      {tier === "full" && [0, 25, 50, 75, 100].map((mark) => {
        const angle = MathUtils.degToRad(-135 + (mark / 100) * 270);
        const x = Math.cos(angle) * 1.05;
        const y = Math.sin(angle) * 1.05;
        
        return (
          <group key={mark} position={[x, y, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 0.08, 0.02]} />
              <meshStandardMaterial
                color="#4a5568"
                emissive="#2d3748"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      })}

      {/* Glow effect ring */}
      {tier === "full" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.03, 16, 64]} />
          <meshBasicMaterial
            color={scoreColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}