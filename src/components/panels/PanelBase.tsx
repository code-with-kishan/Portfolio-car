import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, Zone } from '../../store/gameStore'

interface PanelBaseProps {
  zone: Zone
  title: string
  color: string
  children: React.ReactNode
}

export function PanelBase({ zone, title, color, children }: PanelBaseProps) {
  const activeZone = useGameStore((s) => s.activeZone)
  const isPanelOpen = useGameStore((s) => s.isPanelOpen)
  const setPanelOpen = useGameStore((s) => s.setPanelOpen)
  const setActiveZone = useGameStore((s) => s.setActiveZone)

  const isVisible = activeZone === zone && isPanelOpen

  const handleClose = () => {
    setPanelOpen(false)
    setActiveZone(null)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(700px, 90vw)',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(0,5,15,0.97) 0%, rgba(0,15,30,0.97) 100%)',
            border: `1px solid ${color}`,
            borderRadius: 12,
            boxShadow: `0 0 40px ${color}44, 0 0 80px ${color}22, inset 0 0 40px rgba(0,0,0,0.5)`,
            zIndex: 100,
            padding: '28px 32px',
            fontFamily: 'monospace',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            borderBottom: `1px solid ${color}44`,
            paddingBottom: 16,
          }}>
            <div>
              <div style={{ color: color, fontSize: 10, letterSpacing: 4, marginBottom: 4, opacity: 0.7 }}>
                // ZONE ACCESSED
              </div>
              <h2 style={{
                color: color,
                fontSize: 24,
                fontWeight: 'bold',
                textShadow: `0 0 20px ${color}`,
                margin: 0,
                letterSpacing: 3,
              }}>
                {title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: `1px solid ${color}`,
                color: color,
                width: 36,
                height: 36,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 10px ${color}44`,
                pointerEvents: 'all',
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ color: '#ccddee', lineHeight: 1.7 }}>
            {children}
          </div>
          <div style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${color}22`,
            color: `${color}88`,
            fontSize: 10,
            letterSpacing: 2,
            textAlign: 'center',
          }}>
            CLOSE TO CONTINUE DRIVING
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
