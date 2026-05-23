import { initSchema, query, queryRow } from '@/lib/db'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9

export async function GET() {
  await initSchema()

  const [crmRows, crmRenRows, parceiros, leads] = await Promise.all([
    query('SELECT * FROM crm_leads'),
    query('SELECT * FROM crm_renovacoes'),
    query('SELECT id, nome FROM parceiros'),
    query('SELECT * FROM leads_portal'),
  ])
  const crm: any[] = crmRows.rows
  const crmRenovacao: any[] = crmRenRows.rows

  const parsed = crm.map((c: any) => ({
    ...c,
    historico: JSON.parse(c.historico || '[]'),
  }))
  const parsedRen = crmRenovacao.map((c: any) => ({
    ...c,
    historico: JSON.parse(c.historico || '[]'),
  }))

  return Response.json({ crm: parsed, crmRenovacao: parsedRen, parceiros, leads })
}

export async function PUT(request: Request) {
  await initSchema()
  const body = await request.json()

  if (body.action === 'moverLead') {
    await query('UPDATE crm_leads SET etapa = $1, historico = $2 WHERE id = $3', [body.etapa, JSON.stringify(body.historico), body.id])
    return Response.json({ ok: true })
  }

  if (body.action === 'moverRenovacao') {
    await query('UPDATE crm_renovacoes SET etapa = $1, historico = $2 WHERE id = $3', [body.etapa, JSON.stringify(body.historico), body.id])
    return Response.json({ ok: true })
  }

  if (body.action === 'confirmarPagamento') {
    const lead = await queryRow('SELECT * FROM crm_leads WHERE id = $1', [body.id])
    if (!lead) return Response.json({ error: 'Lead não encontrado' }, { status: 404 })

    let valorFechado = MENSAL
    if (body.plano === 'anual') valorFechado = ANUAL
    else if (body.plano === 'personalizado') {
      valorFechado = body.tipo === 'sebrae' ? body.valor / 0.3 : body.valor
    }

    if (body.plano === 'mensal') {
      await query('INSERT INTO clientes_mensais (descricao, data, parceiro) VALUES ($1, $2, $3)', [lead.nome, body.data, lead.parceiro || ''])
    } else if (body.plano === 'anual') {
      await query('INSERT INTO clientes_anuais (descricao, data, parceiro) VALUES ($1, $2, $3)', [lead.nome, body.data, lead.parceiro || ''])
    } else if (body.plano === 'personalizado') {
      const recTotal = valorFechado
      const equiv = recTotal / ANUAL
      await query('INSERT INTO lancamentos (qty, val, tipo, valorRec, recTotal, equiv, descricao, data, parceiro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [1, body.valor, body.tipo || 'recebido', valorFechado, recTotal, equiv, lead.nome, body.data, lead.parceiro || ''])
    }

    const historico = JSON.parse(lead.historico || '[]')
    historico.push({ etapa: 4, data: body.data, user: body.user || 'Sistema', plano: body.plano })
    await query('UPDATE crm_leads SET etapa = 4, plano = $1, valor = $2, historico = $3 WHERE id = $4', [body.plano, valorFechado, JSON.stringify(historico), body.id])

    return Response.json({ ok: true })
  }

  if (body.action === 'criarLead') {
    const novoLead = {
      id: 'crm_' + Date.now(),
      leadId: null,
      nome: body.nome,
      whats: body.whats,
      segmento: body.segmento || '',
      obs: body.obs || '',
      parceiro: body.parceiro || '',
      parceiroNome: body.parceiroNome || '',
      etapa: 0,
      plano: body.plano || 'mensal',
      valor: body.valor || MENSAL,
      data: body.data || new Date().toISOString().split('T')[0],
      historico: JSON.stringify([{ etapa: 0, data: body.data || new Date().toISOString().split('T')[0], user: body.user || 'Sistema' }]),
    }
    await query('INSERT INTO crm_leads (id, "leadId", nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [novoLead.id, novoLead.leadId, novoLead.nome, novoLead.whats, novoLead.segmento, novoLead.obs, novoLead.parceiro, novoLead.parceiroNome, novoLead.etapa, novoLead.plano, novoLead.valor, novoLead.data, novoLead.historico])
    return Response.json({ ok: true, id: novoLead.id })
  }

  if (body.action === 'excluirLead') {
    await query('DELETE FROM crm_leads WHERE id = $1', [body.id])
    return Response.json({ ok: true })
  }

  return Response.json({ error: 'Ação desconhecida' }, { status: 400 })
}
