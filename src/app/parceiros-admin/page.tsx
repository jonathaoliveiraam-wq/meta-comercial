'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function ParceirosAdminPage() {
  const [parceiros, setParceiros] = useState<any[]>([])
  const [clientesMensais, setClientesMensais] = useState<any[]>([])
  const [clientesAnuais, setClientesAnuais] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editUser, setEditUser] = useState('')
  const [editSenha, setEditSenha] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [novoUser, setNovoUser] = useState('')
  const [novoSenha, setNovoSenha] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [resetSenha, setResetSenha] = useState<string | null>(null)
  const [resetVal, setResetVal] = useState('')

  const load = async () => {
    const [p, cm, ca] = await Promise.all([
      fetch('/api/data?tipo=parceiros').then(r => r.json()),
      fetch('/api/data?tipo=clientesMensais').then(r => r.json()),
      fetch('/api/data?tipo=clientesAnuais').then(r => r.json()),
    ])
    setParceiros(p); setClientesMensais(cm); setClientesAnuais(ca)
  }
  useEffect(() => { load() }, [])

  const calcComissao = (total: number) => {
    if (total <= 3) return 150; if (total <= 6) return 200; if (total <= 10) return 250; return 300
  }

  const clientesDoParceiro = (parceiroId: string) => [
    ...clientesMensais.filter((c: any) => c.parceiro === parceiroId).map((c: any) => ({ ...c, planoLabel: 'Mensal' })),
    ...clientesAnuais.filter((c: any) => c.parceiro === parceiroId).map((c: any) => ({ ...c, planoLabel: 'Anual' })),
  ]

  const adicionar = async () => {
    if (!novoNome.trim() || !novoUser.trim() || !novoSenha.trim()) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addParceiro', nome: novoNome.trim(), user: novoUser.trim(), senha: novoSenha.trim() }) })
    setNovoNome(''); setNovoUser(''); setNovoSenha(''); setShowNew(false); load()
  }

  const editar = (p: any) => { setEditId(p.id); setEditNome(p.nome); setEditUser(p.user); setEditSenha(p.senha) }

  const salvarEdicao = async () => {
    if (!editNome.trim()) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'editParceiro', id: editId, nome: editNome.trim(), user: editUser.trim(), senha: editSenha.trim(), whats: '', email: '', pix: '' }) })
    setEditId(null); load()
  }

  const excluir = async (id: string) => {
    if (!confirm('Excluir este parceiro?')) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delParceiro', id }) })
    load()
  }

  const resetarSenha = async (id: string) => {
    if (!resetVal.trim()) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'resetSenha', id, senha: resetVal.trim() }) })
    setResetSenha(null); setResetVal('')
  }

  const items = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '👥', label: 'Clientes', href: '/clientes' },
    { icon: '➕', label: 'Lançamentos', href: '/lancamentos' },
    { icon: '🤝', label: 'Parceiros', href: '/parceiros-admin' },
  ]
  const bottomItems = [
    { icon: '🎯', label: 'CRM', href: '/crm' },
    { icon: '📖', label: 'Playbook', href: '/playbook' },
  ]

  return (
    <div className="app-layout">
      <Sidebar title="Meta Comercial" subtitle="2026" items={items} bottomItems={bottomItems} />
      <div className="main">
        <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="topbar-title">🤝 Parceiros</span>
          <button className="lbtn" style={{ width: 'auto', padding: '8px 16px', fontSize: 12 }} onClick={() => setShowNew(!showNew)}>+ Novo Parceiro</button>
        </div>
        <div className="content">
          {showNew && (
            <div className="card" style={{ borderColor: '#00e67644', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#00e676', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>➕ Novo Parceiro</p>
              <div className="lan-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
                <input className="finput" placeholder="Nome" value={novoNome} onChange={e => setNovoNome(e.target.value)} />
                <input className="finput" placeholder="Usuário" value={novoUser} onChange={e => setNovoUser(e.target.value)} />
                <input className="finput" placeholder="Senha" value={novoSenha} onChange={e => setNovoSenha(e.target.value)} />
                <button className="lbtn" style={{ padding: '8px 16px', fontSize: 12 }} onClick={adicionar}>Salvar</button>
              </div>
            </div>
          )}

          {parceiros.map(p => {
            const clientes = clientesDoParceiro(p.id)
            const total = clientes.length
            const comissao = calcComissao(total)
            const valorAReceber = total * comissao

            return (
              <div key={p.id} className="card" style={{ marginBottom: 12 }}>
                <div className="parceiro-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    {editId === p.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input className="finput" value={editNome} onChange={e => setEditNome(e.target.value)} style={{ width: 160 }} />
                        <input className="finput" value={editUser} onChange={e => setEditUser(e.target.value)} style={{ width: 120 }} />
                        <input className="finput" value={editSenha} onChange={e => setEditSenha(e.target.value)} style={{ width: 120 }} />
                        <button className="tbl-btn" onClick={salvarEdicao} style={{ borderColor: '#00e676', color: '#00e676' }}>💾</button>
                        <button className="tbl-btn" onClick={() => setEditId(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="parceiro-nome" style={{ fontSize: 15, fontWeight: 700 }}>{p.nome}</span>
                        <span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>@{p.user}</span>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="tbl-btn" onClick={() => editar(p)}>✏️</button>
                    <button className="tbl-btn" onClick={() => { setResetSenha(p.id); setResetVal('') }}>🔑</button>
                    <button className="tbl-btn del" onClick={() => excluir(p.id)}>🗑</button>
                  </div>
                </div>

                {resetSenha === p.id && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#ffca28' }}>Nova senha:</span>
                    <input className="finput" value={resetVal} onChange={e => setResetVal(e.target.value)} style={{ width: 200 }} placeholder="Digite a nova senha" />
                    <button className="tbl-btn" onClick={() => resetarSenha(p.id)} style={{ borderColor: '#ffca28', color: '#ffca28' }}>Salvar</button>
                  </div>
                )}

                <div className="parceiro-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  <div className="pstat" style={{ background: '#111', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div className="pstat-v" style={{ fontSize: 20, fontWeight: 800, color: '#00e676' }}>{total}</div>
                    <div className="pstat-l" style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Indicações</div>
                  </div>
                  <div className="pstat" style={{ background: '#111', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div className="pstat-v" style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>R$ {comissao}</div>
                    <div className="pstat-l" style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Comissão atual</div>
                  </div>
                  <div className="pstat" style={{ background: '#111', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                    <div className="pstat-v" style={{ fontSize: 20, fontWeight: 800, color: '#ff9800' }}>R$ {valorAReceber.toLocaleString('pt-BR')}</div>
                    <div className="pstat-l" style={{ fontSize: 10, color: '#555', marginTop: 2 }}>A receber</div>
                  </div>
                </div>

                {/* Faixas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                  {[
                    { range: '1-3', val: 'R$ 150', ativa: total >= 1 },
                    { range: '4-6', val: 'R$ 200', ativa: total >= 4 },
                    { range: '7-10', val: 'R$ 250', ativa: total >= 7 },
                    { range: '11+', val: 'R$ 300', ativa: total >= 11 },
                  ].map(f => (
                    <div key={f.range} className={`faixa-card ${f.ativa ? 'ativa' : ''}`} style={{ background: '#111', borderRadius: 10, padding: 12, textAlign: 'center', border: `2px solid ${f.ativa ? '#a855f7' : '#333'}`, transition: 'all 0.2s' }}>
                      <div className="faixa-num" style={{ fontSize: 18, fontWeight: 800, color: f.ativa ? '#a78bfa' : '#555' }}>{f.val}</div>
                      <div className="faixa-label" style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{f.range} clientes</div>
                    </div>
                  ))}
                </div>

                {/* Progresso */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: '#555' }}>Progresso para próxima faixa</span>
                    <span style={{ color: '#a78bfa', fontWeight: 700 }}>{total} clientes</span>
                  </div>
                  <div className="prog-bar" style={{ background: '#2a2a2a', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                    <div className="prog-fill" style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #7c3aed, #a855f7)', width: `${Math.min((total / 11) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Clientes do parceiro */}
                {clientes.length > 0 && (
                  <details>
                    <summary style={{ fontSize: 11, color: '#555', cursor: 'pointer', marginBottom: 8 }}>👥 Ver clientes indicados ({total})</summary>
                    <div style={{ marginTop: 8 }}>
                      {clientes.map((c: any, i: number) => (
                        <div key={i} className="comissao-item" style={{ background: '#111', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ flex: 1, fontSize: 12, color: '#ccc' }}>{c.descricao}</span>
                          <span className={`tag ${c.planoLabel === 'Mensal' ? 'tag-mensal' : 'tag-anual'}`}>{c.planoLabel}</span>
                          <span style={{ fontSize: 11, color: '#555' }}>{c.data}</span>
                          <span className="status-badge status-pendente" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#ff980022', color: '#ff9800', border: '1px solid #ff980055' }}>⏳ Pendente</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )
          })}
          {parceiros.length === 0 && <p style={{ textAlign: 'center', color: '#333', padding: 40 }}>Nenhum parceiro cadastrado</p>}
        </div>
      </div>
    </div>
  )
}
