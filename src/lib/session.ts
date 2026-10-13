import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

// Sessão em cookie httpOnly assinado (HMAC). "equipe" = CRM/dashboard; "parceiro" = portal do parceiro.
export type Sessao = { t: 'equipe' | 'parceiro'; id: string; nome: string; perfil?: string; exp: number }

const COOKIE = 'mc_sess'
const DIAS = 7

function segredo() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET não configurado')
  return s
}

const assinar = (payload: string) => createHmac('sha256', segredo()).update(payload).digest('base64url')

export function criarToken(s: Omit<Sessao, 'exp'>) {
  const payload = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + DIAS * 864e5 })).toString('base64url')
  return payload + '.' + assinar(payload)
}

export function lerToken(token?: string | null): Sessao | null {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const a = Buffer.from(sig), b = Buffer.from(assinar(payload))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return s.exp > Date.now() ? s : null
  } catch {
    return null
  }
}

export function sessaoDoRequest(req: Request) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)mc_sess=([^;]+)/)
  return lerToken(m?.[1])
}

export async function sessaoDaPagina() {
  return lerToken((await cookies()).get(COOKIE)?.value)
}

export const cookieSessao = (token: string) => `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`
export const cookieLogout = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
