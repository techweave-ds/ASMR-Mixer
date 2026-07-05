"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

const ENVIRONMENTS = {
  rainforest: { bg: "#08081a", fog: [0.05, 0.03, 0.1], light: "#60A5FA", intensity: 0.35, ground: "#0a0a2e" },
  forest: { bg: "#0a1a0f", fog: [0.04, 0.08, 0.03], light: "#34D399", intensity: 0.4, ground: "#0a2a10" },
  ocean: { bg: "#0a0a1e", fog: [0.02, 0.04, 0.1], light: "#93C5FD", intensity: 0.3, ground: "#0a0a28" },
  campfire: { bg: "#1a0a05", fog: [0.12, 0.05, 0.02], light: "#F59E0B", intensity: 0.45, ground: "#1a0a08" },
  snow: { bg: "#0f1218", fog: [0.06, 0.06, 0.08], light: "#E2E8F0", intensity: 0.35, ground: "#12141a" },
  night: { bg: "#050510", fog: [0.02, 0.01, 0.05], light: "#A78BFA", intensity: 0.2, ground: "#080818" },
  desert: { bg: "#0f0a05", fog: [0.08, 0.05, 0.02], light: "#FCD34D", intensity: 0.4, ground: "#120a05" },
}

type EnvKey = keyof typeof ENVIRONMENTS

interface OrbData {
  id: string
  label: string
  color: string
  soundId: string
  pos: [number, number, number]
  depth: number
}

const ORBS: OrbData[] = [
  { id: "rain", label: "Rain", color: "#60A5FA", soundId: "rain-light", pos: [-4, 1.2, -3.5], depth: 0.8 },
  { id: "forest", label: "Forest", color: "#34D399", soundId: "forest-day", pos: [3.5, -0.3, -5], depth: 0.5 },
  { id: "fire", label: "Fire", color: "#F59E0B", soundId: "campfire", pos: [-1.5, 2.5, -6], depth: 0.3 },
  { id: "ocean", label: "Ocean", color: "#93C5FD", soundId: "ocean-waves", pos: [5.5, 0.8, -4.5], depth: 0.6 },
  { id: "night", label: "Night", color: "#A78BFA", soundId: "night-crickets", pos: [-3.5, -1, -7], depth: 0.2 },
  { id: "wind", label: "Wind", color: "#E2E8F0", soundId: "wind-gentle", pos: [2, -1.5, -8], depth: 0.15 },
]

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

function InteractiveOrb({ orb, index, activeOrb, hoveredOrb, onOrbClick, onOrbHover, reducedMotion }: {
  orb: OrbData
  index: number
  activeOrb: string | null
  hoveredOrb: string | null
  onOrbClick: (orb: OrbData) => void
  onOrbHover: (id: string | null) => void
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const basePos = useMemo(() => new THREE.Vector3(...orb.pos), [orb.pos])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const isActive = activeOrb === orb.id
  const isHovered = hoveredOrb === orb.id

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return
    const t = state.clock.elapsedTime
    const driftX = Math.sin(t * 0.15 + phase) * 0.4
    const driftY = Math.sin(t * 0.12 + phase * 1.3) * 0.3
    const driftZ = Math.sin(t * 0.08 + phase * 0.7) * 0.2
    const parallaxX = state.pointer.x * orb.depth * 1.5
    const parallaxY = state.pointer.y * orb.depth * 1.5
    meshRef.current.position.x = basePos.x + driftX + parallaxX
    meshRef.current.position.y = basePos.y + driftY + parallaxY
    meshRef.current.position.z = basePos.z + driftZ

    const s = isActive ? 0.6 : isHovered ? 0.45 : 0.3
    const pulseAmount = isActive ? 0.05 : 0.08
    const targetScale = s + Math.sin(t * 0.2 + phase) * pulseAmount
    meshRef.current.scale.setScalar(targetScale)
    if (glowRef.current) {
      glowRef.current.scale.setScalar(targetScale * 2.5)
      glowRef.current.position.copy(meshRef.current.position)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onOrbClick(orb)
  }

  return (
    <group>
      {/* Glow */}
      <mesh ref={glowRef} position={orb.pos}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={orb.color} transparent opacity={isActive ? 0.25 : isHovered ? 0.15 : 0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Orb */}
      <mesh
        ref={meshRef}
        position={orb.pos}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); onOrbHover(orb.id) }}
        onPointerOut={(e) => { e.stopPropagation(); onOrbHover(null) }}
      >
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color={orb.color}
          emissive={orb.color}
          emissiveIntensity={isActive ? 0.8 : isHovered ? 0.5 : 0.2}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* Label (shown on hover) */}
      {isHovered && !isActive && (
        <Html position={[orb.pos[0], orb.pos[1] + 0.8, orb.pos[2]]} center distanceFactor={8} zIndexRange={[0, 0]}>
          <div className="pointer-events-none select-none animate-fade-in">
            <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap">
              {orb.label} Preview
            </div>
          </div>
        </Html>
      )}

      {/* Mini player (shown when active) */}
      {isActive && (
        <Html position={[orb.pos[0], orb.pos[1] - 1, orb.pos[2]]} center distanceFactor={8} zIndexRange={[0, 0]}>
          <div className="pointer-events-none select-none animate-fade-in">
            <div className="rounded-xl bg-black/70 backdrop-blur-xl border border-white/20 px-3 py-2 shadow-2xl min-w-[120px]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-medium text-white/80">Now Playing</span>
              </div>
              <p className="text-[11px] text-white/40">{orb.label}</p>
              <div className="mt-1.5 h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-accent/60 animate-pulse" />
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

interface SceneContentProps {
  env: EnvKey
  activeOrb: string | null
  hoveredOrb: string | null
  onOrbClick: (orb: OrbData) => void
  onOrbHover: (id: string | null) => void
  reducedMotion: boolean
  timeWarmth: number
}

function SceneContent({ env, activeOrb, hoveredOrb, onOrbClick, onOrbHover, reducedMotion, timeWarmth }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const config = ENVIRONMENTS[env]

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return
    groupRef.current.rotation.y = state.pointer.x * 0.06
    groupRef.current.position.x = state.pointer.x * -0.1
    groupRef.current.position.y = state.pointer.y * -0.06
  })

  const warmthColor = new THREE.Color(config.light)
  if (timeWarmth > 0.5) {
    warmthColor.lerp(new THREE.Color("#F97316"), (timeWarmth - 0.5) * 0.4)
  } else {
    warmthColor.lerp(new THREE.Color("#60A5FA"), (1 - timeWarmth) * 0.3)
  }

  return (
    <group ref={groupRef}>
      <color attach="background" args={[config.bg]} />
      <fog attach="fog" args={[`rgb(${config.fog[0] * 255},${config.fog[1] * 255},${config.fog[2] * 255})`, 6, 22]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={config.intensity} color={warmthColor} />
      <directionalLight position={[-5, -2, -5]} intensity={0.12} color="#A78BFA" />
      <Stars />
      <MountainRange color="#1a1a2e" opacity={0.12} posZ={-8} segments={12} />
      <MountainRange color="#15152a" opacity={0.15} posZ={-6} segments={10} />
      <MountainRange color="#12122a" opacity={0.18} posZ={-4.5} segments={8} />
      <FogParticles env={env} />
      <AuroraBand color={warmthColor.getStyle()} positionY={2} opacity={0.04} speed={0.006} />
      <AuroraBand color={warmthColor.getStyle()} positionY={-1} opacity={0.03} speed={0.01} />
      <BokehParticles env={env} />
      <Fireflies />
      <GroundGlow env={env} />
      <mesh position={[0, -2.2, 0.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshBasicMaterial color={config.bg} transparent opacity={0.3} />
      </mesh>

      {/* Interactive Orbs */}
      {ORBS.map((orb, i) => (
        <InteractiveOrb
          key={orb.id}
          orb={orb}
          index={i}
          activeOrb={activeOrb}
          hoveredOrb={hoveredOrb}
          onOrbClick={onOrbClick}
          onOrbHover={onOrbHover}
          reducedMotion={reducedMotion}
        />
      ))}
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

export interface HeroSceneProps {
  env?: EnvKey
  activeOrb?: string | null
  hoveredOrb?: string | null
  onOrbClick?: (orb: { id: string; label: string; color: string; soundId: string }) => void
  onOrbHover?: (id: string | null) => void
  timeWarmth?: number
}

export function HeroScene({ env = "rainforest", activeOrb = null, hoveredOrb = null, onOrbClick = () => {}, onOrbHover = () => {}, timeWarmth = 0.5 }: HeroSceneProps) {
  const lowPerf = useLowPerformance()
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  if (lowPerf) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#08081a] via-[#0a0a2e] to-[#050510]" />
    )
  }

  return (
    <Canvas camera={{ position: [0, 0.3, 5.5], fov: 50 }} dpr={[0.5, 1]} gl={{ antialias: false, alpha: false }} frameloop="always">
      <SceneContent
        env={env}
        activeOrb={activeOrb}
        hoveredOrb={hoveredOrb}
        onOrbClick={(orb) => onOrbClick({ id: orb.id, label: orb.label, color: orb.color, soundId: orb.soundId })}
        onOrbHover={onOrbHover}
        reducedMotion={reducedMotion}
        timeWarmth={timeWarmth}
      />
    </Canvas>
  )
}
