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
          <h2 style={h2Style}>Rotina Instagram — Kamila</h2>
          <p style={{ color: TEXTMUTED, fontSize: 14, marginBottom: 32 }}>Prospecção orgânica e gratuita no Instagram. 45 minutos por dia, consistência de 30 dias gera pipeline real.</p>

          {/* Rotina diária */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Rotina Diária</h3>
          <div className="pb-grid-3" style={{ marginBottom: 40 }}>
            {[
              { hora: '7h–8h · 20 min', titulo: 'Manhã', items: ['Responder DMs e Stories (5 min)', 'Publicar Story do dia (5 min)', 'Prospectar 5–10 perfis · interagir antes de enviar DM (10 min)'] },
              { hora: '12h–13h · 15 min', titulo: 'Tarde', items: ['Acompanhar Stories de quem interagiu (5 min)', 'Enviar até 5 DMs por dia — só pra quem já interagiu (10 min)'] },
              { hora: '20h–21h · 10 min', titulo: 'Noite', items: ['Publicar post no feed — Seg, Qua, Sex (10 min)', 'Responder comentários e agradecimentos'] },
            ].map(t => (
              <div key={t.titulo} style={cardStyle}>
                <div style={{ fontSize: 10, color: PBL, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4 }}>{t.hora}</div>
                <h3 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t.titulo}</h3>
                {t.items.map(i => <p key={i} style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${PB}44` }}>{i}</p>)}
              </div>
            ))}
          </div>

          {/* Como encontrar empresários */}
          <div style={{ ...cardStyle, marginBottom: 40 }}>
            <h3 style={{ color: PBL, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Como encontrar empresários em Manaus</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['#manaus', '#empresariodemanaus', '#meimanaus', '#negociosmanaus', '#empreendedormanaus', 'Seguidores de @aciamanaus, @sebrae_am, @cdlmanaus', 'Posts com localização "Manaus, Amazonas"'].map(h => (
                <span key={h} style={{ background: PB + '18', border: `1px solid ${PB}33`, color: PBL, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>{h}</span>
              ))}
            </div>
          </div>

          {/* Scripts DM */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Scripts de DM</h3>
          <p style={{ color: TEXTMUTED, fontSize: 12, marginBottom: 16 }}>Regra de ouro: sempre interaja (curtir / comentar) antes de enviar DM. Nunca seja o primeiro contato.</p>
          <div className="pb-grid-2" style={{ marginBottom: 40 }}>
            {[
              { label: 'DM 1 — Após ver Story ou post', texto: '"Oi [Nome]! Vi aqui seu Story sobre [assunto] — adorei demais. Sou a Kamila, trabalho com a Faço a Conta, uma contabilidade digital. A gente usa IA pra ajudar empresários a não perder prazo de imposto, emitir nota fiscal, isso tudo. Não quero te vender nada agora — mas fico curiosa: você já tem contador ou tá tocando tudo sozinho ainda?"' },
              { label: 'DM 2 — Após comentar no post', texto: '"Oi [Nome]! Deixei um comentário no seu post porque me identifiquei muito. Me chamo Kamila, ajudo empresários a organizar a parte contábil sem dor de cabeça. Me conta uma coisa, só por curiosidade: você tem algum suporte contábil hoje ou tá na raça ainda?"' },
              { label: 'DM 3 — Empresário com dúvida sobre imposto', texto: '"Oi [Nome]! Vi que você postou sobre [DAS / nota fiscal / imposto] — isso é muito mais comum do que parece. Sou a Kamila, da Faço a Conta. A gente tem uma IA fiscal que avisa sobre prazo e ajuda com isso exatamente. Não precisa ser cliente pra eu te dar uma dica rápida — o que tá rolando aí?"' },
            ].map(d => (
              <div key={d.label} style={cardStyle}>
                <div style={{ ...tagStyle, marginBottom: 10 }}>{d.label}</div>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.8, fontStyle: 'italic' }}>{d.texto}</p>
              </div>
            ))}
          </div>

          {/* Hooks para Reels */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>10 Hooks para Reels / Stories</h3>
          <div className="pb-grid-2" style={{ marginBottom: 40 }}>
            {[
              '"Você sabe exatamente quanto pagou de imposto esse mês? Porque a maioria dos donos de negócio em Manaus não sabe — e tá perdendo dinheiro todo dia."',
              '"Seu contador some quando você precisa? Então a gente precisa conversar."',
              '"MEI pagando mais imposto do que deveria. Isso não é azar — é falta de informação. E tem solução."',
              '"Você abre o negócio de manhã, atende cliente, resolve fornecedor, ainda emite nota fiscal — e no fim do dia não sabe se teve lucro ou prejuízo."',
              '"Existe uma forma de emitir nota fiscal, controlar caixa e resolver imposto pelo celular, por menos do que você gasta de almoço por dia."',
              '"R$ 337 por mês. Tudo que um pequeno empresário precisa pra não tomar susto com o Leão."',
              '"Sou de Manaus, trabalho com donos de negócio daqui, e vou te contar o que a maioria dos contadores não fala."',
              '"Notificação da Receita Federal chegando no e-mail sem você entender nada. Esse pesadelo é evitável."',
              '"Contador caro não significa contador bom. Às vezes o problema é exatamente o contrário."',
              '"Em 5 minutos eu te mostro se você tá pagando imposto certo ou jogando dinheiro fora."',
            ].map((h, i) => (
              <div key={i} style={{ ...cardStyle, display: 'flex', gap: 12 }}>
                <span style={{ color: PBL, fontWeight: 800, fontSize: 18, flexShrink: 0 }}>#{i + 1}</span>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.7, fontStyle: 'italic' }}>{h}</p>
              </div>
            ))}
          </div>

          {/* Stories Você Sabia */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>5 Stories "Você Sabia?"</h3>
          <div className="pb-grid-2" style={{ marginBottom: 40 }}>
            {[
              { titulo: 'Limite MEI', texto: '95% dos MEIs pagam DAS todo mês sem saber se ainda estão no limite de faturamento correto. Quando passa de R$ 81k/ano sem atualizar o regime, a multa pode zerar o lucro do semestre. 👇 Me manda DM.' },
              { titulo: 'NF Errada', texto: 'Emitir NF errada é motivo de autuação fiscal — mesmo sendo MEI. Campo errado, código de serviço equivocado... A Receita cruza isso automaticamente. Contabilidade digital evita isso com emissor integrado.' },
              { titulo: 'Controle Financeiro', texto: 'Pequenas empresas que fazem conciliação financeira todo mês têm 3x mais chance de sobreviver 5 anos. Não é sobre ter muito dinheiro — é sobre saber exatamente onde ele vai.' },
              { titulo: 'Segmento Importa', texto: 'O contador do seu vizinho pode não saber nada sobre o seu segmento. Contabilidade pra salão de beleza é diferente de contabilidade pra loja de roupas. Regime errado = imposto alto sem necessidade.' },
              { titulo: 'IA Fiscal 24h', texto: 'Você pode ter uma IA fiscal funcionando 24h pra resolver dúvidas de imposto — inclusive domingo às 22h quando bate aquela dúvida. Isso já existe. Eu uso isso com meus clientes aqui em Manaus.' },
            ].map(s => (
              <div key={s.titulo} style={cardStyle}>
                <div style={{ ...tagStyle }}>Story · {s.titulo}</div>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.8 }}>{s.texto}</p>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>3 Templates de Post no Feed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Post 1 — Educativo (gera salvamentos)', legenda: '3 erros que todo MEI comete no primeiro ano (e como evitar)\n\nSe você abriu CNPJ nos últimos 2 anos, provavelmente já cometeu pelo menos um desses.\n\n1. Não separar conta pessoal da conta do negócio\nIsso complica tudo — do controle financeiro ao imposto. Abra uma conta PJ o quanto antes.\n\n2. Esquecer o DAS todo mês\nO DAS do MEI é baratinho, mas se atrasar, vira multa + juros. Automatize o débito.\n\n3. Achar que não precisa emitir nota fiscal\nSe você vende para empresa, nota fiscal não é opcional. E quem emite, fecha mais contratos.\n\nSalvou esse post? Manda pra um amigo empresário que precisa ver isso. 👇\n\n#MEI #CNPJ #EmpreendedorManaus #ContabilidadeDigital' },
              { label: 'Post 2 — Prova Social (gera confiança)', legenda: '"Achei que contador era só pra empresa grande."\n\nEssa frase eu ouço pelo menos uma vez por semana.\n\nMas hoje o jogo mudou. MEI com faturamento de R$ 3.000/mês já precisa de suporte contábil. Não por obrigação — porque:\n\n— Não perder prazo de imposto economiza dinheiro\n— Emitir NF abre portas com outras empresas\n— Ter alguém do lado quando a Receita manda carta não tem preço\n\nSe quiser saber se faz sentido pro seu negócio, me chama no direct. Primeira conversa sem compromisso.\n\n#ContabilidadeDigital #MEIManaus #FaçoAConta' },
              { label: 'Post 3 — Provocação (gera comentários)', legenda: 'Pergunta honesta: você sabe quanto pagou de imposto nos últimos 3 meses?\n\nFiz essa pergunta pra 10 empresários essa semana. Só 2 souberam responder de cabeça.\n\nNão é falta de inteligência — é falta de organização. E organização financeira não é talento, é ferramenta.\n\nVocê tá no grupo dos 2 ou dos 8? Conta aqui nos comentários 👇\n\n#GestãoFinanceira #EmpreendedorManaus #PequenaEmpresa #MEI' },
            ].map(p => (
              <div key={p.label} style={cardStyle}>
                <div style={{ ...tagStyle, marginBottom: 12 }}>{p.label}</div>
                <pre style={{ fontSize: 12, color: TEXT, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{p.legenda}</pre>
              </div>
            ))}
          </div>

          {/* Bio */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Bio do Instagram</h3>
          <div className="pb-grid-2" style={{ marginBottom: 40 }}>
            {[
              { label: 'Opção A — Direta', bio: 'Kamila | Contabilidade Digital 📊\nAjudo MEI e pequenas empresas a pagar menos imposto (do jeito certo)\nNF • Gestão financeira • IA fiscal 24h\n📍 Manaus/AM • Top 1000 SEBRAE\n👇 Chama no direct' },
              { label: 'Opção B — Com personalidade', bio: 'Kamila 👋 Falo de imposto sem enrolação\nSua contabilidade no celular, com suporte real\nMEI e pequenas empresas em Manaus\nNF • DAS • Gestão financeira\n💬 Me manda "quero organizar meu negócio"' },
            ].map(b => (
              <div key={b.label} style={cardStyle}>
                <div style={{ ...tagStyle }}>{b.label}</div>
                <pre style={{ fontSize: 12, color: TEXT, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginTop: 8 }}>{b.bio}</pre>
              </div>
            ))}
          </div>

          {/* Qualificação */}
          <h3 style={{ color: PBL, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Como Qualificar Antes de Marcar Reunião</h3>
          <div className="pb-grid-2" style={{ marginBottom: 16 }}>
            {[
              { num: '1', pergunta: 'Tem CNPJ ativo?', como: '"Você tem CNPJ aberto ou ainda tá atuando como pessoa física?"', obs: 'MEI, ME, EPP = segue em frente. Sem CNPJ = lead futuro.' },
              { num: '2', pergunta: 'Tem contador hoje?', como: '"Você já tem alguém te ajudando com a parte contábil, ou tá tocando tudo na raça?"', obs: 'Sem contador = dor clara. Insatisfeito = oportunidade. Satisfeito = semente.' },
              { num: '3', pergunta: 'Qual o faturamento?', como: '"Você trabalha mais com pessoa física ou jurídica? Tem nota fiscal mensal?"', obs: 'Não perguntar direto. Triangular pela emissão de NF.' },
              { num: '4', pergunta: 'Qual é a dor hoje?', como: '"O que mais te incomoda nessa parte de contador, imposto, nota fiscal?"', obs: 'Respostas: "não entendo nada", "contador some", "não sei emitir nota" — cada dor tem resposta direta.' },
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

          {/* Transição para reunião */}
          <div className="pb-highlight">
            <h3 style={{ color: PBL, marginBottom: 8, fontSize: 14 }}>Quando marcar reunião?</h3>
            <p style={{ color: TEXTMUTED, fontSize: 13, marginBottom: 12 }}>Tem CNPJ ativo + sem contador ou insatisfeito + demonstrou pelo menos uma dor.</p>
            <p style={{ color: TEXT, fontSize: 13, fontStyle: 'italic', lineHeight: 1.8 }}>"Olha, pelo que você me contou, faz muito sentido a gente conversar uns 20 minutos. Não é reunião de vendas não — quero te mostrar como funciona na prática e você decide se faz sentido pro seu momento. Quando você tem um tempinho essa semana?"</p>
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
