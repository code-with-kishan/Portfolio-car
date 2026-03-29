import { PanelBase } from './PanelBase'

const projects = [
  {
    name: 'NeuralVis 3D',
    desc: 'An interactive 3D visualization platform for neural networks built with Three.js and WebGL shaders.',
    tech: ['Three.js', 'WebGL', 'React', 'TypeScript'],
    color: '#ff00ff',
    status: 'LIVE',
    github: 'https://github.com/code-with-kishan/neuralvis-3d',
    demo: 'https://neuralvis.kishan.dev',
  },
  {
    name: 'CryptoFlow Dashboard',
    desc: 'Real-time cryptocurrency analytics with live charts, portfolio tracking, and AI-powered predictions.',
    tech: ['React', 'D3.js', 'Node.js', 'WebSockets'],
    color: '#00ffff',
    status: 'LIVE',
    github: 'https://github.com/code-with-kishan/cryptoflow',
    demo: 'https://cryptoflow.kishan.dev',
  },
  {
    name: 'AR City Mapper',
    desc: 'Augmented reality city navigation app using WebXR, overlaying real-time data on physical environments.',
    tech: ['WebXR', 'Three.js', 'PWA', 'GeoAPI'],
    color: '#ffff00',
    status: 'BETA',
    github: 'https://github.com/code-with-kishan/ar-city-mapper',
    demo: null,
  },
  {
    name: 'AI Code Reviewer',
    desc: 'GitHub bot powered by GPT-4 that performs automated code reviews and suggests optimizations.',
    tech: ['Python', 'OpenAI API', 'GitHub API', 'FastAPI'],
    color: '#00ff88',
    status: 'OPEN SOURCE',
    github: 'https://github.com/code-with-kishan/ai-code-reviewer',
    demo: null,
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
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = `${project.color}0d`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,0,255,0.05)')}
          >
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
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
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid #444',
                    borderRadius: 5,
                    padding: '5px 12px',
                    fontSize: 10,
                    color: '#ccc',
                    textDecoration: 'none',
                    letterSpacing: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = project.color; (e.currentTarget as HTMLAnchorElement).style.color = project.color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#444'; (e.currentTarget as HTMLAnchorElement).style.color = '#ccc' }}
                >
                  ⌨ CODE
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: `${project.color}1a`,
                      border: `1px solid ${project.color}66`,
                      borderRadius: 5,
                      padding: '5px 12px',
                      fontSize: 10,
                      color: project.color,
                      textDecoration: 'none',
                      letterSpacing: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}33` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${project.color}1a` }}
                  >
                    ▶ LIVE
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelBase>
  )
}
