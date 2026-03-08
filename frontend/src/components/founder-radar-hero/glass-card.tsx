'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface GlassCardProps {
  position: [number, number, number]
  name: string
  score: number
  color: string
}

export function GlassCard({ position, name, score, color }: GlassCardProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return

    // Smooth floating animation
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.002

    // Rotation on hover
    if (hovered) {
      targetRotation.current.x = Math.sin(state.clock.elapsedTime) * 0.3
      targetRotation.current.y = Math.cos(state.clock.elapsedTime) * 0.4
    } else {
      targetRotation.current.x *= 0.95
      targetRotation.current.y *= 0.95
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.1
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.1
    )
  })

  // Get score color
  const getScoreColor = () => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#3b82f6'
    return '#f97316'
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Glass material background */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1.4, 1.8, 0.2]} />
        <meshPhysicalMaterial
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.1}
          color={hovered ? '#ffffff' : '#e0e7ff'}
          ior={1.5}
          envMapIntensity={1}
        />
      </mesh>

      {/* Glow effect on hover */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[1.5, 1.9, 0.1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* HTML Content */}
      <Html
        scale={0.003}
        position={[0, 0, 0.15]}
        distanceFactor={1}
      >
        <div className="w-96 h-96 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl">
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 mb-3" />
              <h3 className="text-white text-2xl font-bold mb-1">{name}</h3>
              <p className="text-gray-300 text-xs">Technology Startup</p>
            </div>

            {/* Momentum Score */}
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-gray-400 text-sm">/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${score}%`,
                    backgroundColor: getScoreColor(),
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-2">Momentum Score</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
