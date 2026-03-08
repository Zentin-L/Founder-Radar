'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Lighting() {
  const spotLightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3
      spotLightRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 2 + 3
    }
  })

  return (
    <>
      {/* Main Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[2, 4, 3]}
        angle={Math.PI / 3}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Blue accent light */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={0.8}
        color="#00ccff"
        distance={15}
      />

      {/* Pink accent light */}
      <pointLight
        position={[3, -1, 2]}
        intensity={0.6}
        color="#ff6b9d"
        distance={12}
      />

      {/* Cyan rim light */}
      <directionalLight
        position={[0, 0, 5]}
        intensity={0.4}
        color="#00ff88"
      />

      {/* Ambient light for overall brightness */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Hemisphere light for atmospheric effect */}
      <hemisphereLight
        color="#0a1a40"
        groundColor="#000000"
        intensity={0.5}
      />
    </>
  )
}
