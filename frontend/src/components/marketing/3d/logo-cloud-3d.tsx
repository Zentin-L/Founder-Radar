import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";

type LogoCloud3DProps = {
  progress: number;
  tier?: "full" | "lite" | "static";
};

type Logo = {
  id: string;
  name: string;
  image: string;
};

const DEMO_LOGOS: Logo[] = [
  { id: "1", name: "Sequoia", image: "/placeholder-logo.svg" },
  { id: "2", name: "a16z", image: "/placeholder-logo.svg" },
  { id: "3", name: "YC", image: "/placeholder-logo.svg" },
  { id: "4", name: "Accel", image: "/placeholder-logo.svg" },
  { id: "5", name: "Lightspeed", image: "/placeholder-logo.svg" },
  { id: "6", name: "Index", image: "/placeholder-logo.svg" },
];

function LogoCard({ 
  logo, 
  position, 
  index 
}: { 
  logo: Logo; 
  position: [number, number, number]; 
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const meshRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + index * 0.8) * 0.04;
    meshRef.current.rotation.z = Math.sin(t * 0.3 + index) * 0.02;
    
    if (hovered) {
      meshRef.current.scale.setScalar(MathUtils.lerp(meshRef.current.scale.x, 1.1, 0.1));
    } else {
      meshRef.current.scale.setScalar(MathUtils.lerp(meshRef.current.scale.x, 1, 0.1));
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <planeGeometry args={[0.9, 0.42]} />
        <meshPhysicalMaterial
          color="#0a0f1e"
          metalness={0.3}
          roughness={0.2}
          transmission={0.3}
          thickness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive="#1a2f5f"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      <Html center distanceFactor={1.2} transform occlude>
        <div
          style={{
            width: "120px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            pointerEvents: "none",
            transition: "opacity 0.3s",
            opacity: hovered ? 1 : 0.8,
          }}
        >
          {imgError ? (
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#e0e7ff",
                letterSpacing: "0.05em",
              }}
            >
              {logo.name}
            </span>
          ) : (
            <img
              src={logo.image}
              alt={logo.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                filter: "brightness(0) invert(1)",
                opacity: 0.9,
              }}
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </Html>
    </group>
  );
}

export function LogoCloud3D({ progress, tier = "full" }: LogoCloud3DProps) {
  const group = useRef<Group>(null);

  const positions = useMemo(
    () => [
      [-2.2, 0.9, -0.2],
      [-1.0, -0.3, -0.5],
      [0.2, 0.8, 0],
      [1.5, -0.6, -0.4],
      [2.3, 0.5, -0.1],
      [0.9, 1.6, -0.6],
    ] as [number, number, number][],
    []
  );

  const logos = useMemo(() => {
    return tier === "lite" ? DEMO_LOGOS.slice(0, 4) : DEMO_LOGOS;
  }, [tier]);

  const active = progress > 0.56 && progress < 0.84;

  useFrame(({ clock, pointer }) => {
    if (!group.current || !active) return;
    
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.2) * 0.15;
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.05,
      0.05
    );
  });

  if (tier === "static") return null;

  return (
    <group ref={group} position={[0, 0.2, -0.8]} visible={active}>
      {logos.map((logo, index) => (
        <LogoCard
          key={logo.id}
          logo={logo}
          position={positions[index]}
          index={index}
        />
      ))}
    </group>
  );
}