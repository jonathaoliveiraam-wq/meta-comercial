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
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({
    id,
    data: { etapa },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  const planoLabel = plano === 'anual' ? '🏆 Anual' : plano === 'personalizado' ? '⭐ Person.' : '📅 Mensal'

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: '#1a1a1a',
        borderRadius: 10,
        padding: 12,
        border: '1px solid #222',
        transition: transition || 'box-shadow 0.15s',
        touchAction: 'none',
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{nome}</div>
      <div style={{ fontSize: 11, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>
        📱 {whats}{segmento ? ' · ' + segmento : ''}
      </div>
      {parceiroNome && (
        <div style={{ fontSize: 10, background: '#7c3aed18', border: '1px solid #7c3aed33', color: '#a78bfa', borderRadius: 20, padding: '2px 8px', display: 'inline-block', marginBottom: 8 }}>
          🤝 {parceiroNome}
        </div>
      )}
      {obs && <div style={{ fontSize: 11, color: '#444', fontStyle: 'italic', marginBottom: 6 }}>"{obs}"</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#444' }}>📅 {fmtData(data)}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#00e676' }}>
          {fmt(valor)} <span style={{ fontSize: 10, color: '#555' }}>{planoLabel}</span>
        </span>
      </div>
    </div>
  )
}
