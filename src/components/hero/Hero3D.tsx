"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

let rngState = 1
function fastRand() {
  rngState = (rngState * 16807) % 2147483647
  return (rngState - 1) / 2147483646
}

function generatePositions(count: number) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (fastRand() - 0.5) * 40
    pos[i * 3 + 1] = (fastRand() - 0.5) * 20
    pos[i * 3 + 2] = (fastRand() - 0.5) * 30 - 5
  }
  return pos
}

const posBuffer = generatePositions(500)

function Particles() {
  const meshRef = useRef<THREE.Points>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.pointer.x * 0.05
    meshRef.current.rotation.x = state.pointer.y * 0.02
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posBuffer, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#93C5FD" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function SceneContent() {
  const mountRef = useRef<THREE.Group>(null!)
  const orbRefs = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    rngState = 1
  }, [])

  useFrame((state) => {
    if (!mountRef.current) return
    const p = state.pointer
    mountRef.current.rotation.y = p.x * 0.08
    mountRef.current.position.x = p.x * -0.15
    mountRef.current.position.y = p.y * -0.08
    orbRefs.current.forEach((orb, i) => {
      if (!orb) return
      const yOff = [-0.5, 0.5, -0.2, 0.8, -1.2, -1.5][i]
      orb.position.y = yOff + Math.sin(state.clock.elapsedTime * 0.5 + i * 1.2) * 0.15
    })
  })

  const orbData = useMemo(() => [
    { pos: [-4, 0.5, -3] as const, color: "#60A5FA" },
    { pos: [-1.5, 1.2, -2] as const, color: "#34D399" },
    { pos: [1.5, 0.8, -2.5] as const, color: "#F59E0B" },
    { pos: [4, 1.5, -3.5] as const, color: "#A78BFA" },
    { pos: [-3, -0.5, -1] as const, color: "#F87171" },
    { pos: [3, -0.2, -1.5] as const, color: "#93C5FD" },
  ], [])

  return (
    <group ref={mountRef}>
      <color attach="background" args={["#08081a"]} />
      <fog attach="fog" args={["#08081a", 8, 25]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#60A5FA" />
      <directionalLight position={[-5, -2, -5]} intensity={0.15} color="#A78BFA" />
      <Particles />
      <mesh position={[0, -2.5, -8]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[30, 10, 16, 16]} />
        <meshStandardMaterial color="#1a1a2e" wireframe roughness={0.8} metalness={0.1} transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, -1, -12]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#0a0a1f" transparent opacity={0.5} />
      </mesh>
      {orbData.map((orb, i) => (
        <mesh key={i} ref={(el) => { if (el) orbRefs.current[i] = el }} position={orb.pos}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshPhysicalMaterial
            color={orb.color}
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.3}
            envMapIntensity={0.5}
            clearcoat={0.3}
          />
        </mesh>
      ))}
      <mesh position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a0a2e" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function CameraSetup() {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(0, 0.5, 6)
    camera.lookAt(0, 0, -3)
  }, [camera])
  return null
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 6], fov: 55 }} dpr={[0.5, 1]} gl={{ antialias: false, alpha: false }} frameloop="demand">
      <CameraSetup />
      <SceneContent />
    </Canvas>
  )
}
