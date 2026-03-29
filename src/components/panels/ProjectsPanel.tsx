import { PanelBase } from './PanelBase'

const projects = [
  {
    name: 'NeuralVis 3D',
    desc: 'An interactive 3D visualization platform for neural networks built with Three.js and WebGL shaders.',
    tech: ['Three.js', 'WebGL', 'React', 'TypeScript'],
    color: '#ff00ff',
    status: 'LIVE',
  },
  {
    name: 'CryptoFlow Dashboard',
    desc: 'Real-time cryptocurrency analytics with live charts, portfolio tracking, and AI-powered predictions.',
    tech: ['React', 'D3.js', 'Node.js', 'WebSockets'],
    color: '#00ffff',
    status: 'LIVE',
  },
  {
    name: 'AR City Mapper',
    desc: 'Augmented reality city navigation app using WebXR, overlaying real-time data on physical environments.',
    tech: ['WebXR', 'Three.js', 'PWA', 'GeoAPI'],
    color: '#ffff00',
    status: 'BETA',
  },
  {
    name: 'AI Code Reviewer',
    desc: 'GitHub bot powered by GPT-4 that performs automated code reviews and suggests optimizations.',
    tech: ['Python', 'OpenAI API', 'GitHub API', 'FastAPI'],
    color: '#00ff88',
    status: 'OPEN SOURCE',
  },
]

export function ProjectsPanel() {
  return (
    <PanelBase zone="projects" title="PROJECTS" color="#ff00ff">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {projects.map((project, i) => (
          <div key={i} style={{
            background: 'rgba(255,0,255,0.05)',
            border: `1px solid ${project.color}33`,
            borderRadius: 8,
            padding: 16,
            borderLeft: `3px solid ${project.color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ color: project.color, margin: 0, fontSize: 15, letterSpacing: 1 }}>{project.name}</h3>
              <span style={{
                background: `${project.color}22`,
                border: `1px solid ${project.color}66`,
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 9,
                color: project.color,
                letterSpacing: 1,
              }}>{project.status}</span>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#aabbcc' }}>{project.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #333',
                  borderRadius: 3,
                  padding: '2px 7px',
                  fontSize: 10,
                  color: '#889',
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelBase>
  )
}
