'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import Sidebar from '@/components/Sidebar'

Chart.register(...registerables)

const MENSAL = 337, ANUAL = 337 * 12 * 0.9, META = 240
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

interface DataType {
  mensais: number; anuais: number; totalClientes: number; faltam: number
  receitaTotal: number; receitaMensal: number; receitaAnual: number
  receitaLancamentos: number; progresso: number
  clientesMensais: any[]; clientesAnuais: any[]; lancamentos: any[]
  parceiros: any[]; totalEquiv: number
}

export default function DashboardPage() {
  const [logado, setLogado] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [data, setData] = useState<DataType | null>(null)
  const pizza1Ref = useRef<HTMLCanvasElement>(null)
  const pizza2Ref = useRef<HTMLCanvasElement>(null)
  const barrasRef = useRef<HTMLCanvasElement>(null)
  const mensalRef = useRef<HTMLCanvasElement>(null)
  const chartsRef = useRef<Chart[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('logado') === '1') setLogado(true)
  }, [])

  useEffect(() => {
    if (!logado) return
    fetch('/api/data?tipo=all').then(r => r.json()).then(d => {
      const totalEquiv = d.totalEquiv || 0
      const totalClientes = d.mensais + d.anuais + totalEquiv
      const receitaMensal = d.mensais * MENSAL
      const receitaAnual = d.anuais * ANUAL
      const receitaLancamentos = (d.lancamentos || []).reduce((s: number, l: any) => s + l.recTotal, 0)
      const receitaTotal = receitaMensal + receitaAnual + receitaLancamentos
      const progresso = Math.min(100, Math.round((totalClientes / META) * 100))
      setData({
        ...d, totalClientes, faltam: Math.max(0, META - totalClientes),
        receitaTotal, receitaMensal, receitaAnual, receitaLancamentos, progresso, totalEquiv,
      })
    })
  }, [logado])

  useEffect(() => {
    if (!data || !pizza1Ref.current) return
    chartsRef.current.forEach(c => c.destroy())
    chartsRef.current = []

    const p1 = new Chart(pizza1Ref.current, {
      type: 'doughnut', data: {
        labels: ['Fechados', 'Faltam'],
        datasets: [{ data: [data.totalClientes, data.faltam], backgroundColor: ['#00e676', '#2a2a2a'], borderWidth: 0 }]
      },
      options: { cutout: '70%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    })
    chartsRef.current.push(p1)

    if (pizza2Ref.current) {
      const p2 = new Chart(pizza2Ref.current, {
        type: 'doughnut', data: {
          labels: ['Mensal', 'Anual', 'Personalizado'],
          datasets: [{ data: [data.receitaMensal, data.receitaAnual, data.receitaLancamentos], backgroundColor: ['#29b6f6', '#ab47bc', '#ff9800'], borderWidth: 0 }]
        },
        options: { cutout: '70%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
      })
      chartsRef.current.push(p2)
    }

    if (barrasRef.current) {
      const b = new Chart(barrasRef.current, {
        type: 'bar', data: {
          labels: ['Mensal', 'Anual', 'Person.', 'Meta'],
          datasets: [{
            label: 'Clientes',
            data: [data.mensais, data.anuais, data.lancamentos.length, META],
            backgroundColor: ['#29b6f6', '#ab47bc', '#ff9800', '#7c3aed88'],
            borderRadius: 4,
          }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#1e1e1e' }, ticks: { color: '#555' } }, x: { grid: { display: false }, ticks: { color: '#888' } } }, responsive: true }
      })
      chartsRef.current.push(b)
    }

    if (mensalRef.current && data.clientesMensais.length + data.clientesAnuais.length + data.lancamentos.length > 0) {
      const todos = [
        ...data.clientesMensais.map((c: any) => ({ data: c.data })),
        ...data.clientesAnuais.map((c: any) => ({ data: c.data })),
        ...data.lancamentos.map((l: any) => ({ data: l.data })),
      ]
      const meses: Record<string, number> = {}
      todos.forEach(c => { const m = (c.data || '').slice(0, 7); if (m) meses[m] = (meses[m] || 0) + 1 })
      const labels = Object.keys(meses).sort()
      const m = new Chart(mensalRef.current, {
        type: 'bar', data: {
          labels: labels.map(l => { const [a, b] = l.split('-'); return `${b}/${a.slice(2)}` }),
          datasets: [{ label: 'Clientes', data: labels.map(l => meses[l]), backgroundColor: '#a78bfa', borderRadius: 4 }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#1e1e1e' }, ticks: { color: '#555' } }, x: { grid: { display: false }, ticks: { color: '#888' } } }, responsive: true }
      })
      chartsRef.current.push(m)
    }

    return () => chartsRef.current.forEach(c => c.destroy())
  }, [data])

  const entrar = (u: string, s: string) => {
    if ((u === 'comercial' && s === '123456') || (u === 'financeiro' && s === 'F@c2026')) {
      sessionStorage.setItem('logado', '1')
      sessionStorage.setItem('nomeUsuario', u === 'comercial' ? 'Comercial' : 'Financeiro')
      setLogado(true)
      setLoginError('')
    } else {
      setLoginError('❌ Usuário ou senha incorretos.')
    }
  }

  if (!logado) {
    return (
      <div id="login-screen">
        <div className="login-left">
          <canvas id="particles" />
          <div className="login-left-content">
            <h2>Meta Comercial 2026</h2>
            <p>Faço a Conta · Plano Essencial</p>
          </div>
        </div>
        <div className="login-right">
          <div className="login-box">
            <div className="login-brand">
              <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 180 }} />
              <p>Meta Comercial · Plano Essencial</p>
            </div>
            <p className="lbl">Usuário</p>
            <input className="linput" type="text" id="inp-user" placeholder="Digite seu usuário"
              onKeyDown={e => e.key === 'Enter' && entrar(
                (document.getElementById('inp-user') as HTMLInputElement)?.value,
                (document.getElementById('inp-senha') as HTMLInputElement)?.value
              )} />
            <p className="lbl">Senha</p>
            <input className="linput" type="password" id="inp-senha" placeholder="Digite sua senha"
              onKeyDown={e => e.key === 'Enter' && entrar(
                (document.getElementById('inp-user') as HTMLInputElement)?.value,
                (document.getElementById('inp-senha') as HTMLInputElement)?.value
              )} />
            <button className="lbtn" onClick={() => {
              const u = (document.getElementById('inp-user') as HTMLInputElement)?.value
              const s = (document.getElementById('inp-senha') as HTMLInputElement)?.value
              entrar(u, s)
            }}>Entrar →</button>
            <p className="lerror">{loginError}</p>
          </div>
        </div>
      </div>
    )
  }

  const nomeUsuario = typeof window !== 'undefined' ? sessionStorage.getItem('nomeUsuario') || 'Usuário' : 'Usuário'
  const items = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '👥', label: 'Clientes', href: '/clientes' },
    { icon: '➕', label: 'Lançamentos', href: '/lancamentos' },
    { icon: '🤝', label: 'Parceiros', href: '/parceiros-admin' },
  ]
  const bottomItems = [
    { icon: '🎯', label: 'CRM', href: '/crm' },
    { icon: '📖', label: 'Playbook', href: '/playbook' },
    { icon: '🤝', label: 'Portal Parceiro', href: '/parceiros' },
    { icon: '🚪', label: 'Sair', onClick: () => { sessionStorage.clear(); window.location.reload() } },
  ]

  if (!data) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#555' }}>⏳ Carregando...</div>

  return (
    <div className="app-layout">
      <Sidebar title="Meta Comercial" subtitle="2026" items={items} bottomItems={bottomItems} user={nomeUsuario} />
      <div className="main">
        <div className="topbar">
          <span className="topbar-title">📊 Dashboard</span>
          <div className="topbar-right">
            <span className="badge" style={{ background: '#1b5e2022', color: '#00e676' }}>✅ Supabase</span>
            <span className="user-chip">👤 {nomeUsuario}</span>
          </div>
        </div>
        <div className="content">
          <div className="card">
            <div className="progress-nums">
              <div><span className="big" style={{ color: '#f44336' }}>{data.totalClientes.toFixed(1)}</span><span style={{ fontSize: 18, color: '#555', marginLeft: 4 }}>/ {META}</span></div>
              <span style={{ fontSize: 24, fontWeight: 700 }}>{data.progresso}%</span>
            </div>
            <div className="bar-bg"><div className="bar-fill" style={{ width: `${Math.min(data.progresso, 100)}%` }}></div></div>
            <div className="bar-labels"><span>0</span><span style={{ color: data.faltam > 0 ? '#f44336' : '#00e676' }}>{data.faltam > 0 ? `Faltam ${data.faltam.toFixed(1)}` : '🎉 Meta atingida!'}</span><span>{META}</span></div>
          </div>
          <div className="g3">
            <div className="card"><p className="kl">Total Fechado</p><p className="kv" style={{ color: '#f44336' }}>{data.totalClientes.toFixed(1)}</p><p className="ks">{((data.totalClientes / META) * 100).toFixed(1)}% da meta</p></div>
            <div className="card"><p className="kl">Faltam</p><p className="kv" style={{ color: '#ff9800' }}>{data.faltam.toFixed(1)}</p><p className="ks">clientes equiv.</p></div>
            <div className="card" style={{ borderColor: '#5c6bc033' }}><p className="kl">Meta</p><p className="kv" style={{ color: '#5c6bc0' }}>{META}</p><p className="ks">clientes Essencial</p></div>
          </div>
          <div className="gc">
            <div className="card" style={{ borderColor: '#5c6bc033' }}>
              <p className="chart-title">🎯 % da Meta</p>
              <div className="cw"><canvas ref={pizza1Ref}></canvas></div>
              <div className="legend">
                <div className="li"><div className="ld" style={{ background: '#00e676' }}></div><span id="leg-fechado">Fechados: {data.totalClientes.toFixed(1)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#2a2a2a' }}></div><span id="leg-faltam">Faltam: {data.faltam.toFixed(1)}</span></div>
              </div>
            </div>
            <div className="card" style={{ borderColor: '#ff980033' }}>
              <p className="chart-title">💰 Faturamento</p>
              <div className="cw"><canvas ref={pizza2Ref}></canvas></div>
              <div className="legend">
                <div className="li"><div className="ld" style={{ background: '#29b6f6' }}></div><span>Mensal: {fmt(data.receitaMensal)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#ab47bc' }}></div><span>Anual: {fmt(data.receitaAnual)}</span></div>
                <div className="li"><div className="ld" style={{ background: '#ff9800' }}></div><span>Person.: {fmt(data.receitaLancamentos)}</span></div>
              </div>
            </div>
            <div className="card" style={{ borderColor: '#ffffff11' }}>
              <p className="chart-title">📊 Planos vs Meta</p>
              <div className="cwb"><canvas ref={barrasRef}></canvas></div>
            </div>
          </div>
          <div className="card" style={{ borderColor: '#00e67633' }}>
            <p style={{ fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>💰 Receita Recorrente</p>
            <div className="rg">
              <div className="rc"><p className="rl">MRR Atual</p><p className="rv">{fmt(data.receitaMensal)}</p><p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>mensal recorrente</p></div>
              <div className="rc"><p className="rl">Receita Contratada</p><p className="rv">{fmt(data.receitaTotal)}</p><p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>todos os planos</p></div>
              <div className="rc"><p className="rl">Receita na Meta</p><p className="rv" style={{ color: '#a78bfa' }}>{fmt(META * MENSAL)}</p><p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{META} × R$ {MENSAL}</p></div>
            </div>
          </div>
          <div className="card" style={{ borderColor: '#7c3aed33' }}>
            <p className="chart-title">📅 Clientes Fechados por Mês</p>
            <div style={{ position: 'relative', width: '100%', height: 280 }}><canvas ref={mensalRef}></canvas></div>
          </div>
          <p className="footer">Faço a Conta · Meta Comercial 2026 · Versão Supabase</p>
        </div>
      </div>
    </div>
  )
}
