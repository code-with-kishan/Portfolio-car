import { useState } from 'react'
import { PanelBase } from './PanelBase'

export function ContactPanel() {
  const [copied, setCopied] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const SUCCESS_MESSAGE_DURATION_MS = 4000

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message too short (min 10 chars)'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    setErrors({})
    setSubmitted(true)
    console.log('Contact form submission:', form)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', email: '', message: '' })
    }, SUCCESS_MESSAGE_DURATION_MS)
  }

  const contacts = [
    { label: 'EMAIL', value: 'kishan@example.com', icon: '✉', color: '#ff4400' },
    { label: 'GITHUB', value: 'github.com/kishan', icon: '⌨', color: '#fff' },
    { label: 'LINKEDIN', value: 'linkedin.com/in/kishan', icon: '💼', color: '#0077b5' },
    { label: 'TWITTER', value: '@kishan_dev', icon: '🐦', color: '#1da1f2' },
  ]

  const inputStyle = (error?: string): React.CSSProperties => ({
    background: 'rgba(255,68,0,0.08)',
    border: `1px solid ${error ? '#ff4444' : '#ff440044'}`,
    borderRadius: 6,
    padding: '10px 14px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

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
              flexShrink: 0,
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
          <h3 style={{ color: '#ff4400', margin: '0 0 14px', fontSize: 13, letterSpacing: 2 }}>// SEND A MESSAGE</h3>
          {submitted ? (
            <div style={{
              textAlign: 'center',
              padding: '24px 0',
              color: '#00ff88',
              fontSize: 14,
              letterSpacing: 2,
              textShadow: '0 0 10px #00ff88',
            }}>
              ✓ MESSAGE TRANSMITTED SUCCESSFULLY
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <input
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                  style={inputStyle(errors.name)}
                  onFocus={e => (e.target.style.borderColor = errors.name ? '#ff4444' : '#ff440099')}
                  onBlur={e => (e.target.style.borderColor = errors.name ? '#ff4444' : '#ff440044')}
                />
                {errors.name && <div style={{ color: '#ff4444', fontSize: 10, marginTop: 3, letterSpacing: 1 }}>{errors.name}</div>}
              </div>
              <div>
                <input
                  placeholder="Your email"
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
                  style={inputStyle(errors.email)}
                  onFocus={e => (e.target.style.borderColor = errors.email ? '#ff4444' : '#ff440099')}
                  onBlur={e => (e.target.style.borderColor = errors.email ? '#ff4444' : '#ff440044')}
                />
                {errors.email && <div style={{ color: '#ff4444', fontSize: 10, marginTop: 3, letterSpacing: 1 }}>{errors.email}</div>}
              </div>
              <div>
                <textarea
                  placeholder="Your message..."
                  rows={3}
                  value={form.message}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })) }}
                  style={{ ...inputStyle(errors.message), resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = errors.message ? '#ff4444' : '#ff440099')}
                  onBlur={e => (e.target.style.borderColor = errors.message ? '#ff4444' : '#ff440044')}
                />
                {errors.message && <div style={{ color: '#ff4444', fontSize: 10, marginTop: 3, letterSpacing: 1 }}>{errors.message}</div>}
              </div>
              <button
                onClick={handleSubmit}
                style={{
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
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,68,0,0.35)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px #ff440066' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,68,0,0.2)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #ff440033' }}
              >
                TRANSMIT MESSAGE
              </button>
            </div>
          )}
        </div>
      </div>
    </PanelBase>
  )
}
