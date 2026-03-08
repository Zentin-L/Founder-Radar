import { useMemo, useRef, useState } from "react";
import { Group, Mesh, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

type StartupCard = {
  id: string;
  name: string;
  logo: string;
  score: number;
  signal: string;
};

type FloatingStartupCardsProps = {
  progress: number;
  tier: "full" | "lite" | "static";
  startups?: StartupCard[];
};

const cardPositions: [number, number, number][] = [
  [-1.8, 0.8, 0],
  [0, 1.1, -0.6],
  [1.8, 0.6, -0.2],
  [-0.8, -0.8, -0.8],
  [1.2, -0.9, -0.4],
];

const DEMO_STARTUPS: StartupCard[] = [
  { id: '1', name: 'Stripe', logo: '/placeholder-logo.svg', score: 94, signal: '↑ +5 engineers' },
  { id: '2', name: 'Notion', logo: '/placeholder-logo.svg', score: 87, signal: '↑ +1.2K LinkedIn' },
  { id: '3', name: 'Linear', logo: '/placeholder-logo.svg', score: 82, signal: '↑ Series B' },
  { id: '4', name: 'Vercel', logo: '/placeholder-logo.svg', score: 91, signal: '↑ +8 engineers' },
  { id: '5', name: 'Supabase', logo: '/placeholder-logo.svg', score: 78, signal: '↑ +600 LinkedIn' },
];

function Card({ 
  startup, 
  position, 
  index,
  shadowsEnabled = true,
}: { 
  startup: StartupCard; 
  position: [number, number, number]; 
  index: number;
  shadowsEnabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const meshRef = useRef<Mesh>(null);

  useFrame(({ pointer, clock }) => {
    if (!meshRef.current) return;
    
    const t = clock.getElapsedTime();

    // Gentle float
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + index) * 0.05;
    meshRef.current.rotation.z = Math.sin(t * 0.4 + index) * 0.03;

    // Hover tilt
    if (hovered) {
      meshRef.current.rotation.x = MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.2,
        0.1
      );
      meshRef.current.rotation.y = MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.2,
        0.1
      );
    } else {
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow={shadowsEnabled}
      >
        <boxGeometry args={[1.1, 0.65, 0.06]} />
        <meshStandardMaterial
          color={hovered ? "#1a2438" : "#121826"}
          metalness={0.6}
          roughness={0.2}
          emissive="#1c2f61"
          emissiveIntensity={hovered ? 0.5 : 0.3}
        />
      </mesh>

      <Html center distanceFactor={1.5} transform occlude>
        <div className="startup-card-content" style={{
          width: '180px',
          padding: '16px',
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}>
          {imgError ? (
            <div
              style={{
                width: 40,
                height: 40,
                marginBottom: 8,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: '#e0e7ff',
              }}
            >
              {startup.name.charAt(0)}
            </div>
          ) : (
            <img
              src={startup.logo}
              alt={startup.name}
              style={{ width: '40px', height: '40px', marginBottom: '8px', objectFit: 'contain' }}
              onError={() => setImgError(true)}
            />
          )}
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{startup.name}</h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: startup.score > 85 ? '#10b981' : '#6b7280',
            margin: '8px 0'
          }}>
            {startup.score}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{startup.signal}</div>
        </div>
      </Html>
    </group>
  );
}

export function FloatingStartupCards({ 
  progress, 
  tier,
  startups = DEMO_STARTUPS 
}: FloatingStartupCardsProps) {
  const group = useRef<Group>(null);
  const cards = useMemo(() => 
    tier === "full" ? cardPositions : cardPositions.slice(0, 3), 
    [tier]
  );
  const isVisible = progress < 0.38;

  useFrame(({ pointer }) => {
    if (!group.current || !isVisible) return;

    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x, 
      pointer.y * 0.06, 
      0.05
    );
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y, 
      pointer.x * 0.08, 
      0.05
    );
  });

  if (tier === 'static') {
    return null; // Render 2D fallback instead
  }

  return (
    <group ref={group} visible={isVisible}>
      {cards.map((position, index) => {
        const startup = startups[index];
        if (!startup) return null;
        
        return (
          <Card
            key={startup.id}
            startup={startup}
            position={position}
            index={index}
            shadowsEnabled={tier === 'full'}
          />
        );
      })}
    </group>
  );
}