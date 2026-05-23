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
        background: '#111',
        borderRadius: 12,
        padding: 12,
        borderTop: `3px solid ${cor}`,
        opacity: isOver ? 0.85 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: cor }}>{label}</span>
        <span style={{ fontSize: 11, background: '#1e1e1e', borderRadius: 999, padding: '2px 8px', color: '#666' }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 }}>
        {children}
      </div>
    </div>
  )
}
