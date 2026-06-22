'use client'

import { useState, useEffect, useRef } from 'react'

const FAIXAS = [
  { min: 0, max: 3, label: 'R$ 150', range: '1 a 3' },
  { min: 4, max: 6, label: 'R$ 200', range: '4 a 6' },
  { min: 7, max: 10, label: 'R$ 250', range: '7 a 10' },
  { min: 11, max: Infinity, label: 'R$ 300', range: '11+' },
]

function fmt(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR')
}

export default function ParceirosPage() {
  const [passo, setPasso] = useState<'login' | 'termo' | 'painel'>('login')
  const [parceiro, setParceiro] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<'dashboard' | 'clientes' | 'indicar'>('dashboard')
  const [revealed, setRevealed] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | 'fechados' | 'leads'>('todos')

  const [indNome, setIndNome] = useState('')
  const [indWhats, setIndWhats] = useState('')
  const [indSeg, setIndSeg] = useState('')
  const [indObs, setIndObs] = useState('')
  const [indMsg, setIndMsg] = useState('')

  const termoRef = useRef<HTMLDivElement>(null)
  const [termoOk, setTermoOk] = useState(false)
  const revTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const userRef = useRef('')
  const passRef = useRef('')

  const fazerLogin = async () => {
    const u = userRef.current.trim()
    const s = passRef.current
    if (!u || !s) { setLoginError('Preencha usuário e senha!'); return }
    const r = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'loginParceiro', user: u, senha: s }),
    }).then(r => r.json())
    if (r.error) { setLoginError(r.error); return }
    setParceiro(r.parceiro)
    setStats(r)
    setLoginError('')
    if (!r.parceiro.termoAceito) setPasso('termo')
    else setPasso('painel')
  }

  const aceitarTermo = async () => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'aceitarTermo', id: parceiro.id, data: new Date().toISOString().split('T')[0], versao: '1.0', ip: '' }),
    })
    setParceiro({ ...parceiro, termoAceito: 1 })
    setPasso('painel')
  }

  const revelarRecorrencia = () => {
    if (stats?.totalClientes >= 10) return
    if (revTimer.current) clearTimeout(revTimer.current)
    setRevealed(true)
    revTimer.current = setTimeout(() => setRevealed(false), 2000)
  }

  const indicarCliente = async () => {
    if (!indNome || !indWhats) { setIndMsg('Preencha nome e WhatsApp!'); return }
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addLead', parceiroId: parceiro.id, parceiroNome: parceiro.nome, nome: indNome, whats: indWhats, segmento: indSeg, obs: indObs }),
    })
    setIndMsg('✅ Cliente indicado com sucesso!')
    setIndNome(''); setIndWhats(''); setIndSeg(''); setIndObs('')
    const r = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'loginParceiro', user: parceiro.user, senha: parceiro.senha }),
    }).then(r => r.json())
    if (!r.error) setStats(r)
  }

  const verificarScroll = () => {
    if (!termoRef.current) return
    const el = termoRef.current
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 10) setTermoOk(true)
  }

  useEffect(() => {
    setTimeout(verificarScroll, 100)
  }, [passo])

  if (passo === 'login') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: '#0d0d1a' }}>
        <style>{`
          @media(max-width:700px){.login-left-p{display:none!important;}}
          .lbtn-p{width:100%;background:linear-gradient(90deg,#00a844,#00e676);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:700;padding:13px;cursor:pointer;}
          .linput-p{width:100%;background:#ffffff0a;border:1px solid #00e67644;border-radius:10px;color:#fff;font-size:15px;padding:12px 14px;margin-bottom:16px;outline:none;}
          .linput-p:focus{border-color:#00e676;}
        `}</style>
        <div className="login-left-p" style={{ flex: 1, background: 'linear-gradient(135deg,#0a1a33 0%,#0a3d2e 60%,#0d0d1a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 160, marginBottom: 16 }} />
            <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', textShadow: '0 0 30px #00e67666', marginBottom: 8 }}>Portal do Parceiro</h2>
            <p style={{ color: '#00e67699', fontSize: 14, marginBottom: 40 }}>Indique. Ajude. Ganhe.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}>
              {[['1 a 3 clientes', 'R$ 150'], ['4 a 6 clientes', 'R$ 200'], ['7 a 10 clientes', 'R$ 250'], ['11+ clientes', 'R$ 300']].map(([l, v]) => (
                <div key={l} style={{ background: '#ffffff08', border: '1px solid #00e67622', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#555' }}>{l}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#00e676' }}>{v}</span>
                </div>
              ))}
              <div style={{ background: '#ffca2808', border: '1px solid #ffca2844', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#555' }}>⭐ 10+ recorrente/mês</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#ffca28' }}>R$ 50</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 420, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', padding: '40px 36px' }}>
          <div style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 160 }} />
              <p style={{ color: '#00e67688', fontSize: 13, marginTop: 8 }}>Portal do Parceiro Faço a Conta</p>
            </div>
            <p style={{ fontSize: 12, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Usuário</p>
            <input className="linput-p" type="text" placeholder="Digite seu usuário" onChange={e => { userRef.current = e.target.value }} onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
            <p style={{ fontSize: 12, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Senha</p>
            <input className="linput-p" type="password" placeholder="Digite sua senha" onChange={e => { passRef.current = e.target.value }} onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
            <button className="lbtn-p" onClick={fazerLogin}>Entrar →</button>
            {loginError && <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{loginError}</p>}
            <p style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ fontSize: 12, color: '#555', cursor: 'pointer', textDecoration: 'underline' }}>Esqueceu a senha? Fale com o suporte</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (passo === 'termo') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', padding: 20 }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #7c3aed44', borderRadius: 16, width: '100%', maxWidth: 680, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxHeight: 28 }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Termo de Parceria — Faço a Conta</h2>
          </div>
          <div ref={termoRef} onScroll={verificarScroll} style={{ height: 420, overflowY: 'auto', padding: 24, fontSize: 13, color: '#aaa', lineHeight: 1.8 }}>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>1. Objeto</h3>
            <p>O presente termo estabelece os direitos e deveres entre a Faço a Conta e o Parceiro indicado.</p>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>2. Indicação</h3>
            <p>O Parceiro poderá indicar clientes potenciais através do portal. Cada indicação será registrada e rastreada.</p>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>3. Comissão</h3>
            <p>O Parceiro receberá comissão por cada cliente fechado conforme a faixa de desempenho:</p>
            <ul style={{ marginLeft: 20, marginBottom: 10 }}>
              <li>1 a 3 clientes: R$ 150/cliente</li>
              <li>4 a 6 clientes: R$ 200/cliente</li>
              <li>7 a 10 clientes: R$ 250/cliente</li>
              <li>11+ clientes: R$ 300/cliente (Elite)</li>
            </ul>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>4. Recorrência</h3>
            <p>O Parceiro receberá R$ 50/mês por cada cliente ativo na base enquanto o cliente permanecer conosco (disponível após 10 fechamentos).</p>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>5. Pagamento</h3>
            <p>As comissões serão pagas até o 15º dia do mês subsequente ao fechamento.</p>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>6. Confidencialidade</h3>
            <p>O Parceiro se compromete a manter sigilo sobre as informações estratégicas da empresa.</p>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '16px 0 6px' }}>7. Vigência</h3>
            <p>Este termo é válido por tempo indeterminado, podendo ser rescindido por qualquer parte com 30 dias de aviso.</p>
            <p style={{ marginTop: 16 }}>Ao clicar em "Aceitar Termo", você declara ter lido e concordado com todos os termos acima.</p>
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid #222', background: '#111', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#555', flex: 1 }}>{termoOk ? 'Pronto para aceitar.' : 'Role até o fim para aceitar.'}</span>
            <button onClick={() => { setPasso('login'); setParceiro(null) }} style={{ background: '#ffffff11', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>Recusar</button>
            <button onClick={aceitarTermo} disabled={!termoOk} style={{ background: termoOk ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : '#333', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, padding: '10px 24px', cursor: termoOk ? 'pointer' : 'not-allowed', opacity: termoOk ? 1 : 0.4 }}>✔ Aceitar Termo</button>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const totalFechados: number = stats.totalClientes || 0
  const totalLeads: number = stats.totalLeads || 0
  const aReceber: number = stats.aReceber || 0
  const recebido: number = stats.recebido || 0
  const recorrencia: number = stats.recorencia || 0
  const comissaoUnit: number = stats.comissaoAtual || 150

  const faixaIdx = totalFechados <= 3 ? 0 : totalFechados <= 6 ? 1 : totalFechados <= 10 ? 2 : 3
  const faixaMetas = [3, 6, 10, Infinity]
  const faixaInicio = faixaIdx === 0 ? 0 : [3, 6, 10][faixaIdx - 1] || 0
  const faixaMeta = faixaMetas[faixaIdx]
  const progPct = faixaMeta === Infinity ? 100 : Math.min((totalFechados - faixaInicio) / (faixaMeta - faixaInicio) * 100, 100)

  const recUnlocked = totalFechados >= 10
  const recPct = Math.min(totalFechados / 10 * 100, 100)

  const todosClientes = [
    ...(stats.clientes || []).map((c: any) => ({ ...c, tipo: 'fechado' })),
    ...(stats.leadsAtivos || []).map((l: any) => ({ ...l, tipo: 'lead' })),
  ]
  const clientesFiltrados = filtro === 'fechados'
    ? todosClientes.filter(c => c.tipo === 'fechado')
    : filtro === 'leads'
    ? todosClientes.filter(c => c.tipo === 'lead')
    : todosClientes

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d' }}>
      <style>{`
        .tab-p{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:600;border-radius:8px;cursor:pointer;color:#555;border:none;background:none;transition:all 0.15s;}
        .tab-p.active{background:#00e67618;color:#00e676;border:1px solid #00e67644;}
        .fbtn-p{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #333;background:#111;color:#555;transition:all 0.15s;}
        .fbtn-p.active{background:#00e67618;color:#00e676;border-color:#00e67644;}
        .form-input-p{width:100%;background:#111;border:1px solid #00e67633;border-radius:8px;color:#fff;font-size:13px;padding:10px 12px;outline:none;}
        .form-input-p:focus{border-color:#00e676;}
        select.form-input-p option{background:#111;}
        @media(max-width:700px){.faixa-grid-p{grid-template-columns:repeat(2,1fr)!important;}}
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxHeight: 32 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Portal do Parceiro</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#00e67618', border: '1px solid #00e67644', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#00e676', fontWeight: 600 }}>🤝 {parceiro?.nome}</span>
          <button onClick={() => { setPasso('login'); setParceiro(null); setStats(null) }} style={{ background: '#ffffff11', border: '1px solid #333', color: '#888', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>Sair →</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: '#111', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {(['dashboard', 'clientes', 'indicar'] as const).map(t => (
            <button key={t} className={`tab-p${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'dashboard' ? '📊 Meu Painel' : t === 'clientes' ? '👥 Clientes Indicados' : '➕ Indicar Cliente'}
            </button>
          ))}
        </div>

        {/* ABA: DASHBOARD */}
        {tab === 'dashboard' && <>

          {/* Indicações + Fechadas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ background: '#111', borderRadius: 12, padding: 16, border: '1px solid #222', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#00e676' }}>{totalLeads}</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Indicações</div>
            </div>
            <div style={{ background: '#111', borderRadius: 12, padding: 16, border: '1px solid #222', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#29b6f6' }}>{totalFechados}</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Fechadas</div>
            </div>
          </div>

          {/* Card Recorrência */}
          {recUnlocked ? (
            <div style={{ borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16, background: 'linear-gradient(135deg,#1a1500,#2a2000)', border: '2px solid #ffca2888' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffca28', marginBottom: 4 }}>Renda Recorrente Mensal — Clube Elite</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#ffca28', margin: '10px 0' }}>{fmt(recorrencia)}/mês</div>
              <div style={{ fontSize: 12, color: '#ffca2888' }}>{totalFechados} clientes ativos × R$ 50 = {fmt(recorrencia)}/mês</div>
            </div>
          ) : (
            <div
              onClick={revelarRecorrencia}
              style={{ borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16, background: '#111', border: '2px dashed #333', cursor: 'pointer', transition: 'all 0.4s ease' }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{revealed ? '💰' : '🔒'}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 4 }}>Renda Recorrente Mensal</div>
              <div style={{
                fontSize: 36, fontWeight: 800, margin: '10px 0',
                color: revealed ? '#ffca28' : '#2a2a2a',
                filter: revealed ? 'blur(0px)' : 'blur(6px)',
                userSelect: 'none',
                transition: 'filter 0.3s ease, color 0.3s ease',
              }}>
                R$ 500/mês
              </div>
              <div style={{ fontSize: 12, color: '#333' }}>Faltam {10 - totalFechados} indicação(ões) para desbloquear</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ background: '#1e1e1e', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', borderRadius: 999, background: recPct > 60 ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : 'linear-gradient(90deg,#444,#666)', width: recPct + '%', transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: '#444' }}>{totalFechados} de 10 indicações fechadas</div>
              </div>
            </div>
          )}

          {/* A receber + Já recebido */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#111', borderRadius: 12, padding: 16, border: '1px solid #222', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ff9800' }}>{fmt(aReceber)}</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>A receber</div>
            </div>
            <div style={{ background: '#111', borderRadius: 12, padding: 16, border: '1px solid #222', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#00e676' }}>{fmt(recebido)}</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Já recebido</div>
            </div>
          </div>

          {/* Elite banner (10+) */}
          {recUnlocked && (
            <div style={{ background: 'linear-gradient(135deg,#1a1a00,#2a2000)', border: '1px solid #ffca2844', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffca28' }}>Clube Parceiros Elite</div>
              <div style={{ fontSize: 12, color: '#ffca2888', marginTop: 4 }}>Você atingiu 10+ indicações fechadas!</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ffca28', marginTop: 12 }}>{fmt(recorrencia)}/mês</div>
              <div style={{ fontSize: 11, color: '#ffca2866' }}>renda recorrente por mês</div>
            </div>
          )}

          {/* Faixa de comissão */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16, border: '1px solid #222', marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>🏅 Sua Faixa de Comissão</p>
            <div className="faixa-grid-p" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
              {FAIXAS.map((f, i) => (
                <div key={i} style={{ background: '#111', borderRadius: 10, padding: 12, textAlign: 'center', border: `2px solid ${i === faixaIdx ? '#00e676' : i === faixaIdx + 1 ? '#ffca2844' : '#222'}`, transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: i === faixaIdx ? '#00e676' : i === faixaIdx + 1 ? '#ffca28' : '#aaa' }}>{f.label}</div>
                  <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>por cliente</div>
                  <div style={{ fontSize: 11, color: '#444', marginTop: 4 }}>{f.range}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: '#2a2a2a', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#00a844,#00e676)', width: progPct + '%', transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555', marginTop: 6 }}>
                <span>{totalFechados} fechadas</span>
                <span>{faixaIdx < 3 ? `Próxima faixa em ${faixaMeta - totalFechados} indicação(ões)` : '🏆 Faixa máxima!'}</span>
              </div>
            </div>
          </div>

          {/* Últimas fechadas */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16, border: '1px solid #222' }}>
            <p style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>📋 Últimas Indicações Fechadas</p>
            {(stats.clientes || []).length === 0
              ? <p style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: 16 }}>Nenhuma indicação fechada ainda.</p>
              : (stats.clientes || []).slice(0, 5).map((c: any, i: number) => (
                <div key={i} style={{ background: '#111', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, border: '1px solid #1e1e1e', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{c.nome || c.descricao}</div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{c.data}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: '#ab47bc22', color: '#ab47bc', border: '1px solid #ab47bc44' }}>{c.plano || 'Fechado'}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#00e676' }}>{fmt(comissaoUnit)}</span>
                </div>
              ))
            }
          </div>
        </>}

        {/* ABA: CLIENTES */}
        {tab === 'clientes' && (
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16, border: '1px solid #222' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['todos', 'fechados', 'leads'] as const).map(f => (
                <button key={f} className={`fbtn-p${filtro === f ? ' active' : ''}`} onClick={() => setFiltro(f)}>
                  {f === 'todos' ? 'Todos' : f === 'fechados' ? '✅ Fechados' : '📋 Indicações enviadas'}
                </button>
              ))}
            </div>
            {clientesFiltrados.length === 0
              ? <p style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: 16 }}>Nenhum registro ainda.</p>
              : clientesFiltrados.map((c: any, i: number) => (
                <div key={i} style={{ background: '#111', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, border: '1px solid #1e1e1e', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{c.nome || c.descricao}</div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{c.data}</div>
                  </div>
                  {c.tipo === 'fechado'
                    ? <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: '#00e67622', color: '#00e676', border: '1px solid #00e67644' }}>✅ Fechado</span>
                    : <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44' }}>📋 Indicado</span>
                  }
                  {c.tipo === 'fechado' && <span style={{ fontSize: 13, fontWeight: 700, color: '#00e676' }}>{fmt(comissaoUnit)}</span>}
                </div>
              ))
            }
            <p style={{ fontSize: 11, color: '#444', marginTop: 10, textAlign: 'right' }}>{clientesFiltrados.length} registro(s)</p>
          </div>
        )}

        {/* ABA: INDICAR */}
        {tab === 'indicar' && (
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 20, border: '1px solid #00e67633', maxWidth: 560, margin: '0 auto' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#00e676', marginBottom: 4 }}>➕ Indicar um Novo Cliente</p>
            <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>Preencha os dados e nossa equipe entrará em contato com o empresário.</p>
            {[
              { label: 'Nome do empresário / empresa', value: indNome, set: setIndNome, placeholder: 'Ex: João Silva – Padaria do João', type: 'text' },
              { label: 'WhatsApp', value: indWhats, set: setIndWhats, placeholder: '(92) 99999-9999', type: 'text' },
            ].map(({ label, value, set, placeholder, type }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</p>
                <input className="form-input-p" type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Segmento</p>
              <select className="form-input-p" value={indSeg} onChange={e => setIndSeg(e.target.value)}>
                <option value="">Selecione o segmento</option>
                {['Comércio', 'Serviços', 'Indústria', 'Agronegócio', 'Saúde', 'Educação', 'Tecnologia', 'Alimentação', 'Construção', 'Outro'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Observação</p>
              <textarea className="form-input-p" rows={2} value={indObs} onChange={e => setIndObs(e.target.value)} placeholder="Como conheceu, potencial..." />
            </div>
            <button onClick={indicarCliente} style={{ width: '100%', background: 'linear-gradient(90deg,#00a844,#00e676)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, padding: 13, cursor: 'pointer', marginTop: 6 }}>📲 Enviar Indicação</button>
            {indMsg && <p style={{ fontSize: 12, textAlign: 'center', marginTop: 10, color: '#00e676' }}>{indMsg}</p>}
          </div>
        )}

      </div>
    </div>
  )
}
