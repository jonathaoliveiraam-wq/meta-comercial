'use client'

interface Props {
  id: string
  crm: any[]
}

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function KanbanCardOverlay({ id, crm }: Props) {
  const card = crm.find(c => c.id === id)
  if (!card) return null

  const planoLabel = card.plano === 'anual' ? '🏆 Anual' : card.plano === 'personalizado' ? '⭐ Person.' : '📅 Mensal'

  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 10,
        padding: 12,
        border: '2px solid #7c3aed',
        boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
        width: 260,
        rotate: '2deg',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.nome}</div>
      <div style={{ fontSize: 11, color: '#555' }}>📱 {card.whats}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#00e676' }}>
          {fmt(card.valor || 337)}
        </span>
        <span style={{ fontSize: 10, color: '#555' }}>{planoLabel}</span>
      </div>
    </div>
  )
}
