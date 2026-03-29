import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Vector3, Group } from 'three'
import { useGameStore } from '../store/gameStore'
import { useCarControls } from '../hooks/useCarControls'
import { joystickState } from '../store/joystickState'

// ── Physics constants ────────────────────────────────────────────────────────
const MAX_SPEED   = 24   // m/s  (~86 km/h)
const ACCELERATION= 14   // m/s² per second  (smooth ramp-up)
const DECEL_COAST = 6    // m/s² (release key)
const DECEL_BRAKE = 20   // m/s² (brake key)
const TURN_SPEED  = 1.9  // rad/s at full speed
const DEADZONE    = 0.12

// ── Jeep body colour ────────────────────────────────────────────────────────
const JEEP_GREEN = '#3d5a2a'
const JEEP_DARK  = '#2a3d1e'
const METAL      = '#1a1a1a'

// ── Driver character ─────────────────────────────────────────────────────────
function Driver() {
  return (
    <group position={[0, 0.6, -0.1]}>
      {/* Torso */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.48, 0.55, 0.28]} />
        <meshStandardMaterial color="#6a9a60" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.34, 0.34, 0.34]} />
        <meshStandardMaterial color="#c8966a" roughness={0.7} />
      </mesh>
      {/* Safari helmet */}
      <mesh position={[0, 1.22, 0.02]}>
        <cylinderGeometry args={[0.26, 0.38, 0.16, 8]} />
        <meshStandardMaterial color="#c8a030" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.18, 0.02]}>
        <cylinderGeometry args={[0.19, 0.22, 0.2, 8]} />
        <meshStandardMaterial color="#c8a030" roughness={0.7} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 1.0, 0.17]}>
        <boxGeometry args={[0.07, 0.06, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.1, 1.0, 0.17]}>
        <boxGeometry args={[0.07, 0.06, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Arms */}
      {([-0.35, 0.35] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.42, 0.06]} rotation={[0.2, 0, (x < 0 ? 0.25 : -0.25)]}>
          <boxGeometry args={[0.12, 0.44, 0.12]} />
          <meshStandardMaterial color="#c8966a" roughness={0.7} />
        </mesh>
      ))}
      {/* Legs (hips hidden by seat) */}
      {([-0.14, 0.14] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.14, 0.42, 0.14]} />
          <meshStandardMaterial color="#4a5a30" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ── Jeep mesh ────────────────────────────────────────────────────────────────
function JeepBody() {
  return (
    <group>
      {/* Chassis / lower body */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[2.05, 0.42, 4.5]} />
        <meshStandardMaterial color={JEEP_GREEN} roughness={0.75} metalness={0.25} />
      </mesh>

      {/* Upper cabin shell (open-top) */}
      <mesh position={[0, 0.84, -0.3]} castShadow>
        <boxGeometry args={[1.95, 0.72, 2.75]} />
        <meshStandardMaterial color={JEEP_DARK} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Windshield (near-vertical) */}
      <mesh position={[0, 1.08, 1.08]}>
        <boxGeometry args={[1.82, 0.72, 0.07]} />
        <meshStandardMaterial color="#88c4ff" transparent opacity={0.38} roughness={0.1} metalness={0.2} />
      </mesh>

      {/* Roll cage — horizontal top bar */}
      <mesh position={[0, 1.55, -0.3]}>
        <boxGeometry args={[1.9, 0.08, 2.7]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Roll cage — 4 vertical corner pillars */}
      {([[-0.92, 0.72, 0.95], [0.92, 0.72, 0.95], [-0.92, 0.72, -1.58], [0.92, 0.72, -1.58]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 1.44, 6]} />
          <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* Front bumper */}
      <mesh position={[0, 0.28, 2.38]}>
        <boxGeometry args={[2.0, 0.3, 0.2]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Front bull-bar */}
      <mesh position={[0, 0.6, 2.38]}>
        <boxGeometry args={[1.6, 0.1, 0.1]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Spare tyre on rear */}
      <group position={[0, 0.7, -2.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.46, 0.16, 8, 18]} />
          <meshStandardMaterial color="#222" roughness={0.95} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 8]} />
          <meshStandardMaterial color="#333" metalness={0.5} />
        </mesh>
      </group>

      {/* Wheels × 4 — big off-road style */}
      {([[-1.12, 0.0, 1.55], [1.12, 0.0, 1.55], [-1.12, 0.0, -1.55], [1.12, 0.0, -1.55]] as [number,number,number][]).map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tyre */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.52, 0.52, 0.36, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
          </mesh>
          {/* Hubcap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.38, 6]} />
            <meshStandardMaterial color="#555" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Tyre sidewall ring */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.52, 0.04, 6, 18]} />
            <meshStandardMaterial color="#333" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <pointLight position={[ 0.7, 0.45, 2.6]} color="#fffde0" intensity={10} distance={28} />
      <pointLight position={[-0.7, 0.45, 2.6]} color="#fffde0" intensity={10} distance={28} />
      <mesh position={[ 0.72, 0.45, 2.42]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial emissive="#ffffaa" emissiveIntensity={8} color="#fff" />
      </mesh>
      <mesh position={[-0.72, 0.45, 2.42]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial emissive="#ffffaa" emissiveIntensity={8} color="#fff" />
      </mesh>

      {/* Headlight bar (LED strip) */}
      <mesh position={[0, 0.78, 2.38]}>
        <boxGeometry args={[1.5, 0.08, 0.06]} />
        <meshStandardMaterial emissive="#ffffff" emissiveIntensity={3} color="#fff" />
      </mesh>

      {/* Tail lights */}
      <mesh position={[ 0.72, 0.45, -2.32]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial emissive="#ff2200" emissiveIntensity={5} color="#ff2200" />
      </mesh>
      <mesh position={[-0.72, 0.45, -2.32]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial emissive="#ff2200" emissiveIntensity={5} color="#ff2200" />
      </mesh>

      {/* Rooftop light bar (safari) */}
      <mesh position={[0, 1.62, -0.3]}>
        <boxGeometry args={[1.3, 0.1, 0.3]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.3, 1.72, -0.28]}>
          <sphereGeometry args={[0.06, 5, 5]} />
          <meshStandardMaterial emissive="#ffdd44" emissiveIntensity={4} color="#ffdd44" />
        </mesh>
      ))}
    </group>
  )
}

// ── Car + Physics controller ─────────────────────────────────────────────────
export function Car() {
  const rigidBodyRef  = useRef<RapierRigidBody>(null)
  const carRef        = useRef<Group>(null)
  const controls      = useCarControls()
  const { camera }    = useThree()
  const setSpeed      = useGameStore((s) => s.setSpeed)
  const setCarPos     = useGameStore((s) => s.setCarPosition)
  const isPanelOpen   = useGameStore((s) => s.isPanelOpen)

  const carYaw        = useRef(0)
  const vehicleSpeed  = useRef(0)       // signed longitudinal speed  m/s
  const camPos        = useRef(new Vector3(0, 8, -14))
  const camLook       = useRef(new Vector3(0, 0, 0))
  const lastSpeedKmh  = useRef(0)
  const prevPosX      = useRef(0)
  const prevPosZ      = useRef(0)

  useFrame((_, rawDelta) => {
    const rb = rigidBodyRef.current
    if (!rb) return

    // Cap delta to avoid huge physics steps after tab-switch
    const dt = Math.min(rawDelta, 0.05)

    const linvel = rb.linvel()
    const pos    = rb.translation()

    // ── Update car mesh rotation ─────────────────────────────────────────
    if (carRef.current) carRef.current.rotation.y = carYaw.current

    // ── Camera follow ────────────────────────────────────────────────────
    const sinY = Math.sin(carYaw.current)
    const cosY = Math.cos(carYaw.current)

    const targetCam = new Vector3(
      pos.x - sinY * 12,
      pos.y + 6,
      pos.z - cosY * 12,
    )
    camPos.current.lerp(targetCam, 0.09)
    camera.position.copy(camPos.current)

    const lookTarget = new Vector3(pos.x + sinY * 4, pos.y + 1.2, pos.z + cosY * 4)
    camLook.current.lerp(lookTarget, 0.12)
    camera.lookAt(camLook.current)

    // ── Update store (throttled) ─────────────────────────────────────────
    if (Math.abs(pos.x - prevPosX.current) > 0.12 || Math.abs(pos.z - prevPosZ.current) > 0.12) {
      setCarPos([pos.x, pos.y, pos.z])
      prevPosX.current = pos.x
      prevPosZ.current = pos.z
    }

    // ── Panel-open → heavy damping, no driving ───────────────────────────
    if (isPanelOpen) {
      vehicleSpeed.current *= 0.7
      rb.setLinvel({ x: linvel.x * 0.7, y: linvel.y, z: linvel.z * 0.7 }, true)
      return
    }

    // ── Read combined keyboard + joystick input ──────────────────────────
    const jx = joystickState.x
    const jy = joystickState.y
    const fwd  = controls.current.forward  || jy >  DEADZONE
    const bwd  = controls.current.backward || jy < -DEADZONE
    const left = controls.current.left     || jx < -DEADZONE
    const rgt  = controls.current.right    || jx >  DEADZONE
    const brk  = controls.current.brake    || joystickState.brake

    // ── Steering (speed-dependent, less sensitive when slow) ─────────────
    const absSpd = Math.abs(vehicleSpeed.current)
    const turnFactor = Math.min(absSpd / 5 + 0.3, 1.0)
    const steerDir   = left ? 1 : rgt ? -1 : 0
    carYaw.current  += steerDir * TURN_SPEED * turnFactor * dt

    // ── Longitudinal speed update ────────────────────────────────────────
    const maxFwd = MAX_SPEED * (jy > DEADZONE ? Math.abs(jy) : 1.0)

    if (fwd) {
      vehicleSpeed.current = Math.min(vehicleSpeed.current + ACCELERATION * dt, maxFwd)
    } else if (bwd) {
      vehicleSpeed.current = Math.max(vehicleSpeed.current - ACCELERATION * 0.55 * dt, -MAX_SPEED * 0.4)
    } else if (brk) {
      const sign = Math.sign(vehicleSpeed.current)
      vehicleSpeed.current -= sign * DECEL_BRAKE * dt
      if (sign !== Math.sign(vehicleSpeed.current)) vehicleSpeed.current = 0
    } else {
      // Coast deceleration
      const sign = Math.sign(vehicleSpeed.current)
      vehicleSpeed.current -= sign * DECEL_COAST * dt
      if (sign !== Math.sign(vehicleSpeed.current)) vehicleSpeed.current = 0
    }

    // ── Apply velocity ───────────────────────────────────────────────────
    const sinR = Math.sin(carYaw.current)
    const cosR = Math.cos(carYaw.current)

    // Project existing velocity onto the car's perpendicular (lateral) axis.
    // fwdDot = how fast we're moving in the forward direction.
    // lateralX/Z = velocity component perpendicular to heading — damped to
    // prevent sliding/drifting while still allowing smooth turns.
    const fwdDot = linvel.x * sinR + linvel.z * cosR
    const lateralX = linvel.x - sinR * fwdDot
    const lateralZ = linvel.z - cosR * fwdDot

    rb.setLinvel({
      x: sinR * vehicleSpeed.current + lateralX * 0.72,
      y: linvel.y,
      z: cosR * vehicleSpeed.current + lateralZ * 0.72,
    }, true)

    // ── Speed display (throttled) ────────────────────────────────────────
    const kmh = Math.round(Math.abs(vehicleSpeed.current) * 3.6)
    if (kmh !== lastSpeedKmh.current) {
      lastSpeedKmh.current = kmh
      setSpeed(kmh)
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 1.8, 0]}
      colliders={false}
      linearDamping={0.4}
      angularDamping={8}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider args={[1.0, 0.52, 2.2]} position={[0, 0, 0]} />
      <group ref={carRef}>
        <JeepBody />
        <Driver />
      </group>
    </RigidBody>
  )
}
