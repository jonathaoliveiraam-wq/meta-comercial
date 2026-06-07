'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  id: string; etapa: number; nome: string; whats: string
  segmento: string; parceiroNome: string; obs: string
  data: string; valor: number; plano: string
}

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtData = (d: string) => d ? d.split('-').reverse().join('/') : '—'

export default function KanbanCard({ id, etapa, nome, whats, segmento, parceiroNome, obs, data, valor, plano }: Props) {
  const [hovered, setHovered] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: { etapa } })

  const planoColor = plano === 'anual' ? '#8B5CF6' : plano === 'personalizado' ? '#F59E0B' : '#0EA5E9'
  const planoBg   = plano === 'anual' ? '#F5F3FF' : plano === 'personalizado' ? '#FFFBEB' : '#F0F9FF'
  const planoLabel = plano === 'anual' ? '🏆 Anual' : plano === 'personalizado' ? '⭐ Person.' : '📅 Mensal'

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: isDragging
          ? CSS.Transform.toString(transform)
          : hovered
            ? `${CSS.Transform.toString(transform) || 'translate3d(0,0,0)'} translateY(-2px)`
            : CSS.Transform.toString(transform),
        transition: transition || 'all 0.18s ease',
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        background: hovered ? '#FAFBFF' : '#fff',
        borderRadius: 10,
        padding: '11px 13px',
        border: hovered ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
        boxShadow: hovered
          ? '0 6px 16px rgba(37,99,235,.12), 0 2px 4px rgba(0,0,0,.04)'
          : '0 1px 3px rgba(0,0,0,.06)',
        touchAction: 'none',
      }}
      {...attributes} {...listeners}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{nome}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: parceiroNome || obs ? 7 : 0, lineHeight: 1.5 }}>
        📱 {whats}{segmento ? ' · ' + segmento : ''}
      </div>
      {parceiroNome && (
        <div style={{ fontSize: 10, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', borderRadius: 20, padding: '2px 8px', display: 'inline-block', marginBottom: 6, fontWeight: 600 }}>
          🤝 {parceiroNome}
        </div>
      )}
      {obs && <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 6 }}>"{obs}"</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: 10, color: '#9CA3AF' }}>📅 {fmtData(data)}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
          {fmt(valor)}
          <span style={{ fontSize: 10, color: planoColor, background: planoBg, padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>{planoLabel}</span>
        </span>
      </div>
    </div>
  )
}
