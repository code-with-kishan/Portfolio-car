import { useEffect, useRef } from 'react'

export interface Controls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  brake: boolean
}

export function useCarControls(): React.MutableRefObject<Controls> {
  const controls = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': controls.current.forward = true; break
        case 'KeyS': case 'ArrowDown': controls.current.backward = true; break
        case 'KeyA': case 'ArrowLeft': controls.current.left = true; break
        case 'KeyD': case 'ArrowRight': controls.current.right = true; break
        case 'Space': controls.current.brake = true; e.preventDefault(); break
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': controls.current.forward = false; break
        case 'KeyS': case 'ArrowDown': controls.current.backward = false; break
        case 'KeyA': case 'ArrowLeft': controls.current.left = false; break
        case 'KeyD': case 'ArrowRight': controls.current.right = false; break
        case 'Space': controls.current.brake = false; break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return controls
}
