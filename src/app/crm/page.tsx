import { initSchema, getDb } from '@/lib/db'
import CrmClient from './CrmClient'

export default async function CrmPage() {
  initSchema()
  const db = getDb()

  const crm = db.prepare('SELECT * FROM crm_leads').all() as any[]
  const crmRenovacao = db.prepare('SELECT * FROM crm_renovacoes').all() as any[]
  const parceiros = db.prepare('SELECT id, nome FROM parceiros').all() as any[]

  const crmParsed = crm.map(c => ({ ...c, historico: JSON.parse(c.historico || '[]') }))
  const renParsed = crmRenovacao.map(c => ({ ...c, historico: JSON.parse(c.historico || '[]') }))

  return <CrmClient initialCrm={crmParsed} initialRenovacao={renParsed} initialParceiros={parceiros} />
}
