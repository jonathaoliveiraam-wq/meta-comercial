'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [qty, setQty] = useState(1)
  const [val, setVal] = useState('')
  const [tipo, setTipo] = useState<'recebido' | 'sebrae'>('recebido')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0])
  const [editId, setEditId] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => fetch('/api/data?tipo=lancamentos').then(r => r.json()).then(setLancamentos)
  useEffect(() => { load() }, [])

  const limpar = () => { setQty(1); setVal(''); setTipo('recebido'); setDescricao(''); setData(new Date().toISOString().split('T')[0]); setEditId(null); setMsg('') }

  const salvar = async () => {
    const v = parseFloat(val) || 0
    if (v <= 0 || !descricao.trim()) { setMsg('⚠️ Preencha valor e descrição!'); return }
    const action = editId ? 'editLancamento' : 'addLancamento'
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id: editId, qty, val: v, tipo, descricao: descricao.trim(), data, parceiro: '' }),
    })
    setMsg(editId ? '✅ Editado!' : '✅ Adicionado!')
    limpar(); load()
  }

  const editar = (l: any) => {
    setEditId(l.id); setQty(l.qty); setVal(String(l.val)); setTipo(l.tipo); setDescricao(l.descricao); setData(l.data)
  }

  const del = async (id: number) => {
    if (!confirm('Excluir lançamento?')) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delLancamento', id }) })
    load()
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
        <div className="topbar"><span className="topbar-title">➕ Lançamentos</span></div>
        <div className="content">
          <div className="lan-grid">
            <div className="card" style={{ borderColor: '#ff980033' }}>
              <p style={{ fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>{editId ? '✏️ Editar' : '➕ Novo'} Lançamento</p>
              <div className="modal-field"><p className="modal-label">Descrição</p><input className="modal-input" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Consultoria" /></div>
              <div className="modal-field"><p className="modal-label">Quantidade</p><input className="modal-input" type="number" value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)} min={1} /></div>
              <div className="modal-field"><p className="modal-label">Valor (R$)</p><input className="modal-input" type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Ex: 5000" /></div>
              <div className="modal-field"><p className="modal-label">Data</p><input className="modal-input" type="date" value={data} onChange={e => setData(e.target.value)} /></div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <button className={`tbtn ${tipo === 'recebido' ? 'on' : 'off'}`} onClick={() => setTipo('recebido')}>💰 Recebido</button>
                <button className={`tbtn ${tipo === 'sebrae' ? 'on' : 'off'}`} onClick={() => setTipo('sebrae')}>🏦 SEBRAE</button>
              </div>
              <button className="lbtn" onClick={salvar}>{editId ? '✔ Salvar Edição' : '✔ Confirmar Lançamento'}</button>
              {editId && <button className="tbtn off" style={{ width: '100%', marginTop: 6 }} onClick={limpar}>✕ Cancelar edição</button>}
              <p className="modal-msg" style={{ marginTop: 10 }}>{msg}</p>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Descrição</th><th>Qtd</th><th>Valor</th><th>Tipo</th><th>Equiv.</th><th>Data</th><th style={{ textAlign: 'center' }}>Ações</th></tr></thead>
                  <tbody>
                    {lancamentos.map(l => (
                      <tr key={l.id}>
                        <td>{l.descricao}</td>
                        <td>{l.qty}</td>
                        <td>R$ {l.val.toLocaleString('pt-BR')}</td>
                        <td><span className={`tag ${l.tipo === 'sebrae' ? 'tag-custom' : 'tag-mensal'}`}>{l.tipo === 'sebrae' ? '🏦 SEBRAE' : '💰 Recebido'}</span></td>
                        <td style={{ color: '#a78bfa' }}>{l.equiv.toFixed(2)}</td>
                        <td style={{ color: '#555' }}>{l.data}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="tbl-btn" onClick={() => editar(l)}>✏️</button>
                          <button className="tbl-btn del" onClick={() => del(l.id)}>🗑</button>
                        </td>
                      </tr>
                    ))}
                    {lancamentos.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#333' }}>Nenhum lançamento</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
