'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  id: string
  etapa: number
  nome: string
  whats: string
  segmento: string
  parceiroNome: string
  obs: string
  data: string
  valor: number
  plano: string
}

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtData = (d: string) => d ? d.split('-').reverse().join('/') : '—'

export default function KanbanCard({ id, etapa, nome, whats, segmento, parceiroNome, obs, data, valor, plano }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { etapa },
  })

  const planoLabel = plano === 'anual' ? '🏆 Anual' : plano === 'personalizado' ? '⭐ Person.' : '📅 Mensal'
  const planoColor = plano === 'anual' ? '#C084FC' : plano === 'personalizado' ? '#FBBF24' : '#38BDF8'

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        cursor: 'grab',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: '12px 14px',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        touchAction: 'none',
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{nome}</div>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8, lineHeight: 1.5 }}>
        📱 {whats}{segmento ? ' · ' + segmento : ''}
      </div>
      {parceiroNome && (
        <div style={{
          fontSize: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
          color: '#818CF8', borderRadius: 20, padding: '2px 8px', display: 'inline-block', marginBottom: 8,
        }}>
          🤝 {parceiroNome}
        </div>
      )}
      {obs && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic', marginBottom: 6 }}>"{obs}"</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#475569' }}>📅 {fmtData(data)}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>
          {fmt(valor)} <span style={{ fontSize: 10, color: planoColor, fontWeight: 600 }}>{planoLabel}</span>
        </span>
      </div>
    </div>
  )
}
