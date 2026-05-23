'use client'

import { useState } from 'react'
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
  const pathname = usePathname()

  if (variant === 'crm') {
    return (
      <div className={`sidebar-crm${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-section">Menu</div>
        {items.map((item, i) => {
          const isActive = item.href ? pathname.startsWith(item.href) : false
          return (
            <div
              key={i}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              onClick={() => { if (item.onClick) item.onClick() }}
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
          <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e1e', paddingTop: 8 }}>
            {bottomItems.map((item, i) => (
              <div
                key={i}
                className="sidebar-item"
                onClick={item.onClick}
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
