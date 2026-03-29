import { useState } from 'react'
import { PanelBase } from './PanelBase'

export function ContactPanel() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const contacts = [
    { label: 'EMAIL', value: 'kishan@example.com', icon: '✉', color: '#ff4400' },
    { label: 'GITHUB', value: 'github.com/kishan', icon: '⌨', color: '#fff' },
    { label: 'LINKEDIN', value: 'linkedin.com/in/kishan', icon: '💼', color: '#0077b5' },
    { label: 'TWITTER', value: '@kishan_dev', icon: '🐦', color: '#1da1f2' },
  ]

  return (
    <PanelBase zone="contact" title="CONTACT" color="#ff4400">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: '0 0 8px', fontSize: 14, color: '#aabbcc' }}>
          Ready to build something amazing together? Reach out through any channel below.
        </p>
        {contacts.map((contact, i) => (
          <div
            key={i}
            onClick={() => copy(contact.value, contact.label)}
            style={{
              background: 'rgba(255,68,0,0.05)',
              border: `1px solid ${contact.color}33`,
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${contact.color}11`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,68,0,0.05)')}
          >
            <div style={{
              width: 40,
              height: 40,
              background: `${contact.color}22`,
              border: `1px solid ${contact.color}66`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>{contact.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: contact.color, fontSize: 10, letterSpacing: 2, marginBottom: 2 }}>{contact.label}</div>
              <div style={{ color: '#fff', fontSize: 13 }}>{contact.value}</div>
            </div>
            <div style={{ color: copied === contact.label ? '#00ff88' : '#333', fontSize: 11, letterSpacing: 1 }}>
              {copied === contact.label ? 'COPIED!' : 'CLICK TO COPY'}
            </div>
          </div>
        ))}
        <div style={{
          background: 'rgba(255,68,0,0.05)',
          border: '1px solid #ff440033',
          borderRadius: 8,
          padding: 16,
          marginTop: 4,
        }}>
          <h3 style={{ color: '#ff4400', margin: '0 0 12px', fontSize: 13, letterSpacing: 2 }}>// SEND A MESSAGE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Your message..."
              style={{
                background: 'rgba(255,68,0,0.08)',
                border: '1px solid #ff440044',
                borderRadius: 6,
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button style={{
              background: 'rgba(255,68,0,0.2)',
              border: '1px solid #ff4400',
              borderRadius: 6,
              color: '#ff4400',
              padding: '10px 20px',
              fontFamily: 'monospace',
              fontSize: 12,
              cursor: 'pointer',
              letterSpacing: 2,
              boxShadow: '0 0 10px #ff440033',
            }}>
              TRANSMIT MESSAGE
            </button>
          </div>
        </div>
      </div>
    </PanelBase>
  )
}
