import { PanelBase } from './PanelBase'

export function QualificationsPanel() {
  return (
    <PanelBase zone="qualifications" title="QUALIFICATIONS" color="#00ff88">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ color: '#00ff88', margin: '0 0 12px', fontSize: 13, letterSpacing: 2 }}>// EDUCATION</h3>
          {[
            {
              degree: 'B.Sc. Computer Science',
              school: 'University of Technology',
              year: '2020 - 2024',
              grade: 'First Class Honours',
            },
            {
              degree: 'A-Levels: Math, Physics, CS',
              school: 'City College',
              year: '2018 - 2020',
              grade: 'A*AA',
            },
          ].map((edu, i) => (
            <div key={i} style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid #00ff8833',
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              borderLeft: '3px solid #00ff88',
            }}>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{edu.degree}</div>
              <div style={{ color: '#00ff88', fontSize: 12, marginTop: 2 }}>{edu.school}</div>
              <div style={{ color: '#667', fontSize: 11, marginTop: 4 }}>{edu.year} · {edu.grade}</div>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ color: '#00ff88', margin: '0 0 12px', fontSize: 13, letterSpacing: 2 }}>// SKILLS MATRIX</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { skill: 'Frontend Development', level: 95 },
              { skill: 'Backend / API', level: 88 },
              { skill: 'Cloud & DevOps', level: 78 },
              { skill: '3D / WebGL', level: 85 },
              { skill: 'Machine Learning', level: 70 },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: '#aabbcc' }}>{item.skill}</span>
                  <span style={{ color: '#00ff88' }}>{item.level}%</span>
                </div>
                <div style={{ background: '#111', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.level}%`,
                    height: '100%',
                    background: 'linear-gradient(to right, #00ff88, #00ffff)',
                    borderRadius: 4,
                    boxShadow: '0 0 8px #00ff8866',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBase>
  )
}
