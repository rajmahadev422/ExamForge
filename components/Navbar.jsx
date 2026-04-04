'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'

export default function Navbar({ title, subtitle, left, right }) {
  const { theme, toggle } = useTheme()
  const [animating, setAnimating] = useState(false)
  const btnRef = useRef(null)

  const handleToggle = () => {
    setAnimating(true)
    toggle()
    setTimeout(() => setAnimating(false), 350)
  }

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--header-bg)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.25s',
    }}>
      {/* Left slot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '14px', flexShrink: 0,
          }}>⚡</div>
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            ExamForge
          </span>
        </Link>
        {(title || subtitle) && (
          <>
            <span style={{ color: 'var(--border-bright)', margin: '0 4px' }}>|</span>
            {title && <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text)' }}>{title}</span>}
            {subtitle && <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{subtitle}</span>}
          </>
        )}
        {left}
      </div>

      {/* Right slot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {right}
        {/* Theme toggle */}
        <button
          ref={btnRef}
          className={`theme-toggle${animating ? ' animating' : ''}`}
          onClick={handleToggle}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
