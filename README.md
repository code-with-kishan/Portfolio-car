# 🚗 Portfolio Drive — Futuristic 3D Driving Portfolio

A cyberpunk-themed 3D interactive portfolio where you **drive a neon car** through a city and discover portfolio zones.

---

## ✨ Features

- **3D Cyberpunk City** — Neon-lit buildings, glowing roads, star-field skybox and fog
- **Drivable Car** — Physics-based vehicle with headlights, underglow and tail lights
- **5 Portfolio Zones** — Drive into glowing checkpoints to open panels:
  - 🟦 **About Me** — Intro, Full Stack + Web3 skills, tech stack
  - 🟪 **Projects** — Cards with title/description, GitHub & demo links
  - 🟨 **Certifications** — Achievement cards with issuer & year
  - 🟩 **Qualifications** — Animated education & achievements timeline
  - 🟥 **Contact** — Form with validation + social links
- **HUD Overlay** — Speedometer, minimap, music toggle, zone hints
- **Procedural Audio** — Background synth music toggle, plays via Web Audio API
- **Easter Eggs** — 3 hidden collectibles scattered in the world 🔮
- **Mobile Fallback** — 2D accordion card navigation for small screens

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Accelerate |
| `S` / `↓` | Reverse |
| `A` / `←` | Turn Left |
| `D` / `→` | Turn Right |
| `Space` | Brake |

Drive into a **coloured glowing zone** to open the portfolio panel for that zone.

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+ and npm

### Install
```bash
npm install
```

### Run (dev server)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## 🏗️ Project Structure

```
src/
├── App.tsx                   # Root component, loading screen, mobile detection
├── store/
│   └── gameStore.ts          # Zustand global state (zone, speed, music, easter eggs)
├── hooks/
│   └── useCarControls.ts     # Keyboard input hook
├── components/
│   ├── Scene.tsx             # R3F Canvas + Physics wrapper
│   ├── Car.tsx               # Physics car with camera follow
│   ├── City.tsx              # Procedural cyberpunk city
│   ├── Checkpoints.tsx       # 5 sensor zones
│   ├── HUD.tsx               # Speedometer, minimap, music toggle
│   ├── EasterEggs.tsx        # Hidden collectibles
│   ├── MobileFallback.tsx    # 2D mobile navigation
│   └── panels/
│       ├── PanelBase.tsx
│       ├── AboutPanel.tsx
│       ├── ProjectsPanel.tsx
│       ├── CertificationsPanel.tsx
│       ├── QualificationsPanel.tsx
│       └── ContactPanel.tsx
```

---

## 🛠️ Tech Stack

| Library | Purpose |
|---------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| @react-three/fiber | Three.js React renderer |
| @react-three/drei | 3D helpers (Stars, etc.) |
| @react-three/rapier | Physics engine |
| Framer Motion | UI animations |
| Zustand | State management |
| Web Audio API | Procedural background music |

---

## 📱 Mobile

On screens narrower than 768 px the 3D world is replaced with a **2D accordion card interface** covering all five portfolio sections — same content, no heavy 3D load.

