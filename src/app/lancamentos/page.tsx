'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

const MENSAL = 337
const ANUAL = 337 * 12 * 0.9

export default function LancamentosPage() {
  const [parceiros, setParceiros] = useState<any[]>([])
  const [mensalCount, setMensalCount] = useState(0)
  const [anualCount, setAnualCount] = useState(0)

  // Mensal
  const [mensalDesc, setMensalDesc] = useState('')
  const [mensalData, setMensalData] = useState(() => new Date().toISOString().split('T')[0])
  const [mensalParceiro, setMensalParceiro] = useState('')
  const [msgMensal, setMsgMensal] = useState('')

  // Anual
  const [anualDesc, setAnualDesc] = useState('')
  const [anualData, setAnualData] = useState(() => new Date().toISOString().split('T')[0])
  const [anualParceiro, setAnualParceiro] = useState('')
  const [msgAnual, setMsgAnual] = useState('')

  // Personalizado
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [qty, setQty] = useState(1)
  const [val, setVal] = useState('')
  const [tipo, setTipo] = useState<'recebido' | 'sebrae'>('recebido')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0])
  const [customParceiro, setCustomParceiro] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  const loadAll = async () => {
    const [lancs, parcs, cm, ca] = await Promise.all([
      fetch('/api/data?tipo=lancamentos').then(r => r.json()),
      fetch('/api/data?tipo=parceirosSimple').then(r => r.json()),
      fetch('/api/data?tipo=clientesMensais').then(r => r.json()),
      fetch('/api/data?tipo=clientesAnuais').then(r => r.json()),
    ])
    setLancamentos(lancs)
    setParceiros(parcs)
    setMensalCount(cm.length)
    setAnualCount(ca.length)
  }

  useEffect(() => { loadAll() }, [])

  const addMensal = async () => {
    if (!mensalDesc.trim()) { setMsgMensal('⚠️ Preencha o nome!'); return }
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addClienteMensal', descricao: mensalDesc.trim(), data: mensalData, parceiro: mensalParceiro }),
    })
    setMsgMensal('✅ Cliente adicionado!')
    setMensalDesc(''); setMensalData(new Date().toISOString().split('T')[0]); setMensalParceiro('')
    loadAll()
    setTimeout(() => setMsgMensal(''), 3000)
  }

  const addAnual = async () => {
    if (!anualDesc.trim()) { setMsgAnual('⚠️ Preencha o nome!'); return }
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addClienteAnual', descricao: anualDesc.trim(), data: anualData, parceiro: anualParceiro }),
    })
    setMsgAnual('✅ Cliente adicionado!')
    setAnualDesc(''); setAnualData(new Date().toISOString().split('T')[0]); setAnualParceiro('')
    loadAll()
    setTimeout(() => setMsgAnual(''), 3000)
  }

  const limpar = () => {
    setQty(1); setVal(''); setTipo('recebido'); setDescricao('')
    setData(new Date().toISOString().split('T')[0]); setCustomParceiro(''); setEditId(null); setMsg('')
  }

  const salvar = async () => {
    const v = parseFloat(val) || 0
    if (v <= 0 || !descricao.trim()) { setMsg('⚠️ Preencha valor e descrição!'); return }
    const action = editId ? 'editLancamento' : 'addLancamento'
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id: editId, qty, val: v, tipo, descricao: descricao.trim(), data, parceiro: customParceiro }),
    })
    setMsg(editId ? '✅ Editado!' : '✅ Adicionado!')
    limpar(); loadAll()
    setTimeout(() => setMsg(''), 3000)
  }

  const editar = (l: any) => {
    setEditId(l.id); setQty(l.qty); setVal(String(l.val)); setTipo(l.tipo)
    setDescricao(l.descricao); setData(l.data); setCustomParceiro(l.parceiro || '')
  }

  const del = async (id: number) => {
    if (!confirm('Excluir lançamento?')) return
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delLancamento', id }) })
    loadAll()
  }

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const ParceiroSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="modal-field">
      <p className="modal-label" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>PARCEIRO INDICADOR</p>
      <select
        className="modal-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ background: '#111', color: value ? '#fff' : '#555' }}
      >
        <option value="">— Nenhum —</option>
        {parceiros.map((p: any) => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </select>
    </div>
  )

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

            {/* Card Mensal */}
            <div className="card" style={{ borderColor: '#29b6f633' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#29b6f6', margin: 0 }}>Plano Mensal</p>
                  <p style={{ fontSize: 11, color: '#555', margin: 0 }}>R$ 337/mês</p>
                </div>
                <span style={{ fontSize: 26 }}>📅</span>
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#29b6f6', margin: '0 0 2px' }}>{mensalCount}</p>
              <p style={{ fontSize: 12, color: '#29b6f6aa', marginBottom: 12 }}>Receita: {fmt(mensalCount * MENSAL)}/mês</p>
              <div className="modal-field">
                <p className="modal-label">Nome do cliente</p>
                <input className="modal-input" value={mensalDesc} onChange={e => setMensalDesc(e.target.value)} placeholder="Ex: João Silva" onKeyDown={e => e.key === 'Enter' && addMensal()} />
              </div>
              <div className="modal-field">
                <p className="modal-label">Data</p>
                <input className="modal-input" type="date" value={mensalData} onChange={e => setMensalData(e.target.value)} />
              </div>
              <ParceiroSelect value={mensalParceiro} onChange={setMensalParceiro} />
              <button
                className="lbtn"
                style={{ background: '#29b6f622', border: '1px solid #29b6f655', color: '#29b6f6' }}
                onClick={addMensal}
              >
                + Adicionar Cliente
              </button>
              {msgMensal && <p style={{ fontSize: 12, marginTop: 8, color: msgMensal.startsWith('✅') ? '#00e676' : '#ff9800' }}>{msgMensal}</p>}
            </div>

            {/* Card Anual */}
            <div className="card" style={{ borderColor: '#ab47bc33' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#ab47bc', margin: 0 }}>Plano Anual</p>
                  <p style={{ fontSize: 11, color: '#555', margin: 0 }}>R$ 3.639,60/ano (10% desc.)</p>
                </div>
                <span style={{ fontSize: 26 }}>🏆</span>
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#ab47bc', margin: '0 0 2px' }}>{anualCount}</p>
              <p style={{ fontSize: 12, color: '#ab47bcaa', marginBottom: 12 }}>Receita: {fmt(anualCount * ANUAL)}/ano</p>
              <div className="modal-field">
                <p className="modal-label">Nome do cliente</p>
                <input className="modal-input" value={anualDesc} onChange={e => setAnualDesc(e.target.value)} placeholder="Ex: Empresa XYZ" onKeyDown={e => e.key === 'Enter' && addAnual()} />
              </div>
              <div className="modal-field">
                <p className="modal-label">Data</p>
                <input className="modal-input" type="date" value={anualData} onChange={e => setAnualData(e.target.value)} />
              </div>
              <ParceiroSelect value={anualParceiro} onChange={setAnualParceiro} />
              <button
                className="lbtn"
                style={{ background: '#ab47bc22', border: '1px solid #ab47bc55', color: '#ab47bc' }}
                onClick={addAnual}
              >
                + Adicionar Cliente
              </button>
              {msgAnual && <p style={{ fontSize: 12, marginTop: 8, color: msgAnual.startsWith('✅') ? '#00e676' : '#ff9800' }}>{msgAnual}</p>}
            </div>

            {/* Card Personalizado */}
            <div className="card" style={{ borderColor: '#00c85333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#00c853', margin: 0 }}>Plano Personalizado</p>
                  <p style={{ fontSize: 11, color: '#555', margin: 0 }}>Lançamento avulso</p>
                </div>
                <span style={{ fontSize: 26 }}>⭐</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <button className={`tbtn ${tipo === 'recebido' ? 'on' : 'off'}`} onClick={() => setTipo('recebido')}>💰 Valor recebido</button>
                <button className={`tbtn ${tipo === 'sebrae' ? 'on' : 'off'}`} onClick={() => setTipo('sebrae')}>🏦 Valor SEBRAE</button>
              </div>
              <div className="modal-field">
                <p className="modal-label">Descrição</p>
                <input className="modal-input" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Consultoria / Nome do cliente" />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <p className="modal-label">Qtd</p>
                  <input className="modal-input" type="number" value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)} min={1} />
                </div>
                <div style={{ flex: 2 }}>
                  <p className="modal-label">{tipo === 'sebrae' ? 'Valor SEBRAE (R$)' : 'Valor recebido (R$)'}</p>
                  <input className="modal-input" type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Ex: 6500" />
                </div>
              </div>
              <div className="modal-field">
                <p className="modal-label">Data</p>
                <input className="modal-input" type="date" value={data} onChange={e => setData(e.target.value)} />
              </div>
              <ParceiroSelect value={customParceiro} onChange={setCustomParceiro} />
              <button
                className="lbtn"
                style={{ background: 'linear-gradient(90deg,#00a844,#00e676)', border: 'none' }}
                onClick={salvar}
              >
                {editId ? '✔ Salvar Edição' : '✔ Confirmar Lançamento'}
              </button>
              {editId && (
                <button className="tbtn off" style={{ width: '100%', marginTop: 6 }} onClick={limpar}>✕ Cancelar edição</button>
              )}
              {msg && <p style={{ fontSize: 12, marginTop: 8, color: msg.startsWith('✅') ? '#00e676' : '#ff9800' }}>{msg}</p>}
            </div>

          </div>

          {/* Tabela de Lançamentos Personalizados — fora do grid */}
          <div className="card" style={{ marginTop: 14 }}>
            <p style={{ fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>⭐ Lançamentos Personalizados</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th><th>Qtd</th><th>Valor</th><th>Tipo</th><th>Equiv.</th><th>Data</th><th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lancamentos.map(l => (
                    <tr key={l.id}>
                      <td>{l.descricao}</td>
                      <td>{l.qty}</td>
                      <td>R$ {Number(l.val).toLocaleString('pt-BR')}</td>
                      <td><span className={`tag ${l.tipo === 'sebrae' ? 'tag-custom' : 'tag-mensal'}`}>{l.tipo === 'sebrae' ? '🏦 SEBRAE' : '💰 Recebido'}</span></td>
                      <td style={{ color: '#a78bfa' }}>{Number(l.equiv).toFixed(2)}</td>
                      <td style={{ color: '#555' }}>{l.data}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="tbl-btn" onClick={() => editar(l)}>✏️</button>
                        <button className="tbl-btn del" onClick={() => del(l.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                  {lancamentos.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#333' }}>Nenhum lançamento personalizado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
