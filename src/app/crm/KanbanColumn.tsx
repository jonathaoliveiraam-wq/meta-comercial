'use client'

import { useDroppable } from '@dnd-kit/core'

interface Props {
  id: string
  etapa: number
  label: string
  cor: string
  count: number
  children: React.ReactNode
}

export default function KanbanColumn({ id, etapa, label, cor, count, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${id}`,
    data: { etapa },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 280,
        flexShrink: 0,
        background: isOver ? `${cor}08` : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        padding: '14px 12px',
        borderTop: `3px solid ${cor}`,
        border: `1px solid ${isOver ? cor + '44' : 'rgba(255,255,255,0.07)'}`,
        borderTopColor: cor,
        boxShadow: isOver ? `0 0 24px ${cor}18` : '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, paddingBottom: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: cor }}>{label}</span>
        <span style={{
          fontSize: 11, background: `${cor}20`, border: `1px solid ${cor}44`,
          borderRadius: 999, padding: '2px 8px', color: cor, fontWeight: 700,
        }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 }}>
        {children}
      </div>
    </div>
  )
}
