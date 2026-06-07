/**
 * Script de inicialização do banco de staging
 * Uso: DB_HOST=<host> DB_PASSWORD=<senha> npx ts-node scripts/init-staging-db.ts
 */
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || '',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: { rejectUnauthorized: false },
})

async function main() {
  console.log('🔧 Inicializando banco de staging...')
  console.log('   Host:', process.env.DB_HOST)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS configuracoes (chave TEXT PRIMARY KEY, valor TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS clientes_mensais (id SERIAL PRIMARY KEY, descricao TEXT NOT NULL, data TEXT NOT NULL, parceiro TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS clientes_anuais (id SERIAL PRIMARY KEY, descricao TEXT NOT NULL, data TEXT NOT NULL, parceiro TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS lancamentos (id SERIAL PRIMARY KEY, qty DOUBLE PRECISION NOT NULL DEFAULT 1, val DOUBLE PRECISION NOT NULL, tipo TEXT NOT NULL DEFAULT 'recebido', "valorRec" DOUBLE PRECISION NOT NULL, "recTotal" DOUBLE PRECISION NOT NULL, equiv DOUBLE PRECISION NOT NULL, descricao TEXT NOT NULL, data TEXT NOT NULL, parceiro TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS parceiros (id TEXT PRIMARY KEY, nome TEXT NOT NULL, "user" TEXT NOT NULL UNIQUE, senha TEXT NOT NULL, "termoAceito" INTEGER DEFAULT 0, "termoData" TEXT, "termoVersao" TEXT, "termoIp" TEXT, whats TEXT DEFAULT '', email TEXT DEFAULT '', nascimento TEXT DEFAULT '', pix TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS crm_leads (id TEXT PRIMARY KEY, "leadId" TEXT, nome TEXT NOT NULL, whats TEXT NOT NULL, segmento TEXT DEFAULT '', obs TEXT DEFAULT '', parceiro TEXT DEFAULT '', "parceiroNome" TEXT DEFAULT '', etapa INTEGER DEFAULT 0, plano TEXT DEFAULT 'mensal', valor DOUBLE PRECISION DEFAULT 337, data TEXT NOT NULL, historico TEXT DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS crm_renovacoes (id TEXT PRIMARY KEY, nome TEXT NOT NULL, whats TEXT NOT NULL, segmento TEXT DEFAULT '', obs TEXT DEFAULT '', plano TEXT DEFAULT 'mensal', valor DOUBLE PRECISION DEFAULT 337, tipoCustom TEXT DEFAULT 'recebido', etapa INTEGER DEFAULT 0, data TEXT NOT NULL, historico TEXT DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS renovacoes_historico (id SERIAL PRIMARY KEY, "clienteId" TEXT NOT NULL, nome TEXT NOT NULL, plano TEXT NOT NULL, valor DOUBLE PRECISION NOT NULL, tipo TEXT DEFAULT 'recebido', data TEXT NOT NULL, "user" TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS leads_portal (id TEXT PRIMARY KEY, "parceiroId" TEXT NOT NULL, "parceiroNome" TEXT NOT NULL, nome TEXT NOT NULL, whats TEXT NOT NULL, segmento TEXT DEFAULT '', obs TEXT DEFAULT '', data TEXT NOT NULL);

    INSERT INTO configuracoes (chave, valor) VALUES ('meta_clientes', '240') ON CONFLICT (chave) DO NOTHING;
    INSERT INTO configuracoes (chave, valor) VALUES ('valor_mensal', '337') ON CONFLICT (chave) DO NOTHING;
  `)

  // Dados de teste
  await pool.query(`
    INSERT INTO parceiros (id, nome, "user", senha) VALUES
      ('p_staging_001', 'Parceiro Teste', 'teste', '123456')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO crm_leads (id, nome, whats, segmento, obs, parceiro, "parceiroNome", etapa, plano, valor, data, historico) VALUES
      ('crm_staging_001', 'Cliente Teste A', '92999990001', 'Serviços', 'Lead de teste', 'p_staging_001', 'Parceiro Teste', 0, 'mensal', 337, '${new Date().toISOString().split('T')[0]}', '[]'),
      ('crm_staging_002', 'Cliente Teste B', '92999990002', 'Comércio', 'Outro lead', '', '', 1, 'anual', 3639.60, '${new Date().toISOString().split('T')[0]}', '[]')
    ON CONFLICT (id) DO NOTHING;
  `)

  console.log('✅ Banco de staging inicializado com sucesso!')
  console.log('   Tabelas criadas: 9')
  console.log('   Dados de teste inseridos: 1 parceiro, 2 leads')
  await pool.end()
}

main().catch(e => { console.error('❌ Erro:', e.message); process.exit(1) })
