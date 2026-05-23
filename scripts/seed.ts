import { initSchema, getDb } from '../src/lib/db'
import fs from 'fs'
import path from 'path'

const DUMP_PATH = path.join(process.cwd(), '..', 'meta-comercial', 'dump.json')

function main() {
  console.log('Inicializando schema...')
  initSchema()

  if (!fs.existsSync(DUMP_PATH)) {
    console.log('Arquivo dump.json não encontrado em:', DUMP_PATH)
    console.log('Usando banco vazio.')
    return
  }

  const raw = fs.readFileSync(DUMP_PATH, 'utf-8')
  const { record } = JSON.parse(raw)
  const db = getDb()

  // Clientes Mensais
  if (record.clientesMensais?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO clientes_mensais (descricao, data, parceiro) VALUES (?, ?, ?)'
    )
    for (const c of record.clientesMensais) {
      insert.run(c.desc, c.data, c.parceiro || '')
    }
    console.log(`  ${record.clientesMensais.length} clientes mensais`)
  }

  // Clientes Anuais
  if (record.clientesAnuais?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO clientes_anuais (descricao, data, parceiro) VALUES (?, ?, ?)'
    )
    for (const c of record.clientesAnuais) {
      insert.run(c.desc, c.data, c.parceiro || '')
    }
    console.log(`  ${record.clientesAnuais.length} clientes anuais`)
  }

  // Lançamentos
  if (record.lancamentos?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO lancamentos (qty, val, tipo, valorRec, recTotal, equiv, descricao, data, parceiro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    for (const l of record.lancamentos) {
      insert.run(l.qty, l.val, l.tipo, l.valorRec, l.recTotal, l.equiv, l.desc, l.data, l.parceiro || '')
    }
    console.log(`  ${record.lancamentos.length} lançamentos`)
  }

  // Parceiros
  if (record.parceiros?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO parceiros (id, nome, user, senha, termoAceito, termoData, termoVersao, termoIp, whats, email, nascimento, pix) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    for (const p of record.parceiros) {
      insert.run(
        p.id, p.nome, p.user, p.senha,
        p.termoAceito ? 1 : 0, p.termoData || null, p.termoVersao || null, p.termoIp || null,
        p.whats || '', p.email || '', p.nascimento || '', p.pix || ''
      )
    }
    console.log(`  ${record.parceiros.length} parceiros`)
  }

  // CRM Leads
  if (record.crm?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO crm_leads (id, leadId, nome, whats, segmento, obs, parceiro, parceiroNome, etapa, plano, valor, data, historico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    for (const c of record.crm) {
      insert.run(
        c.id, c.leadId || null, c.nome, c.whats, c.segmento || '',
        c.obs || '', c.parceiro || '', c.parceiroNome || '',
        c.etapa ?? 0, c.plano || 'mensal', c.valor ?? 337,
        c.data, JSON.stringify(c.historico || [])
      )
    }
    console.log(`  ${record.crm.length} leads CRM`)
  }

  // CRM Renovações
  if (record.crmRenovacao?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO crm_renovacoes (id, nome, whats, segmento, obs, plano, valor, tipoCustom, etapa, data, historico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    for (const c of record.crmRenovacao) {
      insert.run(
        c.id, c.nome, c.whats, c.segmento || '', c.obs || '',
        c.plano || 'mensal', c.valor ?? 337, c.tipoCustom || 'recebido',
        c.etapa ?? 0, c.data, JSON.stringify(c.historico || [])
      )
    }
    console.log(`  ${record.crmRenovacao.length} renovações CRM`)
  }

  // Renovações Histórico
  if (record.renovacoes?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO renovacoes_historico (clienteId, nome, plano, valor, tipo, data, user) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    for (const r of record.renovacoes) {
      insert.run(r.clienteId, r.nome, r.plano, r.valor, r.tipo || 'recebido', r.data, r.user)
    }
    console.log(`  ${record.renovacoes.length} renovações histórico`)
  }

  // Leads Portal
  if (record.leads?.length) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO leads_portal (id, parceiroId, parceiroNome, nome, whats, segmento, obs, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    for (const l of record.leads) {
      insert.run(l.id, l.parceiroId, l.parceiroNome, l.nome, l.whats, l.segmento || '', l.obs || '', l.data)
    }
    console.log(`  ${record.leads.length} leads portal`)
  }

  // Config
  if (record.mensais != null) {
    db.prepare('INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)').run('total_mensais', String(record.mensais))
  }
  if (record.anuais != null) {
    db.prepare('INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)').run('total_anuais', String(record.anuais))
  }

  console.log('Seed concluído com sucesso!')
}

main()
