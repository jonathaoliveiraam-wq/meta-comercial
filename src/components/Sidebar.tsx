'use client'

import { useEffect } from 'react'
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
  collapsed?: boolean
  onCollapse?: (v: boolean) => void
}

import { useState } from 'react'

export default function Sidebar({ title, subtitle, items, bottomItems, user, variant = 'dashboard', collapsed: collapsedProp, onCollapse }: Props) {
  const [collapsedInternal, setCollapsedInternal] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // For CRM: use controlled prop if provided, otherwise internal state
  const isControlled = collapsedProp !== undefined
  const collapsed = isControlled ? collapsedProp : collapsedInternal

  const setCollapsed = (v: boolean) => {
    if (isControlled) onCollapse?.(v)
    else setCollapsedInternal(v)
  }

  useEffect(() => {
    if (window.innerWidth <= 768) setCollapsed(true)
  }, [])

  if (variant === 'crm') {
    const isOpen = mobileOpen || !collapsed

    return (
      <>
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 29, backdropFilter: 'blur(2px)' }}
          />
        )}
        <div
          className="sidebar-crm"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            zIndex: mobileOpen ? 50 : 20,
            background: '#fff',
          }}
        >
          {/* Header com botão fechar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 12px', borderBottom: '1px solid #E5E7EB', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Menu</span>
            <button
              onClick={() => {
                if (window.innerWidth <= 768) setMobileOpen(false)
                setCollapsed(true)
              }}
              style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer', color: '#6B7280', fontSize: 14, lineHeight: 1, padding: '4px 8px', fontWeight: 700 }}
              title="Fechar menu"
            >✕</button>
          </div>

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
                  <><span className="sidebar-item-icon">{item.icon}</span><span>{item.label}</span></>
                )}
              </div>
            )
          })}

          {bottomItems && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: 8 }}>
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
                    <><span className="sidebar-item-icon">{item.icon}</span><span>{item.label}</span></>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }

  // Dashboard variant
  return (
    <div className={`sidebar${collapsedInternal ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" alt="Faço a Conta" />
        {!collapsedInternal && <p>{title} {subtitle || ''}</p>}
      </div>
      <button className="toggle-btn" onClick={() => setCollapsedInternal(!collapsedInternal)}>
        <span>{collapsedInternal ? '▼' : '▲'}</span>
        {!collapsedInternal && <span className="nav-label">Recolher menu</span>}
      </button>
      <div className="nav-section">
        {items.map((item, i) => {
          const isActive = item.href ? pathname.startsWith(item.href) : false
          return (
            <div key={i} className={`nav-item${isActive ? ' active' : ''}`} onClick={() => { if (item.onClick) item.onClick() }}>
              {item.href ? (
                <Link href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ) : (
                <><span className="nav-icon">{item.icon}</span><span className="nav-label">{item.label}</span></>
              )}
            </div>
          )
        })}
      </div>
      <div className="sidebar-bottom">
        {user && !collapsedInternal && <div className="user-info">👤 {user}</div>}
        {bottomItems?.map((item, i) => (
          <div key={i}>
            {item.href ? (
              <Link href={item.href} className="logout-btn" style={{ textDecoration: 'none', marginBottom: 4 }}>
                <span>{item.icon}</span>
                {!collapsedInternal && <span className="nav-label">{item.label}</span>}
              </Link>
            ) : (
              <button className="logout-btn" onClick={item.onClick} style={{ marginBottom: 4 }}>
                <span>{item.icon}</span>
                {!collapsedInternal && <span className="nav-label">{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
