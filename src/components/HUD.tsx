import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

function Speedometer({ speed }: { speed: number }) {
  const maxSpeed = 120
  const angle = (speed / maxSpeed) * 240 - 120

  return (
    <div style={{
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 140,
      height: 140,
      background: 'radial-gradient(circle, #001a2e 60%, #003355 100%)',
      borderRadius: '50%',
      border: '2px solid #00ffff',
      boxShadow: '0 0 20px #00ffff55, inset 0 0 20px #00000088',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      {Array.from({ length: 13 }, (_, i) => {
        const tickAngle = (-120 + i * 20) * (Math.PI / 180)
        const r = 58
        const x = 70 + Math.cos(tickAngle) * r
        const y = 70 + Math.sin(tickAngle) * r
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x - 1,
            top: y - 1,
            width: i % 3 === 0 ? 6 : 3,
            height: i % 3 === 0 ? 6 : 3,
            background: '#00ffff',
            borderRadius: '50%',
            opacity: i % 3 === 0 ? 1 : 0.5,
          }} />
        )
      })}
      <div style={{
        position: 'absolute',
        width: 2,
        height: 50,
        background: 'linear-gradient(to top, #00ffff, transparent)',
        bottom: '50%',
        left: '50%',
        transformOrigin: 'bottom center',
        transform: `translateX(-50%) rotate(${angle}deg)`,
        transition: 'transform 0.1s ease',
        borderRadius: 2,
      }} />
      <div style={{
        position: 'absolute',
        width: 10,
        height: 10,
        background: '#00ffff',
        borderRadius: '50%',
        boxShadow: '0 0 8px #00ffff',
      }} />
      <div style={{
        marginTop: 60,
        color: '#00ffff',
        fontSize: 22,
        fontWeight: 'bold',
        textShadow: '0 0 10px #00ffff',
      }}>
        {speed}
      </div>
      <div style={{ color: '#00cccc', fontSize: 9, marginTop: -4 }}>KM/H</div>
    </div>
  )
}

function Minimap() {
  const carPosition = useGameStore((s) => s.carPosition)
  const checkpoints = [
    { pos: [0, -30], color: '#00ffff' },
    { pos: [30, 0], color: '#ff00ff' },
    { pos: [-30, 0], color: '#ffff00' },
    { pos: [0, 30], color: '#00ff88' },
    { pos: [25, -25], color: '#ff4400' },
  ]
  const SCALE = 1.2
  const CENTER = 50

  return (
    <div style={{
      position: 'absolute',
      bottom: 30,
      left: 30,
      width: 100,
      height: 100,
      background: 'rgba(0,10,20,0.85)',
      border: '1px solid #00ffff55',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {[25, 50, 75].map(p => (
          <div key={p}>
            <div style={{ position: 'absolute', left: `${p}%`, top: 0, width: 1, height: '100%', background: '#00ffff11' }} />
            <div style={{ position: 'absolute', top: `${p}%`, left: 0, height: 1, width: '100%', background: '#00ffff11' }} />
          </div>
        ))}
        {checkpoints.map((cp, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: CENTER + cp.pos[0] * SCALE - 3,
            top: CENTER + cp.pos[1] * SCALE - 3,
            width: 6,
            height: 6,
            background: cp.color,
            borderRadius: '50%',
            boxShadow: `0 0 4px ${cp.color}`,
          }} />
        ))}
        <div style={{
          position: 'absolute',
          left: CENTER + carPosition[0] * SCALE - 4,
          top: CENTER + carPosition[2] * SCALE - 4,
          width: 8,
          height: 8,
          background: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 6px #ffffff',
          zIndex: 10,
        }} />
      </div>
      <div style={{
        position: 'absolute',
        top: 3,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#00ffff',
        fontSize: 8,
        fontFamily: 'monospace',
        letterSpacing: 1,
      }}>MINIMAP</div>
    </div>
  )
}

export function HUD() {
  const speed = useGameStore((s) => s.speed)
  const musicOn = useGameStore((s) => s.musicOn)
  const toggleMusic = useGameStore((s) => s.toggleMusic)
  const easterEggsFound = useGameStore((s) => s.easterEggsFound)
  const isPanelOpen = useGameStore((s) => s.isPanelOpen)
  const activeZone = useGameStore((s) => s.activeZone)

  const zoneLabels: Record<string, { label: string; color: string }> = {
    about: { label: 'ABOUT ME', color: '#00ffff' },
    projects: { label: 'PROJECTS', color: '#ff00ff' },
    certifications: { label: 'CERTIFICATIONS', color: '#ffff00' },
    qualifications: { label: 'QUALIFICATIONS', color: '#00ff88' },
    contact: { label: 'CONTACT', color: '#ff4400' },
  }

  const currentZone = activeZone ? zoneLabels[activeZone] : null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(0,0,10,0.8), transparent)',
      }}>
        <div style={{
          color: '#00ffff',
          fontFamily: 'monospace',
          fontSize: 18,
          fontWeight: 'bold',
          textShadow: '0 0 15px #00ffff',
          letterSpacing: 3,
        }}>
          PORTFOLIO.DRIVE
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', pointerEvents: 'all' }}>
          <button
            onClick={toggleMusic}
            style={{
              background: musicOn ? 'rgba(0,255,255,0.2)' : 'rgba(0,0,0,0.4)',
              border: `1px solid ${musicOn ? '#00ffff' : '#333'}`,
              borderRadius: 6,
              color: musicOn ? '#00ffff' : '#666',
              padding: '6px 14px',
              fontFamily: 'monospace',
              fontSize: 12,
              cursor: 'pointer',
              letterSpacing: 1,
              boxShadow: musicOn ? '0 0 10px #00ffff55' : 'none',
            }}
          >
            {musicOn ? '♪ ON' : '♪ OFF'}
          </button>
          {easterEggsFound.length > 0 && (
            <div style={{
              color: '#ffff00',
              fontFamily: 'monospace',
              fontSize: 12,
              textShadow: '0 0 8px #ffff00',
            }}>
              🥚 {easterEggsFound.length}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeZone && !isPanelOpen && currentZone && (
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background: `${currentZone.color}11`,
              border: `1px solid ${currentZone.color}66`,
              borderRadius: 8,
              padding: '8px 20px',
              color: currentZone.color,
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: 3,
              textShadow: `0 0 10px ${currentZone.color}`,
              boxShadow: `0 0 20px ${currentZone.color}22`,
            }}>
              ▶ ZONE: {currentZone.label}
            </div>
          </motion.div>
        )}
        {!activeZone && !isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#00ffff88',
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: 2,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            W/A/S/D OR ARROW KEYS TO DRIVE · SPACE TO BRAKE · DRIVE INTO ZONES
          </motion.div>
        )}
      </AnimatePresence>

      <Speedometer speed={speed} />
      <Minimap />
    </div>
  )
}
