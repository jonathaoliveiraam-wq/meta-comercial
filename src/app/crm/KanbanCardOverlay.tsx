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
        background: 'rgba(15,12,36,0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: 14,
        padding: '14px 16px',
        border: '2px solid rgba(99,102,241,0.6)',
        boxShadow: '0 12px 40px rgba(79,70,229,0.35)',
        width: 268,
        rotate: '2deg',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{card.nome}</div>
      <div style={{ fontSize: 11, color: '#64748B' }}>📱 {card.whats}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>
          {fmt(card.valor || 337)}
        </span>
        <span style={{ fontSize: 10, color: '#818CF8', fontWeight: 600 }}>{planoLabel}</span>
      </div>
    </div>
  )
}
