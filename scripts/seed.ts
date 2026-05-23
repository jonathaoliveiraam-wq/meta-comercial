import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { initSchema, query } from '../src/lib/db'
import fs from 'fs'
import path from 'path'

const DUMP_PATH = path.join(process.cwd(), '..', 'meta-comercial', 'dump.json')

async function main() {
  console.log('Inicializando schema...')
  await initSchema()

  if (!fs.existsSync(DUMP_PATH)) {
    console.log('Arquivo dump.json não encontrado em:', DUMP_PATH)
    console.log('Usando banco vazio.')
    return
  }

  const raw = fs.readFileSync(DUMP_PATH, 'utf-8')
  const { record } = JSON.parse(raw)

  // Clientes Mensais
  if (record.clientesMensais?.length) {
    for (const c of record.clientesMensais) {
      await query(
        'INSERT INTO clientes_mensais (descricao, data, parceiro) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [c.desc, c.data, c.parceiro || '']
      )
    }
    console.log(`  ${record.clientesMensais.length} clientes mensais`)
  }

  // Clientes Anuais
  if (record.clientesAnuais?.length) {
    for (const c of record.clientesAnuais) {
      await query(
        'INSERT INTO clientes_anuais (descricao, data, parceiro) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [c.desc, c.data, c.parceiro || '']
      )
    }
    console.log(`  ${record.clientesAnuais.length} clientes anuais`)
  }

  // Lançamentos
  if (record.lancamentos?.length) {
    for (const l of record.lancamentos) {
      await query(
        'INSERT INTO lancamentos (qty, val, tipo, valorRec, recTotal, equiv, descricao, data, parceiro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
        [l.qty, l.val, l.tipo, l.valorRec, l.recTotal, l.equiv, l.desc, l.data, l.parceiro || '']
      )
    }
    console.log(`  ${record.lancamentos.length} lançamentos`)
  }

  // Parceiros
  if (record.parceiros?.length) {
    for (const p of record.parceiros) {
      await query(
        'INSERT INTO parceiros (id, nome, "user", senha, termoAceito, termoData, termoVersao, termoIp, whats, email, nascimento, pix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING',
        [p.id, p.nome, p.user, p.senha, p.termoAceito ? 1 : 0, p.termoData || null, p.termoVersao || null, p.termoIp || null, p.whats || '', p.email || '', p.nascimento || '', p.pix || '']
      )
    }
    console.log(`  ${record.parceiros.length} parceiros`)
  }

  // CRM Leads
  if (record.crm?.length) {
    for (const c of record.crm) {
      await query(
        'INSERT INTO crm_leads (id, "leadId", nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING',
        [c.id, c.leadId || null, c.nome, c.whats, c.segmento || '', c.obs || '', c.parceiro || '', c.parceiroNome || '', c.etapa ?? 0, c.plano || 'mensal', c.valor ?? 337, c.data, JSON.stringify(c.historico || [])]
      )
    }
    console.log(`  ${record.crm.length} leads CRM`)
  }

  // CRM Renovações
  if (record.crmRenovacao?.length) {
    for (const c of record.crmRenovacao) {
      await query(
        'INSERT INTO crm_renovacoes (id, nome, whats, segmento, obs, plano, valor, tipoCustom, etapa, data, historico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING',
        [c.id, c.nome, c.whats, c.segmento || '', c.obs || '', c.plano || 'mensal', c.valor ?? 337, c.tipoCustom || 'recebido', c.etapa ?? 0, c.data, JSON.stringify(c.historico || [])]
      )
    }
    console.log(`  ${record.crmRenovacao.length} renovações CRM`)
  }

  // Renovações Histórico
  if (record.renovacoes?.length) {
    for (const r of record.renovacoes) {
      await query(
        'INSERT INTO renovacoes_historico (clienteId, nome, plano, valor, tipo, data, "user") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        [r.clienteId, r.nome, r.plano, r.valor, r.tipo || 'recebido', r.data, r.user]
      )
    }
    console.log(`  ${record.renovacoes.length} renovações histórico`)
  }

  // Leads Portal
  if (record.leads?.length) {
    for (const l of record.leads) {
      await query(
        'INSERT INTO leads_portal (id, "parceiroId", "parceiroNome", nome, whats, segmento, obs, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
        [l.id, l.parceiroId, l.parceiroNome, l.nome, l.whats, l.segmento || '', l.obs || '', l.data]
      )
    }
    console.log(`  ${record.leads.length} leads portal`)
  }

  // Config
  if (record.mensais != null) {
    await query('INSERT INTO configuracoes (chave, valor) VALUES ($1, $2) ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor', ['total_mensais', String(record.mensais)])
  }
  if (record.anuais != null) {
    await query('INSERT INTO configuracoes (chave, valor) VALUES ($1, $2) ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor', ['total_anuais', String(record.anuais)])
  }

  console.log('Seed concluído com sucesso!')
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1) })
