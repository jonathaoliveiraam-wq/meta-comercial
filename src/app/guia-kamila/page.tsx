'use client'
import { useState } from 'react'

export default function GuiaKamilaPage() {
  const PB = '#7c3aed'
  const PBL = '#a78bfa'
  const CARD = '#1a1a2e'
  const BORDER = '#7c3aed33'
  const TEXTMUTED = '#64748b'
  const TEXT = '#cbd5e1'

  const [aba, setAba] = useState(0)
  const [copiados, setCopiados] = useState<Record<string, boolean>>({})

  function copiar(key: string, texto: string) {
    navigator.clipboard.writeText(texto)
    setCopiados(c => ({ ...c, [key]: true }))
    setTimeout(() => setCopiados(c => ({ ...c, [key]: false })), 1500)
  }

  const cardStyle: React.CSSProperties = {
    background: CARD, border: `1px solid ${BORDER}`,
    borderTop: `3px solid ${PB}`, borderRadius: 14, padding: '18px 18px',
  }
  const tagStyle: React.CSSProperties = {
    display: 'inline-block', background: PB + '22', border: `1px solid ${PB}55`,
    color: PBL, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700,
  }

  function BtnCopiar({ id, texto }: { id: string; texto: string }) {
    const ok = copiados[id]
    return (
      <button onClick={() => copiar(id, texto)} style={{
        background: ok ? '#059669' : PB, color: '#fff', border: 'none',
        borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700,
        cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
        whiteSpace: 'nowrap',
      }}>
        {ok ? '✓ Copiado' : '📋 Copiar'}
      </button>
    )
  }

  function Script({ id, label, texto, labelStyle }: { id: string; label?: string; texto: string; labelStyle?: React.CSSProperties }) {
    return (
      <div style={{ background: '#0d0d1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12 }}>
          {label && <span style={{ ...tagStyle, ...labelStyle }}>{label}</span>}
          <BtnCopiar id={id} texto={texto} />
        </div>
        <pre style={{ fontSize: 13, color: TEXT, lineHeight: 1.85, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontStyle: 'italic', margin: 0 }}>{texto}</pre>
      </div>
    )
  }

  function Passo({ num, titulo, cor }: { num: string | number; titulo: string; cor?: string }) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: cor || PB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>{num}</div>
        <h2 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0 }}>{titulo}</h2>
      </div>
    )
  }

  const objecoesComuns = [
    { ob: '"Já tenho contador"', resp: '"O contador faz a burocracia. A gente faz inteligência tributária, reduz imposto legalmente. Um complementa o outro."' },
    { ob: '"É caro"', resp: '"Quanto você acha que paga de imposto a mais hoje? Nossos clientes economizam em média 30%. O plano se paga sozinho."' },
    { ob: '"Isso é propaganda?"', resp: '"Propaganda não, eu ajudo empreendedores com contabilidade digital. Se não for sua realidade, sem problema. Mas se tá pagando imposto a mais, vale 10 min de conversa."' },
    { ob: '"Vou pensar"', resp: '"Entendo! Que tal uma conversa rápida de 15 min pra você ver na prática e decidir? Sem compromisso."' },
  ]

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: TEXT }}>

      {/* Header */}
      <div style={{ background: '#0d0d1a', borderBottom: `1px solid ${BORDER}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <a href="/playbook" style={{ color: PBL, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>← Playbook</a>
        <span style={{ color: '#334155' }}>|</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>💬 Guia da Kamila</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,#0d0d1a 0%,${PB}22 100%)`, padding: '28px 18px 20px', textAlign: 'center', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>💬</div>
        <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px' }}>Guia da Kamila</h1>
        <p style={{ color: TEXTMUTED, fontSize: 13, margin: 0 }}>Scripts de prospecção · Faço a Conta · Manaus</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, background: '#0d0d1a', position: 'sticky', top: 49, zIndex: 30, overflowX: 'auto' }}>
        {['📱 DM (lead frio)', '🤝 Indicação (lead quente)', '📅 Rotina do dia'].map((label, i) => (
          <button key={i} onClick={() => setAba(i)} style={{
            flex: 1, padding: '13px 10px', background: 'none', border: 'none',
            borderBottom: `3px solid ${aba === i ? PB : 'transparent'}`,
            color: aba === i ? PBL : TEXTMUTED,
            fontSize: 12, fontWeight: aba === i ? 800 : 600,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* ─── ABA 0: DM ─── */}
        {aba === 0 && <>
          <div style={{ ...cardStyle, marginBottom: 20, borderTop: '3px solid #f59e0b' }}>
            <span style={{ ...tagStyle, background: '#f59e0b22', border: '1px solid #f59e0b55', color: '#fbbf24' }}>Quando usar</span>
            <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.8, margin: '8px 0 0' }}>
              Pessoa que você abordou no Instagram e <strong style={{ color: '#fbbf24' }}>nunca ouviu falar da gente</strong>. Tem que esquentar antes de mandar DM.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={1} titulo="Ritual de 3 dias" />
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 12, margin: '0 0 12px' }}>Todo dia faz os 3 ao mesmo tempo — cada turma num estágio diferente:</p>
              {[
                { dia: 'Dia 1', desc: '30 perfis novos: seguir + curtir 2 fotos do feed. Não manda DM ainda.', cor: PBL },
                { dia: 'Dia 2', desc: 'Os de ontem: comentar 1 post do negócio dela. Não manda DM ainda.', cor: PBL },
                { dia: 'Dia 3', desc: 'Quem comentou ontem: aí sim, manda a DM 1.', cor: '#86efac' },
              ].map(d => (
                <div key={d.dia} style={{ display: 'flex', gap: 12, padding: '9px 12px', background: '#0d0d1a', borderRadius: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: d.cor, fontWeight: 800, fontSize: 12, flexShrink: 0, minWidth: 42 }}>{d.dia}</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={2} titulo="Primeira DM" />
            <div style={cardStyle}>
              <Script id="dm1" label="DM 1" texto="Oi [Nome]! Comentei lá no seu post de [assunto], bacana demais. Sou da equipe da Faço a Conta, contabilidade digital. Pergunta rápida: você tem contador hoje ou tá tocando a parte fiscal por conta própria?" />
              <p style={{ fontSize: 12, color: TEXTMUTED, margin: '4px 0 12px' }}>Se respondeu → vai pro Passo 3. Se não respondeu → espera 3 dias:</p>
              <Script id="dm2" label="DM 2 (sem resposta em 3 dias)" labelStyle={{ background: '#33415522', border: '1px solid #33415555', color: TEXTMUTED }} texto={"Oi [Nome]! Só passando pra ver se você viu minha mensagem. Se não for o momento, sem problema, fico à disposição quando precisar de apoio contábil 🙂"} />
              <div style={{ padding: '8px 12px', background: '#1a1014', border: '1px solid #ef444433', borderRadius: 8, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: '#fca5a5', margin: 0, fontWeight: 600 }}>✗ Sem resposta na DM 2 → arquiva.</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={3} titulo="Qualificar" />
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: TEXTMUTED, margin: '0 0 12px' }}>Uma pergunta por vez:</p>
              {[
                '"Você tem CNPJ aberto ou ainda tá como pessoa física?" (sem CNPJ = agradece e encerra)',
                '"Já tem alguém te ajudando com a parte contábil, ou tá tocando por conta própria?"',
                '"Você emite nota fiscal regularmente?"',
                '"O que mais te incomoda hoje nessa parte: imposto, nota, ou prazo?"',
              ].map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#0d0d1a', borderRadius: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: PBL, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{q}</p>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14 }}>
                <p style={{ fontSize: 12, color: PBL, fontWeight: 700, margin: '0 0 10px' }}>Se travar numa objeção:</p>
                {objecoesComuns.map(o => (
                  <div key={o.ob} style={{ padding: '10px 12px', background: PB + '11', border: `1px solid ${PB}33`, borderRadius: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 12, color: PBL, fontWeight: 700, margin: '0 0 4px' }}>{o.ob}</p>
                    <p style={{ fontSize: 12, color: TEXT, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>{o.resp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={4} titulo="Marcar a reunião" cor="#059669" />
            <div style={{ ...cardStyle, borderTop: '3px solid #059669' }}>
              <p style={{ fontSize: 11, color: TEXTMUTED, margin: '0 0 10px' }}>Quando: tem CNPJ + sem contador ou insatisfeito + citou uma dor</p>
              <Script id="dm-reu" label="Marcar reunião" texto="Olha, pelo que você me contou faz muito sentido a gente conversar 20 min. Não é reunião de venda, quero te mostrar como funciona e você decide. Quando você tem um tempinho essa semana?" />
              <Script id="dm-whats" label="Topou? Puxa pro WhatsApp" texto="Perfeito! Vou te passar o nosso WhatsApp pra te enviar o link da reunião e o material. Qual o melhor número?" />
              <div style={{ padding: '8px 12px', background: '#0f2d1a', border: '1px solid #22c55e33', borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: '#86efac', margin: 0, fontWeight: 600 }}>✓ Registra o lead no CRM na hora.</p>
              </div>
            </div>
          </div>
        </>}

        {/* ─── ABA 1: Indicação ─── */}
        {aba === 1 && <>
          <div style={{ ...cardStyle, marginBottom: 20, borderTop: '3px solid #22c55e' }}>
            <span style={{ ...tagStyle, background: '#22c55e22', border: '1px solid #22c55e55', color: '#86efac' }}>Quando usar</span>
            <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.8, margin: '8px 0 0' }}>
              Pessoa que chegou por um <strong style={{ color: '#86efac' }}>parceiro da rede</strong>. É lead quente, já sabe que vamos falar com ele.
              Não faz ritual de 3 dias. <strong style={{ color: '#86efac' }}>Fala direto, hoje.</strong>
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={1} titulo="Primeiro contato" />
            <div style={cardStyle}>
              <Script id="ind1" label="Mensagem inicial" texto={"Oi [Nome]! Tudo bem? Aqui é a Kamila, da Faço a Conta. O [parceiro] passou seu contato pra mim. A gente já tá ajudando centenas de empreendedores aqui em Manaus a reduzir custos e organizar melhor a gestão, e o [parceiro] achou que faria sentido pra você também. Posso te fazer duas perguntas rápidas pra entender como a gente pode te ajudar?"} />
              <p style={{ fontSize: 12, color: TEXTMUTED, margin: '4px 0 12px' }}>Se não respondeu em 24h:</p>
              <Script id="ind2" label="Follow-up 24h" labelStyle={{ background: '#33415522', border: '1px solid #33415555', color: TEXTMUTED }} texto={"Oi [Nome]! Passando só pra confirmar se chega aqui pra você. O [parceiro] comentou que ia fazer sentido pra você, qualquer coisa tô à disposição 🙂"} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={2} titulo="Qualificar" />
            <div style={cardStyle}>
              <p style={{ fontSize: 12, color: TEXTMUTED, margin: '0 0 12px' }}>Quem vem de indicação quase sempre já tem CNPJ — não pergunta se tem, <strong style={{ color: TEXT }}>começa pela dor</strong>:</p>
              {[
                '"Hoje você já tem alguém cuidando da parte contábil, ou tá tocando mais por conta própria?"',
                '"Você emite nota fiscal com frequência?"',
                '"O que mais te incomoda hoje nessa parte: imposto, nota, prazo, ou a organização no geral?"',
              ].map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#0d0d1a', borderRadius: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: PBL, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{q}</p>
                </div>
              ))}
              <div style={{ padding: '8px 12px', background: PB + '11', border: `1px solid ${PB}33`, borderRadius: 8, margin: '12px 0' }}>
                <p style={{ fontSize: 12, color: PBL, margin: 0, fontWeight: 600 }}>Exceção: ainda não tem CNPJ → "Sem problema! A gente ajuda a abrir e já deixa tudo organizado desde o começo." E segue normal.</p>
              </div>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
                <p style={{ fontSize: 12, color: PBL, fontWeight: 700, margin: '0 0 10px' }}>Se travar numa objeção:</p>
                {objecoesComuns.filter((_, i) => i !== 2).map(o => (
                  <div key={o.ob} style={{ padding: '10px 12px', background: PB + '11', border: `1px solid ${PB}33`, borderRadius: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 12, color: PBL, fontWeight: 700, margin: '0 0 4px' }}>{o.ob}</p>
                    <p style={{ fontSize: 12, color: TEXT, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>{o.resp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Passo num={3} titulo="Marcar a reunião" cor="#059669" />
            <div style={{ ...cardStyle, borderTop: '3px solid #059669' }}>
              <Script id="ind-reu" label="Marcar reunião" texto="Show, [Nome]! Faz sentido a gente conversar 20 min pra eu te mostrar como funciona e você decide. Quando você tem um tempinho essa semana?" />
              <div style={{ padding: '8px 12px', background: '#0f2d1a', border: '1px solid #22c55e33', borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: '#86efac', margin: 0, fontWeight: 600 }}>✓ Registra no CRM e avisa o parceiro que o contato foi feito.</p>
              </div>
            </div>
          </div>
        </>}

        {/* ─── ABA 2: Rotina ─── */}
        {aba === 2 && <>
          {/* Meta */}
          <div style={{ background: PB + '22', border: `2px solid ${PB}66`, borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>30</div>
              <div style={{ fontSize: 10, color: PBL, fontWeight: 700, letterSpacing: '0.5px' }}>PERFIS/DIA</div>
            </div>
            <div style={{ borderLeft: `1px solid ${PB}44`, paddingLeft: 16 }}>
              <p style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, margin: '0 0 4px' }}>Meta diária de prospecção</p>
              <p style={{ fontSize: 12, color: TEXTMUTED, lineHeight: 1.6, margin: 0 }}>30 perfis novos todo dia. Em 30 dias = 900 abordados. Com 3% indo pra reunião = <strong style={{ color: PBL }}>27 reuniões no mês</strong>.</p>
            </div>
          </div>

          {/* Manhã */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: PBL, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>☀️ Manhã — prioridades</h2>
            <div style={cardStyle}>
              {[
                'Responder toda mensagem nova do dia anterior (nada sem resposta em 24h)',
                'Atender primeiro os leads de indicação (quentes) e quem respondeu a DM',
                'Avançar no CRM quem evoluiu de etapa',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: '#0d0d1a', borderRadius: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: PBL, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ritual Instagram */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: PBL, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📱 Ritual Instagram</h2>
            <div style={cardStyle}>
              {[
                { dia: 'Dia 1', acao: 'Seguir 30 perfis novos + curtir 2 fotos de cada', cor: PBL },
                { dia: 'Dia 2', acao: 'Comentar nos 30 de ontem', cor: PBL },
                { dia: 'Dia 3', acao: 'Mandar DM 1 nos 30 que comentou ontem', cor: '#86efac' },
              ].map(d => (
                <div key={d.dia} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ color: d.cor, fontWeight: 800, fontSize: 12, flexShrink: 0, minWidth: 42 }}>{d.dia}</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>{d.acao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Onde achar */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: PBL, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🔍 Onde achar os 30 perfis (Manaus)</h2>
            <div style={cardStyle}>
              {[
                'Seguidores de outras contabilidades de Manaus',
                'Seguidores de @sebrae_am, @aciamanaus, @cdlmanaus',
                'Quem curtiu/comentou posts sobre MEI, DAS, Simples',
                'Seguidores de @contaazul, @omie.erp',
                'Busca por bio: "MEI Manaus", "loja Manaus", "serviço Manaus"',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: '#0d0d1a', borderRadius: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🔥</span>
                  <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vale / não vale */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ ...cardStyle, borderTop: '3px solid #22c55e' }}>
              <h3 style={{ color: '#86efac', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Perfil que vale</h3>
              {['Bio com CNPJ/MEI/loja/serviço', 'Posts mostram produto ou serviço', 'Cara de negócio real', 'Já reclamou de imposto/nota/DAS'].map(s => (
                <p key={s} style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 6, paddingLeft: 10, borderLeft: '2px solid #22c55e44', lineHeight: 1.5 }}>{s}</p>
              ))}
            </div>
            <div style={{ ...cardStyle, borderTop: '3px solid #ef4444' }}>
              <h3 style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✗ Não vale agora</h3>
              {['Bio genérica sem negócio', 'Só estilo de vida pessoal', 'Parece CLT', 'Influencer sem negócio'].map(s => (
                <p key={s} style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 6, paddingLeft: 10, borderLeft: '2px solid #ef444444', lineHeight: 1.5 }}>{s}</p>
              ))}
            </div>
          </div>

          {/* Regra de ouro */}
          <div style={{ background: PB + '22', border: `2px solid ${PB}66`, borderRadius: 14, padding: '18px 20px' }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 800, margin: '0 0 12px' }}>⭐ Regra de ouro</h3>
            {[
              'Quem responde é sempre você, nunca robô.',
              'Lead novo no CRM no mesmo dia.',
              'Toda mensagem respondida em até 24h.',
              'Qualidade acima de quantidade.',
            ].map(r => (
              <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: '#86efac', flexShrink: 0, fontWeight: 700 }}>✓</span>
                <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        </>}

      </div>
    </div>
  )
}
