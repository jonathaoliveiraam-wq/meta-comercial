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
  const { setNodeRef, isOver } = useDroppable({ id: `col-${id}`, data: { etapa } })

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 272, flexShrink: 0,
        background: isOver ? '#F0F4FF' : '#F3F4F6',
        borderRadius: 14, padding: '12px 10px',
        border: `1px solid ${isOver ? '#BFDBFE' : '#E5E7EB'}`,
        borderTop: `3px solid ${cor}`,
        transition: 'all 0.15s',
        boxShadow: isOver ? `0 0 0 2px ${cor}22` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: cor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontSize: 11, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999, padding: '2px 8px', color: '#6B7280', fontWeight: 600 }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minHeight: 60 }}>
        {children}
      </div>
    </div>
  )
}
