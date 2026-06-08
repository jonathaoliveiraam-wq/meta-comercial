import { queryRow } from '@/lib/db'

export async function POST(req: Request) {
  const { usuario, senha } = await req.json()
  if (!usuario || !senha) return Response.json({ error: 'Informe usuário e senha.' }, { status: 400 })

  const user = await queryRow(
    `SELECT nome, perfil FROM crm_usuarios
     WHERE usuario = $1 AND ativo = true
     AND senha_hash = crypt($2, senha_hash)`,
    [usuario.trim(), senha]
  )

  if (!user) return Response.json({ error: '❌ Usuário ou senha incorretos.' }, { status: 401 })

  return Response.json({ ok: true, nome: user.nome, perfil: user.perfil })
}
