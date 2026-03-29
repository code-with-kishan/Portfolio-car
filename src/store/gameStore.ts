import { create } from 'zustand'

export type Zone = 'about' | 'projects' | 'certifications' | 'qualifications' | 'contact' | null

interface GameStore {
  activeZone: Zone
  setActiveZone: (zone: Zone) => void
  isPanelOpen: boolean
  setPanelOpen: (open: boolean) => void
  speed: number
  setSpeed: (speed: number) => void
  musicOn: boolean
  toggleMusic: () => void
  carPosition: [number, number, number]
  setCarPosition: (pos: [number, number, number]) => void
  easterEggsFound: string[]
  findEasterEgg: (id: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  activeZone: null,
  setActiveZone: (zone) => set({ activeZone: zone }),
  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  speed: 0,
  setSpeed: (speed) => set({ speed }),
  musicOn: false,
  toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),
  carPosition: [0, 0, 0],
  setCarPosition: (carPosition) => set({ carPosition }),
  easterEggsFound: [],
  findEasterEgg: (id) => set((s) => ({
    easterEggsFound: s.easterEggsFound.includes(id) ? s.easterEggsFound : [...s.easterEggsFound, id]
  })),
}))
