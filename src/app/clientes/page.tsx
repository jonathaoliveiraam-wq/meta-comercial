'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function ClientesPage() {
  const [data, setData] = useState<any[]>([])
  const [filtro, setFiltro] = useState({ nome: '', plano: '', data: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editData, setEditData] = useState('')
  const [editPlano, setEditPlano] = useState('')

  const load = () => {
    Promise.all([
      fetch('/api/data?tipo=clientesMensais').then(r => r.json()),
      fetch('/api/data?tipo=clientesAnuais').then(r => r.json()),
    ]).then(([mensais, anuais]) => {
      setData([
        ...mensais.map((c: any) => ({ ...c, plano: 'Mensal' })),
        ...anuais.map((c: any) => ({ ...c, plano: 'Anual' })),
      ])
    })
  }
  useEffect(() => { load() }, [])

  const filtrados = data.filter(c => {
    if (filtro.nome && !(c.descricao || '').toLowerCase().includes(filtro.nome.toLowerCase())) return false
    if (filtro.plano && c.plano !== filtro.plano) return false
    if (filtro.data && c.data !== filtro.data) return false
    return true
  })

  const del = async (id: number, plano: string) => {
    if (!confirm('Excluir este cliente?')) return
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delCliente', id, plano: plano === 'Mensal' ? 'mensal' : 'anual' }),
    })
    load()
  }

  const editar = (c: any) => {
    setEditId(c.id); setEditNome(c.descricao); setEditData(c.data); setEditPlano(c.plano === 'Mensal' ? 'mensal' : 'anual')
  }

  const salvarEdicao = async () => {
    if (!editNome.trim()) return
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editCliente', id: editId, descricao: editNome.trim(), data: editData, plano: editPlano }),
    })
    setEditId(null); load()
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
        <div className="topbar"><span className="topbar-title">👥 Clientes</span></div>
        <div className="content">
          <div className="card">
            <div className="filters" style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input className="finput" placeholder="Filtrar por nome..." value={filtro.nome} onChange={e => setFiltro({ ...filtro, nome: e.target.value })} />
              <select className="finput" value={filtro.plano} onChange={e => setFiltro({ ...filtro, plano: e.target.value })}>
                <option value="">Todos planos</option><option value="Mensal">Mensal</option><option value="Anual">Anual</option>
              </select>
              <input className="finput" type="date" value={filtro.data} onChange={e => setFiltro({ ...filtro, data: e.target.value })} />
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Nome</th><th>Plano</th><th>Data</th><th style={{ textAlign: 'center' }}>Ações</th></tr></thead>
                <tbody>
                  {filtrados.map((c: any) => (
                    <tr key={c.id}>
                      {editId === c.id ? (
                        <>
                          <td><input className="finput" value={editNome} onChange={e => setEditNome(e.target.value)} style={{ width: '100%' }} /></td>
                          <td><span className={`tag tag-${c.plano === 'Mensal' ? 'mensal' : 'anual'}`}>{c.plano}</span></td>
                          <td><input className="finput" type="date" value={editData} onChange={e => setEditData(e.target.value)} /></td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="tbl-btn" onClick={salvarEdicao} style={{ borderColor: '#00e676', color: '#00e676' }}>💾</button>
                            <button className="tbl-btn" onClick={() => setEditId(null)}>✕</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{c.descricao}</td>
                          <td><span className={`tag tag-${c.plano === 'Mensal' ? 'mensal' : 'anual'}`}>{c.plano}</span></td>
                          <td style={{ color: '#555' }}>{c.data}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="tbl-btn" onClick={() => editar(c)}>✏️</button>
                            <button className="tbl-btn del" onClick={() => del(c.id, c.plano)}>🗑</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {filtrados.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 20, color: '#333' }}>Nenhum cliente encontrado</td></tr>}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: '#555', marginTop: 12 }}>{filtrados.length} cliente(s)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
