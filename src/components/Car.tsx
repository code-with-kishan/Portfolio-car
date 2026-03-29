import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Vector3, Group } from 'three'
import { useGameStore } from '../store/gameStore'
import { useCarControls } from '../hooks/useCarControls'

const MAX_SPEED = 20
const ACCELERATION = 18
const TURN_SPEED = 2.2
const DAMPING = 0.90

export function Car() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const carRef = useRef<Group>(null)
  const controls = useCarControls()
  const { camera } = useThree()
  const setSpeed = useGameStore((s) => s.setSpeed)
  const setCarPosition = useGameStore((s) => s.setCarPosition)
  const isPanelOpen = useGameStore((s) => s.isPanelOpen)

  const carRotation = useRef(0)
  const cameraPos = useRef(new Vector3(0, 8, -12))
  const cameraLook = useRef(new Vector3(0, 0, 0))

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return

    const rb = rigidBodyRef.current
    const linvel = rb.linvel()
    const currentSpeed = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z)

    setSpeed(Math.round(currentSpeed * 3.6))

    if (!isPanelOpen) {
      if (controls.current.left) carRotation.current += TURN_SPEED * delta
      if (controls.current.right) carRotation.current -= TURN_SPEED * delta

      const sinR = Math.sin(carRotation.current)
      const cosR = Math.cos(carRotation.current)

      if (controls.current.forward && currentSpeed < MAX_SPEED) {
        rb.applyImpulse({ x: sinR * ACCELERATION * delta, y: 0, z: cosR * ACCELERATION * delta }, true)
      }
      if (controls.current.backward && currentSpeed < MAX_SPEED / 2) {
        rb.applyImpulse({ x: -sinR * ACCELERATION * 0.5 * delta, y: 0, z: -cosR * ACCELERATION * 0.5 * delta }, true)
      }

      if (controls.current.brake || (!controls.current.forward && !controls.current.backward)) {
        rb.setLinvel({ x: linvel.x * DAMPING, y: linvel.y, z: linvel.z * DAMPING }, true)
      }
    }

    if (carRef.current) {
      carRef.current.rotation.y = carRotation.current
    }

    const pos = rb.translation()
    setCarPosition([pos.x, pos.y, pos.z])

    // Camera follow
    const sinR = Math.sin(carRotation.current)
    const cosR = Math.cos(carRotation.current)
    const targetCamPos = new Vector3(
      pos.x - sinR * 10,
      pos.y + 5,
      pos.z - cosR * 10
    )
    cameraPos.current.lerp(targetCamPos, 0.07)
    camera.position.copy(cameraPos.current)

    const lookTarget = new Vector3(pos.x, pos.y + 1, pos.z)
    cameraLook.current.lerp(lookTarget, 0.1)
    camera.lookAt(cameraLook.current)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 1.5, 0]}
      colliders={false}
      linearDamping={0.5}
      angularDamping={5}
      enabledRotations={[false, false, false]}
    >
      <CuboidCollider args={[0.9, 0.4, 2]} position={[0, 0, 0]} />
      <group ref={carRef}>
        {/* Main body */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.8, 0.5, 4.2]} />
          <meshStandardMaterial color="#001a1a" emissive="#00ffff" emissiveIntensity={0.15} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 0.75, -0.3]} castShadow>
          <boxGeometry args={[1.5, 0.5, 2.2]} />
          <meshStandardMaterial color="#002222" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.75, 0.82]}>
          <boxGeometry args={[1.4, 0.45, 0.05]} />
          <meshStandardMaterial color="#00ffff" transparent opacity={0.3} emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Neon underglow */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.85, 0.05, 4.25]} />
          <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={2} color="#000" />
        </mesh>
        {/* Wheels */}
        {([[-1.0, -0.15, 1.4], [1.0, -0.15, 1.4], [-1.0, -0.15, -1.4], [1.0, -0.15, -1.4]] as [number,number,number][]).map((pos, i) => (
          <group key={i} position={pos}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.38, 0.38, 0.28, 20]} />
              <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.38, 0.06, 8, 20]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
            </mesh>
          </group>
        ))}
        {/* Headlights */}
        <pointLight position={[0.6, 0.25, 2.2]} color="#00ffff" intensity={8} distance={20} />
        <pointLight position={[-0.6, 0.25, 2.2]} color="#00ffff" intensity={8} distance={20} />
        <mesh position={[0.65, 0.25, 2.15]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial emissive="#00ffff" emissiveIntensity={8} color="#ffffff" />
        </mesh>
        <mesh position={[-0.65, 0.25, 2.15]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial emissive="#00ffff" emissiveIntensity={8} color="#ffffff" />
        </mesh>
        {/* Tail lights */}
        <mesh position={[0.65, 0.25, -2.15]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#ff0033" emissiveIntensity={5} color="#ff0033" />
        </mesh>
        <mesh position={[-0.65, 0.25, -2.15]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#ff0033" emissiveIntensity={5} color="#ff0033" />
        </mesh>
      </group>
    </RigidBody>
  )
}
