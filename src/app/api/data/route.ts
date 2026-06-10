export const dynamic = 'force-dynamic'

import { initSchema, query, queryRow } from '@/lib/db'
import { sendTelegram } from '@/lib/telegram'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9

export async function GET(req: Request) {
  await initSchema()
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo') || 'all'

  const actions: Record<string, () => Promise<any>> = {
    clientesMensais: () => query('SELECT * FROM clientes_mensais ORDER BY id DESC').then(r => r.rows),
    clientesAnuais: () => query('SELECT * FROM clientes_anuais ORDER BY id DESC').then(r => r.rows),
    lancamentos: () => query('SELECT * FROM lancamentos ORDER BY id DESC').then(r => r.rows),
    parceiros: () => query('SELECT * FROM parceiros ORDER BY nome').then(r => r.rows),
    parceirosSimple: () => query('SELECT id, nome FROM parceiros ORDER BY nome').then(r => r.rows),
    leadsPortal: () => query('SELECT * FROM leads_portal ORDER BY data DESC').then(r => r.rows),
    crm: async () => {
      const rows: any[] = (await query('SELECT * FROM crm_leads ORDER BY data DESC')).rows
      return rows.map(r => ({ ...r, historico: JSON.parse(r.historico || '[]') }))
    },
    crmRenovacao: async () => {
      const rows: any[] = (await query('SELECT * FROM crm_renovacoes ORDER BY data DESC')).rows
      return rows.map(r => ({ ...r, historico: JSON.parse(r.historico || '[]') }))
    },
    renovacoes: () => query('SELECT * FROM renovacoes_historico ORDER BY data DESC').then(r => r.rows),
    all: async () => {
      const [mensais, anuais, clientesMensais, clientesAnuais, lancamentos, parceiros, leads, crmRows, crmRenRows, renovacoes, totalEquiv] = await Promise.all([
        queryRow('SELECT COUNT(*)::int as t FROM clientes_mensais').then(r => r?.t || 0),
        queryRow('SELECT COUNT(*)::int as t FROM clientes_anuais').then(r => r?.t || 0),
        query('SELECT * FROM clientes_mensais ORDER BY id DESC').then(r => r.rows),
        query('SELECT * FROM clientes_anuais ORDER BY id DESC').then(r => r.rows),
        query('SELECT * FROM lancamentos ORDER BY id DESC').then(r => r.rows),
        query('SELECT * FROM parceiros ORDER BY nome').then(r => r.rows),
        query('SELECT * FROM leads_portal ORDER BY data DESC').then(r => r.rows),
        query('SELECT * FROM crm_leads').then(r => r.rows as any[]),
        query('SELECT * FROM crm_renovacoes').then(r => r.rows as any[]),
        query('SELECT * FROM renovacoes_historico ORDER BY data DESC').then(r => r.rows),
        queryRow('SELECT COALESCE(SUM(equiv), 0)::float as t FROM lancamentos').then(r => r?.t || 0),
      ])
      return {
        mensais, anuais, clientesMensais, clientesAnuais, lancamentos, parceiros, leads,
        crm: crmRows.map((r: any) => ({ ...r, historico: JSON.parse(r.historico || '[]') })),
        crmRenovacao: crmRenRows.map((r: any) => ({ ...r, historico: JSON.parse(r.historico || '[]') })),
        renovacoes, totalEquiv,
      }
    },
  }

  const result = await (actions[tipo] ? actions[tipo]() : actions.all())
  return Response.json(result)
}

export async function POST(req: Request) {
  await initSchema()
  const body = await req.json()
  const { action } = body

  try {
    if (action === 'addClienteMensal') {
      await query('INSERT INTO clientes_mensais (descricao, data, parceiro) VALUES ($1, $2, $3)', [body.descricao, body.data, body.parceiro || ''])
      return Response.json({ ok: true })
    }
    if (action === 'addClienteAnual') {
      await query('INSERT INTO clientes_anuais (descricao, data, parceiro) VALUES ($1, $2, $3)', [body.descricao, body.data, body.parceiro || ''])
      return Response.json({ ok: true })
    }
    if (action === 'editCliente') {
      const tbl = body.plano === 'mensal' ? 'clientes_mensais' : 'clientes_anuais'
      await query(`UPDATE ${tbl} SET descricao = $1, data = $2 WHERE id = $3`, [body.descricao, body.data, body.id])
      return Response.json({ ok: true })
    }
    if (action === 'delCliente') {
      const tbl = body.plano === 'mensal' ? 'clientes_mensais' : 'clientes_anuais'
      await query(`DELETE FROM ${tbl} WHERE id = $1`, [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'addLancamento') {
      const valorRec = body.tipo === 'sebrae' ? body.val / 0.3 : body.val
      const recTotal = body.qty * valorRec
      const equiv = recTotal / ANUAL
      await query('INSERT INTO lancamentos (qty, val, tipo, valorRec, recTotal, equiv, descricao, data, parceiro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [body.qty, body.val, body.tipo, valorRec, recTotal, equiv, body.descricao, body.data, body.parceiro || ''])
      return Response.json({ ok: true })
    }
    if (action === 'editLancamento') {
      const valorRec = body.tipo === 'sebrae' ? body.val / 0.3 : body.val
      const recTotal = body.qty * valorRec
      const equiv = recTotal / ANUAL
      await query('UPDATE lancamentos SET qty=$1, val=$2, tipo=$3, valorRec=$4, recTotal=$5, equiv=$6, descricao=$7, data=$8, parceiro=$9 WHERE id=$10', [body.qty, body.val, body.tipo, valorRec, recTotal, equiv, body.descricao, body.data, body.parceiro || '', body.id])
      return Response.json({ ok: true })
    }
    if (action === 'delLancamento') {
      await query('DELETE FROM lancamentos WHERE id = $1', [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'addParceiro') {
      const id = 'p_' + Date.now()
      await query('INSERT INTO parceiros (id, nome, "user", senha) VALUES ($1, $2, $3, $4)', [id, body.nome, body.user, body.senha])
      return Response.json({ ok: true, id })
    }
    if (action === 'editParceiro') {
      await query('UPDATE parceiros SET nome=$1, "user"=$2, senha=$3, whats=$4, email=$5, pix=$6 WHERE id=$7', [body.nome, body.user, body.senha, body.whats || '', body.email || '', body.pix || '', body.id])
      return Response.json({ ok: true })
    }
    if (action === 'delParceiro') {
      await query('DELETE FROM parceiros WHERE id = $1', [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'resetSenha') {
      await query('UPDATE parceiros SET senha = $1 WHERE id = $2', [body.senha, body.id])
      return Response.json({ ok: true })
    }
    if (action === 'addLead') {
      const id = 'l_' + Date.now()
      const hoje = body.data || new Date().toISOString().split('T')[0]
      await query('INSERT INTO leads_portal (id, "parceiroId", "parceiroNome", nome, whats, segmento, obs, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, body.parceiroId, body.parceiroNome, body.nome, body.whats, body.segmento || '', body.obs || '', hoje])
      const crmId = 'crm_' + id
      await query('INSERT INTO crm_leads (id, "leadId", nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10, $11, $12)', [crmId, id, body.nome, body.whats, body.segmento || '', body.obs || '', body.parceiroId || '', body.parceiroNome || '', 'mensal', MENSAL, hoje, JSON.stringify([{ etapa: 0, data: hoje, user: 'Portal Parceiro' }])])
      sendTelegram('📨 <b>Nova indicação de parceiro!</b>\nParceiro: ' + (body.parceiroNome || '—') + '\nCliente: ' + body.nome + '\nWhats: ' + body.whats)
      return Response.json({ ok: true, id })
    }
    if (action === 'editLead') {
      await query('UPDATE leads_portal SET nome=$1, whats=$2, segmento=$3, obs=$4 WHERE id=$5', [body.nome, body.whats, body.segmento, body.obs, body.id])
      return Response.json({ ok: true })
    }
    if (action === 'delLead') {
      await query('DELETE FROM leads_portal WHERE id = $1', [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'criarCrmLead') {
      const id = 'crm_' + Date.now()
      const valor = body.valor || MENSAL
      await query('INSERT INTO crm_leads (id, "leadId", nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10, $11, $12)', [id, null, body.nome, body.whats, body.segmento || '', body.obs || '', body.parceiro || '', body.parceiroNome || '', body.plano || 'mensal', valor, body.data || new Date().toISOString().split('T')[0], JSON.stringify([{ etapa: 0, data: new Date().toISOString().split('T')[0], user: body.user || 'Sistema' }])])
      sendTelegram('📋 <b>Novo lead manual no CRM!</b>\nNome: ' + body.nome + '\nWhats: ' + body.whats + '\nPlano: ' + (body.plano || 'mensal') + '\nValor: R$ ' + valor.toLocaleString('pt-BR'))
      return Response.json({ ok: true, id })
    }
    if (action === 'moverLead') {
      await query('UPDATE crm_leads SET etapa = $1, historico = $2 WHERE id = $3', [body.etapa, JSON.stringify(body.historico), body.id])
      return Response.json({ ok: true })
    }
    if (action === 'atribuirResponsavel') {
      await query('UPDATE crm_leads SET responsavel = $1 WHERE id = $2', [body.responsavel || null, body.id])
      return Response.json({ ok: true })
    }
    if (action === 'confirmarPagamento') {
      const lead = await queryRow('SELECT * FROM crm_leads WHERE id = $1', [body.id])
      if (!lead) return Response.json({ error: 'Lead não encontrado' }, { status: 404 })
      let valorFechado = MENSAL
      if (body.plano === 'anual') valorFechado = ANUAL
      else if (body.plano === 'personalizado') valorFechado = body.tipo === 'sebrae' ? body.valor / 0.3 : body.valor
      const nomeCliente = body.razaoSocial?.trim() || lead.nome
      if (body.plano === 'mensal') await query('INSERT INTO clientes_mensais (descricao, data, parceiro) VALUES ($1, $2, $3)', [nomeCliente, body.data, lead.parceiro || ''])
      else if (body.plano === 'anual') await query('INSERT INTO clientes_anuais (descricao, data, parceiro) VALUES ($1, $2, $3)', [nomeCliente, body.data, lead.parceiro || ''])
      else if (body.plano === 'personalizado') {
        const recTotal = valorFechado; const equiv = recTotal / ANUAL
        await query('INSERT INTO lancamentos (qty,val,tipo,valorRec,recTotal,equiv,descricao,data,parceiro) VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8)', [body.valor, body.tipo || 'recebido', valorFechado, recTotal, equiv, nomeCliente, body.data, lead.parceiro || ''])
      }
      // Atualiza lead do parceiro: indicado → fechado
      if (lead.leadId) await query('UPDATE leads_portal SET status = $1 WHERE id = $2', ['fechado', lead.leadId])
      // Calcula e acumula comissão do parceiro
      if (lead.parceiro) {
        const fechadosRes = await queryRow('SELECT COUNT(*) as total FROM crm_leads WHERE parceiro = $1 AND etapa >= 4', [lead.parceiro])
        const totalFechados = parseInt(fechadosRes?.total || '0') // conta o atual (já vai ser 4 ao final)
        const posicao = totalFechados + 1
        const comissao = posicao >= 11 ? 300 : posicao >= 7 ? 250 : posicao >= 4 ? 200 : 150
        await query('UPDATE parceiros SET "aReceber" = COALESCE("aReceber", 0) + $1 WHERE id = $2', [comissao, lead.parceiro])
      }
      const historico = JSON.parse(lead.historico || '[]')
      historico.push({ etapa: 4, data: body.data, user: body.user || 'Sistema', plano: body.plano })
      await query('UPDATE crm_leads SET etapa=4, plano=$1, valor=$2, historico=$3 WHERE id=$4', [body.plano, valorFechado, JSON.stringify(historico), body.id])
      sendTelegram('💳 <b>Venda fechada!</b>\nCliente: ' + nomeCliente + '\nPlano: ' + body.plano + '\nValor: R$ ' + valorFechado.toLocaleString('pt-BR') + '\nUsuário: ' + (body.user || 'Sistema'))
      return Response.json({ ok: true })
    }
    if (action === 'excluirCrmLead') {
      const lead = await queryRow('SELECT * FROM crm_leads WHERE id = $1', [body.id])
      if (lead?.leadId) await query('DELETE FROM leads_portal WHERE id = $1', [lead.leadId])
      if (lead?.etapa >= 4) {
        const nome = lead.nome
        if (lead.plano === 'mensal') await query('DELETE FROM clientes_mensais WHERE descricao = $1', [nome])
        else if (lead.plano === 'anual') await query('DELETE FROM clientes_anuais WHERE descricao = $1', [nome])
      }
      await query('DELETE FROM crm_leads WHERE id = $1', [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'criarRenovacao') {
      const id = 'ren_' + Date.now()
      const valor = body.valor || MENSAL
      await query('INSERT INTO crm_renovacoes (id, nome, whats, segmento, obs, plano, valor, tipoCustom, etapa, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10)', [id, body.nome, body.whats, body.segmento || '', body.obs || '', body.plano || 'mensal', valor, body.tipoCustom || 'recebido', body.data || new Date().toISOString().split('T')[0], JSON.stringify([{ etapa: 0, data: new Date().toISOString().split('T')[0], user: body.user || 'Sistema' }])])
      return Response.json({ ok: true, id })
    }
    if (action === 'moverRenovacao') {
      await query('UPDATE crm_renovacoes SET etapa = $1, historico = $2 WHERE id = $3', [body.etapa, JSON.stringify(body.historico), body.id])
      return Response.json({ ok: true })
    }
    if (action === 'confirmarRenovacao') {
      const ren = await queryRow('SELECT * FROM crm_renovacoes WHERE id = $1', [body.id])
      if (!ren) return Response.json({ error: 'Não encontrada' }, { status: 404 })
      let valorFechado = MENSAL
      if (body.plano === 'anual') valorFechado = ANUAL
      else if (body.plano === 'personalizado') valorFechado = body.tipo === 'sebrae' ? body.valor / 0.3 : body.valor
      await query('INSERT INTO renovacoes_historico (clienteId, nome, plano, valor, tipo, data, "user") VALUES ($1, $2, $3, $4, $5, $6, $7)', [body.id, ren.nome, body.plano, valorFechado, body.tipo || 'recebido', body.data || new Date().toISOString().split('T')[0], body.user || 'Sistema'])
      const historico = JSON.parse(ren.historico || '[]')
      historico.push({ etapa: 3, data: body.data, user: body.user || 'Sistema', plano: body.plano })
      await query('UPDATE crm_renovacoes SET etapa=3, plano=$1, valor=$2, historico=$3 WHERE id=$4', [body.plano, valorFechado, JSON.stringify(historico), body.id])
      sendTelegram('🔄 <b>Renovação confirmada!</b>\nCliente: ' + ren.nome + '\nPlano: ' + body.plano + '\nValor: R$ ' + valorFechado.toLocaleString('pt-BR'))
      return Response.json({ ok: true })
    }
    if (action === 'excluirRenovacao') {
      await query('DELETE FROM crm_renovacoes WHERE id = $1', [body.id])
      return Response.json({ ok: true })
    }
    if (action === 'importarLeads') {
      const leads: any[] = (await query('SELECT * FROM leads_portal')).rows
      const crmIds = new Set((await query('SELECT "leadId" FROM crm_leads WHERE "leadId" IS NOT NULL')).rows.map((r: any) => r.leadId))
      let novos = 0
      for (const l of leads) {
        if (!crmIds.has(l.id)) {
          await query('INSERT INTO crm_leads (id, "leadId", nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10, $11, $12)', ['crm_' + l.id, l.id, l.nome, l.whats, l.segmento || '', l.obs || '', l.parceiroId || '', l.parceiroNome || '', 'mensal', MENSAL, l.data || new Date().toISOString().split('T')[0], JSON.stringify([{ etapa: 0, data: l.data || new Date().toISOString().split('T')[0], user: 'Sistema' }])])
          novos++
        }
      }
      return Response.json({ ok: true, novos })
    }
    if (action === 'loginParceiro') {
      const p = await queryRow('SELECT * FROM parceiros WHERE "user" = $1 AND senha = $2', [body.user, body.senha])
      if (!p) return Response.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
      const [fechadosRes, leadsPortalRes] = await Promise.all([
        query('SELECT id, "leadId", nome, plano, valor, data FROM crm_leads WHERE parceiro = $1 AND etapa >= 4 ORDER BY data DESC', [p.id]),
        query('SELECT * FROM leads_portal WHERE "parceiroId" = $1 ORDER BY data DESC', [p.id]),
      ])
      const fechados: any[] = fechadosRes.rows
      const fechadosLeadIds = new Set(fechados.map((r: any) => r.leadId).filter(Boolean))
      const leadsAtivos: any[] = leadsPortalRes.rows.filter((l: any) => !fechadosLeadIds.has(l.id))
      const totalFechados = fechados.length
      const comissao = totalFechados <= 3 ? 150 : totalFechados <= 6 ? 200 : totalFechados <= 10 ? 250 : 300
      return Response.json({
        parceiro: p,
        totalClientes: totalFechados,
        totalFechados: totalFechados,
        totalLeads: leadsPortalRes.rows.length,
        comissaoAtual: comissao,
        aReceber: p.aReceber || 0,
        recebido: p.liberado || 0,
        clientes: fechados,
        leadsAtivos,
        recorencia: totalFechados * 50,
      })
    }
    if (action === 'aceitarTermo') {
      await query('UPDATE parceiros SET "termoAceito" = 1, "termoData" = $1, "termoVersao" = $2, "termoIp" = $3 WHERE id = $4', [body.data, body.versao, body.ip, body.id])
      return Response.json({ ok: true })
    }
    if (action === 'editarPerfilParceiro') {
      await query('UPDATE parceiros SET nome=$1, whats=$2, email=$3, nascimento=$4, pix=$5 WHERE id=$6', [body.nome, body.whats, body.email, body.nascimento, body.pix, body.id])
      return Response.json({ ok: true })
    }
    return Response.json({ error: 'Ação desconhecida: ' + action }, { status: 400 })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
