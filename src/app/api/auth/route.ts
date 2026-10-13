import { queryRow } from '@/lib/db'
import { criarToken, cookieSessao, cookieLogout, sessaoDoRequest } from '@/lib/session'

// Login da equipe (CRM e dashboard)
export async function POST(req: Request) {
  const { usuario, senha } = await req.json()
  if (!usuario || !senha) return Response.json({ error: 'Informe usuário e senha.' }, { status: 400 })

  const user = await queryRow(
    `SELECT usuario, nome, perfil FROM crm_usuarios
     WHERE usuario = $1 AND ativo = true
     AND senha_hash = crypt($2, senha_hash)`,
    [String(usuario).trim().toLowerCase(), senha]
  )

  if (!user) return Response.json({ error: '❌ Usuário ou senha incorretos.' }, { status: 401 })

  const token = criarToken({ t: 'equipe', id: user.usuario, nome: user.nome, perfil: user.perfil })
  return Response.json({ ok: true, nome: user.nome, perfil: user.perfil }, { headers: { 'Set-Cookie': cookieSessao(token) } })
}

export async function GET(req: Request) {
  const s = sessaoDoRequest(req)
  if (!s) return Response.json({ logado: false }, { status: 401 })
  return Response.json({ logado: true, tipo: s.t, nome: s.nome, perfil: s.perfil })
}

export async function DELETE() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': cookieLogout } })
}
