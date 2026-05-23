import { initSchema, getDb } from '@/lib/db'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9

export async function GET() {
  initSchema()
  const db = getDb()

  const crm = db.prepare('SELECT * FROM crm_leads').all()
  const crmRenovacao = db.prepare('SELECT * FROM crm_renovacoes').all()
  const parceiros = db.prepare('SELECT id, nome FROM parceiros').all()
  const leads = db.prepare('SELECT * FROM leads_portal').all()

  const parsed = (crm as any[]).map(c => ({
    ...c,
    historico: JSON.parse(c.historico || '[]'),
  }))
  const parsedRen = (crmRenovacao as any[]).map(c => ({
    ...c,
    historico: JSON.parse(c.historico || '[]'),
  }))

  return Response.json({ crm: parsed, crmRenovacao: parsedRen, parceiros, leads })
}

export async function PUT(request: Request) {
  initSchema()
  const body = await request.json()
  const db = getDb()

  if (body.action === 'moverLead') {
    db.prepare('UPDATE crm_leads SET etapa = ?, historico = ? WHERE id = ?').run(
      body.etapa, JSON.stringify(body.historico), body.id
    )
    return Response.json({ ok: true })
  }

  if (body.action === 'moverRenovacao') {
    db.prepare('UPDATE crm_renovacoes SET etapa = ?, historico = ? WHERE id = ?').run(
      body.etapa, JSON.stringify(body.historico), body.id
    )
    return Response.json({ ok: true })
  }

  if (body.action === 'confirmarPagamento') {
    const lead = db.prepare('SELECT * FROM crm_leads WHERE id = ?').get(body.id) as any
    if (!lead) return Response.json({ error: 'Lead não encontrado' }, { status: 404 })

    let valorFechado = MENSAL
    if (body.plano === 'anual') valorFechado = ANUAL
    else if (body.plano === 'personalizado') {
      valorFechado = body.tipo === 'sebrae' ? body.valor / 0.3 : body.valor
    }

    if (body.plano === 'mensal') {
      db.prepare('INSERT INTO clientes_mensais (descricao, data, parceiro) VALUES (?, ?, ?)').run(lead.nome, body.data, lead.parceiro || '')
    } else if (body.plano === 'anual') {
      db.prepare('INSERT INTO clientes_anuais (descricao, data, parceiro) VALUES (?, ?, ?)').run(lead.nome, body.data, lead.parceiro || '')
    } else if (body.plano === 'personalizado') {
      const recTotal = valorFechado
      const equiv = recTotal / ANUAL
      db.prepare('INSERT INTO lancamentos (qty, val, tipo, valorRec, recTotal, equiv, descricao, data, parceiro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        1, body.valor, body.tipo || 'recebido', valorFechado, recTotal, equiv, lead.nome, body.data, lead.parceiro || ''
      )
    }

    const historico = JSON.parse(lead.historico || '[]')
    historico.push({ etapa: 4, data: body.data, user: body.user || 'Sistema', plano: body.plano })
    db.prepare('UPDATE crm_leads SET etapa = 4, plano = ?, valor = ?, historico = ? WHERE id = ?').run(
      body.plano, valorFechado, JSON.stringify(historico), body.id
    )

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
    db.prepare(`INSERT INTO crm_leads (id, leadId, nome, whats, segmento, obs, parceiro, parceiroNome, etapa, plano, valor, data, historico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      novoLead.id, novoLead.leadId, novoLead.nome, novoLead.whats, novoLead.segmento, novoLead.obs,
      novoLead.parceiro, novoLead.parceiroNome, novoLead.etapa, novoLead.plano, novoLead.valor, novoLead.data, novoLead.historico
    )
    return Response.json({ ok: true, id: novoLead.id })
  }

  if (body.action === 'excluirLead') {
    db.prepare('DELETE FROM crm_leads WHERE id = ?').run(body.id)
    return Response.json({ ok: true })
  }

  return Response.json({ error: 'Ação desconhecida' }, { status: 400 })
}
