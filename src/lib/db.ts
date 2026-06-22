import { Pool } from 'pg'

let pool: Pool | null = null

function dbConfig() {
  return {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    ssl: { rejectUnauthorized: false },
  }
}

export function getPool(): Pool {
  if (!pool) {
    const cfg = dbConfig()
    if (!cfg.host || !cfg.password) {
      throw new Error(
        'Database not configured. Set DB_HOST, DB_USER, and DB_PASSWORD env vars.'
      )
    }
    pool = new Pool(cfg)
  }
  return pool
}

export async function query(sql: string, params?: any[]) {
  return getPool().query(sql, params)
}

export async function queryRow(sql: string, params?: any[]) {
  const result = await getPool().query(sql, params)
  return result.rows[0] || null
}

export async function initSchema() {
  const db = getPool()
  await db.query(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS clientes_mensais (
      id SERIAL PRIMARY KEY,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS clientes_anuais (
      id SERIAL PRIMARY KEY,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS lancamentos (
      id SERIAL PRIMARY KEY,
      qty DOUBLE PRECISION NOT NULL DEFAULT 1,
      val DOUBLE PRECISION NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'recebido',
      "valorRec" DOUBLE PRECISION NOT NULL,
      "recTotal" DOUBLE PRECISION NOT NULL,
      equiv DOUBLE PRECISION NOT NULL,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS parceiros (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      "user" TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      "termoAceito" INTEGER DEFAULT 0,
      "termoData" TEXT,
      "termoVersao" TEXT,
      "termoIp" TEXT,
      whats TEXT DEFAULT '',
      email TEXT DEFAULT '',
      nascimento TEXT DEFAULT '',
      pix TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS crm_leads (
      id TEXT PRIMARY KEY,
      "leadId" TEXT,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      parceiro TEXT DEFAULT '',
      "parceiroNome" TEXT DEFAULT '',
      etapa INTEGER DEFAULT 0,
      plano TEXT DEFAULT 'mensal',
      valor DOUBLE PRECISION DEFAULT 337,
      data TEXT NOT NULL,
      historico TEXT DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS crm_renovacoes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      plano TEXT DEFAULT 'mensal',
      valor DOUBLE PRECISION DEFAULT 337,
      tipoCustom TEXT DEFAULT 'recebido',
      etapa INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      historico TEXT DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS crm_servicos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      descricao TEXT DEFAULT '',
      plano TEXT DEFAULT 'servico',
      valor DOUBLE PRECISION DEFAULT 0,
      tipoCustom TEXT DEFAULT 'recebido',
      etapa INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      historico TEXT DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS renovacoes_historico (
      id SERIAL PRIMARY KEY,
      "clienteId" TEXT NOT NULL,
      nome TEXT NOT NULL,
      plano TEXT NOT NULL,
      valor DOUBLE PRECISION NOT NULL,
      tipo TEXT DEFAULT 'recebido',
      data TEXT NOT NULL,
      "user" TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS leads_portal (
      id TEXT PRIMARY KEY,
      "parceiroId" TEXT NOT NULL,
      "parceiroNome" TEXT NOT NULL,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      data TEXT NOT NULL
    );

    INSERT INTO configuracoes (chave, valor) VALUES ('meta_clientes', '240') ON CONFLICT (chave) DO NOTHING;
    INSERT INTO configuracoes (chave, valor) VALUES ('valor_mensal', '337') ON CONFLICT (chave) DO NOTHING;
  `)
}
