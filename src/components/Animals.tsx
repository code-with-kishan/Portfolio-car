import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Elephant
// ---------------------------------------------------------------------------
function Elephant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.2, 1.5, 3.6]} />
        <meshStandardMaterial color="#9b8b7a" roughness={0.85} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.3, 1.55]}>
        <boxGeometry args={[1.4, 1.25, 1.0]} />
        <meshStandardMaterial color="#9b8b7a" roughness={0.85} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 1.6, 2.15]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.12, 1.6, 8]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.85} />
      </mesh>
      {/* Ears */}
      {([-1, 1] as number[]).map((side, i) => (
        <mesh key={i} position={[side * 0.86, 2.25, 1.35]}>
          <boxGeometry args={[0.12, 0.95, 0.75]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.85} />
        </mesh>
      ))}
      {/* Legs */}
      {([[-0.7, -1.75], [0.7, -1.75], [-0.7, 1.15], [0.7, 1.15]] as [number,number][]).map(([lx,lz],i) => (
        <mesh key={i} position={[lx, 0.55, lz]}>
          <cylinderGeometry args={[0.27, 0.24, 1.25, 8]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.85} />
        </mesh>
      ))}
      {/* Tusks */}
      {([-0.38, 0.38] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.75, 2.25]} rotation={[0.45, 0, i === 0 ? -0.2 : 0.2]}>
          <cylinderGeometry args={[0.06, 0.03, 0.95, 6]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.25} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[0, 1.5, -1.88]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.7, 5]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.85} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Giraffe
// ---------------------------------------------------------------------------
function Giraffe({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Body */}
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[1.2, 1.05, 2.1]} />
        <meshStandardMaterial color="#c8a050" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 4.6, 0.65]} rotation={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 4.2, 6]} />
        <meshStandardMaterial color="#c8a050" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 6.85, 1.1]}>
        <boxGeometry args={[0.52, 0.5, 0.82]} />
        <meshStandardMaterial color="#c8a050" roughness={0.8} />
      </mesh>
      {/* Ossicones */}
      {([-0.16, 0.16] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 7.25, 0.9]}>
          <cylinderGeometry args={[0.04, 0.03, 0.42, 5]} />
          <meshStandardMaterial color="#8b6020" roughness={0.7} />
        </mesh>
      ))}
      {/* Legs */}
      {([[-0.45, -0.72], [0.45, -0.72], [-0.45, 0.72], [0.45, 0.72]] as [number,number][]).map(([lx,lz],i) => (
        <mesh key={i} position={[lx, 0.95, lz]}>
          <cylinderGeometry args={[0.11, 0.09, 2.3, 6]} />
          <meshStandardMaterial color="#c8a050" roughness={0.8} />
        </mesh>
      ))}
      {/* Spots (dark patches on neck) */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[((i % 2) * 2 - 1) * 0.18, 3.5 + i * 0.5, 0.5]}>
          <boxGeometry args={[0.25, 0.25, 0.06]} />
          <meshStandardMaterial color="#7a5010" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Deer
// ---------------------------------------------------------------------------
function Deer({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Body */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.72, 0.62, 1.42]} />
        <meshStandardMaterial color="#c87832" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.58, 0.55]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.6, 6]} />
        <meshStandardMaterial color="#c87832" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.88, 0.75]}>
        <boxGeometry args={[0.36, 0.33, 0.46]} />
        <meshStandardMaterial color="#c87832" roughness={0.8} />
      </mesh>
      {/* Antlers */}
      {([-0.13, 0.13] as number[]).map((x, i) => (
        <group key={i} position={[x, 2.12, 0.74]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.03, 0.52, 4]} />
            <meshStandardMaterial color="#7a5225" roughness={0.7} />
          </mesh>
          <mesh position={[(i === 0 ? -1 : 1) * 0.12, 0.3, 0]} rotation={[0.3, 0, (i === 0 ? 0.6 : -0.6)]}>
            <cylinderGeometry args={[0.02, 0.02, 0.36, 4]} />
            <meshStandardMaterial color="#7a5225" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {([[-0.25, -0.5], [0.25, -0.5], [-0.25, 0.5], [0.25, 0.5]] as [number,number][]).map(([lx,lz],i) => (
        <mesh key={i} position={[lx, 0.47, lz]}>
          <cylinderGeometry args={[0.07, 0.05, 0.92, 6]} />
          <meshStandardMaterial color="#a86428" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Crocodile (near ocean)
// ---------------------------------------------------------------------------
function Crocodile({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Body */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.7, 0.3, 3.0]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.18, 1.7]}>
        <boxGeometry args={[0.55, 0.18, 0.8]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.9} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.14, 2.2]}>
        <boxGeometry args={[0.4, 0.12, 0.55]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.9} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.18, -1.85]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.3, 1.2, 5]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {([[-0.42, -0.9, 0.08], [0.42, -0.9, 0.08], [-0.42, -0.9, -0.3], [0.42, -0.9, -0.3]] as [number,number,number][]).map(([lx,,lz],i) => (
        <mesh key={i} position={[lx, 0.1, lz]} rotation={[0, 0, (lx < 0 ? -1 : 1) * 0.55]}>
          <cylinderGeometry args={[0.07, 0.06, 0.5, 5]} />
          <meshStandardMaterial color="#305520" roughness={0.9} />
        </mesh>
      ))}
      {/* Back ridges */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.37, -0.8 + i * 0.35]}>
          <coneGeometry args={[0.08, 0.22, 4]} />
          <meshStandardMaterial color="#2a5020" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Camel (desert)
// ---------------------------------------------------------------------------
function Camel({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Body */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[1.1, 1.1, 2.4]} />
        <meshStandardMaterial color="#c89060" roughness={0.85} />
      </mesh>
      {/* Hump */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.55, 6, 5]} />
        <meshStandardMaterial color="#b87a50" roughness={0.85} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.0, 1.1]} rotation={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 1.1, 6]} />
        <meshStandardMaterial color="#c89060" roughness={0.85} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.6, 1.65]}>
        <boxGeometry args={[0.5, 0.46, 0.7]} />
        <meshStandardMaterial color="#c89060" roughness={0.85} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 2.42, 1.98]}>
        <boxGeometry args={[0.38, 0.3, 0.3]} />
        <meshStandardMaterial color="#b87a50" roughness={0.85} />
      </mesh>
      {/* Legs */}
      {([[-0.4, -0.95], [0.4, -0.95], [-0.4, 0.95], [0.4, 0.95]] as [number,number][]).map(([lx,lz],i) => (
        <mesh key={i} position={[lx, 0.6, lz]}>
          <cylinderGeometry args={[0.13, 0.11, 1.3, 6]} />
          <meshStandardMaterial color="#b87a50" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Birds — animated, flying in circles
// ---------------------------------------------------------------------------
const BIRDS = [
  { cx: 8,   cy: 13, cz: -8,  r: 9,  speed: 0.8, phase: 0 },
  { cx: -14, cy: 11, cz: 4,   r: 6,  speed: 1.1, phase: 1.5 },
  { cx: 5,   cy: 16, cz: 20,  r: 11, speed: 0.6, phase: 3 },
  { cx: -20, cy: 9,  cz: -22, r: 7,  speed: 0.9, phase: 2 },
  { cx: 28,  cy: 12, cz: 10,  r: 5,  speed: 1.3, phase: 0.5 },
  { cx: -5,  cy: 14, cz: -15, r: 8,  speed: 0.75, phase: 4 },
]

function Birds() {
  const groupRefs    = useRef<(THREE.Group | null)[]>(BIRDS.map(() => null))
  const lwingRefs    = useRef<(THREE.Mesh  | null)[]>(BIRDS.map(() => null))
  const rwingRefs    = useRef<(THREE.Mesh  | null)[]>(BIRDS.map(() => null))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    BIRDS.forEach((b, i) => {
      const g = groupRefs.current[i]; if (!g) return
      const ang = t * b.speed + b.phase
      g.position.set(
        b.cx + Math.cos(ang) * b.r,
        b.cy + Math.sin(ang * 1.8) * 0.6,
        b.cz + Math.sin(ang) * b.r,
      )
      g.rotation.y = -ang + Math.PI / 2

      const flap = Math.sin(t * 7 + b.phase) * 0.42
      const lw = lwingRefs.current[i]; if (lw) lw.rotation.z =  flap + 0.15
      const rw = rwingRefs.current[i]; if (rw) rw.rotation.z = -flap - 0.15
    })
  })

  return (
    <>
      {BIRDS.map((_, i) => (
        <group key={i} ref={el => { groupRefs.current[i] = el }}>
          {/* Body */}
          <mesh>
            <sphereGeometry args={[0.14, 5, 4]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          {/* Left wing */}
          <mesh ref={el => { lwingRefs.current[i] = el }} position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.42, 0.04, 0.14]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Right wing */}
          <mesh ref={el => { rwingRefs.current[i] = el }} position={[0.2, 0, 0]}>
            <boxGeometry args={[0.42, 0.04, 0.14]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function Animals() {
  return (
    <group>
      {/* Elephants — savanna-side east */}
      <Elephant position={[58, 0, -5]} />
      <Elephant position={[65, 0, 12]} />

      {/* Giraffes */}
      <Giraffe position={[52, 0, -18]} rotY={0.4} />
      <Giraffe position={[70, 0, 5]}   rotY={-0.6} />

      {/* Deer — scattered in jungle */}
      <Deer position={[-18, 0, -10]} rotY={1.0} />
      <Deer position={[  8, 0,  18]} rotY={-0.5} />
      <Deer position={[-35, 0,  15]} rotY={2.1} />
      <Deer position={[ 20, 0, -18]} rotY={0.8} />
      <Deer position={[-12, 0,  38]} rotY={-1.2} />

      {/* Crocodiles — near ocean shoreline */}
      <Crocodile position={[-20, 0.02, -52]} rotY={0.3} />
      <Crocodile position={[ 15, 0.02, -54]} rotY={-0.5} />

      {/* Camels — desert */}
      <Camel position={[-15, 0, 65]} rotY={0.6} />
      <Camel position={[ 25, 0, 72]} rotY={-0.3} />
      <Camel position={[  5, 0, 80]} rotY={1.2} />

      {/* Birds */}
      <Birds />
    </group>
  )
}
