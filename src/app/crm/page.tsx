export const dynamic = 'force-dynamic'

import { initSchema, query } from '@/lib/db'
import CrmClient from './CrmClient'
import { sessaoDaPagina } from '@/lib/session'

export default async function CrmPage() {
  // Sem sessão da equipe a página não leva dados: o cliente mostra o login e recarrega depois
  if ((await sessaoDaPagina())?.t !== 'equipe') {
    return <CrmClient initialCrm={[]} initialRenovacao={[]} initialServicos={[]} initialParceiros={[]} />
  }

  await initSchema()

  const [crm, crmRenovacao, crmServicos, parceiros] = await Promise.all([
    query('SELECT * FROM crm_leads ORDER BY data DESC, id DESC').then(r => r.rows as any[]),
    query('SELECT * FROM crm_renovacoes ORDER BY data DESC, id DESC').then(r => r.rows as any[]),
    query('SELECT * FROM crm_servicos ORDER BY data DESC, id DESC').then(r => r.rows as any[]),
    query('SELECT id, nome FROM parceiros').then(r => r.rows),
  ])

  const crmParsed = crm.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))
  const renParsed = crmRenovacao.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))
  const srvParsed = crmServicos.map((c: any) => ({ ...c, historico: JSON.parse(c.historico || '[]') }))

  return <CrmClient initialCrm={crmParsed} initialRenovacao={renParsed} initialServicos={srvParsed} initialParceiros={parceiros} />
}
