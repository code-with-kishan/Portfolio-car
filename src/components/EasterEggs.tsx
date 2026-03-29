import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { IntersectionEnterPayload } from '@react-three/rapier'
import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

interface EggProps {
  id: string
  position: [number, number, number]
  color: string
}

function EasterEgg({ id, position, color }: EggProps) {
  const meshRef = useRef<Mesh>(null)
  const findEasterEgg = useGameStore((s) => s.findEasterEgg)
  const easterEggsFound = useGameStore((s) => s.easterEggsFound)
  const found = easterEggsFound.includes(id)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
      meshRef.current.rotation.x = state.clock.elapsedTime
      meshRef.current.position.y = position[1] + 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  if (found) return null

  const handleCollect = (_payload: IntersectionEnterPayload) => {
    findEasterEgg(id)
  }

  return (
    <group>
      <RigidBody type="fixed" sensor onIntersectionEnter={handleCollect}>
        <CuboidCollider args={[1, 1, 1]} position={position} />
      </RigidBody>
      <mesh ref={meshRef} position={[position[0], position[1] + 0.5, position[2]]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight position={[position[0], position[1] + 1, position[2]]} color={color} intensity={3} distance={8} />
    </group>
  )
}

const eggs = [
  { id: 'egg1', position: [-15, 1, -15] as [number,number,number], color: '#ff00ff' },
  { id: 'egg2', position: [15, 1, 15] as [number,number,number], color: '#ffff00' },
  { id: 'egg3', position: [-5, 1, 20] as [number,number,number], color: '#00ff88' },
]

export function EasterEggs() {
  return (
    <group>
      {eggs.map((egg) => (
        <EasterEgg key={egg.id} {...egg} />
      ))}
    </group>
  )
}

export function EasterEggNotification() {
  const easterEggsFound = useGameStore((s) => s.easterEggsFound)
  const [visible, setVisible] = useState(false)
  const [shownCount, setShownCount] = useState(0)

  useEffect(() => {
    if (easterEggsFound.length > shownCount) {
      setShownCount(easterEggsFound.length)
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [easterEggsFound.length, shownCount])

  const messages: Record<string, string> = {
    egg1: '🎮 GAMER DETECTED! +100 XP',
    egg2: '⚡ SPEED RACER FOUND! +200 XP',
    egg3: '🌟 EXPLORER ACHIEVEMENT! +150 XP',
  }

  const lastEgg = easterEggsFound[easterEggsFound.length - 1]

  return (
    <AnimatePresence>
      {visible && lastEgg && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,5,15,0.95)',
            border: '1px solid #ffff00',
            borderRadius: 8,
            padding: '12px 24px',
            color: '#ffff00',
            fontFamily: 'monospace',
            fontSize: 14,
            letterSpacing: 2,
            boxShadow: '0 0 20px #ffff0044',
            zIndex: 200,
            pointerEvents: 'none',
          }}
        >
          {messages[lastEgg] || '🥚 EASTER EGG FOUND!'}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
