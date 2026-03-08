'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleSystem() {
  const meshRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const particlesCount = 1500

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    const col = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3

      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 4 + Math.random() * 2

      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)

      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        col[i3] = 0.0
        col[i3 + 1] = 1.0
        col[i3 + 2] = 1.0
      } else if (colorChoice < 0.66) {
        col[i3] = 0.0
        col[i3 + 1] = 0.6
        col[i3 + 2] = 1.0
      } else {
        col[i3] = 0.5
        col[i3 + 1] = 0.0
        col[i3 + 2] = 1.0
      }
    }

    return { positions: pos, colors: col }
  }, [particlesCount])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.01
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors={true}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.7}
      />
    </points>
  )
}
