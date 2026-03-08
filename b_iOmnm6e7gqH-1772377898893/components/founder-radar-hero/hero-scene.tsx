'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { GlassCard } from './glass-card'
import { ParticleSystem } from './particle-system'
import { Lighting } from './lighting'

const CARDS = [
  { position: [-1.8, 1.2, 0] as [number, number, number], name: 'Tektile', score: 92, color: '#00ff88' },
  { position: [0, 0.2, -1] as [number, number, number], name: 'Aurora', score: 87, color: '#00ccff' },
  { position: [1.8, 1.2, 0] as [number, number, number], name: 'Nexus AI', score: 91, color: '#ff6b9d' },
  { position: [-1.2, -1.5, 0.5] as [number, number, number], name: 'Nova Labs', score: 78, color: '#ffa500' },
  { position: [1.2, -1.5, 0.5] as [number, number, number], name: 'Quantum', score: 85, color: '#7c3aed' },
]

export function HeroScene() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0d1428] to-[#000000] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000000']} />
        <Lighting />
        <ParticleSystem />
        
        {CARDS.map((card, idx) => (
          <GlassCard
            key={idx}
            position={card.position}
            name={card.name}
            score={card.score}
            color={card.color}
          />
        ))}
        
        <Preload all />
      </Canvas>

      {/* HTML Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Discover Founders
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Real-time startup momentum tracking and founder intelligence
          </p>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
