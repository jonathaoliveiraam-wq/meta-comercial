export const dynamic = 'force-dynamic'

import { initSchema, query, queryRow } from '@/lib/db'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9
const META = 240

export async function GET() {
  await initSchema()

  const [mensais, anuais, lancResult, clientesMensaisResult, clientesAnuaisResult, parceirosResult] = await Promise.all([
    queryRow('SELECT COUNT(*)::int as total FROM clientes_mensais').then(r => r || { total: 0 }),
    queryRow('SELECT COUNT(*)::int as total FROM clientes_anuais').then(r => r || { total: 0 }),
    query('SELECT * FROM lancamentos'),
    query('SELECT * FROM clientes_mensais'),
    query('SELECT * FROM clientes_anuais'),
    query('SELECT * FROM parceiros'),
  ])
  const lancamentos: { equiv: number; recTotal: number }[] = lancResult.rows
  const clientesMensais = clientesMensaisResult.rows
  const clientesAnuais = clientesAnuaisResult.rows
  const parceiros = parceirosResult.rows

  const totalEquiv = lancamentos.reduce((s: number, l) => s + l.equiv, 0)
  const totalClientes = mensais.total + anuais.total + totalEquiv
  const receitaMensal = mensais.total * MENSAL
  const receitaAnual = anuais.total * ANUAL
  const receitaLancamentos = lancamentos.reduce((s: number, l) => s + l.recTotal, 0)
  const receitaTotal = receitaMensal + receitaAnual + receitaLancamentos
  const faltam = Math.max(0, META - totalClientes)

  return Response.json({
    meta: META,
    mensais: mensais.total,
    anuais: anuais.total,
    totalClientes: Math.round(totalClientes * 10) / 10,
    faltam: Math.round(faltam * 10) / 10,
    receitaTotal,
    receitaNaMeta: META * MENSAL,
    clientesMensais,
    clientesAnuais,
    lancamentos,
    parceiros,
  })
}
