'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  icon: string
  label: string
  href?: string
  onClick?: () => void
}

interface Props {
  title: string
  subtitle?: string
  items: NavItem[]
  bottomItems?: NavItem[]
  user?: string | null
  variant?: 'dashboard' | 'crm'
}

export default function Sidebar({ title, subtitle, items, bottomItems, user, variant = 'dashboard' }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (window.innerWidth <= 768) setCollapsed(true)
  }, [])

  if (variant === 'crm') {
    return (
      <>
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 19, backdropFilter: 'blur(2px)' }}
          />
        )}
        <div className={`sidebar-crm${collapsed && !mobileOpen ? ' collapsed' : ''}`} style={mobileOpen ? { zIndex: 50, boxShadow: '4px 0 32px rgba(0,0,0,0.6)' } : {}}>
          <button
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen)
              } else {
                setCollapsed(!collapsed)
              }
            }}
            style={{
              width: '100%', background: 'none', border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: (collapsed && !mobileOpen) ? 'center' : 'space-between',
              padding: (collapsed && !mobileOpen) ? '12px 0' : '10px 14px',
              marginBottom: 8, fontSize: 13, fontWeight: 600,
            }}
          >
            {(!collapsed || mobileOpen) && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Menu</span>}
            <span style={{ fontSize: 18, lineHeight: 1 }}>{(collapsed && !mobileOpen) ? '☰' : '✕'}</span>
          </button>

          {items.map((item, i) => {
            const isActive = item.href ? pathname.startsWith(item.href) : false
            return (
              <div
                key={i}
                className={`sidebar-item${isActive ? ' active' : ''}`}
                onClick={() => {
                  if (item.onClick) item.onClick()
                  if (window.innerWidth <= 768) setMobileOpen(false)
                }}
              >
                {item.href ? (
                  <Link href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </>
                )}
              </div>
            )
          })}

          {bottomItems && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              {bottomItems.map((item, i) => (
                <div
                  key={i}
                  className="sidebar-item"
                  onClick={() => {
                    if (item.onClick) item.onClick()
                    if (window.innerWidth <= 768) setMobileOpen(false)
                  }}
                >
                  {item.href ? (
                    <Link href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      <span className="sidebar-item-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <span className="sidebar-item-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img
          src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png"
          alt="Faço a Conta"
        />
        {!collapsed && <p>{title} {subtitle || ''}</p>}
      </div>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        <span>{collapsed ? '▼' : '▲'}</span>
        {!collapsed && <span className="nav-label">Recolher menu</span>}
      </button>

      <div className="nav-section">
        {items.map((item, i) => {
          const isActive = item.href ? pathname.startsWith(item.href) : false
          return (
            <div
              key={i}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => { if (item.onClick) item.onClick() }}
            >
              {item.href ? (
                <Link href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ) : (
                <>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="sidebar-bottom">
        {user && !collapsed && (
          <div className="user-info">👤 {user}</div>
        )}
        {bottomItems?.map((item, i) => (
          <div key={i}>
            {item.href ? (
              <Link href={item.href} className="logout-btn" style={{ textDecoration: 'none', marginBottom: 4 }}>
                <span>{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            ) : (
              <button className="logout-btn" onClick={item.onClick} style={{ marginBottom: 4 }}>
                <span>{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
