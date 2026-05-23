import { query, queryRow, initSchema } from './db'

export async function dbQuery(sql: string, params?: any[]) {
  await initSchema()
  const result = await query(sql, params)
  return result.rows
}

export async function dbGet(sql: string, params?: any[]) {
  await initSchema()
  return queryRow(sql, params)
}

export const MENSAL = 337
export const ANUAL = 337 * 12 * 0.9
export const META = 240
