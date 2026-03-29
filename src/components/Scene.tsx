import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Car } from './Car'
import { City } from './City'
import { Checkpoints } from './Checkpoints'
import { EasterEggs } from './EasterEggs'
import { Animals } from './Animals'
import { Suspense } from 'react'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 8, -14], fov: 72 }}
      style={{ background: '#87ceeb' }}
      shadows
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{ powerPreference: 'high-performance', antialias: true }}
    >
      <Suspense fallback={null}>
        {/* Daylight */}
        <ambientLight intensity={0.75} color="#fff8ee" />
        <directionalLight
          position={[30, 55, 20]}
          intensity={2.0}
          color="#fff5dd"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={160}
          shadow-camera-near={1}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
        />
        {/* Soft fill from opposite side */}
        <directionalLight position={[-20, 20, -30]} intensity={0.4} color="#cce8ff" />

        {/* Sun visual */}
        <mesh position={[30, 55, 20]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#ffffaa" />
        </mesh>

        {/* @ts-ignore */}
        <fog attach="fog" args={['#b8e0f7', 55, 150]} />

        <Physics gravity={[0, -20, 0]} timeStep="vary">
          <Car />
          <City />
          <Checkpoints />
          <EasterEggs />
          <Animals />
        </Physics>
      </Suspense>
    </Canvas>
  )
}
