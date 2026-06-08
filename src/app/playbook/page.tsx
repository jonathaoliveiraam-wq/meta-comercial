export default function PlaybookPage() {
  const PB = '#7c3aed'
  const PBL = '#a78bfa'
  const CARD = '#1a1a2e'
  const BORDER = '#7c3aed33'
  const TEXTMUTED = '#64748b'
  const TEXT = '#cbd5e1'

  const secoes = [
    { id: 'missao',       label: 'Missão' },
    { id: 'produto',      label: 'Produto' },
    { id: 'publico',      label: 'Público-alvo' },
    { id: 'planos',       label: 'Planos' },
    { id: 'diferenciais', label: 'Diferenciais' },
    { id: 'social',       label: 'Social Seller' },
    { id: 'script',       label: 'Script' },
    { id: 'objecoes',     label: 'Objeções' },
    { id: 'funil',        label: 'Funil' },
    { id: 'credibilidade',label: 'Credibilidade' },
    { id: 'regras',       label: 'Regras' },
  ]

  const cardStyle = { background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${PB}`, borderRadius: 14, padding: '20px 22px' }
  const h2Style = { fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: PBL, marginBottom: 8 }
  const tagStyle = { display: 'inline-block', background: PB + '22', border: `1px solid ${PB}55`, color: PBL, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, marginBottom: 10 }

  return (
    <div className="pb-body" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <nav style={{ width: 200, flexShrink: 0, background: '#0d0d1a', borderRight: `1px solid ${BORDER}`, padding: '24px 12px', position: 'fixed', height: '100vh', overflowY: 'auto', zIndex: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: PBL, marginBottom: 20, paddingLeft: 10, letterSpacing: '0.5px' }}>PLAYBOOK</div>
        {secoes.map(s => (
          <a key={s.id} href={'#' + s.id} style={{ display: 'block', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: s.id === 'social' ? PBL : '#475569', textDecoration: 'none', marginBottom: 2, background: s.id === 'social' ? PB + '18' : 'transparent', border: s.id === 'social' ? `1px solid ${PB}44` : '1px solid transparent' }}>
            {s.id === 'social' ? '📱 ' : ''}{s.label}
          </a>
        ))}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, marginTop: 20 }}>
          <a href="/dashboard" style={{ display: 'block', padding: '7px 12px', borderRadius: 8, fontSize: 11, color: '#334155', textDecoration: 'none' }}>Dashboard</a>
          <a href="/crm" style={{ display: 'block', padding: '7px 12px', borderRadius: 8, fontSize: 11, color: '#334155', textDecoration: 'none' }}>CRM</a>
          <a href="/parceiros" style={{ display: 'block', padding: '7px 12px', borderRadius: 8, fontSize: 11, color: '#334155', textDecoration: 'none' }}>Parceiros</a>
        </div>
      </nav>

      <main style={{ flex: 1, marginLeft: 200 }}>

        {/* Hero */}
        <div className="pb-hero">
          <h1>📖 <span>Playbook Comercial</span></h1>
          <p>Realizadores do Improvável · Faço a Conta</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Social Seller', 'Scripts', 'Funil', 'Objeções'].map(s => (
              <a key={s} href={'#' + s.toLowerCase().replace(' ', '')} style={{ padding: '6px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: PB + '18', border: `1px solid ${PB}44`, color: PBL, textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* MISSAO */}
        <div className="pb-section" id="missao">
          <div style={tagStyle}>MISSÃO</div>
          <h2 style={h2Style}>Por que existimos</h2>
          <div className="pb-highlight">
            <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.8 }}>Salvar negócios que seriam fechados por falta de gestão fiscal. Levar inteligência tributária e organização financeira para micro e pequenas empresas do Simples Nacional.</p>
          </div>
        </div>

        {/* PRODUTO */}
        <div className="pb-section" id="produto">
          <div style={tagStyle}>PRODUTO</div>
          <h2 style={h2Style}>O que entregamos</h2>
          <div className="pb-grid-3">
            {['Inteligência Tributária', 'Gestão Financeira', 'Emissor de NF', 'PDV Online', 'IA Fiscal 24h', 'Abertura CNPJ Grátis'].map(p => (
              <div key={p} style={{ ...cardStyle, textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PUBLICO */}
        <div className="pb-section" id="publico">
          <div style={tagStyle}>PÚBLICO-ALVO</div>
          <h2 style={h2Style}>Para quem vendemos</h2>
          <div className="pb-grid-3">
            {[
              { titulo: 'Perfil', texto: 'MEI, micro e pequenas empresas do Simples Nacional. Faturamento até R$ 4,8M.' },
              { titulo: 'Dores', texto: 'Carga tributária alta, contadores lentos, falta de organização fiscal, medo de malha fina.' },
              { titulo: 'Solução', texto: 'Redução legal de impostos, gestão integrada, suporte IA 24h, contabilidade consultiva.' },
            ].map(c => (
              <div key={c.titulo} style={cardStyle}>
                <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{c.titulo}</h3>
                <p style={{ fontSize: 13, color: TEXTMUTED, lineHeight: 1.6 }}>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PLANOS */}
        <div className="pb-section" id="planos">
          <div style={tagStyle}>PLANOS</div>
          <h2 style={h2Style}>Preços e planos</h2>
          <div className="pb-grid-4">
            {[
              { nome: 'MEI', valor: 'R$ 97/mês' },
              { nome: 'Controle', valor: 'R$ 227/mês' },
              { nome: 'Essencial', valor: 'R$ 337/mês' },
              { nome: 'Anual', valor: 'R$ 303/mês', desc: 'R$ 3.639,60/ano' },
            ].map(p => (
              <div key={p.nome} style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PBL }}>{p.nome}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginTop: 6 }}>{p.valor}</div>
                {p.desc && <div style={{ fontSize: 11, color: TEXTMUTED, marginTop: 4 }}>{p.desc}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* DIFERENCIAIS */}
        <div className="pb-section" id="diferenciais">
          <div style={tagStyle}>DIFERENCIAIS</div>
          <h2 style={h2Style}>Por que somos diferentes</h2>
          <div className="pb-grid-2">
            {[
              { icone: '🤖', titulo: 'IA Fiscal 24h', texto: 'Assistente fiscal para dúvidas sobre NFs, guias, prazos e tributos. Responde domingo às 22h.' },
              { icone: '📱', titulo: 'PDV Online', texto: 'Venda direto pelo sistema com emissão de NF na hora. Ideal para comércio e serviços.' },
              { icone: '📊', titulo: 'Gestão Completa', texto: 'Contas a pagar/receber, fluxo de caixa, DRE em um só lugar.' },
              { icone: '🏅', titulo: 'Top 1000 SEBRAE', texto: 'Reconhecimento nacional como um dos negócios mais promissores do Brasil.' },
            ].map(d => (
              <div key={d.titulo} style={{ ...cardStyle, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{d.icone}</span>
                <div>
                  <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{d.titulo}</h3>
                  <p style={{ fontSize: 13, color: TEXTMUTED, lineHeight: 1.6 }}>{d.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL SELLER */}
        <div className="pb-section" id="social">
          <div style={tagStyle}>SOCIAL SELLER</div>
          <h2 style={h2Style}>Prospecção via DM — Instagram</h2>
          <p style={{ color: TEXTMUTED, fontSize: 14, marginBottom: 32 }}>Canal mais barato e eficaz de prospecção hoje. Sem ads, sem evento — só consistência diária no DM. Este processo funciona para qualquer pessoa do time comercial.</p>

          {/* META */}
          <div style={{ background: PB + '22', border: `2px solid ${PB}66`, borderRadius: 14, padding: '16px 22px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>30</div>
              <div style={{ fontSize: 11, color: PBL, fontWeight: 700, letterSpacing: '0.5px' }}>PESSOAS/DIA</div>
            </div>
            <div style={{ borderLeft: `1px solid ${PB}44`, paddingLeft: 20 }}>
              <p style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>Meta diária de prospecção</p>
              <p style={{ fontSize: 12, color: TEXTMUTED, lineHeight: 1.6 }}>30 pessoas novas entram no ritual todo dia. Com o ciclo de 3 dias, em 30 dias você terá abordado 900 empresários. Mesmo com 3% de conversão em reunião, são 27 reuniões no mês.</p>
            </div>
          </div>

          {/* FLUXO VISUAL */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>O Fluxo — passo a passo por pessoa</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 20 }}>Cada pessoa que você decide abordar passa por este fluxo. Nunca pule etapa.</p>

          {/* Passo 1 */}
          <div style={{ display: 'flex', gap: 0, flexDirection: 'column', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: PB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>1</div>
                <div style={{ width: 2, height: 40, background: PB + '44', marginTop: 4 }} />
              </div>
              <div style={{ ...cardStyle, flex: 1, marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700 }}>Dia 1 — Entrar no radar</h3>
                  <span style={{ fontSize: 10, color: PBL, fontWeight: 700, background: PB + '22', padding: '3px 8px', borderRadius: 6 }}>30 pessoas/dia</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icone: '➕', acao: 'Seguir o perfil' },
                    { icone: '❤️', acao: 'Curtir os Stories ativos (se tiver)' },
                    { icone: '❤️', acao: 'Curtir 2 fotos do feed' },
                    { icone: '🚫', acao: 'NÃO enviar DM ainda — deixe o algoritmo trabalhar' },
                  ].map(a => (
                    <div key={a.acao} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: '#0d0d1a', borderRadius: 7 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{a.icone}</span>
                      <p style={{ fontSize: 12, color: a.icone === '🚫' ? TEXTMUTED : TEXT }}>{a.acao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: PB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>2</div>
                <div style={{ width: 2, height: 40, background: PB + '44', marginTop: 4 }} />
              </div>
              <div style={{ ...cardStyle, flex: 1, marginBottom: 0, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700 }}>Dia 2 — Comentar</h3>
                  <span style={{ fontSize: 10, color: PBL, fontWeight: 700, background: PB + '22', padding: '3px 8px', borderRadius: 6 }}>quem entrou ontem</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icone: '💬', acao: 'Comentar em 1 post recente do negócio' },
                    { icone: '✅', acao: 'Falar sobre o negócio dela — nunca elogio pessoal' },
                    { icone: '🚫', acao: 'NÃO enviar DM ainda' },
                  ].map(a => (
                    <div key={a.acao} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: '#0d0d1a', borderRadius: 7 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{a.icone}</span>
                      <p style={{ fontSize: 12, color: a.icone === '🚫' ? TEXTMUTED : TEXT }}>{a.acao}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: '8px 12px', background: PB + '11', borderRadius: 8, borderLeft: `3px solid ${PB}` }}>
                  <p style={{ fontSize: 11, color: TEXT, fontStyle: 'italic' }}>Exemplos de comentário: "Que serviço diferenciado! Esse segmento tá crescendo muito aqui em Manaus 🙌" / "Que trabalho caprichado! Faz tempo no ramo?"</p>
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: PB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>3</div>
                <div style={{ width: 2, height: 40, background: PB + '44', marginTop: 4 }} />
              </div>
              <div style={{ ...cardStyle, flex: 1, marginBottom: 0, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700 }}>Dia 3 — Enviar DM</h3>
                  <span style={{ fontSize: 10, color: PBL, fontWeight: 700, background: PB + '22', padding: '3px 8px', borderRadius: 6 }}>quem comentou ontem</span>
                </div>
                <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 8 }}>A pessoa já te viu 2 vezes. A DM chega como continuação natural, não como spam.</p>
                <div style={{ padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, borderLeft: `3px solid ${PB}` }}>
                  <p style={{ fontSize: 12, color: TEXT, fontStyle: 'italic', lineHeight: 1.7 }}>"Oi [Nome]! Comentei lá no seu post de [assunto] — bacana demais. Sou da equipe da Faço a Conta, contabilidade digital. Pergunta rápida: você tem contador hoje ou tá tocando a parte fiscal sozinho(a)?"</p>
                </div>
              </div>
            </div>

            {/* Bifurcação — respondeu ou não */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>?</div>
              </div>
              <div style={{ flex: 1, marginTop: 8, display: 'flex', gap: 12 }}>
                {/* Respondeu */}
                <div style={{ flex: 1, background: '#0f2d1a', border: '1px solid #22c55e44', borderTop: '3px solid #22c55e', borderRadius: 14, padding: '16px 18px' }}>
                  <h3 style={{ color: '#86efac', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✓ Respondeu</h3>
                  <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 8 }}>Inicie a qualificação de forma natural. Use as perguntas da seção abaixo. Objetivo: chegar na reunião em até 5 mensagens.</p>
                  <p style={{ fontSize: 11, color: '#86efac', fontWeight: 600 }}>→ Segue para o Script de Qualificação</p>
                </div>
                {/* Não respondeu */}
                <div style={{ flex: 1, background: '#1a1014', border: '1px solid #ef444444', borderTop: '3px solid #ef4444', borderRadius: 14, padding: '16px 18px' }}>
                  <h3 style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✗ Não respondeu</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      'Aguardar 3 dias',
                      'Curtir 1 Story novo se aparecer',
                      'Tentar DM 2 com abordagem diferente',
                      'Sem resposta na DM 2 → arquivar',
                    ].map((s, i) => (
                      <div key={s} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700, flexShrink: 0 }}>D+{[3,4,4,7][i]}</span>
                        <p style={{ fontSize: 11, color: TEXTMUTED }}>{s}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, padding: '8px 10px', background: '#0d0d1a', borderRadius: 7 }}>
                    <p style={{ fontSize: 11, color: TEXT, fontStyle: 'italic' }}>DM 2: "Oi [Nome]! Só passando pra ver se você viu minha mensagem. Se não for o momento certo, sem problema — fico à disposição quando precisar de apoio contábil 🙂"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline diário */}
          <div style={{ ...cardStyle, marginBottom: 32, marginTop: 16 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Rotina diária — 3 estágios simultâneos</h3>
            <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 12 }}>Todo dia você executa os 3 passos ao mesmo tempo — cada leva de pessoas está num estágio diferente do fluxo.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { step: 'Passo 1 hoje', qtd: '30 perfis novos', obs: 'Seguir + curtir Stories + curtir 2 fotos do feed', cor: PBL },
                { step: 'Passo 2 hoje', qtd: '30 perfis',       obs: 'Comentar — quem você seguiu ontem', cor: PBL },
                { step: 'Passo 3 hoje', qtd: '30 DMs',          obs: 'Enviar DM — quem você comentou ontem', cor: '#86efac' },
              ].map(p => (
                <div key={p.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, border: `1px solid ${BORDER}` }}>
                  <span style={{ color: p.cor, fontWeight: 800, fontSize: 13, minWidth: 70 }}>{p.qtd}</span>
                  <span style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 600, minWidth: 90 }}>{p.step}</span>
                  <span style={{ color: TEXTMUTED, fontSize: 11 }}>{p.obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Como encontrar */}
          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Como encontrar prospectos em Manaus</h3>
            <p style={{ fontSize: 11, color: TEXTMUTED, marginBottom: 14 }}>Hashtag não funciona bem — o alcance caiu muito. Essas fontes entregam listas mais quentes e qualificadas.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { fonte: 'Seguidores de concorrentes', como: 'Abra o perfil de outras contabilidades em Manaus e percorra quem as segue', quente: true },
                { fonte: 'Seguidores de @sebrae_am, @aciamanaus, @cdlmanaus', como: 'Quem segue associações já é ou quer ser empresário — público altamente qualificado', quente: true },
                { fonte: 'Quem curtiu/comentou posts sobre MEI, DAS, Simples', como: 'Engajou com o assunto = dor confirmada. Vá nos posts de notícias ou perfis de finanças', quente: true },
                { fonte: 'Seguidores de apps: @contaazul, @omie.erp', como: 'Já usa ou busca solução contábil — lead muito quente', quente: true },
                { fonte: 'Posts marcados em locais comerciais', como: '"Centro Comercial de Manaus", "Feira do Produtor AM", shoppings locais — negócio físico real', quente: false },
                { fonte: 'Seguidores de fornecedores locais', como: 'Distribuidoras, gráficas, uniformes — quem segue tem negócio ativo e compra insumos', quente: false },
                { fonte: 'Busca por bio no Instagram', como: 'Pesquise "MEI Manaus", "loja Manaus", "serviço Manaus" diretamente no campo de busca por pessoas', quente: false },
              ].map(f => (
                <div key={f.fonte} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, border: `1px solid ${f.quente ? '#22c55e33' : BORDER}`, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: f.quente ? '#86efac' : TEXTMUTED, flexShrink: 0, marginTop: 2 }}>{f.quente ? '🔥' : '•'}</span>
                  <div>
                    <p style={{ fontSize: 12, color: TEXT, fontWeight: 600, marginBottom: 2 }}>{f.fonte}</p>
                    <p style={{ fontSize: 11, color: TEXTMUTED }}>{f.como}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Como identificar oportunidade */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Como identificar uma oportunidade no perfil</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Antes de seguir, leia o perfil por 30 segundos. Esses sinais dizem se vale abordagem ou não.</p>
          <div className="pb-grid-2" style={{ marginBottom: 16 }}>
            <div style={cardStyle}>
              <h3 style={{ color: '#86efac', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Perfil que vale abordar</h3>
              {[
                { sinal: 'Bio menciona CNPJ, MEI, empresa, loja, serviço', ex: 'Ex: "Dono da Barbearia X", "Distribuidora Y", "Arquiteta autônoma"' },
                { sinal: 'Posts mostram produto, serviço ou bastidor do negócio', ex: 'Fotos de obra, pratos, produtos, atendimento, equipe' },
                { sinal: 'Postou sobre dificuldade financeira ou fiscal', ex: '"Imposto alto demais", "DAS atrasado", "Nota fiscal deu problema"' },
                { sinal: 'Perfil tem cara de negócio real, não de influencer', ex: 'Poucos seguidores, posts do dia a dia, sem produção excessiva' },
              ].map(s => (
                <div key={s.sinal} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid #22c55e44` }}>
                  <p style={{ fontSize: 12, color: TEXT, marginBottom: 2 }}>{s.sinal}</p>
                  <p style={{ fontSize: 11, color: TEXTMUTED, fontStyle: 'italic' }}>{s.ex}</p>
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✗ Perfil que não vale agora</h3>
              {[
                { sinal: 'Bio genérica sem menção a negócio', ex: '"Vivendo a vida", "Mãe e esposa"' },
                { sinal: 'Perfil focado em estilo de vida pessoal', ex: 'Fotos de viagem, academia, família — sem produto ou serviço' },
                { sinal: 'Parece funcionário CLT', ex: 'Posts de empresa onde trabalha, nada de negócio próprio' },
                { sinal: 'Muitos seguidores, poucos posts de negócio', ex: 'Influencer, criador de conteúdo — não é o público' },
              ].map(s => (
                <div key={s.sinal} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid #ef444444` }}>
                  <p style={{ fontSize: 12, color: TEXT, marginBottom: 2 }}>{s.sinal}</p>
                  <p style={{ fontSize: 11, color: TEXTMUTED, fontStyle: 'italic' }}>{s.ex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comentários no feed */}
          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Comentários no feed — Passo 2 do ritual</h3>
            <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 14 }}>O comentário posiciona você como empreendedor que entende o universo dela — não como vendedor. Fale sobre a realidade de empreender, não sobre o seu produto.</p>
            {[
              { contexto: 'Post sobre crescimento do negócio', comentario: '"Crescer no Brasil exige coragem demais. O maior desafio não é nem vender — é manter a casa em ordem enquanto cresce. Você tá conseguindo?"' },
              { contexto: 'Post sobre rotina pesada de empreendedor', comentario: '"Essa realidade é real demais. O empreendedor cuida de tudo: venda, entrega, financeiro... e ainda precisa entender de imposto. Sistema não facilita não."' },
              { contexto: 'Post de desabafo ou dificuldade', comentario: '"Empreender em Manaus tem seus desafios específicos. Mas o que mais trava as pessoas aqui não é mercado — é burocracia. Conheço bem esse cenário."' },
              { contexto: 'Foto do produto ou serviço', comentario: '"Que trabalho caprichado! Faz tempo no ramo?"' },
              { contexto: 'Abertura de empresa ou nova fase', comentario: '"Parabéns! Começar um negócio exige coragem mesmo. Que segmento você escolheu?"' },
            ].map(g => (
              <div key={g.contexto} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ minWidth: 150, flexShrink: 0 }}>
                  <p style={{ fontSize: 10, color: PBL, fontWeight: 700, marginBottom: 2 }}>Contexto:</p>
                  <p style={{ fontSize: 11, color: TEXTMUTED }}>{g.contexto}</p>
                </div>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.7, fontStyle: 'italic' }}>{g.comentario}</p>
              </div>
            ))}
          </div>

          {/* SIMULAÇÃO DE CONVERSA */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Simulação de conversa completa</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Como uma abordagem real flui — do comentário até a reunião marcada. Estude o tom: curioso, humano, sem pressa.</p>

          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ ...tagStyle, marginBottom: 16 }}>Simulação 1 — Empresária sem contador</div>
            {[
              { lado: 'você', msg: '[ Comentou no post de foto do salão ] "Que ambiente lindo! Salão bem cuidado transmite confiança pro cliente. 🙌"' },
              { lado: 'ela', msg: 'Respondin: "Muito obrigada! A gente se dedica muito aqui 😊"' },
              { lado: 'você', msg: '[ DM no dia seguinte ] "Oi [Nome]! Vi aqui seu salão — que trabalho caprichado.\nCuriosidade: a parte de nota fiscal e imposto você resolve sozinha ou tem alguém te ajudando com isso?\nPergunto porque a maioria dos empreendedores aqui em Manaus gasta tempo demais com isso — tempo que deveria tá no negócio."' },
              { lado: 'ela', msg: '"Sozinha mesmo, to tentando entender o DAS e essas coisas, nunca tive contador não"' },
              { lado: 'você', msg: '"Entendo! A maioria começa assim. Fica difícil, né? Principalmente na hora que vem guia e você não sabe se tá certo. O que mais te complica hoje nessa parte — prazo, emitir nota, ou entender o quanto tá pagando de imposto?"' },
              { lado: 'ela', msg: '"Tudo isso na vdd rsrs principalmente nota fiscal, meu cliente pediu e eu não sabia emitir"' },
              { lado: 'você', msg: '"Isso é muito comum, não precisa se sentir mal. A gente tem uma plataforma que já tem o emissor de NF integrado, com IA que te orienta. Funciona no celular mesmo. Posso te mostrar como é em 15 minutos? Sem compromisso — você vê e decide se faz sentido."' },
              { lado: 'ela', msg: '"Ah pode ser sim! Qual dia você tem?"' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, flexDirection: m.lado === 'você' ? 'row' : 'row-reverse' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.lado === 'você' ? PB : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.lado === 'você' ? 'VC' : 'ELA'}</div>
                <div style={{ background: m.lado === 'você' ? PB + '22' : '#1e293b', border: `1px solid ${m.lado === 'você' ? PB + '44' : '#334155'}`, borderRadius: 10, padding: '8px 12px', maxWidth: '80%' }}>
                  <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>{m.msg}</p>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#22c55e', marginTop: 8, fontWeight: 600 }}>✓ Resultado: reunião marcada em 7 mensagens. Em nenhum momento pareceu venda forçada.</p>
          </div>

          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <div style={{ ...tagStyle, marginBottom: 16 }}>Simulação 2 — Empresário com contador mas insatisfeito</div>
            {[
              { lado: 'você', msg: '[ Comentou no post de loja ] "Que loja organizada! Esse tipo de apresentação faz diferença na hora de fechar com cliente maior."' },
              { lado: 'ele', msg: '"Valeu! Tamo se preparando pra crescer esse ano"' },
              { lado: 'você', msg: '[ DM ] "[Nome], fala sério — empreender no Brasil em 2025 tá pesado demais. Imposto, burocracia, nota fiscal... parece que o sistema foi feito pra travar quem quer crescer.\nComo tá sendo isso pra você? Você consegue focar no negócio ou fica apagando incêndio fiscal toda semana?"' },
              { lado: 'ele', msg: '"Tenho sim, mas é difícil de falar com ele. Responde lento demais"' },
              { lado: 'você', msg: '"Entendo, isso é uma reclamação muito comum. Quando o negócio tá crescendo você precisa de resposta rápida, não de esperar dias. Nossa plataforma tem IA que responde na hora, 24h. Como você usa hoje — só pra DAS e declaração, ou tá usando pra gestão financeira também?"' },
              { lado: 'ele', msg: '"Só DAS mesmo, gestão financeira faço no papel ainda rsrs"' },
              { lado: 'você', msg: '"Rsrs no papel ainda funciona, mas quando escala fica complicado. A gente tem controle de caixa, DRE, contas a pagar tudo junto com a contabilidade. Quer ver como é? 20 minutos e você já tem uma ideia clara se faz sentido pra sua fase agora."' },
              { lado: 'ele', msg: '"Pode ser sim, me manda o link"' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, flexDirection: m.lado === 'você' ? 'row' : 'row-reverse' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.lado === 'você' ? PB : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.lado === 'você' ? 'VC' : 'ELE'}</div>
                <div style={{ background: m.lado === 'você' ? PB + '22' : '#1e293b', border: `1px solid ${m.lado === 'você' ? PB + '44' : '#334155'}`, borderRadius: 10, padding: '8px 12px', maxWidth: '80%' }}>
                  <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>{m.msg}</p>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#22c55e', marginTop: 8, fontWeight: 600 }}>✓ Resultado: reunião marcada. A dor foi descoberta pela conversa, não por script direto.</p>
          </div>

          {/* Scripts DM */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Scripts de DM — Passo 3 do ritual</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Tom: empreendedor falando com empreendedor. Não apresente a empresa logo de cara — primeiro crie conexão pela dor compartilhada. Use no máximo 3–4 linhas.</p>
          <div className="pb-grid-2" style={{ marginBottom: 16 }}>
            {[
              { label: 'DM 1 — Dor do imposto pago a mais', texto: 'Ei [nome], tava vendo seu perfil aqui.\nVocê sabia que a maioria dos MEI e pequenas empresas paga mais imposto do que deveria? Muitas vezes por causa do enquadramento errado.\nPergunta honesta: você já teve alguém que revisou isso pra você de verdade?' },
              { label: 'DM 2 — Dificuldade de empreender no Brasil', texto: '[nome], fala sério — empreender no Brasil em 2025 tá pesado demais.\nImposto, burocracia, nota fiscal... parece que o sistema foi feito pra travar quem quer crescer.\nComo tá sendo isso pra você? Você consegue focar no seu negócio ou fica apagando incêndio fiscal toda semana?' },
              { label: 'DM 3 — NF e obrigações fiscais', texto: 'Oi [nome], vi que você tem o seu negócio aqui em Manaus.\nCuriosidade genuína: a parte de nota fiscal e obrigações do mês você resolve sozinho ou tem alguém que cuida disso?\nPergunto porque a maioria dos empreendedores aqui gasta tempo demais com isso — tempo que deveria tá no negócio.' },
              { label: 'DM 4 — Contador que some', texto: '[nome], uma coisa que escuto muito de empreendedor aqui em Manaus:\n"Meu contador só aparece em março."\nVocê se identifica? Porque tem gente que paga por um serviço e fica no escuro o ano inteiro.' },
              { label: 'DM 5 — Negócio crescendo sem controle', texto: 'Oi [nome], vi que seu negócio tá crescendo — parabéns, sério.\nMas deixa eu te perguntar uma coisa: quando o faturamento aumenta, você sente que o controle financeiro acompanha ou fica pra trás?\nÉ o ponto onde mais vejo empreendedor se perder — e geralmente é na parte contábil que o buraco aparece.' },
            ].map(d => (
              <div key={d.label} style={cardStyle}>
                <div style={{ ...tagStyle, marginBottom: 10 }}>{d.label}</div>
                <pre style={{ fontSize: 12, color: TEXT, lineHeight: 1.8, fontStyle: 'italic', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{d.texto}</pre>
              </div>
            ))}
          </div>

          {/* Quando fica na defensiva */}
          <div style={{ ...cardStyle, marginBottom: 32, borderTop: `3px solid #f59e0b` }}>
            <div style={{ ...tagStyle, background: '#f59e0b22', border: '1px solid #f59e0b44', color: '#fbbf24', marginBottom: 10 }}>Se perguntar "o que você vende?" ou "isso é propaganda?"</div>
            <pre style={{ fontSize: 12, color: TEXT, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontStyle: 'italic' }}>{`Não, propaganda não — mas entendo a desconfiança, todo mundo manda coisa aleatória na DM.

Deixa eu ser direto: eu ajudo empreendedores com contabilidade digital. MEI, pequenas empresas, esse perfil.

O motivo de ter falado foi genuíno — o que eu perguntei é exatamente o que vejo acontecer com muita gente. Se não for a sua realidade, sem problema nenhum.

Mas se tiver mesmo pagando imposto a mais ou sem suporte contábil de verdade, aí vale uma conversa de 10 minutos. Sem pressão.`}</pre>
          </div>

          {/* Filtro de intenção */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Filtro de Intenção</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Nem toda resposta é uma oportunidade. Identifique rápido quem está interessado no serviço vs. quem só quer conversar.</p>
          <div className="pb-grid-2" style={{ marginBottom: 32 }}>
            <div style={{ ...cardStyle, borderTop: `3px solid #22c55e` }}>
              <h3 style={{ color: '#86efac', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Sinais positivos</h3>
              {['Perguntou sobre preço ou planos', 'Mencionou algum problema fiscal', 'Disse que não tem contador', 'Perguntou "como funciona?"', 'Mencionou o CNPJ ou segmento', 'Quis marcar reunião'].map(s => (
                <p key={s} style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 5, paddingLeft: 10, borderLeft: `2px solid #22c55e44` }}>{s}</p>
              ))}
            </div>
            <div style={{ ...cardStyle, borderTop: `3px solid #ef4444` }}>
              <h3 style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✗ Red flags — encerre com elegância</h3>
              {['Resposta só com emojis ou elogios pessoais', 'Não mencionou nada sobre negócio', 'Começou a perguntar sobre você pessoalmente', 'Não respondeu as perguntas de qualificação', 'Só quis "bater papo"'].map(s => (
                <p key={s} style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 5, paddingLeft: 10, borderLeft: `2px solid #ef444444` }}>{s}</p>
              ))}
            </div>
          </div>

          {/* Qualificação */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Qualificação — 4 perguntas naturais</h3>
          <div className="pb-grid-2" style={{ marginBottom: 16 }}>
            {[
              { num: '1', pergunta: 'Tem CNPJ ativo?', como: '"Você tem CNPJ aberto ou ainda tá como pessoa física?"', obs: 'MEI, ME, EPP = segue. Sem CNPJ = lead futuro, encerra com gentileza.' },
              { num: '2', pergunta: 'Tem contador hoje?', como: '"Você já tem alguém te ajudando com a parte contábil, ou tá na raça?"', obs: 'Sem contador = dor clara. Insatisfeito = compare. Satisfeito = plante semente.' },
              { num: '3', pergunta: 'Emite nota fiscal?', como: '"Você emite NF regularmente? Vende pra pessoa física, jurídica ou os dois?"', obs: 'Não perguntar faturamento direto. Emissão de NF triangula o volume.' },
              { num: '4', pergunta: 'Qual é a dor hoje?', como: '"O que mais te dá dor de cabeça nessa parte fiscal — imposto, nota, prazo?"', obs: '"Contador some" / "Não entendo nada" / "Tenho medo de multa" = cada um tem resposta direta.' },
            ].map(q => (
              <div key={q.num} style={cardStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ background: PB, color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{q.num}</span>
                  <div>
                    <h3 style={{ color: PBL, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{q.pergunta}</h3>
                    <p style={{ fontSize: 12, color: TEXT, fontStyle: 'italic', marginBottom: 6 }}>{q.como}</p>
                    <p style={{ fontSize: 11, color: TEXTMUTED }}>{q.obs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transição + Regra de ouro */}
          <div className="pb-grid-2">
            <div className="pb-highlight">
              <h3 style={{ color: PBL, marginBottom: 8, fontSize: 14 }}>Quando marcar reunião</h3>
              <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 12 }}>CNPJ ativo + sem contador ou insatisfeito + demonstrou pelo menos uma dor.</p>
              <p style={{ color: TEXT, fontSize: 12, fontStyle: 'italic', lineHeight: 1.8 }}>"Olha, pelo que você me contou faz muito sentido a gente conversar 20 minutos. Não é reunião de vendas — quero te mostrar como funciona e você decide se faz sentido. Quando você tem um tempinho essa semana?"</p>
            </div>
            <div className="pb-highlight" style={{ borderLeft: `3px solid ${PB}` }}>
              <h3 style={{ color: PBL, marginBottom: 8, fontSize: 14 }}>Regra de ouro</h3>
              <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.8 }}>Você é quem responde. Sempre. Não delega pra robô, não usa IA pra simular conversa. O social selling funciona porque é real — a pessoa sente quando é automático e perde a confiança na hora. Se você captou o lead, você conduz até a reunião.</p>
            </div>
          </div>
        </div>

        {/* SCRIPT */}
        <div className="pb-section" id="script">
          <div style={tagStyle}>SCRIPT</div>
          <h2 style={h2Style}>Script de Venda</h2>
          <div className="pb-grid-2">
            {[
              { passo: '1. Abertura', texto: '"Olá [nome], aqui é [seu nome] da Faço a Conta. Tudo bem?"' },
              { passo: '2. Dor', texto: '"Você ainda faz sua contabilidade do jeito antigo? Já pensou em reduzir seus impostos legalmente?"' },
              { passo: '3. Comparação', texto: '"Diferente dos contadores tradicionais, a FAC te dá inteligência tributária + gestão financeira + emissor NF tudo em um lugar."' },
              { passo: '4. Diferenciais', texto: '"Além disso, IA para responder dúvidas fiscais 24h, PDV online e abertura de CNPJ grátis."' },
              { passo: '5. Credibilidade', texto: '"Já somos Top 1000 SEBRAE, aprovados no Inovativa Brasil e temos centenas de clientes satisfeitos."' },
              { passo: '6. Fechamento', texto: '"Vamos marcar uma reunião rápida de 15min para eu te mostrar a plataforma?"' },
            ].map(s => (
              <div key={s.passo} style={cardStyle}>
                <div style={{ fontSize: 11, fontWeight: 700, color: PBL, marginBottom: 6, letterSpacing: '0.5px' }}>{s.passo}</div>
                <p style={{ fontSize: 13, color: TEXT, fontStyle: 'italic', lineHeight: 1.7 }}>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OBJECOES */}
        <div className="pb-section" id="objecoes">
          <div style={tagStyle}>OBJEÇÕES</div>
          <h2 style={h2Style}>Como contornar</h2>
          <div className="pb-grid-2">
            {[
              { objecao: '"Já tenho contador"', resposta: 'Contador tradicional faz escrituração. A FAC faz inteligência tributária — reduzimos seus impostos legalmente enquanto o contador cuida da burocracia.' },
              { objecao: '"É caro"', resposta: 'Quanto você paga de imposto a mais hoje? Nossos clientes economizam em média 30% no IRPJ. O plano se paga sozinho.' },
              { objecao: '"Não tenho tempo"', resposta: 'A gente faz tudo pra você. Você só envia os documentos e a IA cuida do resto. 5 minutos por mês.' },
              { objecao: '"Vou pensar"', resposta: 'Entendo! Que tal uma reunião rápida de 15min para eu te mostrar como funciona na prática? Sem compromisso.' },
            ].map(o => (
              <div key={o.objecao} style={cardStyle}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{o.objecao}</div>
                <p style={{ fontSize: 13, color: TEXTMUTED, lineHeight: 1.7 }}>{o.resposta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FUNIL */}
        <div className="pb-section" id="funil">
          <div style={tagStyle}>FUNIL</div>
          <h2 style={h2Style}>Etapas do pipeline</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { etapa: '📋 Indicação', desc: 'Lead entra por indicação, portal ou prospecção ativa.' },
              { etapa: '📞 Reunião', desc: 'Reunião de 15–20min. Apresentar solução, entender dor.' },
              { etapa: '📄 Proposta', desc: 'Enviar proposta personalizada com valor e benefícios.' },
              { etapa: '💳 Pagamento', desc: 'Fechamento. Escolha do plano. Emissão de NF.' },
              { etapa: '📝 Contrato', desc: 'Assinatura digital. Envio de acesso.' },
              { etapa: '🚀 Onboarding', desc: 'Ativação + suporte inicial. Acompanhamento semanal.' },
            ].map(f => (
              <div key={f.etapa} style={{ ...cardStyle, flex: 1, minWidth: 150, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: PBL, marginBottom: 6 }}>{f.etapa}</div>
                <p style={{ fontSize: 11, color: TEXTMUTED, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CREDIBILIDADE */}
        <div className="pb-section" id="credibilidade">
          <div style={tagStyle}>CREDIBILIDADE</div>
          <h2 style={h2Style}>Por que confiar</h2>
          <div className="pb-highlight">
            <div className="pb-grid-3" style={{ marginTop: 0 }}>
              {[
                { num: '🏆', label: 'Top 1000 SEBRAE' },
                { num: '🚀', label: 'Inovativa Brasil' },
                { num: '📈', label: 'Centenas de clientes' },
              ].map(c => (
                <div key={c.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>{c.num}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: PBL }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REGRAS */}
        <div className="pb-section" id="regras">
          <div style={tagStyle}>REGRAS</div>
          <h2 style={h2Style}>Regras do jogo</h2>
          <div className="pb-grid-2">
            {[
              { regra: 'Leads entram no CRM em até 1h', desc: 'Todo lead do portal ou indicação deve ser adicionado ao CRM no mesmo dia.' },
              { regra: 'Retorno em até 24h', desc: 'Todo contato deve ser respondido em no máximo 24 horas úteis.' },
              { regra: 'Proposta em até 48h', desc: 'Após a reunião, a proposta deve ser enviada em até 2 dias.' },
              { regra: 'Acompanhamento semanal', desc: 'Leads em negociação devem ter follow-up semanal registrado no CRM.' },
              { regra: 'Meta mensal: 12 fechamentos', desc: 'Bônus progressivo conforme tabela de comissões.' },
              { regra: 'Qualidade > Quantidade', desc: 'Lead qualificado vale mais. Priorize reuniões com decisores.' },
            ].map(r => (
              <div key={r.regra} style={cardStyle}>
                <div style={{ fontWeight: 700, fontSize: 13, color: PBL, marginBottom: 4 }}>✓ {r.regra}</div>
                <p style={{ fontSize: 12, color: TEXTMUTED, lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-footer">
          <p style={{ color: '#334155' }}>Faço a Conta · Realizadores do Improvável · 2026</p>
          <p style={{ marginTop: 4, color: '#1e293b' }}>CEO Jonatha Oliveira · (92) 98159-0598</p>
        </div>
      </main>
    </div>
  )
}
