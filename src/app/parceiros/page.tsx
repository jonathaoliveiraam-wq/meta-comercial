'use client'

import { useState, useEffect, useRef } from 'react'

const FAISCOES = [
  { min: 0, max: 3, label: 'Bronze', faixa: 'R$ 150/cliente', cor: '#cd7f32' },
  { min: 4, max: 6, label: 'Prata', faixa: 'R$ 200/cliente', cor: '#c0c0c0' },
  { min: 7, max: 10, label: 'Ouro', faixa: 'R$ 250/cliente', cor: '#ffd700' },
  { min: 11, max: Infinity, label: 'Elite', faixa: 'R$ 300/cliente', cor: '#00e676' },
]

function calcFaixa(t: number) {
  if (t <= 3) return FAISCOES[0]
  if (t <= 6) return FAISCOES[1]
  if (t <= 10) return FAISCOES[2]
  return FAISCOES[3]
}

export default function ParceirosPage() {
  const [passo, setPasso] = useState<'login' | 'termo' | 'painel'>('login')
  const [user, setUser] = useState<string | null>(null)
  const [parceiro, setParceiro] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('painel')
  const [msg, setMsg] = useState('')
  const termoRef = useRef<HTMLDivElement>(null)

  const [indNome, setIndNome] = useState('')
  const [indWhats, setIndWhats] = useState('')
  const [indSeg, setIndSeg] = useState('')
  const [indObs, setIndObs] = useState('')
  const [indMsg, setIndMsg] = useState('')

  const [editNome, setEditNome] = useState('')
  const [editWhats, setEditWhats] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editNasc, setEditNasc] = useState('')
  const [editPix, setEditPix] = useState('')
  const [editMsg, setEditMsg] = useState('')

  const fazerLogin = async () => {
    const u = (document.getElementById('p-user') as HTMLInputElement)?.value
    const s = (document.getElementById('p-pass') as HTMLInputElement)?.value
    if (!u || !s) { setLoginError('Preencha usuário e senha!'); return }
    const r = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'loginParceiro', user: u, senha: s }) }).then(r => r.json())
    if (r.error) { setLoginError(r.error); return }
    setParceiro(r.parceiro)
    setStats(r)
    setUser(r.parceiro.nome)
    setLoginError('')
    if (!r.parceiro.termoAceito) setPasso('termo')
    else setPasso('painel')
  }

  const aceitarTermo = async () => {
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'aceitarTermo', id: parceiro.id, data: new Date().toISOString().split('T')[0], versao: '1.0', ip: '' }) })
    setParceiro({ ...parceiro, termoAceito: 1 })
    setPasso('painel')
  }

  const indicarCliente = async () => {
    if (!indNome || !indWhats) { setIndMsg('Preencha nome e WhatsApp!'); return }
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addLead', parceiroId: parceiro.id, parceiroNome: parceiro.nome, nome: indNome, whats: indWhats, segmento: indSeg, obs: indObs }) })
    setIndMsg('✅ Cliente indicado com sucesso!')
    setIndNome(''); setIndWhats(''); setIndSeg(''); setIndObs('')
    const r = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'loginParceiro', user: parceiro.user, senha: '' }) }).then(r => r.json())
    if (!r.error) setStats(r)
  }

  const salvarPerfil = async () => {
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'editarPerfilParceiro', id: parceiro.id, nome: editNome, whats: editWhats, email: editEmail, nascimento: editNasc, pix: editPix }) })
    setEditMsg('✅ Perfil atualizado!')
    setParceiro({ ...parceiro, nome: editNome, whats: editWhats, email: editEmail, pix: editPix })
  }

  useEffect(() => {
    if (parceiro && passo === 'painel') {
      setEditNome(parceiro.nome)
      setEditWhats(parceiro.whats || '')
      setEditEmail(parceiro.email || '')
      setEditNasc(parceiro.nascimento || '')
      setEditPix(parceiro.pix || '')
    }
  }, [parceiro, passo])

  if (passo === 'login') {
    return (
      <div id="login-screen">
        <div className="login-left login-left-green">
          <canvas id="particles" />
          <div className="login-left-content">
            <h2>Portal do Parceiro</h2>
            <p>Indique. Ajude. Ganhe.</p>
            <div className="faixas-preview">
              {FAISCOES.map(f => (
                <div key={f.label} className="fp-item">
                  <span className="fp-label" style={{ color: f.cor }}>{f.label} · {f.min}-{f.max === Infinity ? '+' : f.max}</span>
                  <span className="fp-val" style={{ color: f.cor }}>{f.faixa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="login-right">
          <div className="login-box">
            <div className="login-brand">
              <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 160 }} />
              <p>Portal do Parceiro Faço a Conta</p>
            </div>
            <p className="lbl lbl-green">Usuário</p>
            <input className="linput linput-green" type="text" id="p-user" placeholder="Seu usuário" onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
            <p className="lbl lbl-green">Senha</p>
            <input className="linput linput-green" type="password" id="p-pass" placeholder="Sua senha" onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
            <button className="lbtn lbtn-green" onClick={fazerLogin}>Entrar →</button>
            {loginError && <p className="lerror">{loginError}</p>}
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
      <div id="login-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-box" style={{ maxWidth: 600 }}>
          <div className="login-brand">
            <p style={{ fontSize: 18, fontWeight: 800, color: '#00e676' }}>📜 Termo de Parceria</p>
            <p style={{ fontSize: 13, color: '#555', marginTop: 8 }}>Leia atentamente antes de aceitar</p>
          </div>
          <div ref={termoRef} style={{ background: '#0d0d0d', border: '1px solid #00e67633', borderRadius: 12, padding: 20, maxHeight: 400, overflowY: 'auto', fontSize: 13, color: '#aaa', lineHeight: 1.8, marginBottom: 20 }}>
            <p><strong style={{ color: '#00e676' }}>TERMO DE PARCERIA — FAÇO A CONTA</strong></p><br />
            <p>1. <strong>Objeto:</strong> O presente termo estabelece os direitos e deveres entre a Faço a Conta e o Parceiro indicado.</p>
            <p>2. <strong>Indicação:</strong> O Parceiro poderá indicar clientes potenciais através do portal. Cada indicação será registrada e rastreada.</p>
            <p>3. <strong>Comissão:</strong> O Parceiro receberá comissão por cada cliente fechado conforme a faixa de desempenho:</p>
            <p style={{ paddingLeft: 20 }}>- 1 a 3 clientes: R$ 150/cliente</p>
            <p style={{ paddingLeft: 20 }}>- 4 a 6 clientes: R$ 200/cliente</p>
            <p style={{ paddingLeft: 20 }}>- 7 a 10 clientes: R$ 250/cliente</p>
            <p style={{ paddingLeft: 20 }}>- 11+ clientes: R$ 300/cliente (Elite)</p>
            <p>4. <strong>Recorrência:</strong> O Parceiro receberá R$ 50/mês por cada cliente ativo na base enquanto o cliente permanecer conosco.</p>
            <p>5. <strong>Pagamento:</strong> As comissões serão pagas até o 15º dia do mês subsequente ao fechamento.</p>
            <p>6. <strong>Confidencialidade:</strong> O Parceiro se compromete a manter sigilo sobre as informações estratégicas da empresa.</p>
            <p>7. <strong>Vigência:</strong> Este termo é válido por tempo indeterminado, podendo ser rescindido por qualquer parte com 30 dias de aviso.</p><br />
            <p>Ao clicar em "Aceitar Termo", você declara ter lido e concordado com todos os termos acima.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="modal-cancel" onClick={() => { setPasso('login'); setUser(null) }}>Recusar</button>
            <button className="modal-save" style={{ background: 'linear-gradient(90deg,#00a844,#00e676)' }} onClick={aceitarTermo}>✔ Aceitar Termo</button>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const faixa = calcFaixa(stats.totalClientes)
  const metaRestante = Math.max(0, (faixa.max === Infinity ? stats.totalClientes : faixa.max + 1) - stats.totalClientes)
  const progresso = faixa.max === Infinity ? 100 : Math.round(stats.totalClientes / (faixa.max + 1) * 100)

  return (
    <div className="app-layout">
      <nav style={{ width: 190, flexShrink: 0, background: '#0a0a0a', borderRight: '1px solid #1e1e1e', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 20 }}>
        <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: 1, padding: '6px 10px 4px' }}>Menu</div>
        {[
          { icon: '📊', label: 'Meu Painel', onClick: () => setTab('painel') },
          { icon: '👥', label: 'Clientes', onClick: () => setTab('clientes') },
          { icon: '📨', label: 'Indicar Cliente', onClick: () => setTab('indicar') },
          { icon: '👤', label: 'Meu Perfil', onClick: () => setTab('perfil') },
        ].map((item) => (
          <div key={item.label} onClick={item.onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: tab === item.label.replace(/\s.*/, '').toLowerCase() ? '#00e676' : '#555', background: tab === item.label.replace(/\s.*/, '').toLowerCase() ? '#00e67611' : 'transparent', border: tab === item.label.replace(/\s.*/, '').toLowerCase() ? '1px solid #00e67644' : '1px solid transparent' }}>
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e1e', paddingTop: 8 }}>
          <div onClick={() => { setPasso('login'); setUser(null) }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#555', background: '#ffffff05', border: '1px solid #333' }}>
            <span>🚪</span><span>Sair</span>
          </div>
        </div>
      </nav>

      <div className="main-crm">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxHeight: 28 }} />
            <span className="topbar-title">Portal do Parceiro</span>
          </div>
          <div className="topbar-right">
            <span className="user-chip" style={{ background: '#00e67618', borderColor: '#00e67644', color: '#00e676' }}>👤 {user}</span>
          </div>
        </div>

        <div className="content">
          {tab === 'painel' && <>
            <div className="g4">
              <div className="stat-card"><div className="stat-val" style={{ color: '#00e676' }}>{stats.totalClientes}</div><div className="stat-label">Clientes Fechados</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: '#29b6f6' }}>{stats.totalLeads}</div><div className="stat-label">Indicações Enviadas</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: '#ff9800' }}>R$ {stats.aReceber.toLocaleString('pt-BR')}</div><div className="stat-label">A Receber</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: faixa.cor }}>{faixa.label}</div><div className="stat-label">Faixa Atual · {faixa.faixa}</div></div>
            </div>

            <div className="g4">
              <div className="stat-card" style={{ borderColor: '#00e67633' }}>
                <div className="stat-val" style={{ color: '#ab47bc', fontSize: 24 }}>R$ {stats.recorencia.toLocaleString('pt-BR')}/mês</div>
                <div className="stat-label">🔄 Recorrência (R$ 50/cliente ativo)</div>
              </div>
              <div className="stat-card" style={{ gridColumn: 'span 2', textAlign: 'left' }}>
                <div style={{ fontSize: 13, color: '#00e676', fontWeight: 700, marginBottom: 8 }}>📊 Progresso para próxima faixa</div>
                <div className="bar-bg" style={{ height: 10, marginBottom: 4 }}>
                  <div className="bar-fill" style={{ width: Math.min(progresso, 100) + '%', background: 'linear-gradient(90deg,#00e676,#ab47bc)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555' }}>
                  <span>{stats.totalClientes} fechado(s)</span>
                  <span>{metaRestante > 0 ? 'Faltam ' + metaRestante : '🎉 Meta da faixa atingida!'}</span>
                </div>
              </div>
              <div className="stat-card" style={{ background: 'linear-gradient(135deg,#00e67610,#ab47bc10)', borderColor: faixa.cor + '44' }}>
                <div style={{ fontSize: 12, color: faixa.cor, fontWeight: 700, marginBottom: 4 }}>🏆 Clube Elite</div>
                <p style={{ fontSize: 11, color: '#555' }}>{stats.totalClientes >= 11 ? '🎉 Parabéns! Você está no Clube Elite — R$ 300/cliente!' : 'Faltam ' + (11 - stats.totalClientes) + ' clientes para o Elite (R$ 300/cliente). Continue indicando!'}</p>
              </div>
            </div>
          </>}

          {tab === 'clientes' && <>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#00e676', marginBottom: 16 }}>👥 Clientes Indicados</p>
            {stats.clientes.length === 0 ? <p style={{ color: '#555', fontSize: 13 }}>Nenhum cliente ainda. Comece a indicar!</p> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Cliente</th><th>Plano</th><th>Data</th><th>Comissão</th></tr></thead>
                  <tbody>
                    {stats.clientes.map((c: any, i: number) => (
                      <tr key={i}><td>{c.descricao}</td><td><span className={'cli-badge ' + (c.plano === 'Anual' ? 'badge-anual' : 'badge-mensal')}>{c.plano}</span></td><td style={{ color: '#555' }}>{c.data}</td><td style={{ color: '#00e676', fontWeight: 700 }}>R$ {stats.comissaoAtual.toLocaleString('pt-BR')}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>}

          {tab === 'indicar' && <>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#00e676', marginBottom: 16 }}>📨 Indicar Novo Cliente</p>
            <div style={{ maxWidth: 420 }}>
              <div className="form-group"><p className="form-label">Nome / Empresa</p><input className="form-input" value={indNome} onChange={e => setIndNome(e.target.value)} placeholder="Ex: João Silva" /></div>
              <div className="form-group"><p className="form-label">WhatsApp</p><input className="form-input" value={indWhats} onChange={e => setIndWhats(e.target.value)} placeholder="(92) 99999-9999" /></div>
              <div className="form-group"><p className="form-label">Segmento</p><select className="form-input" value={indSeg} onChange={e => setIndSeg(e.target.value)}><option value="">Selecione</option><option>Comércio</option><option>Serviços</option><option>Indústria</option><option>Agronegócio</option><option>Saúde</option><option>Educação</option><option>Tecnologia</option><option>Alimentação</option><option>Construção</option><option>Outro</option></select></div>
              <div className="form-group"><p className="form-label">Observação</p><textarea className="form-input" rows={2} value={indObs} onChange={e => setIndObs(e.target.value)} placeholder="Como conheceu, potencial..." /></div>
              <button className="submit-btn" onClick={indicarCliente}>📨 Indicar Cliente</button>
              <p className="submit-msg" style={{ color: '#00e676' }}>{indMsg}</p>
            </div>
          </>}

          {tab === 'perfil' && <>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#00e676', marginBottom: 16 }}>👤 Meu Perfil</p>
            <div style={{ maxWidth: 420 }}>
              <div className="form-group"><p className="form-label">Nome</p><input className="form-input" value={editNome} onChange={e => setEditNome(e.target.value)} /></div>
              <div className="form-group"><p className="form-label">WhatsApp</p><input className="form-input" value={editWhats} onChange={e => setEditWhats(e.target.value)} placeholder="(92) 99999-9999" /></div>
              <div className="form-group"><p className="form-label">E-mail</p><input className="form-input" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="email@exemplo.com" /></div>
              <div className="form-group"><p className="form-label">Data de Nascimento</p><input className="form-input" type="date" value={editNasc} onChange={e => setEditNasc(e.target.value)} /></div>
              <div className="form-group"><p className="form-label">Chave PIX</p><input className="form-input" value={editPix} onChange={e => setEditPix(e.target.value)} placeholder="CPF, e-mail ou telefone" /></div>
              <button className="submit-btn" onClick={salvarPerfil}>✔ Salvar Perfil</button>
              {editMsg && <p className="submit-msg" style={{ color: '#00e676' }}>{editMsg}</p>}
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}
