'use client'

import Sidebar from '@/components/Sidebar'

interface Props {
  meta: number
  mensais: number
  anuais: number
  totalClientes: number
  faltam: number
  receitaTotal: number
  receitaMensal: number
  receitaAnual: number
  receitaLancamentos: number
  progresso: number
  clientesMensais: any[]
  clientesAnuais: any[]
  lancamentos: any[]
  meses: Record<string, number>
}

export default function DashboardClient(props: Props) {
  const items = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '👥', label: 'Clientes', href: '/clientes' },
    { icon: '➕', label: 'Lançamentos', href: '/lancamentos' },
    { icon: '🤝', label: 'Parceiros', href: '/parceiros-admin' },
  ]

  const bottomItems = [
    { icon: '🎯', label: 'CRM', href: '/crm' },
    { icon: '📖', label: 'Playbook', href: '/playbook' },
    { icon: '🚪', label: 'Sair', onClick: () => {
      sessionStorage.removeItem('nomeUsuario')
      window.location.href = '/dashboard'
    }},
  ]

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const nomeUsuario = typeof window !== 'undefined' ? sessionStorage.getItem('nomeUsuario') || 'Usuário' : 'Usuário'

  return (
    <div className="app-layout">
      <Sidebar title="Meta Comercial" subtitle="2026" items={items} bottomItems={bottomItems} user={nomeUsuario} />

      <div className="main">
        <div className="topbar">
          <span className="topbar-title">📊 Dashboard</span>
          <div className="topbar-right">
            <span className="badge" style={{ background: '#1b5e2022', color: '#00e676' }}>✅ Dados locais</span>
          </div>
        </div>

        <div className="content">
          <div className="card">
            <div className="progress-nums">
              <div>
                <span className="big" style={{ color: '#f44336' }}>{props.totalClientes}</span>
                <span style={{ fontSize: 18, color: '#555', marginLeft: 4 }}>/ {props.meta}</span>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700 }}>{props.progresso}%</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${Math.min(props.progresso, 100)}%` }}></div>
            </div>
            <div className="bar-labels">
              <span>0</span>
              <span id="faltam-label" style={{ color: props.faltam > 0 ? '#f44336' : '#00e676' }}>
                {props.faltam > 0 ? `Faltam ${props.faltam.toFixed(1)}` : '🎉 Meta atingida!'}
              </span>
              <span>{props.meta}</span>
            </div>
          </div>

          <div className="g3">
            <div className="card">
              <p className="kl">Total Fechado</p>
              <p className="kv" style={{ color: '#f44336' }}>{props.totalClientes}</p>
              <p className="ks">{((props.totalClientes / props.meta) * 100).toFixed(1)}% da meta</p>
            </div>
            <div className="card">
              <p className="kl">Faltam</p>
              <p className="kv" style={{ color: '#ff9800' }}>{props.faltam.toFixed(1)}</p>
              <p className="ks">clientes equiv.</p>
            </div>
            <div className="card" style={{ borderColor: '#5c6bc033' }}>
              <p className="kl">Meta</p>
              <p className="kv" style={{ color: '#5c6bc0' }}>{props.meta}</p>
              <p className="ks">clientes Essencial</p>
            </div>
          </div>

          <div className="gc">
            <div className="card" style={{ borderColor: '#5c6bc033' }}>
              <p className="chart-title">🎯 % da Meta</p>
              <div className="cw">
                <div style={{
                  width: 160, height: 160, borderRadius: '50%', margin: '0 auto',
                  background: `conic-gradient(#00e676 ${props.progresso * 3.6}deg, #2a2a2a ${props.progresso * 3.6}deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>
                    {props.progresso}%
                  </div>
                </div>
              </div>
              <div className="legend">
                <div className="li"><div className="ld" style={{ background: '#00e676' }}></div><span>Fechados: {props.totalClientes.toFixed(1)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#2a2a2a' }}></div><span>Faltam: {props.faltam.toFixed(1)}</span></div>
              </div>
            </div>

            <div className="card" style={{ borderColor: '#ff980033' }}>
              <p className="chart-title">💰 Faturamento</p>
              <div className="legend">
                <div className="li"><div className="ld" style={{ background: '#29b6f6' }}></div><span>Mensal: {fmt(props.receitaMensal)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#ab47bc' }}></div><span>Anual: {fmt(props.receitaAnual)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#ff9800' }}></div><span>Personalizado: {fmt(props.receitaLancamentos)}</span></div>
              </div>
            </div>

            <div className="card" style={{ borderColor: '#ffffff11' }}>
              <p className="chart-title">📊 Planos vs Meta</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
                {[
                  { label: 'Mensal', valor: props.mensais, cor: '#29b6f6', max: props.meta },
                  { label: 'Anual', valor: props.anuais, cor: '#ab47bc', max: props.meta },
                  { label: 'Personalizado', valor: props.lancamentos.length, cor: '#ff9800', max: props.meta },
                ].map(b => (
                  <div key={b.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: '#888' }}>{b.label}</span>
                      <span style={{ color: b.cor, fontWeight: 700 }}>{b.valor}</span>
                    </div>
                    <div style={{ background: '#2a2a2a', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min((b.valor / b.max) * 100, 100)}%`, height: '100%', background: b.cor, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ borderColor: '#00e67633' }}>
            <p style={{ fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>💰 Receita Recorrente</p>
            <div className="rg">
              <div className="rc">
                <p className="rl">MRR Atual</p>
                <p className="rv">{fmt(props.receitaMensal)}</p>
                <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>mensal recorrente</p>
              </div>
              <div className="rc">
                <p className="rl">Receita Contratada</p>
                <p className="rv">{fmt(props.receitaTotal)}</p>
                <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>todos os planos</p>
              </div>
              <div className="rc">
                <p className="rl">Receita na Meta</p>
                <p className="rv" style={{ color: '#a78bfa' }}>{fmt(props.meta * 337)}</p>
                <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{props.meta} × R$ 337</p>
              </div>
            </div>
          </div>

          <div className="card">
            <p style={{ fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>👥 Últimos Clientes</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Plano</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {[...props.clientesMensais.map((c: any) => ({ ...c, plano: 'Mensal' })), ...props.clientesAnuais.map((c: any) => ({ ...c, plano: 'Anual' }))]
                    .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))
                    .slice(0, 15)
                    .map((c: any, i: number) => (
                      <tr key={i}>
                        <td>{c.descricao || c.desc}</td>
                        <td><span className={`tag tag-${c.plano === 'Mensal' ? 'mensal' : 'anual'}`}>{c.plano}</span></td>
                        <td style={{ color: '#555' }}>{c.data}</td>
                      </tr>
                    ))}
                  {props.clientesMensais.length + props.clientesAnuais.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20, color: '#333' }}>Nenhum cliente cadastrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="footer">Faço a Conta · Meta Comercial 2026 · Versão Local SQLite</p>
        </div>
      </div>
    </div>
  )
}
