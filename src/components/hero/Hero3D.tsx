"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const ENVIRONMENTS = {
  rainforest: { bg: "#08081a" as const, fog: [0.05, 0.03, 0.1] as const, light: "#60A5FA", intensity: 0.35, ground: "#0a0a2e" },
  forest: { bg: "#0a1a0f" as const, fog: [0.04, 0.08, 0.03] as const, light: "#34D399", intensity: 0.4, ground: "#0a2a10" },
  ocean: { bg: "#0a0a1e" as const, fog: [0.02, 0.04, 0.1] as const, light: "#93C5FD", intensity: 0.3, ground: "#0a0a28" },
  campfire: { bg: "#1a0a05" as const, fog: [0.12, 0.05, 0.02] as const, light: "#F59E0B", intensity: 0.45, ground: "#1a0a08" },
  snow: { bg: "#0f1218" as const, fog: [0.06, 0.06, 0.08] as const, light: "#E2E8F0", intensity: 0.35, ground: "#12141a" },
  night: { bg: "#050510" as const, fog: [0.02, 0.01, 0.05] as const, light: "#A78BFA", intensity: 0.2, ground: "#080818" },
  desert: { bg: "#0f0a05" as const, fog: [0.08, 0.05, 0.02] as const, light: "#FCD34D", intensity: 0.4, ground: "#120a05" },
}

type EnvKey = keyof typeof ENVIRONMENTS

function rng() {
  let s = 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function generatePositions(count: number, spread = 30, height = 15, depth = 25) {
  const rand = rng()
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * spread
    pos[i * 3 + 1] = (rand() - 0.5) * height
    pos[i * 3 + 2] = (rand() - 0.5) * depth - 5
  }
  return pos
}

const fireflyPositions = generatePositions(30, 20, 8, 12)

function MountainRange({ color = "#1a1a2e", opacity = 0.12, posZ = -8, segments = 16 }: { color?: string; opacity?: number; posZ?: number; segments?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.x = state.pointer.x * -0.2
    meshRef.current.position.y = state.pointer.y * -0.05
  })
  return (
    <mesh ref={meshRef} position={[0, -2, posZ]} rotation={[-0.08, 0, 0]}>
      <planeGeometry args={[35, 12, segments, segments]} />
      <meshStandardMaterial color={color} wireframe roughness={0.8} metalness={0.1} transparent opacity={opacity} />
    </mesh>
  )
}

function FogParticles({ env }: { env: EnvKey }) {
  const meshRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.3
    meshRef.current.position.y += 0.001
    meshRef.current.rotation.z += 0.0002
  })
  const c = ENVIRONMENTS[env]
  const fogColor = `rgb(${c.fog[0] * 255},${c.fog[1] * 255},${c.fog[2] * 255})`
  return (
    <points ref={meshRef} position={[0, -0.5, -10]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[generatePositions(80, 50, 10, 20), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color={fogColor} transparent opacity={0.15} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Stars() {
  const meshRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.pointer.x * 0.03
  })
  return (
    <points ref={meshRef} position={[0, 5, -15]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[generatePositions(200, 60, 30, 10), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function Fireflies() {
  const meshRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
  })
  return (
    <points ref={meshRef} position={[0, 0.5, -3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[fireflyPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FDE68A" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function AuroraBand({ color = "#60A5FA", positionY = 0, opacity = 0.06, speed = 0.008 }: { color?: string; positionY?: number; opacity?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * speed) * 2
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = opacity + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.02
  })
  return (
    <mesh ref={meshRef} position={[0, positionY, -8]} rotation={[0.2, 0.3, 0.1]}>
      <planeGeometry args={[20, 1.5]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

function BokehParticles({ env }: { env: EnvKey }) {
  const meshRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.0003
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.01) * 0.2
  })
  const c = ENVIRONMENTS[env]
  const count = 15
  const pos = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const rand = rng()
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 30
    pos[i * 3 + 1] = (rand() - 0.5) * 12
    pos[i * 3 + 2] = (rand() - 0.5) * 20 - 5
    sizes[i] = 0.3 + rand() * 0.8
  }
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.8} color={c.light} transparent opacity={0.04} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function GroundGlow({ env }: { env: EnvKey }) {
  return (
    <mesh position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[25, 25]} />
      <meshBasicMaterial color={ENVIRONMENTS[env].ground} transparent opacity={0.4} />
    </mesh>
  )
}

interface SceneContentProps {
  env: EnvKey
  onOrbClick: (label: string) => void
}

function SceneContent({ env }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const config = ENVIRONMENTS[env]

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.pointer.x * 0.06
    groupRef.current.position.x = state.pointer.x * -0.1
    groupRef.current.position.y = state.pointer.y * -0.06
  })

  return (
    <group ref={groupRef}>
      <color attach="background" args={[config.bg]} />
      <fog attach="fog" args={[`rgb(${config.fog[0] * 255},${config.fog[1] * 255},${config.fog[2] * 255})`, 6, 22]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={config.intensity} color={config.light} />
      <directionalLight position={[-5, -2, -5]} intensity={0.12} color="#A78BFA" />
      <Stars />
      <MountainRange color="#1a1a2e" opacity={0.12} posZ={-8} segments={12} />
      <MountainRange color="#15152a" opacity={0.15} posZ={-6} segments={10} />
      <MountainRange color="#12122a" opacity={0.18} posZ={-4.5} segments={8} />
      <FogParticles env={env} />
      {/* Aurora bands */}
      <AuroraBand color={config.light} positionY={2} opacity={0.04} speed={0.006} />
      <AuroraBand color={config.light} positionY={-1} opacity={0.03} speed={0.01} />
      {/* Bokeh */}
      <BokehParticles env={env} />
      <Fireflies />
      <GroundGlow env={env} />
      {/* Foreground foliage layer */}
      <mesh position={[0, -2.2, 0.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshBasicMaterial color={config.bg} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function useLowPerformance(): boolean {
  const [lowPerf] = useState(() => {
    if (typeof navigator === "undefined") return false
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const lowCores = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
    const dm = (navigator as { deviceMemory?: number }).deviceMemory
    const lowMemory = dm !== undefined && dm <= 4
    return isMobile && (lowCores || lowMemory)
  })
  return lowPerf
}

export function HeroScene({ env = "rainforest" }: { env?: EnvKey }) {
  const lowPerf = useLowPerformance()

  if (lowPerf) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#08081a] via-[#0a0a2e] to-[#050510]" />
    )
  }

  return (
    <Canvas camera={{ position: [0, 0.3, 5.5], fov: 50 }} dpr={[0.5, 1]} gl={{ antialias: false, alpha: false }} frameloop="always">
      <SceneContent env={env} onOrbClick={() => {}} />
    </Canvas>
  )
}
