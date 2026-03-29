import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'

// ---------------------------------------------------------------------------
// Deterministic pseudo-random (LCG) — same world every reload
// ---------------------------------------------------------------------------
function makeLCG(initSeed: number) {
  let s = initSeed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

// ---------------------------------------------------------------------------
// Checkpoint positions to avoid overlapping with trees
// ---------------------------------------------------------------------------
const AVOID_XZ: [number, number][] = [
  [0, -30], [30, 0], [-30, 0], [0, 30], [25, -25], [0, 0],
]
function clearOfCheckpoints(x: number, z: number, r = 11) {
  return AVOID_XZ.every(([cx, cz]) => Math.hypot(x - cx, z - cz) > r)
}

// ---------------------------------------------------------------------------
// Pre-compute object positions (module-level — runs once per page load)
// ---------------------------------------------------------------------------

// Jungle trees  (z ∈ -50..50, x ∈ -88..88)
const junglePos: [number, number, number][] = []
{
  const rnd = makeLCG(42)
  while (junglePos.length < 235) {
    const x = rnd() * 176 - 88
    const z = rnd() * 100 - 50
    if (clearOfCheckpoints(x, z)) junglePos.push([x, 0, z])
  }
}

// Inner-ring trees (ring around playfield perimeter)
const innerPos: [number, number, number][] = []
{
  const rnd = makeLCG(99)
  while (innerPos.length < 45) {
    const angle = rnd() * Math.PI * 2
    const r = 36 + rnd() * 15
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    if (clearOfCheckpoints(x, z)) innerPos.push([x, 0, z])
  }
}

// Palm trees (ocean transition zone, z ∈ -85..-52)
const palmPos: [number, number, number][] = []
{
  const rnd = makeLCG(7)
  for (let i = 0; i < 50; i++) {
    palmPos.push([rnd() * 190 - 95, 0, -52 - rnd() * 33])
  }
}

// Desert cacti (z ∈ 52..88)
const cactusPos: [number, number, number][] = []
{
  const rnd = makeLCG(13)
  for (let i = 0; i < 32; i++) {
    cactusPos.push([rnd() * 190 - 95, 0, 52 + rnd() * 36])
  }
}

// Rocks
const rockPos: [number, number, number][] = []
{
  const rnd = makeLCG(55)
  while (rockPos.length < 30) {
    const x = rnd() * 160 - 80
    const z = rnd() * 100 - 50
    if (clearOfCheckpoints(x, z, 6)) rockPos.push([x, 0, z])
  }
}

const JUNGLE_N = junglePos.length
const INNER_N  = innerPos.length
const PALM_N   = palmPos.length
const CACTUS_N = cactusPos.length

// ---------------------------------------------------------------------------
// Helper: set instanced matrix from TRS
// ---------------------------------------------------------------------------
function setIM(
  mesh: THREE.InstancedMesh, i: number,
  px: number, py: number, pz: number,
  sx: number, sy: number, sz: number,
  rotY = 0,
) {
  const p = new THREE.Vector3(px, py, pz)
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0))
  const s = new THREE.Vector3(sx, sy, sz)
  mesh.setMatrixAt(i, new THREE.Matrix4().compose(p, q, s))
}

// ---------------------------------------------------------------------------
// Jungle trees — trunk + two foliage layers (InstancedMesh)
// ---------------------------------------------------------------------------
function JungleTrees({
  positions, seed,
}: {
  positions: [number, number, number][]
  seed: number
}) {
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const leaf1Ref = useRef<THREE.InstancedMesh>(null)
  const leaf2Ref = useRef<THREE.InstancedMesh>(null)
  const n = positions.length

  useEffect(() => {
    if (!trunkRef.current || !leaf1Ref.current || !leaf2Ref.current) return
    const rnd = makeLCG(seed)
    positions.forEach((pos, i) => {
      const sc = 0.65 + rnd() * 0.75
      const ry = rnd() * Math.PI * 2
      setIM(trunkRef.current!, i, pos[0], sc * 1.55, pos[2], sc * 0.9, sc, sc * 0.9, ry)
      setIM(leaf1Ref.current!, i, pos[0], sc * 4.2,  pos[2], sc * 1.8, sc * 1.6, sc * 1.8, ry)
      setIM(leaf2Ref.current!, i, pos[0], sc * 5.8,  pos[2], sc * 1.2, sc * 1.1, sc * 1.2, ry + 0.5)
    })
    trunkRef.current.instanceMatrix.needsUpdate = true
    leaf1Ref.current.instanceMatrix.needsUpdate = true
    leaf2Ref.current.instanceMatrix.needsUpdate = true
  }, [positions, seed])

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, n]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.38, 3, 6]} />
        <meshStandardMaterial color="#6b4226" roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={leaf1Ref} args={[undefined, undefined, n]}>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial color="#1e6b0a" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={leaf2Ref} args={[undefined, undefined, n]}>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial color="#2d8a14" roughness={0.85} />
      </instancedMesh>
    </>
  )
}

// ---------------------------------------------------------------------------
// Palm trees
// ---------------------------------------------------------------------------
function PalmTrees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const leafRef  = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!trunkRef.current || !leafRef.current) return
    const rnd = makeLCG(7)
    palmPos.forEach((pos, i) => {
      const sc   = 0.8 + rnd() * 0.6
      const tilt = (rnd() - 0.5) * 0.35
      const ry   = rnd() * Math.PI * 2
      const qTrunk = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(tilt, ry, 0))
      trunkRef.current!.setMatrixAt(
        i,
        new THREE.Matrix4().compose(
          new THREE.Vector3(pos[0], sc * 3, pos[2]),
          qTrunk,
          new THREE.Vector3(sc * 0.5, sc, sc * 0.5),
        ),
      )
      setIM(leafRef.current!, i, pos[0], sc * 6.5, pos[2], sc * 2.2, sc * 0.5, sc * 2.2, ry)
    })
    trunkRef.current.instanceMatrix.needsUpdate = true
    leafRef.current.instanceMatrix.needsUpdate  = true
  }, [])

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, PALM_N]} receiveShadow>
        <cylinderGeometry args={[0.14, 0.22, 6, 6]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[undefined, undefined, PALM_N]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial color="#1a7a10" roughness={0.8} />
      </instancedMesh>
    </>
  )
}

// ---------------------------------------------------------------------------
// Desert cacti (body + two arms)
// ---------------------------------------------------------------------------
function DesertCacti() {
  const bodyRef = useRef<THREE.InstancedMesh>(null)
  const arm1Ref = useRef<THREE.InstancedMesh>(null)
  const arm2Ref = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!bodyRef.current || !arm1Ref.current || !arm2Ref.current) return
    const rnd = makeLCG(13)
    cactusPos.forEach((pos, i) => {
      const sc  = 0.6 + rnd() * 0.8
      const ox  = 0.55 * sc
      setIM(bodyRef.current!, i, pos[0],    sc * 1.55, pos[2], sc * 0.5, sc, sc * 0.5)
      setIM(arm1Ref.current!, i, pos[0]-ox, sc * 1.8,  pos[2], sc * 0.3, sc * 0.55, sc * 0.3)
      setIM(arm2Ref.current!, i, pos[0]+ox, sc * 1.5,  pos[2], sc * 0.3, sc * 0.45, sc * 0.3)
    })
    bodyRef.current.instanceMatrix.needsUpdate = true
    arm1Ref.current.instanceMatrix.needsUpdate = true
    arm2Ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, CACTUS_N]}>
        <cylinderGeometry args={[0.28, 0.32, 3, 7]} />
        <meshStandardMaterial color="#3a7a20" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={arm1Ref} args={[undefined, undefined, CACTUS_N]}>
        <cylinderGeometry args={[0.18, 0.2, 1.6, 6]} />
        <meshStandardMaterial color="#3a7a20" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={arm2Ref} args={[undefined, undefined, CACTUS_N]}>
        <cylinderGeometry args={[0.18, 0.2, 1.3, 6]} />
        <meshStandardMaterial color="#3a7a20" roughness={0.7} />
      </instancedMesh>
    </>
  )
}

// ---------------------------------------------------------------------------
// Rocks
// ---------------------------------------------------------------------------
function Rocks() {
  const ref = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!ref.current) return
    const rnd = makeLCG(55)
    rockPos.forEach((pos, i) => {
      const sc = 0.3 + rnd() * 0.9
      setIM(ref.current!, i, pos[0], sc * 0.35, pos[2], sc, sc * 0.65, sc, rnd() * Math.PI)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, rockPos.length]} receiveShadow>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#7a7060" roughness={0.95} />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------
// Animated ocean surface
// ---------------------------------------------------------------------------
function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null)
  const tRef = useRef(0)
  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 0.032
      const t = tRef.current
      if (meshRef.current) {
        const geo = meshRef.current.geometry as THREE.PlaneGeometry
        const pos = geo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          const z = pos.getZ(i)
          pos.setY(i, Math.sin(x * 0.15 + t) * 0.3 + Math.cos(z * 0.1 + t * 0.7) * 0.2)
        }
        pos.needsUpdate = true
        geo.computeVertexNormals()
      }
    }, 50)
    return () => clearInterval(id)
  }, [])

  return (
    <mesh ref={meshRef} position={[0, 0.08, -128]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[400, 160, 32, 20]} />
      <meshStandardMaterial color="#1565a8" roughness={0.08} metalness={0.18} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Coloured ground circles at checkpoint locations
// ---------------------------------------------------------------------------
function CheckpointClearings() {
  const spots: [number, number, number][] = [
    [0, 0.01, -30], [30, 0.01, 0], [-30, 0.01, 0],
    [0, 0.01, 30],  [25, 0.01, -25],
  ]
  const colours = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88', '#ff4400']
  return (
    <group>
      {spots.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5.5, 24]} />
          <meshStandardMaterial color={colours[i]} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Main world export (kept as "City" so Scene.tsx import doesn't change)
// ---------------------------------------------------------------------------
export function City() {
  const rndA = makeLCG(300)
  const rndB = makeLCG(400)

  return (
    <group>
      {/* Ground physics collider */}
      <RigidBody type="fixed">
        <CuboidCollider args={[200, 0.5, 200]} position={[0, -0.5, 0]} />
      </RigidBody>

      {/* Invisible boundary walls */}
      <RigidBody type="fixed">
        <CuboidCollider args={[200, 6, 1]} position={[0,   4,  92]} />
        <CuboidCollider args={[200, 6, 1]} position={[0,   4, -92]} />
        <CuboidCollider args={[1,   6, 200]} position={[ 92, 4, 0]} />
        <CuboidCollider args={[1,   6, 200]} position={[-92, 4, 0]} />
      </RigidBody>

      {/* ── Base ground plane ─────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#2e7a1c" roughness={0.95} />
      </mesh>

      {/* ── Ocean floor (static base) ─────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -128]}>
        <planeGeometry args={[400, 160]} />
        <meshStandardMaterial color="#0d4f8a" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* ── Animated ocean surface ────────────────────── */}
      <Ocean />

      {/* ── Sandy shoreline ───────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -55]}>
        <planeGeometry args={[400, 10]} />
        <meshStandardMaterial color="#e8d0a0" roughness={0.9} />
      </mesh>

      {/* ── Desert ground ─────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 126]}>
        <planeGeometry args={[400, 160]} />
        <meshStandardMaterial color="#d4a857" roughness={0.95} />
      </mesh>

      {/* Desert-jungle transition strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 56]}>
        <planeGeometry args={[400, 12]} />
        <meshStandardMaterial color="#c8b46e" roughness={0.9} />
      </mesh>

      {/* ── Sand dunes ────────────────────────────────── */}
      {Array.from({ length: 14 }, (_, i) => {
        const rnd = makeLCG(200 + i)
        return (
          <mesh
            key={i}
            position={[rnd() * 180 - 90, 0.4, 62 + rnd() * 28]}
            rotation={[-Math.PI / 2, 0, rnd() * Math.PI]}
          >
            <capsuleGeometry args={[1.5 + rnd() * 2.5, 5 + rnd() * 10, 4, 8]} />
            <meshStandardMaterial color="#c8a04a" roughness={0.95} />
          </mesh>
        )
      })}

      {/* ── Vegetation ────────────────────────────────── */}
      <JungleTrees positions={junglePos} seed={42} />
      <JungleTrees positions={innerPos}  seed={101} />
      <PalmTrees />
      <DesertCacti />
      <Rocks />

      {/* ── Checkpoint clearings ──────────────────────── */}
      <CheckpointClearings />

      {/* ── Jungle floor patches ──────────────────────── */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = rndA() * 140 - 70
        const z = rndA() * 90  - 45
        if (!clearOfCheckpoints(x, z, 5)) return null
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, rndA() * Math.PI]} position={[x, 0.015, z]}>
            <circleGeometry args={[2 + rndA() * 4, 7]} />
            <meshStandardMaterial color="#1a5c09" transparent opacity={0.5} roughness={1} />
          </mesh>
        )
      })}

      {/* ── Tropical flowers ──────────────────────────── */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = rndB() * 150 - 75
        const z = rndB() * 96  - 48
        if (!clearOfCheckpoints(x, z, 4)) return null
        const cols = ['#ff4488', '#ffcc00', '#ff6600', '#cc44ff', '#44ffcc', '#ff99aa']
        return (
          <mesh key={i} position={[x, 0.06, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3 + rndB() * 0.6, 6]} />
            <meshStandardMaterial
              color={cols[i % 6]}
              emissive={cols[i % 6]}
              emissiveIntensity={0.35}
            />
          </mesh>
        )
      })}
    </group>
  )
}
