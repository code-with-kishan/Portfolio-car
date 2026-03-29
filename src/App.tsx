import { useEffect, useState, useRef } from 'react'
import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { MobileFallback } from './components/MobileFallback'
import { AboutPanel } from './components/panels/AboutPanel'
import { ProjectsPanel } from './components/panels/ProjectsPanel'
import { CertificationsPanel } from './components/panels/CertificationsPanel'
import { QualificationsPanel } from './components/panels/QualificationsPanel'
import { ContactPanel } from './components/panels/ContactPanel'
import { EasterEggNotification } from './components/EasterEggs'
import { Joystick } from './components/Joystick'
import { useGameStore } from './store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

function AudioManager() {
  const musicOn = useGameStore((s) => s.musicOn)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    if (musicOn) {
      audioCtxRef.current = new AudioContext()
      const ctx = audioCtxRef.current
      const notes = [110, 146.83, 164.81, 220]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1 + i * 0.5)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        oscillatorsRef.current.push(osc)
      })
    } else {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch { /* ignore */ }
      })
      oscillatorsRef.current = []
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch { /* ignore */ }
      })
    }
  }, [musicOn])

  return null
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000511',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      zIndex: 1000,
    }}>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#00ffff',
          textShadow: '0 0 30px #00ffff',
          letterSpacing: 6,
          marginBottom: 20,
        }}
      >
        PORTFOLIO.DRIVE
      </motion.div>
      <div style={{ color: '#00ffff66', fontSize: 11, letterSpacing: 3 }}>
        INITIALIZING CITY...
      </div>
      <div style={{
        marginTop: 24,
        width: 200,
        height: 2,
        background: '#001122',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(to right, transparent, #00ffff, transparent)',
          }}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (isMobile) return <MobileFallback />

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#2e7a1c' }}>
      <AnimatePresence>
        {!loaded && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {loaded && (
        <>
          <Scene />
          <HUD />
          <Joystick />
          <AboutPanel />
          <ProjectsPanel />
          <CertificationsPanel />
          <QualificationsPanel />
          <ContactPanel />
          <EasterEggNotification />
          <AudioManager />
        </>
      )}
    </div>
  )
}
