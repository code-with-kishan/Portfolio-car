import { useRef, useEffect } from 'react'
import { joystickState } from '../store/joystickState'

const OUTER_RADIUS = 70   // px — half-width / height of the base circle
const INNER_RADIUS = 28   // px — knob radius
const DEADZONE = 0.12

export function Joystick() {
  const outerRef = useRef<HTMLDivElement>(null)
  const knobRef  = useRef<HTMLDivElement>(null)
  const activeId = useRef<number | null>(null)
  const center   = useRef({ x: 0, y: 0 })

  const applyPosition = (clientX: number, clientY: number) => {
    const dx   = clientX - center.current.x
    const dy   = clientY - center.current.y
    const dist = Math.hypot(dx, dy)
    const cap  = Math.min(dist, OUTER_RADIUS)
    const ang  = Math.atan2(dy, dx)
    const kx   = Math.cos(ang) * cap
    const ky   = Math.sin(ang) * cap

    if (knobRef.current) {
      knobRef.current.style.transform =
        `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`
    }

    const nx = kx / OUTER_RADIUS
    const ny = -(ky / OUTER_RADIUS)  // invert Y: screen-down = backward
    joystickState.x = Math.abs(nx) > DEADZONE ? nx : 0
    joystickState.y = Math.abs(ny) > DEADZONE ? ny : 0
  }

  const resetKnob = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)'
    }
    joystickState.x = 0
    joystickState.y = 0
  }

  useEffect(() => {
    const el = outerRef.current
    if (!el) return

    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      if (activeId.current !== null) return
      activeId.current = e.pointerId
      el.setPointerCapture(e.pointerId)
      const r = el.getBoundingClientRect()
      center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      applyPosition(e.clientX, e.clientY)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== activeId.current) return
      applyPosition(e.clientX, e.clientY)
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activeId.current) return
      activeId.current = null
      resetKnob()
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup',   onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup',   onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const SIZE = OUTER_RADIUS * 2

  return (
    <div style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 20, userSelect: 'none' }}>
      {/* Joystick base */}
      <div
        ref={outerRef}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.38)',
          border: '2px solid rgba(255,255,255,0.28)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          position: 'relative',
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        {/* Crosshair */}
        <div style={{ position:'absolute', top:'50%', left:8, right:8, height:1, background:'rgba(255,255,255,0.13)', transform:'translateY(-50%)' }} />
        <div style={{ position:'absolute', left:'50%', top:8, bottom:8, width:1, background:'rgba(255,255,255,0.13)', transform:'translateX(-50%)' }} />

        {/* Knob */}
        <div
          ref={knobRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: INNER_RADIUS * 2,
            height: INNER_RADIUS * 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.52)',
            border: '2px solid rgba(255,255,255,0.82)',
            boxShadow: '0 2px 14px rgba(0,0,0,0.45)',
            transform: 'translate(-50%,-50%)',
            transition: 'transform 0.07s ease-out',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Brake button */}
      <button
        onPointerDown={() => (joystickState.brake = true)}
        onPointerUp={() => (joystickState.brake = false)}
        onPointerLeave={() => (joystickState.brake = false)}
        style={{
          position: 'absolute',
          bottom: 0,
          left: SIZE + 18,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(220,50,0,0.32)',
          border: '2px solid rgba(255,80,20,0.65)',
          color: '#ff6633',
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: 'bold',
          letterSpacing: 1,
          cursor: 'pointer',
          touchAction: 'none',
          userSelect: 'none',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        BRAKE
      </button>

      {/* Label */}
      <div style={{
        position: 'absolute',
        top: SIZE + 6,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'monospace',
        fontSize: 8,
        letterSpacing: 1,
      }}>
        DRIVE
      </div>
    </div>
  )
}
