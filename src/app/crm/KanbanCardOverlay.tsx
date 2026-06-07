'use client'

interface Props { id: string; crm: any[] }
const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function KanbanCardOverlay({ id, crm }: Props) {
  const card = crm.find(c => c.id === id)
  if (!card) return null
  const planoLabel = card.plano === 'anual' ? '🏆 Anual' : card.plano === 'personalizado' ? '⭐ Person.' : '📅 Mensal'
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '13px 15px',
      border: '2px solid #2563EB', boxShadow: '0 12px 32px rgba(37,99,235,.25)',
      width: 268, rotate: '2deg',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{card.nome}</div>
      <div style={{ fontSize: 11, color: '#6B7280' }}>📱 {card.whats}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{fmt(card.valor || 337)}</span>
        <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 600 }}>{planoLabel}</span>
      </div>
    </div>
  )
}
