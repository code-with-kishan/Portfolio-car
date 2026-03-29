import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { Mesh, MeshStandardMaterial } from 'three'

const CITY_SIZE = 200
const ROAD_WIDTH = 8

function Building({ position, size, color }: { position: [number,number,number], size: [number,number,number], color: string }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[position[0], position[1] + size[1]/2, position[2]]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#0a0a1a" emissive={color} emissiveIntensity={0.1} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Window glow strips */}
      <mesh position={[position[0], position[1] + size[1]/2, position[2] + size[2]/2 + 0.01]}>
        <boxGeometry args={[size[0] * 0.8, size[1] * 0.9, 0.05]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={0.6} color="#000" transparent opacity={0.9} />
      </mesh>
    </RigidBody>
  )
}

function StreetLight({ position }: { position: [number,number,number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 6, 6]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
      <pointLight position={[0, 6.5, 0]} color="#ff00ff" intensity={3} distance={18} />
      <mesh position={[0, 6.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={5} color="#000" />
      </mesh>
    </group>
  )
}

function NeonSign({ position, color }: { position: [number,number,number], color: string }) {
  const meshRef = useRef<Mesh>(null)
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.4
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[3, 0.8, 0.1]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={1} color="#000" />
    </mesh>
  )
}

const buildings: Array<{ position: [number,number,number], size: [number,number,number], color: string }> = []
const neonColors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88', '#ff4400']

for (let i = 0; i < 80; i++) {
  const angle = (i / 80) * Math.PI * 2
  const radius = 20 + (i % 5) * 15 + Math.random() * 10
  const x = Math.cos(angle + i * 0.3) * radius + (Math.random() - 0.5) * 10
  const z = Math.sin(angle + i * 0.3) * radius + (Math.random() - 0.5) * 10
  const height = 8 + Math.random() * 35
  const width = 4 + Math.random() * 8
  const depth = 4 + Math.random() * 8
  buildings.push({
    position: [x, 0, z],
    size: [width, height, depth],
    color: neonColors[i % neonColors.length],
  })
}

export function City() {
  return (
    <group>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[CITY_SIZE * 2, CITY_SIZE * 2]} />
          <meshStandardMaterial color="#050510" metalness={0.3} roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Road grid */}
      {[-40, -20, 0, 20, 40].map((offset, i) => (
        <group key={i}>
          <mesh position={[offset, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[ROAD_WIDTH, CITY_SIZE]} />
            <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.01, offset]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[CITY_SIZE, ROAD_WIDTH]} />
            <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Road markings */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={i}>
          <mesh position={[0, 0.02, -40 + i * 4.5]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[0.3, 2.5]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} size={b.size} color={b.color} />
      ))}

      {/* Street lights */}
      {[-30, -10, 10, 30].map((x, i) => (
        [-30, -10, 10, 30].map((z, j) => (
          <StreetLight key={`${i}-${j}`} position={[x + 4, 0, z + 4]} />
        ))
      ))}

      {/* Neon signs on buildings */}
      <NeonSign position={[18, 12, 19.5]} color="#00ffff" />
      <NeonSign position={[-18, 10, 19.5]} color="#ff00ff" />
      <NeonSign position={[19.5, 8, -18]} color="#ffff00" />
      <NeonSign position={[-19.5, 14, 18]} color="#00ff88" />

      {/* Atmospheric spheres */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={i} position={[
          (Math.cos(i * 0.8) * 60),
          20 + Math.sin(i * 0.5) * 5,
          (Math.sin(i * 0.8) * 60)
        ]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color="#000" emissive={neonColors[i % neonColors.length]} emissiveIntensity={0.3} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}
