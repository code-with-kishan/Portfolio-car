import { motion } from 'framer-motion'
import { useState } from 'react'

const sections = [
  {
    id: 'about',
    title: 'ABOUT ME',
    color: '#00ffff',
    icon: '👤',
    content: 'Full-stack developer passionate about immersive digital experiences. 3+ years building modern web applications with React, TypeScript, Node.js, and WebGL.',
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    color: '#ff00ff',
    icon: '🚀',
    content: "NeuralVis 3D · CryptoFlow Dashboard · AR City Mapper · AI Code Reviewer. Building tools that push the boundaries of what's possible on the web.",
  },
  {
    id: 'certifications',
    title: 'CERTIFICATIONS',
    color: '#ffff00',
    icon: '🏆',
    content: 'AWS Solutions Architect · Google Cloud Professional · Meta React Developer · Docker Certified Associate · Kubernetes Administrator',
  },
  {
    id: 'qualifications',
    title: 'QUALIFICATIONS',
    color: '#00ff88',
    icon: '🎓',
    content: 'B.Sc. Computer Science (First Class Honours) · Frontend 95% · Backend 88% · 3D/WebGL 85% · Cloud & DevOps 78%',
  },
  {
    id: 'contact',
    title: 'CONTACT',
    color: '#ff4400',
    icon: '✉',
    content: 'kishan@example.com · github.com/kishan · linkedin.com/in/kishan · @kishan_dev',
  },
]

export function MobileFallback() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000511',
      fontFamily: 'monospace',
      padding: '20px 16px',
      color: '#fff',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#00ffff',
            textShadow: '0 0 20px #00ffff',
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          PORTFOLIO.DRIVE
        </motion.div>
        <div style={{ color: '#00ffff88', fontSize: 11, letterSpacing: 2 }}>
          MOBILE MODE · 2D NAVIGATION
        </div>
        <div style={{
          marginTop: 12,
          padding: '8px 16px',
          background: 'rgba(255,170,0,0.1)',
          border: '1px solid #ffaa0044',
          borderRadius: 6,
          color: '#ffaa00',
          fontSize: 10,
          letterSpacing: 1,
        }}>
          💡 View on desktop for the full 3D driving experience
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500, margin: '0 auto' }}>
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActive(active === section.id ? null : section.id)}
            style={{
              background: active === section.id ? `${section.color}11` : 'rgba(0,10,20,0.8)',
              border: `1px solid ${active === section.id ? section.color : section.color + '44'}`,
              borderRadius: 10,
              padding: 18,
              cursor: 'pointer',
              boxShadow: active === section.id ? `0 0 20px ${section.color}33` : 'none',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{section.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: section.color, fontSize: 14, fontWeight: 'bold', letterSpacing: 2 }}>
                  {section.title}
                </div>
              </div>
              <div style={{ color: section.color, fontSize: 18 }}>
                {active === section.id ? '▲' : '▼'}
              </div>
            </div>
            {active === section.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${section.color}33`,
                  color: '#aabbcc',
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                {section.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
