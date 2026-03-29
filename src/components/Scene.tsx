import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Stars } from '@react-three/drei'
import { Car } from './Car'
import { City } from './City'
import { Checkpoints } from './Checkpoints'
import { EasterEggs } from './EasterEggs'
import { Suspense } from 'react'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 8, -12], fov: 75 }}
      style={{ background: '#000005' }}
      shadows
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} castShadow />
        <pointLight position={[0, 30, 0]} color="#0044ff" intensity={0.5} distance={100} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
        {/* @ts-ignore */}
        <fog attach="fog" args={['#000511', 40, 120]} />
        <Physics gravity={[0, -20, 0]}>
          <Car />
          <City />
          <Checkpoints />
          <EasterEggs />
        </Physics>
      </Suspense>
    </Canvas>
  )
}
