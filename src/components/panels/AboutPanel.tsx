import { PanelBase } from './PanelBase'

export function AboutPanel() {
  return (
    <PanelBase zone="about" title="ABOUT ME" color="#00ffff">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: 'rgba(0,255,255,0.05)',
          border: '1px solid #00ffff22',
          borderRadius: 8,
          padding: 20,
        }}>
          <h3 style={{ color: '#00ffff', margin: '0 0 12px', fontSize: 14, letterSpacing: 2 }}>// WHO AM I</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Hi! I'm <strong style={{ color: '#00ffff' }}>Kishan</strong> — a full-stack developer and creative technologist 
            passionate about building immersive digital experiences. I blend cutting-edge web technologies 
            with creative design to craft applications that leave an impression.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {[
            { label: 'ROLE', value: 'Full-Stack Developer' },
            { label: 'LOCATION', value: 'Earth, Sector 7' },
            { label: 'EXPERIENCE', value: '3+ Years' },
            { label: 'STATUS', value: '🟢 Available' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(0,255,255,0.05)',
              border: '1px solid #00ffff22',
              borderRadius: 6,
              padding: 12,
            }}>
              <div style={{ color: '#00ffff88', fontSize: 9, letterSpacing: 2 }}>{item.label}</div>
              <div style={{ color: '#fff', fontSize: 13, marginTop: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: 'rgba(0,255,255,0.05)',
          border: '1px solid #00ffff22',
          borderRadius: 8,
          padding: 20,
        }}>
          <h3 style={{ color: '#00ffff', margin: '0 0 12px', fontSize: 14, letterSpacing: 2 }}>// TECH STACK</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['React', 'TypeScript', 'Node.js', 'Python', 'Three.js', 'WebGL', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'].map(tech => (
              <span key={tech} style={{
                background: 'rgba(0,255,255,0.1)',
                border: '1px solid #00ffff44',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 12,
                color: '#00ffff',
              }}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </PanelBase>
  )
}
