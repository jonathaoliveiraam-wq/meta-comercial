import { initSchema, getDb } from '@/lib/db'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9
const META = 240

export async function GET() {
  initSchema()
  const db = getDb()

  const mensais = db.prepare('SELECT COUNT(*) as total FROM clientes_mensais').get() as { total: number }
  const anuais = db.prepare('SELECT COUNT(*) as total FROM clientes_anuais').get() as { total: number }
  const lancamentos = db.prepare('SELECT * FROM lancamentos').all() as { equiv: number; recTotal: number }[]
  const clientesMensais = db.prepare('SELECT * FROM clientes_mensais').all()
  const clientesAnuais = db.prepare('SELECT * FROM clientes_anuais').all()
  const parceiros = db.prepare('SELECT * FROM parceiros').all()

  const totalEquiv = lancamentos.reduce((s, l) => s + l.equiv, 0)
  const totalClientes = mensais.total + anuais.total + totalEquiv
  const receitaMensal = mensais.total * MENSAL
  const receitaAnual = anuais.total * ANUAL
  const receitaLancamentos = lancamentos.reduce((s, l) => s + l.recTotal, 0)
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
