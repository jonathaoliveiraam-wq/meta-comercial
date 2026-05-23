import { initSchema, getDb } from './db'

export function dbQuery(sql: string, params?: any[]) {
  initSchema()
  const db = getDb()
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    return db.prepare(sql).all(...(params || []))
  }
  return db.prepare(sql).run(...(params || []))
}

export function dbGet(sql: string, params?: any[]) {
  initSchema()
  return getDb().prepare(sql).get(...(params || []))
}

export const MENSAL = 337
export const ANUAL = 337 * 12 * 0.9
export const META = 240
