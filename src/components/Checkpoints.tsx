import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { IntersectionEnterPayload } from '@react-three/rapier'
import { Mesh, MeshStandardMaterial } from 'three'
import { useGameStore, Zone } from '../store/gameStore'
import { Text } from '@react-three/drei'

interface CheckpointProps {
  position: [number, number, number]
  zone: Zone
  label: string
  color: string
}

function Checkpoint({ position, zone, label, color }: CheckpointProps) {
  const ringRef = useRef<Mesh>(null)
  const setActiveZone = useGameStore((s) => s.setActiveZone)
  const setPanelOpen = useGameStore((s) => s.setPanelOpen)
  const activeZone = useGameStore((s) => s.activeZone)
  const isActive = activeZone === zone

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 1.5
      const mat = ringRef.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.5
    }
  })

  const handleEnter = (_payload: IntersectionEnterPayload) => {
    setActiveZone(zone)
    setPanelOpen(true)
  }

  return (
    <group position={position}>
      {/* Sensor */}
      <RigidBody type="fixed" sensor onIntersectionEnter={handleEnter}>
        <CuboidCollider args={[4, 3, 4]} />
      </RigidBody>

      {/* Visual ring */}
      <mesh ref={ringRef} position={[0, 1.5, 0]}>
        <torusGeometry args={[3, 0.15, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2 : 1}
        />
      </mesh>

      {/* Pillar lights */}
      {([-2.5, 2.5] as number[]).map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
          <pointLight position={[x, 3, 0]} color={color} intensity={4} distance={10} />
        </group>
      ))}

      {/* Ground marker */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.05}
      >
        {label}
      </Text>
    </group>
  )
}

export function Checkpoints() {
  return (
    <group>
      <Checkpoint position={[0, 0, -30]} zone="about" label="ABOUT ME" color="#00ffff" />
      <Checkpoint position={[30, 0, 0]} zone="projects" label="PROJECTS" color="#ff00ff" />
      <Checkpoint position={[-30, 0, 0]} zone="certifications" label="CERTIFICATIONS" color="#ffff00" />
      <Checkpoint position={[0, 0, 30]} zone="qualifications" label="QUALIFICATIONS" color="#00ff88" />
      <Checkpoint position={[25, 0, -25]} zone="contact" label="CONTACT" color="#ff4400" />
    </group>
  )
}
