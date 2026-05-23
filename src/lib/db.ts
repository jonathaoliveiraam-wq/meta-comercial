import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'meta-comercial.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
  }
  return db
}

export function initSchema() {
  const db = getDb()
  db.exec(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clientes_mensais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS clientes_anuais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qty REAL NOT NULL DEFAULT 1,
      val REAL NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'recebido',
      valorRec REAL NOT NULL,
      recTotal REAL NOT NULL,
      equiv REAL NOT NULL,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      parceiro TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS parceiros (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      user TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      termoAceito INTEGER DEFAULT 0,
      termoData TEXT,
      termoVersao TEXT,
      termoIp TEXT,
      whats TEXT DEFAULT '',
      email TEXT DEFAULT '',
      nascimento TEXT DEFAULT '',
      pix TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS crm_leads (
      id TEXT PRIMARY KEY,
      leadId TEXT,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      parceiro TEXT DEFAULT '',
      parceiroNome TEXT DEFAULT '',
      etapa INTEGER DEFAULT 0,
      plano TEXT DEFAULT 'mensal',
      valor REAL DEFAULT 337,
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
      valor REAL DEFAULT 337,
      tipoCustom TEXT DEFAULT 'recebido',
      etapa INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      historico TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS renovacoes_historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteId TEXT NOT NULL,
      nome TEXT NOT NULL,
      plano TEXT NOT NULL,
      valor REAL NOT NULL,
      tipo TEXT DEFAULT 'recebido',
      data TEXT NOT NULL,
      user TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads_portal (
      id TEXT PRIMARY KEY,
      parceiroId TEXT NOT NULL,
      parceiroNome TEXT NOT NULL,
      nome TEXT NOT NULL,
      whats TEXT NOT NULL,
      segmento TEXT DEFAULT '',
      obs TEXT DEFAULT '',
      data TEXT NOT NULL
    );

    INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('meta_clientes', '240');
    INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('valor_mensal', '337');
  `)
}
