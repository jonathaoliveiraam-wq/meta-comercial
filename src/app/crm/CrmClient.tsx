'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Sidebar from '@/components/Sidebar'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import KanbanCardOverlay from './KanbanCardOverlay'

const MENSAL = 337, ANUAL = 337 * 12 * 0.9
const RESPONSAVEIS = ['Jonatha', 'Carol', 'Kamila']
const ETAPAS = [
  { id: 'indicacao', label: '📋 Indicação', cor: '#6366F1' },
  { id: 'reuniao', label: '📞 Reunião', cor: '#38BDF8' },
  { id: 'proposta', label: '📄 Proposta', cor: '#FBBF24' },
  { id: 'pagamento', label: '💳 Pagamento', cor: '#34D399' },
  { id: 'contrato', label: '📝 Contrato', cor: '#C084FC' },
  { id: 'onboarding', label: '🚀 Onboarding', cor: '#FDE68A' },
]
const ETAPAS_REN = [
  { id: 'renovacao', label: '🔄 Renovação', cor: '#6366F1' },
  { id: 'proposta', label: '📄 Proposta', cor: '#FBBF24' },
  { id: 'contrato', label: '📝 Contrato', cor: '#C084FC' },
  { id: 'pagamento', label: '💳 Pagamento', cor: '#34D399' },
  { id: 'finalizado', label: '✅ Finalizado', cor: '#FDE68A' },
]

interface CrmLead { id: string; leadId: string | null; nome: string; whats: string; segmento: string; obs: string; parceiro: string; parceiroNome: string; etapa: number; plano: string; valor: number; data: string; historico: any[]; responsavel: string | null }
interface CrmRen { id: string; nome: string; whats: string; segmento: string; obs: string; plano: string; valor: number; tipoCustom: string; etapa: number; data: string; historico: any[] }

interface Props { initialCrm: CrmLead[]; initialRenovacao: CrmRen[]; initialParceiros: any[] }

export default function CrmClient({ initialCrm, initialRenovacao }: Props) {
  const [crm, setCrm] = useState<CrmLead[]>(initialCrm)
  const [ren, setRen] = useState<CrmRen[]>(initialRenovacao)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<'novos' | 'renovacao'>('novos')

  const [modalNovo, setModalNovo] = useState(false)
  const [modalPag, setModalPag] = useState(false)
  const [modalPagRen, setModalPagRen] = useState(false)
  const [modalNovaRen, setModalNovaRen] = useState(false)
  const [leadPagId, setLeadPagId] = useState<string | null>(null)
  const [planoSel, setPlanSel] = useState<string | null>(null)
  const [pagTipo, setPagTipo] = useState<'recebido' | 'sebrae'>('recebido')
  const [pagValor, setPagValor] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [novoPlano, setNovoPlano] = useState('mensal')
  const [novoTipo, setNovoTipo] = useState<'recebido' | 'sebrae'>('recebido')
  const [msg, setMsg] = useState('')

  const [filtroResp, setFiltroResp] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('crm-user')
    return null
  })
  const [loginError, setLoginError] = useState('')
  const [toasts, setToasts] = useState<{ id: number; msg: string; tipo: 'lead' | 'ok' }[]>([])
  const crmCountRef = useRef<number | null>(null)

  const addToast = useCallback((msg: string, tipo: 'lead' | 'ok' = 'lead') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, tipo }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 6000)
  }, [])

  const recarregar = useCallback(async () => {
    const [c, r] = await Promise.all([
      fetch('/api/data?tipo=crm').then(r => r.json()),
      fetch('/api/data?tipo=crmRenovacao').then(r => r.json()),
    ])
    setCrm(c); setRen(r)
  }, [])

  // Polling: verifica novos leads a cada 30s
  useEffect(() => {
    if (!user) return
    const poll = async () => {
      try {
        const data = await fetch('/api/data?tipo=crm').then(r => r.json())
        const novos: any[] = data
        const count = novos.length
        if (crmCountRef.current !== null && count > crmCountRef.current) {
          const diff = count - crmCountRef.current
          const recentes = novos.slice(0, diff)
          recentes.forEach((l: any) => {
            addToast(`🔔 Novo lead: ${l.parceiroNome ? l.parceiroNome + ' → ' : ''}${l.nome}`, 'lead')
          })
          setCrm(novos)
        }
        crmCountRef.current = count
      } catch {}
    }
    poll()
    const interval = setInterval(poll, 30000)
    return () => clearInterval(interval)
  }, [user, addToast])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const moverLead = useCallback(async (id: string, novaEtapa: number) => {
    const idx = crm.findIndex(c => c.id === id)
    if (idx < 0) return
    const updated = [...crm]
    updated[idx] = {
      ...updated[idx], etapa: novaEtapa,
      historico: [...updated[idx].historico, { etapa: novaEtapa, data: new Date().toISOString().split('T')[0], user: user || 'Sistema' }],
    }
    setCrm(updated)
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'moverLead', id, etapa: novaEtapa, historico: updated[idx].historico }) })
  }, [crm, user])

  const moverRenovacao = useCallback(async (id: string, novaEtapa: number) => {
    const idx = ren.findIndex(c => c.id === id)
    if (idx < 0) return
    const updated = [...ren]
    updated[idx] = {
      ...updated[idx], etapa: novaEtapa,
      historico: [...updated[idx].historico, { etapa: novaEtapa, data: new Date().toISOString().split('T')[0], user: user || 'Sistema' }],
    }
    setRen(updated)
    await fetch('/api/data', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'moverRenovacao', id, etapa: novaEtapa, historico: updated[idx].historico }),
    })
  }, [ren, user])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ad = active.data.current as { etapa: number } | undefined
    const od = over.data.current as { etapa: number } | undefined
    if (!ad || !od || od.etapa === ad.etapa || od.etapa < 0 || od.etapa > 5) return
    await moverLead(active.id as string, od.etapa)
  }, [moverLead])

  const confirmarPagamento = async () => {
    if (!razaoSocial.trim()) { setMsg('Informe a Razão Social do cliente!'); return }
    if (!planoSel) { setMsg('Selecione um plano!'); return }
    setMsg('⏳ Lançando...')
    let v = MENSAL
    if (planoSel === 'personalizado') {
      v = parseFloat(pagValor) || 0
      if (v <= 0) { setMsg('Informe o valor!'); return }
      if (pagTipo === 'sebrae') v = v / 0.3
    }
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'confirmarPagamento', id: leadPagId, plano: planoSel, valor: v, tipo: pagTipo, razaoSocial, data: new Date().toISOString().split('T')[0], user }) })
    setMsg('✅ Lançado!')
    setTimeout(() => { setModalPag(false); recarregar() }, 600)
  }

  const confirmarPagamentoRen = async () => {
    if (!planoSel) { setMsg('Selecione um plano!'); return }
    setMsg('⏳ Confirmando...')
    let v = MENSAL
    if (planoSel === 'personalizado') {
      v = parseFloat(pagValor) || 0
      if (v <= 0) { setMsg('Informe o valor!'); return }
      if (pagTipo === 'sebrae') v = v / 0.3
    }
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'confirmarRenovacao', id: leadPagId, plano: planoSel, valor: v, tipo: pagTipo, data: new Date().toISOString().split('T')[0], user }) })
    setMsg('✅ Confirmada!')
    setTimeout(() => { setModalPagRen(false); recarregar() }, 600)
  }

  const salvarNovoLead = async () => {
    const nome = (document.getElementById('novo-nome') as HTMLInputElement)?.value?.trim()
    const whats = (document.getElementById('novo-whats') as HTMLInputElement)?.value?.trim()
    if (!nome || !whats) { setMsg('Preencha nome e WhatsApp!'); return }
    setMsg('⏳ Salvando...')
    let valor = MENSAL
    if (novoPlano === 'anual') valor = ANUAL
    else if (novoPlano === 'personalizado' || novoPlano === 'servico') {
      const vi = parseFloat((document.getElementById('novo-valor') as HTMLInputElement)?.value) || 0
      if (vi <= 0) { setMsg('Informe o valor!'); return }
      valor = novoPlano === 'servico' ? vi : (novoTipo === 'sebrae' ? vi / 0.3 : vi)
    }
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'criarCrmLead', nome, whats, segmento: (document.getElementById('novo-segmento') as HTMLSelectElement)?.value || '', obs: (document.getElementById('novo-obs') as HTMLTextAreaElement)?.value || '', plano: novoPlano, valor, user }) })
    setMsg('✅ Lead adicionado!')
    setTimeout(() => { setModalNovo(false); recarregar() }, 600)
  }

  const salvarNovaRenovacao = async () => {
    const nome = (document.getElementById('ren-nome') as HTMLInputElement)?.value?.trim()
    const whats = (document.getElementById('ren-whats') as HTMLInputElement)?.value?.trim()
    if (!nome || !whats) { setMsg('Preencha nome e WhatsApp!'); return }
    setMsg('⏳ Salvando...')
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'criarRenovacao', nome, whats, plano: 'mensal', user }) })
    setMsg('✅ Renovação adicionada!')
    setTimeout(() => { setModalNovaRen(false); recarregar() }, 600)
  }

  const atribuirResponsavel = useCallback(async (id: string, responsavel: string | null) => {
    setCrm(prev => prev.map(c => c.id === id ? { ...c, responsavel } : c))
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'atribuirResponsavel', id, responsavel }) })
  }, [])

  const excluirLead = async (id: string) => {
    if (!confirm('Excluir este lead?')) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'excluirCrmLead', id }) })
    recarregar()
  }

  const fazerLogin = async (u: string, s: string) => {
    if (!u || !s) { setLoginError('❌ Preencha usuário e senha.'); return }
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usuario: u, senha: s }) })
    const data = await res.json()
    if (!res.ok) { setLoginError(data.error || '❌ Usuário ou senha incorretos.'); return }
    setUser(data.nome)
    sessionStorage.setItem('crm-user', data.nome)
    setLoginError('')
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div className="crm-login-left" style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 45%, #7C3AED 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -150, left: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -100, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '38%', right: '8%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', maxWidth: 420 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
            {['📊', '🤝', '🚀', '💳'].map((icon, i) => (
              <div key={i} style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>{icon}</div>
            ))}
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 10, letterSpacing: -0.5, lineHeight: 1.1 }}>Bem-vindo ao CRM</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
            Plataforma de gestão de relacionamento com clientes, indicações e processos comerciais
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎯', text: 'Pipeline Kanban de vendas' },
              { icon: '🤝', text: 'Gestão de parceiros e indicações' },
              { icon: '💳', text: 'Confirmação de pagamentos e contratos' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '11px 16px', border: '1px solid rgba(255,255,255,0.14)', textAlign: 'left' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="crm-login-right" style={{ width: 440, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: 14, padding: '14px 20px', display: 'inline-block', marginBottom: 16 }}>
              <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 140, display: 'block' }} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>Entre na sua conta</h3>
            <p style={{ color: '#94A3B8', fontSize: 14 }}>CRM Comercial · Faço a Conta</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', marginBottom: 2 }}>🎯 CRM Comercial</p>
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>Gerencie seus leads — da indicação ao onboarding.</p>
          </div>
          <p style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginBottom: 6 }}>Usuário</p>
          <input type="text" id="login-user" placeholder="Digite seu usuário"
            style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10, color: '#1E293B', fontSize: 15, padding: '12px 14px', marginBottom: 16, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box', display: 'block' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4F46E5')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
            onKeyDown={e => e.key === 'Enter' && fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value, (document.getElementById('login-pass') as HTMLInputElement)?.value)}
          />
          <p style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginBottom: 6 }}>Senha</p>
          <input type="password" id="login-pass" placeholder="Digite sua senha"
            style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10, color: '#1E293B', fontSize: 15, padding: '12px 14px', marginBottom: 24, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box', display: 'block' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4F46E5')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
            onKeyDown={e => e.key === 'Enter' && fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value, (document.getElementById('login-pass') as HTMLInputElement)?.value)}
          />
          <button
            style={{ width: '100%', background: 'linear-gradient(90deg, #4F46E5, #7C3AED)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, padding: 14, cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}
            onClick={() => fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value, (document.getElementById('login-pass') as HTMLInputElement)?.value)}
          >⚡ Entrar</button>
          {loginError && <p style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{loginError}</p>}
        </div>
      </div>
    </div>
  )

  const crmFiltrado = filtroResp ? crm.filter(c => c.responsavel === filtroResp) : crm
  const totalLeads = crmFiltrado.length
  const fechados = crmFiltrado.filter(c => c.etapa >= 4)
  const taxa = totalLeads ? Math.round(fechados.length / totalLeads * 100) : 0

  const Modal = ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <div className="modal-bg" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) { setModalNovo(false); setModalPag(false); setModalPagRen(false); setModalNovaRen(false) } }}><div className="modal-box" onClick={e => e.stopPropagation()}>{children}</div></div> : null

  const Toasts = () => (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: t.tipo === 'lead' ? 'linear-gradient(135deg, rgba(79,70,229,0.95), rgba(124,58,237,0.95))' : 'rgba(16,185,129,0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${t.tipo === 'lead' ? 'rgba(129,140,248,0.4)' : 'rgba(52,211,153,0.4)'}`,
          borderRadius: 14, padding: '14px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          color: '#fff', fontSize: 14, fontWeight: 600,
          maxWidth: 360, animation: 'slideIn 0.3s ease',
          cursor: 'pointer',
        }} onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{t.tipo === 'lead' ? '🔔' : '✅'}</span>
          <span style={{ lineHeight: 1.4 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="app-layout">
      <Toasts />
      <Sidebar title="CRM Comercial" items={[{ icon:'👥',label:'Clientes Novos',onClick:()=>setView('novos') },{ icon:'🔄',label:'Renovação',onClick:()=>setView('renovacao') }]} bottomItems={[{ icon:'📊',label:'Dashboard',href:'/dashboard' },{ icon:'📖',label:'Playbook',href:'/playbook' },{ icon:'🚪',label:'Sair',onClick:()=>{ sessionStorage.removeItem('crm-user'); window.location.reload() } }]} user={user} variant="crm" collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div className={`main-crm${sidebarCollapsed ? ' expanded' : ''}`}>
        <div className="topbar" style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <button onClick={() => { setSidebarCollapsed(false); }} style={{ background:'none',border:'none',cursor:'pointer',color:'#6B7280',fontSize:20,lineHeight:1,padding:'2px 6px',display: sidebarCollapsed ? 'block' : 'none' }} title="Abrir menu">☰</button>
            <span className="topbar-title" style={{ color:'#111827',fontSize:15 }}>{view==='novos'?'👥 Clientes Novos':'🔄 Renovação'}</span>
            {view==='novos' && crm.filter(c=>c.etapa===0).length > 0 && (
              <span style={{ background:'#EFF6FF',border:'1px solid #BFDBFE',color:'#2563EB',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700 }}>
                {crm.filter(c=>c.etapa===0).length} nova{crm.filter(c=>c.etapa===0).length>1?'s':''}
              </span>
            )}
            {view==='novos' && <button className="badge" style={{ background:'#F9FAFB',border:'1px solid #E5E7EB',color:'#6B7280',cursor:'pointer',fontSize:11,fontWeight:600,borderRadius:8,padding:'4px 10px' }} onClick={async()=>{ const r=await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'importarLeads'})}).then(r=>r.json()); if(r.novos) addToast('✅ '+r.novos+' lead(s) importado(s)','ok'); else addToast('Nenhum novo lead para importar','ok') }}>🔄 Sincronizar</button>}
            {view==='novos' && (
              <div style={{ display:'flex',gap:4 }}>
                <button onClick={() => setFiltroResp(null)} style={{ fontSize:10,fontWeight:700,borderRadius:20,padding:'3px 10px',cursor:'pointer',border:'1px solid',borderColor: filtroResp===null?'#2563EB':'#E5E7EB',background: filtroResp===null?'#EFF6FF':'#F9FAFB',color: filtroResp===null?'#2563EB':'#6B7280' }}>Todos</button>
                {RESPONSAVEIS.map(r => (
                  <button key={r} onClick={() => setFiltroResp(filtroResp===r?null:r)} style={{ fontSize:10,fontWeight:700,borderRadius:20,padding:'3px 10px',cursor:'pointer',border:'1px solid',borderColor: filtroResp===r?'#2563EB':'#E5E7EB',background: filtroResp===r?'#EFF6FF':'#F9FAFB',color: filtroResp===r?'#2563EB':'#6B7280' }}>{r}</button>
                ))}
              </div>
            )}
          </div>
          <div className="topbar-right"><span className="user-chip">👤 {user}</span></div>
        </div>

        <div className="stats-bar">
          <div className="stats-inner">
          {(view==='novos'?[
            { label:'Total leads',value:totalLeads,cor:'#6366F1' },
            { label:'Em reunião',value:crm.filter(c=>c.etapa===1).length,cor:'#0EA5E9' },
            { label:'Em proposta',value:crm.filter(c=>c.etapa===2).length,cor:'#F59E0B' },
            { label:'Fechados',value:fechados.length,cor:'#059669' },
            { label:'Onboarding',value:crm.filter(c=>c.etapa===5).length,cor:'#F97316' },
            { label:'Conversão',value:taxa+'%',cor:'#6366F1' },
          ]:[
            { label:'Total',value:ren.length,cor:'#6366F1' },
            { label:'Em proposta',value:ren.filter(c=>c.etapa===1).length,cor:'#F59E0B' },
            { label:'Em contrato',value:ren.filter(c=>c.etapa===2).length,cor:'#8B5CF6' },
            { label:'Pagos',value:ren.filter(c=>c.etapa>=3).length,cor:'#059669' },
            { label:'Finalizados',value:ren.filter(c=>c.etapa===4).length,cor:'#F97316' },
          ]).map(s => (
            <div key={s.label} className="stat-item"><div className="sv" style={{ color:s.cor }}>{s.value}</div><div className="sl">{s.label}</div></div>
          ))}
          </div>
        </div>

        {view==='novos' ? (
          <div className="kanban-wrap">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={e => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
              <div className="kanban">
                {ETAPAS.map((etapa, idx) => {
                  const leads = crmFiltrado.filter(c => c.etapa === idx)
                  return (
                    <KanbanColumn key={etapa.id} id={etapa.id} etapa={idx} label={etapa.label} cor={etapa.cor} count={leads.length}>
                      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                        {leads.map(card => (
                          <div key={card.id} style={{ position:'relative' }}>
                            <KanbanCard id={card.id} etapa={idx} nome={card.nome} whats={card.whats} segmento={card.segmento} parceiroNome={card.parceiroNome} obs={card.obs} data={card.data} valor={card.valor||MENSAL} plano={card.plano} />
                            <select
                              value={card.responsavel || ''}
                              onChange={e => atribuirResponsavel(card.id, e.target.value || null)}
                              style={{ width:'100%',marginTop:6,fontSize:11,padding:'4px 6px',borderRadius:6,border:'1px solid #E5E7EB',background:'#F9FAFB',color: card.responsavel ? '#2563EB' : '#9CA3AF',fontWeight: card.responsavel ? 700 : 400,cursor:'pointer',outline:'none' }}
                            >
                              <option value="">— Sem responsável —</option>
                              {RESPONSAVEIS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="card-actions" style={{ display:'flex',gap:4,marginTop:6 }}>
                              {idx>0 && <button style={{ flex:1,background:'#F9FAFB',border:'1px solid #E5E7EB',color:'#6B7280',borderRadius:6,padding:'4px',fontSize:10,cursor:'pointer',fontWeight:600 }} onClick={() => moverLead(card.id, idx-1)}>← Voltar</button>}
                              {idx<5 && (
                                <button style={{ flex:1,fontSize:10,padding:'4px',cursor:'pointer',background:'#EFF6FF',border:'1px solid #BFDBFE',color:'#2563EB',borderRadius:6,fontWeight:700 }} onClick={() => {
                                  if (idx+1 === 3) { setLeadPagId(card.id); setPlanSel(null); setPagTipo('recebido'); setPagValor(''); setRazaoSocial(''); setMsg(''); setModalPag(true); return }
                                  moverLead(card.id, idx+1)
                                }}>→ {ETAPAS[idx+1].label}</button>
                              )}
                              <button style={{ background:'#FEF2F2',border:'1px solid #FECACA',color:'#EF4444',borderRadius:6,padding:'4px 6px',fontSize:10,cursor:'pointer' }} onClick={() => excluirLead(card.id)}>🗑</button>
                            </div>
                          </div>
                        ))}
                      </SortableContext>
                      {leads.length===0 && <div className="empty">Nenhum lead aqui</div>}
                      {idx===0 && <button className="add-lead-btn" onClick={() => { setNovoPlano('mensal'); setNovoTipo('recebido'); setMsg(''); setModalNovo(true) }}>+ Adicionar lead manual</button>}
                    </KanbanColumn>
                  )
                })}
              </div>
              <DragOverlay>{activeId ? <KanbanCardOverlay id={activeId} crm={crm} /> : null}</DragOverlay>
            </DndContext>
          </div>
        ) : (
          <div className="kanban-wrap">
            <div className="kanban">
              {ETAPAS_REN.map((etapa, idx) => {
                const cards = ren.filter(c => c.etapa === idx)
                return (
                  <div key={etapa.id} className={'col ren-col-' + idx} style={{ borderTop: '3px solid ' + etapa.cor }}>
                    <div className="col-header"><span className="col-title" style={{ color:etapa.cor }}>{etapa.label}</span><span className="col-count">{cards.length}</span></div>
                    {cards.map(c => (
                      <div key={c.id} className="card-lead">
                        <div className="card-nome">{c.nome}</div>
                        <div className="card-info">📱 {c.whats}</div>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6 }}>
                          <span className="card-data">📅 {c.data?.split('-').reverse().join('/')||'—'}</span>
                          <span style={{ fontSize:12,fontWeight:700,color:'#34D399' }}>R$ {(c.valor||MENSAL).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="card-actions" style={{ display:'flex',gap:4,marginTop:8 }}>
                          {idx>0 && <button style={{ flex:1,background:'#F9FAFB',border:'1px solid #E5E7EB',color:'#6B7280',borderRadius:6,padding:'4px',fontSize:10,cursor:'pointer',fontWeight:600 }} onClick={() => moverRenovacao(c.id, idx-1)}>← Voltar</button>}
                          {idx<4 && (
                            <button style={{ flex:1,fontSize:10,padding:'4px',cursor:'pointer',background:'#EFF6FF',border:'1px solid #BFDBFE',color:'#2563EB',borderRadius:6,fontWeight:700 }} onClick={() => {
                              if (idx+1 === 3) { setLeadPagId(c.id); setPlanSel(null); setPagTipo('recebido'); setPagValor(''); setMsg(''); setModalPagRen(true); return }
                              moverRenovacao(c.id, idx+1)
                            }}>→ {ETAPAS_REN[idx+1].label}</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {cards.length===0 && <div className="empty">Nenhum registro</div>}
                    {idx===0 && <button className="add-lead-btn" onClick={()=>{setMsg('');setModalNovaRen(true)}}>+ Adicionar renovação manual</button>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <Modal show={modalNovo}>
        <p className="modal-title">➕ Novo Lead Manual</p>
        <div className="modal-field"><p className="modal-label">Nome / Empresa</p><input className="modal-input" type="text" id="novo-nome" placeholder="Ex: João Silva" /></div>
        <div className="modal-field"><p className="modal-label">WhatsApp</p><input className="modal-input" type="text" id="novo-whats" placeholder="(92) 99999-9999" /></div>
        <div className="modal-field"><p className="modal-label">Segmento</p><select className="modal-input" id="novo-segmento"><option value="">Selecione</option><option>Comércio</option><option>Serviços</option><option>Indústria</option><option>Agronegócio</option><option>Saúde</option><option>Educação</option><option>Tecnologia</option><option>Alimentação</option><option>Construção</option><option>Outro</option></select></div>
        <div className="modal-field"><p className="modal-label">Plano</p><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[
            {id:'mensal',label:'📅 Mensal',sub:'R$ 337/mês',cor:'#38BDF8'},
            {id:'anual',label:'🏆 Anual',sub:'R$ 3.639,60',cor:'#C084FC'},
            {id:'personalizado',label:'⭐ Person.',sub:'Valor livre',cor:'#FBBF24'},
            {id:'servico',label:'🛠️ Serviço',sub:'Avulso',cor:'#34D399'},
          ].map(p => (
            <button key={p.id} onClick={()=>setNovoPlano(p.id)} style={{flex:1,minWidth:70,background:novoPlano===p.id?p.cor+'22':'#111',border:'1px solid '+(novoPlano===p.id?p.cor+'88':'#333'),color:novoPlano===p.id?p.cor:'#555',borderRadius:8,padding:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>{p.label}<br /><span style={{fontSize:10}}>{p.sub}</span></button>
          ))}
        </div></div>
        {(novoPlano==='personalizado'||novoPlano==='servico') && <>
          {novoPlano==='servico' && <div className="modal-field"><p className="modal-label">Descrição</p><input className="modal-input" id="novo-desc-servico" placeholder="Ex: Abertura de empresa" /></div>}
          <div className="modal-field"><p className="modal-label">Valor (R$)</p><input className="modal-input" type="number" id="novo-valor" placeholder="Ex: 6500" /></div>
          {novoPlano!=='servico' && <div style={{display:'flex',gap:6,marginBottom:12}}>
            <button className={'tbtn '+(novoTipo==='recebido'?'on':'off')} onClick={()=>setNovoTipo('recebido')}>💰 Recebido</button>
            <button className={'tbtn '+(novoTipo==='sebrae'?'on':'off')} onClick={()=>setNovoTipo('sebrae')}>🏦 SEBRAE</button>
          </div>}
        </>}
        <div className="modal-field"><p className="modal-label">Observação</p><textarea className="modal-input" id="novo-obs" rows={2} placeholder="Contexto, interesse..." /></div>
        <div className="modal-btns"><button className="modal-cancel" onClick={()=>setModalNovo(false)}>Cancelar</button><button className="modal-save" onClick={salvarNovoLead}>✔ Salvar Lead</button></div>
        <p className="modal-msg">{msg}</p>
      </Modal>

      <Modal show={modalPag}>
        <p className="modal-title">📝 Confirmar Contrato</p>
        <p style={{fontSize:13,color:'#666',marginBottom:16}}>Cliente pagou! Preencha os dados abaixo:</p>
        <div className="modal-field">
          <p className="modal-label">Razão Social / Nome do Cliente</p>
          <input className="modal-input" type="text" placeholder="Ex: Empresa LTDA" value={razaoSocial} onChange={e=>setRazaoSocial(e.target.value)} />
          <p style={{fontSize:11,color:'#9CA3AF',marginTop:4}}>Este nome aparecerá na lista de clientes e no portal do parceiro.</p>
        </div>
        <p style={{fontSize:12,fontWeight:600,color:'#374151',marginBottom:8}}>Plano contratado:</p>
        {[{id:'mensal',label:'📅 Plano Mensal',sub:'R$ 337/mês'},{id:'anual',label:'🏆 Plano Anual',sub:'R$ 3.639,60/ano (10% desc.)'},{id:'personalizado',label:'⭐ Plano Personalizado',sub:'Valor acordado'}].map(p => (
          <div key={p.id} className={'pagamento-opt '+(planoSel===p.id?'sel':'')} onClick={()=>{setPlanSel(p.id);setMsg('')}}>
            <p>{p.label}</p><span>{p.sub}</span>
          </div>
        ))}
        {planoSel==='personalizado' && <div style={{marginTop:12}}>
          <div className="modal-field"><p className="modal-label">Valor recebido (R$)</p><input className="modal-input" type="number" value={pagValor} onChange={e=>setPagValor(e.target.value)} placeholder="Ex: 5000" /></div>
          <div style={{display:'flex',gap:6,marginBottom:8}}>
            <button className={'tbtn '+(pagTipo==='recebido'?'on':'off')} onClick={()=>setPagTipo('recebido')}>💰 Recebido</button>
            <button className={'tbtn '+(pagTipo==='sebrae'?'on':'off')} onClick={()=>setPagTipo('sebrae')}>🏦 SEBRAE</button>
          </div>
        </div>}
        <div className="modal-btns"><button className="modal-cancel" onClick={()=>setModalPag(false)}>Cancelar</button><button className="modal-save" onClick={confirmarPagamento}>✔ Confirmar e Lançar</button></div>
        <p className="modal-msg">{msg}</p>
      </Modal>

      <Modal show={modalNovaRen}>
        <p className="modal-title">🔄 Nova Renovação Manual</p>
        <div className="modal-field"><p className="modal-label">Nome / Empresa</p><input className="modal-input" type="text" id="ren-nome" placeholder="Ex: João Silva" /></div>
        <div className="modal-field"><p className="modal-label">WhatsApp</p><input className="modal-input" type="text" id="ren-whats" placeholder="(92) 99999-9999" /></div>
        <div className="modal-field"><p className="modal-label">Segmento</p><select className="modal-input" id="ren-segmento"><option value="">Selecione</option><option>Comércio</option><option>Serviços</option><option>Indústria</option><option>Agronegócio</option><option>Saúde</option><option>Educação</option><option>Tecnologia</option><option>Alimentação</option><option>Construção</option><option>Outro</option></select></div>
        <div className="modal-field"><p className="modal-label">Observação</p><textarea className="modal-input" id="ren-obs" rows={2} placeholder="Vencimento, contexto..." /></div>
        <div className="modal-btns"><button className="modal-cancel" onClick={()=>setModalNovaRen(false)}>Cancelar</button><button className="modal-save" onClick={salvarNovaRenovacao}>✔ Salvar Renovação</button></div>
        <p className="modal-msg">{msg}</p>
      </Modal>

      <Modal show={modalPagRen}>
        <p className="modal-title">💳 Confirmar Pagamento – Renovação</p>
        <p style={{fontSize:13,color:'#666',marginBottom:16}}>Cliente renovou! Selecione o plano:</p>
        {[{id:'mensal',label:'📅 Plano Mensal',sub:'R$ 337/mês'},{id:'anual',label:'🏆 Plano Anual',sub:'R$ 3.639,60/ano'},{id:'personalizado',label:'⭐ Plano Personalizado',sub:'Valor acordado'}].map(p => (
          <div key={p.id} className={'pagamento-opt '+(planoSel===p.id?'sel':'')} onClick={()=>{setPlanSel(p.id);setMsg('')}}>
            <p>{p.label}</p><span>{p.sub}</span>
          </div>
        ))}
        {planoSel==='personalizado' && <div style={{marginTop:12}}>
          <div className="modal-field"><p className="modal-label">Valor recebido (R$)</p><input className="modal-input" type="number" value={pagValor} onChange={e=>setPagValor(e.target.value)} placeholder="Ex: 5000" /></div>
          <div style={{display:'flex',gap:6,marginBottom:8}}>
            <button className={'tbtn '+(pagTipo==='recebido'?'on':'off')} onClick={()=>setPagTipo('recebido')}>💰 Recebido</button>
            <button className={'tbtn '+(pagTipo==='sebrae'?'on':'off')} onClick={()=>setPagTipo('sebrae')}>🏦 SEBRAE</button>
          </div>
        </div>}
        <div className="modal-btns"><button className="modal-cancel" onClick={()=>setModalPagRen(false)}>Cancelar</button><button className="modal-save" onClick={confirmarPagamentoRen}>✔ Confirmar Renovação</button></div>
        <p className="modal-msg">{msg}</p>
      </Modal>
    </div>
  )
}
