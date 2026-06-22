export const dynamic = 'force-dynamic'

import { initSchema, query } from '@/lib/db'
import CrmClient from './CrmClient'

export default async function CrmPage() {
  await initSchema()

  const [crm, crmRenovacao, crmServicos, parceiros] = await Promise.all([
    query('SELECT * FROM crm_leads').then(r => r.rows as any[]),
    query('SELECT * FROM crm_renovacoes').then(r => r.rows as any[]),
    query('SELECT * FROM crm_servicos').then(r => r.rows as any[]),
    query('SELECT id, nome FROM parceiros').then(r => r.rows),
  ])

  const crmParsed = crm.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))
  const renParsed = crmRenovacao.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))
  const srvParsed = crmServicos.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))

  return <CrmClient initialCrm={crmParsed} initialRenovacao={renParsed} initialServicos={srvParsed} initialParceiros={parceiros} />
}
