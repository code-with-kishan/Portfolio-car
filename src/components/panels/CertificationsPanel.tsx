import { PanelBase } from './PanelBase'

const certifications = [
  { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', color: '#ff9900' },
  { name: 'Google Cloud Professional', issuer: 'Google Cloud', year: '2023', color: '#4285f4' },
  { name: 'Meta React Developer', issuer: 'Meta / Coursera', year: '2023', color: '#0866ff' },
  { name: 'OpenAI Developer', issuer: 'OpenAI', year: '2024', color: '#00ffff' },
  { name: 'Docker Certified Associate', issuer: 'Docker Inc.', year: '2022', color: '#2496ed' },
  { name: 'Kubernetes Administrator', issuer: 'CNCF', year: '2023', color: '#326ce5' },
]

export function CertificationsPanel() {
  return (
    <PanelBase zone="certifications" title="CERTIFICATIONS" color="#ffff00">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {certifications.map((cert, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,0,0.04)',
            border: '1px solid #ffff0033',
            borderRadius: 8,
            padding: 14,
            borderTop: `2px solid ${cert.color}`,
          }}>
            <div style={{
              width: 32,
              height: 32,
              background: `${cert.color}22`,
              border: `1px solid ${cert.color}66`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              marginBottom: 10,
            }}>🏆</div>
            <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: 12, lineHeight: 1.4 }}>{cert.name}</h4>
            <div style={{ color: '#667', fontSize: 11 }}>{cert.issuer}</div>
            <div style={{ color: cert.color, fontSize: 10, marginTop: 6, letterSpacing: 1 }}>{cert.year}</div>
          </div>
        ))}
      </div>
    </PanelBase>
  )
}
