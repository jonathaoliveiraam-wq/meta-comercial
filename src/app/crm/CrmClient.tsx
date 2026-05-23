'use client'

import { useState, useCallback } from 'react'
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
const ETAPAS = [
  { id: 'indicacao', label: '📋 Indicação', cor: '#7c3aed' },
  { id: 'reuniao', label: '📞 Reunião', cor: '#29b6f6' },
  { id: 'proposta', label: '📄 Proposta', cor: '#ff9800' },
  { id: 'pagamento', label: '💳 Pagamento', cor: '#00e676' },
  { id: 'contrato', label: '📝 Contrato', cor: '#ab47bc' },
  { id: 'onboarding', label: '🚀 Onboarding', cor: '#ffca28' },
]
const ETAPAS_REN = [
  { id: 'renovacao', label: '🔄 Renovação', cor: '#7c3aed' },
  { id: 'proposta', label: '📄 Proposta', cor: '#ff9800' },
  { id: 'contrato', label: '📝 Contrato', cor: '#ab47bc' },
  { id: 'pagamento', label: '💳 Pagamento', cor: '#00e676' },
  { id: 'finalizado', label: '✅ Finalizado', cor: '#ffca28' },
]

interface CrmLead { id: string; leadId: string | null; nome: string; whats: string; segmento: string; obs: string; parceiro: string; parceiroNome: string; etapa: number; plano: string; valor: number; data: string; historico: any[] }
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
  const [novoPlano, setNovoPlano] = useState('mensal')
  const [novoTipo, setNovoTipo] = useState<'recebido' | 'sebrae'>('recebido')
  const [msg, setMsg] = useState('')

  const [user, setUser] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('crm-user')
    return null
  })
  const [loginError, setLoginError] = useState('')

  const recarregar = useCallback(async () => {
    const [c, r] = await Promise.all([
      fetch('/api/data?tipo=crm').then(r => r.json()),
      fetch('/api/data?tipo=crmRenovacao').then(r => r.json()),
    ])
    setCrm(c); setRen(r)
  }, [])

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
    if (!planoSel) { setMsg('Selecione um plano!'); return }
    setMsg('⏳ Lançando...')
    let v = MENSAL
    if (planoSel === 'personalizado') {
      v = parseFloat(pagValor) || 0
      if (v <= 0) { setMsg('Informe o valor!'); return }
      if (pagTipo === 'sebrae') v = v / 0.3
    }
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'confirmarPagamento', id: leadPagId, plano: planoSel, valor: v, tipo: pagTipo, data: new Date().toISOString().split('T')[0], user }) })
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

  const excluirLead = async (id: string) => {
    if (!confirm('Excluir este lead?')) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'excluirCrmLead', id }) })
    recarregar()
  }

  const fazerLogin = (u: string, s: string) => {
    if ((u === 'comercial' && s === '123456') || (u === 'financeiro' && s === 'F@c2026')) {
      setUser(u === 'comercial' ? 'Comercial' : 'Financeiro')
      sessionStorage.setItem('crm-user', u === 'comercial' ? 'Comercial' : 'Financeiro')
      setLoginError('')
    } else setLoginError('❌ Usuário ou senha incorretos.')
  }

  if (!user) return (
    <div id="login-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-box" style={{ maxWidth: 400 }}>
        <div className="login-brand">
          <img src="https://www.facoaconta.com.br/wp-content/uploads/elementor/thumbs/facoaconta_logo_top-pwpeno0c3n15pf1y1eaflwuadbeeupdeipgq0gzk00.png" style={{ maxWidth: 160 }} />
          <p>CRM Comercial · Faço a Conta</p>
        </div>
        <div style={{ background:'#7c3aed11',border:'1px solid #7c3aed33',borderRadius:10,padding:14,marginBottom:20,textAlign:'center' }}>
          <p style={{ fontSize:13,fontWeight:700,color:'#a78bfa',marginBottom:4 }}>🎯 CRM Comercial</p>
          <p style={{ fontSize:12,color:'#555',lineHeight:1.6 }}>Gerencie seus leads — da indicação ao onboarding.</p>
        </div>
        <p className="lbl">Usuário</p>
        <input className="linput" type="text" id="login-user" placeholder="Digite seu usuário" onKeyDown={e => e.key==='Enter' && fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value,(document.getElementById('login-pass') as HTMLInputElement)?.value)} />
        <p className="lbl">Senha</p>
        <input className="linput" type="password" id="login-pass" placeholder="Digite sua senha" onKeyDown={e => e.key==='Enter' && fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value,(document.getElementById('login-pass') as HTMLInputElement)?.value)} />
        <button className="lbtn" onClick={() => fazerLogin((document.getElementById('login-user') as HTMLInputElement)?.value,(document.getElementById('login-pass') as HTMLInputElement)?.value)}>Entrar →</button>
        <p className="lerror">{loginError}</p>
      </div>
    </div>
  )

  const totalLeads = crm.length
  const fechados = crm.filter(c => c.etapa >= 4)
  const taxa = totalLeads ? Math.round(fechados.length / totalLeads * 100) : 0

  const Modal = ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <div className="modal-bg" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) { setModalNovo(false); setModalPag(false); setModalPagRen(false); setModalNovaRen(false) } }}><div className="modal-box" onClick={e => e.stopPropagation()}>{children}</div></div> : null

  return (
    <div className="app-layout">
      <Sidebar title="CRM Comercial" items={[{ icon:'👥',label:'Clientes Novos',onClick:()=>setView('novos') },{ icon:'🔄',label:'Renovação',onClick:()=>setView('renovacao') }]} bottomItems={[{ icon:'📊',label:'Dashboard',href:'/dashboard' },{ icon:'📖',label:'Playbook',href:'/playbook' },{ icon:'🚪',label:'Sair',onClick:()=>{ sessionStorage.removeItem('crm-user'); window.location.reload() } }]} user={user} variant="crm" />

      <div className="main-crm">
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <span className="topbar-title">{view==='novos'?'👥 Clientes Novos':'🔄 Renovação'}</span>
            {view==='novos' && <button className="badge" style={{ background:'#ffffff06',border:'1px dashed #333',color:'#444',cursor:'pointer',fontSize:11 }} onClick={async()=>{ const r=await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'importarLeads'})}).then(r=>r.json()); alert(r.novos?`${r.novos} lead(s) importado(s)`:'Nenhum novo lead') }}>🔄 Sincronizar</button>}
          </div>
          <div className="topbar-right"><span className="user-chip">👤 {user}</span></div>
        </div>

        <div className="stats-bar">
          {(view==='novos'?[
            { label:'Total leads',value:totalLeads,cor:'#a78bfa' },
            { label:'Em reunião',value:crm.filter(c=>c.etapa===1).length,cor:'#29b6f6' },
            { label:'Em proposta',value:crm.filter(c=>c.etapa===2).length,cor:'#ff9800' },
            { label:'Qtd. fechados',value:fechados.length,cor:'#00e676' },
            { label:'Onboarding',value:crm.filter(c=>c.etapa===5).length,cor:'#ffca28' },
            { label:'Conversão',value:taxa+'%',cor:'#a78bfa' },
          ]:[
            { label:'Total renovações',value:ren.length,cor:'#a78bfa' },
            { label:'Em proposta',value:ren.filter(c=>c.etapa===1).length,cor:'#ff9800' },
            { label:'Em contrato',value:ren.filter(c=>c.etapa===2).length,cor:'#ab47bc' },
            { label:'Pagos',value:ren.filter(c=>c.etapa>=3).length,cor:'#00e676' },
            { label:'Finalizados',value:ren.filter(c=>c.etapa===4).length,cor:'#ffca28' },
          ]).map(s => (
            <div key={s.label} className="stat-item"><div className="sv" style={{ color:s.cor }}>{s.value}</div><div className="sl">{s.label}</div></div>
          ))}
        </div>

        {view==='novos' ? (
          <div className="kanban-wrap">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={e => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
              <div className="kanban">
                {ETAPAS.map((etapa, idx) => {
                  const leads = crm.filter(c => c.etapa === idx)
                  return (
                    <KanbanColumn key={etapa.id} id={etapa.id} etapa={idx} label={etapa.label} cor={etapa.cor} count={leads.length}>
                      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                        {leads.map(card => (
                          <div key={card.id} style={{ position:'relative' }}>
                            <KanbanCard id={card.id} etapa={idx} nome={card.nome} whats={card.whats} segmento={card.segmento} parceiroNome={card.parceiroNome} obs={card.obs} data={card.data} valor={card.valor||MENSAL} plano={card.plano} />
                            <div className="card-actions" style={{ display:'flex',gap:4,marginTop:4 }}>
                              {idx>0 && <button className="btn-voltar" style={{ flex:1,background:'#ffffff08',border:'1px solid #333',color:'#555',borderRadius:6,padding:'4px',fontSize:10,cursor:'pointer' }} onClick={() => moverLead(card.id, idx-1)}>← Voltar</button>}
                              {idx<5 && (
                                <button className={`btn-avancar btn-avancar-${idx}`} style={{ flex:1,fontSize:10,padding:'4px',cursor:'pointer' }} onClick={() => {
                                  if (idx+1 === 3) { setLeadPagId(card.id); setPlanSel(null); setPagTipo('recebido'); setPagValor(''); setMsg(''); setModalPag(true); return }
                                  moverLead(card.id, idx+1)
                                }}>→ {ETAPAS[idx+1].label}</button>
                              )}
                              <button className="btn-excluir" style={{ background:'#f4433611',border:'1px solid #f4433633',color:'#f44336',borderRadius:6,padding:'4px',fontSize:10,cursor:'pointer' }} onClick={() => excluirLead(card.id)}>🗑</button>
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
                          <span style={{ fontSize:12,fontWeight:700,color:'#00e676' }}>R$ {(c.valor||MENSAL).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="card-actions" style={{ display:'flex',gap:4,marginTop:6 }}>
                          {idx>0 && <button className="btn-voltar" style={{ flex:1,fontSize:10,padding:'4px',cursor:'pointer' }} onClick={() => moverRenovacao(c.id, idx-1)}>← Voltar</button>}
                          {idx<4 && (
                            <button className={'btn-avancar btn-avancar-ren-' + idx} style={{ flex:1,fontSize:10,padding:'4px',cursor:'pointer' }} onClick={() => {
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
            {id:'mensal',label:'📅 Mensal',sub:'R$ 337/mês',cor:'#29b6f6'},
            {id:'anual',label:'🏆 Anual',sub:'R$ 3.639,60',cor:'#ab47bc'},
            {id:'personalizado',label:'⭐ Person.',sub:'Valor livre',cor:'#ff9800'},
            {id:'servico',label:'🛠️ Serviço',sub:'Avulso',cor:'#00e676'},
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
        <p style={{fontSize:13,color:'#666',marginBottom:16}}>Cliente pagou! Selecione o plano contratado:</p>
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
