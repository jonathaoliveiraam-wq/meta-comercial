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

          {/* Aviso limite */}
          <div style={{ background: '#7c3aed18', border: '1px solid #7c3aed44', borderRadius: 12, padding: '14px 18px', marginBottom: 32, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, color: PBL, fontWeight: 700, marginBottom: 4 }}>Limite do Instagram</p>
              <p style={{ fontSize: 12, color: TEXTMUTED, lineHeight: 1.7 }}>O Instagram pode bloquear temporariamente contas que enviam muitas DMs seguidas. Semana 1–2: máx. 20/dia. Semana 3–4: até 35/dia. A partir do mês 2: 50/dia. Nunca envie em rajada — distribua ao longo do dia.</p>
            </div>
          </div>

          {/* O Ritual */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>O Ritual — 3 dias por prospecto</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Nunca envie DM como primeiro contato. A pessoa precisa te reconhecer antes. O ritual cria isso de forma natural.</p>
          <div className="pb-grid-3" style={{ marginBottom: 16 }}>
            {[
              { dia: 'Dia 1', acao: 'Seguir + Curtir', detalhe: 'Siga o perfil e curta as 3 últimas fotos do feed. Não envie mensagem ainda. Deixe o algoritmo mostrar seu perfil para ela.' },
              { dia: 'Dia 2', acao: 'Comentar', detalhe: 'Deixe um comentário genuíno em um post recente. Algo relacionado ao negócio dela — nunca elogio pessoal. Ex: "Que serviço diferenciado! Aqui em Manaus tá crescendo muito esse segmento"' },
              { dia: 'Dia 3', acao: 'Enviar DM', detalhe: 'Agora sim. A pessoa já te viu 2 vezes. A DM não chega como spam — chega como continuação de uma conversa que já começou.' },
            ].map(r => (
              <div key={r.dia} style={cardStyle}>
                <div style={{ fontSize: 10, color: PBL, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>{r.dia}</div>
                <h3 style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{r.acao}</h3>
                <p style={{ fontSize: 12, color: TEXTMUTED, lineHeight: 1.6 }}>{r.detalhe}</p>
              </div>
            ))}
          </div>

          {/* Pipeline diário */}
          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Pipeline Diário — meta de 50 DMs/dia</h3>
            <p style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 12 }}>Com o ritual de 3 dias, você precisa ter prospectos em 3 estágios simultâneos todo dia:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Seguir + Curtir hoje', qtd: '50 perfis', obs: 'Esses virarão DM em 3 dias' },
                { label: 'Comentar hoje', qtd: '50 perfis', obs: 'Quem você seguiu anteontem' },
                { label: 'Enviar DM hoje', qtd: '50 DMs', obs: 'Quem você comentou ontem' },
              ].map(p => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, border: `1px solid ${BORDER}` }}>
                  <span style={{ color: PBL, fontWeight: 800, fontSize: 13, minWidth: 60 }}>{p.qtd}</span>
                  <span style={{ color: TEXT, fontSize: 12, flex: 1 }}>{p.label}</span>
                  <span style={{ color: TEXTMUTED, fontSize: 11 }}>{p.obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Como encontrar */}
          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Como encontrar prospectos em Manaus</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['#manaus', '#empresariodemanaus', '#meimanaus', '#negociosmanaus', '#empreendedormanaus', 'Seguidores de @aciamanaus', 'Seguidores de @sebrae_am', 'Posts: localização "Manaus, Amazonas"', 'Quem segue fornecedores locais'].map(h => (
                <span key={h} style={{ background: PB + '18', border: `1px solid ${PB}33`, color: PBL, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>{h}</span>
              ))}
            </div>
          </div>

          {/* Scripts DM */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Scripts de DM</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Sempre mencione a Faço a Conta desde o início. Isso filtra quem responde por interesse no serviço vs. interesse pessoal em você.</p>
          <div className="pb-grid-2" style={{ marginBottom: 32 }}>
            {[
              { label: 'DM 1 — Padrão (após comentar no post)', texto: '"Oi [Nome]! Deixei um comentário lá no seu post sobre [assunto] — me identifiquei bastante. Trabalho na equipe comercial da Faço a Conta, uma contabilidade digital. A gente atende bastante MEI e pequena empresa aqui em Manaus. Não quero te vender nada agora — só curiosidade mesmo: você tem contador hoje ou tá tocando a parte fiscal sozinho?"' },
              { label: 'DM 2 — Empresário sem contador visível', texto: '"Oi [Nome]! Vi aqui seu negócio de [segmento] — bacana demais. Sou da equipe da Faço a Conta, contabilidade digital. A gente usa IA pra ajudar MEI e pequena empresa a não perder prazo de imposto e emitir NF sem dor de cabeça. Me conta: você já tem suporte contábil hoje?"' },
              { label: 'DM 3 — Empresário com dor explícita (postou sobre imposto/NF)', texto: '"Oi [Nome]! Vi que você postou sobre [DAS / NF / imposto] — isso é muito mais comum do que parece, todo empresário passa por isso. Sou da Faço a Conta. A gente tem IA fiscal 24h que resolve exatamente esse tipo de dúvida. Não precisa ser cliente — me fala o que tá acontecendo que eu te dou um direcionamento rápido."' },
            ].map(d => (
              <div key={d.label} style={cardStyle}>
                <div style={{ ...tagStyle, marginBottom: 10 }}>{d.label}</div>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.8, fontStyle: 'italic' }}>{d.texto}</p>
              </div>
            ))}
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
