export default function PlaybookPage() {
  const secoes = [
    { id: 'missao', label: '🎯 Missão', cor: '#7c3aed' },
    { id: 'produto', label: '💡 Produto', cor: '#29b6f6' },
    { id: 'publico', label: '🎯 Público-alvo', cor: '#ff9800' },
    { id: 'planos', label: '💰 Planos', cor: '#00e676' },
    { id: 'diferenciais', label: '🏆 Diferenciais', cor: '#ab47bc' },
    { id: 'script', label: '🎤 Script', cor: '#ffca28' },
    { id: 'objecoes', label: '🛡️ Objeções', cor: '#f44336' },
    { id: 'funil', label: '🔁 Funil', cor: '#7c3aed' },
    { id: 'credibilidade', label: '✅ Credibilidade', cor: '#00e676' },
    { id: 'regras', label: '📜 Regras', cor: '#a78bfa' },
  ]

  return (
    <div className="pb-body" style={{ display: 'flex' }}>
      <nav style={{ width: 220, flexShrink: 0, background: '#0d0d1a', borderRight: '1px solid #7c3aed22', padding: '24px 14px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa', marginBottom: 24, paddingLeft: 10 }}>📖 Playbook</div>
        {secoes.map(s => (
          <a key={s.id} href={'#' + s.id}
            style={{ display: 'block', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: s.cor, textDecoration: 'none', borderLeft: '3px solid transparent', marginBottom: 2 }}
          >{s.label}</a>
        ))}
        <div style={{ borderTop: '1px solid #7c3aed22', paddingTop: 16, marginTop: 24 }}>
          <a href="/dashboard" style={{ display: 'block', padding: '8px 14px', borderRadius: 8, fontSize: 12, color: '#555', textDecoration: 'none' }}>📊 Dashboard</a>
          <a href="/crm" style={{ display: 'block', padding: '8px 14px', borderRadius: 8, fontSize: 12, color: '#555', textDecoration: 'none' }}>🎯 CRM</a>
          <a href="/parceiros" style={{ display: 'block', padding: '8px 14px', borderRadius: 8, fontSize: 12, color: '#555', textDecoration: 'none' }}>🤝 Parceiros</a>
        </div>
      </nav>

      <main style={{ flex: 1, marginLeft: 220, minHeight: '100vh' }}>
        <div className="pb-hero">
          <h1>📖 <span>Playbook Comercial</span></h1>
          <p>Realizadores do Improvável · Faço a Conta</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {secoes.filter(s => s.id !== 'missao').slice(0, 4).map(s => (
              <a key={s.id} href={'#' + s.id} style={{ padding: '8px 18px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.cor + '15', border: '1px solid ' + s.cor + '44', color: s.cor, textDecoration: 'none' }}>{s.label}</a>
            ))}
          </div>
        </div>

        <div className="pb-section" id="missao">
          <h2 style={{ color: '#7c3aed' }}>🎯 Missão</h2>
          <div className="pb-highlight">
            <p>Salvar negócios que seriam fechados por falta de gestão fiscal. Levar inteligência tributária e organização financeira para micro e pequenas empresas do Simples Nacional.</p>
          </div>
        </div>

        <div className="pb-section" id="produto">
          <h2 style={{ color: '#29b6f6' }}>💡 Produto</h2>
          <p style={{ color: '#888', marginBottom: 24 }}>Solução completa para o pequeno negócio:</p>
          <div className="pb-grid-3">
            {['Inteligência Tributária', 'Gestão Financeira', 'Emissor NF', 'PDV Online', 'IA Assistente 24h', 'Abertura CNPJ Grátis'].map(p => (
              <div key={p} className="pb-card pb-card-accent">
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', textAlign: 'center' }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="publico">
          <h2 style={{ color: '#ff9800' }}>🎯 Público-alvo</h2>
          <div className="pb-grid-3">
            {[
              { titulo: '📌 Perfil', texto: 'Microempreendedores individuais (MEI), micro e pequenas empresas do Simples Nacional. Faturamento até R$ 4,8 milhões.' },
              { titulo: '🎯 Dores', texto: 'Carga tributária alta, falta de organização fiscal, contadores tradicionais lentos, risco de malha fina.' },
              { titulo: '✅ Solução', texto: 'Redução legal de impostos, gestão financeira integrada, suporte IA 24h, contabilidade consultiva.' },
            ].map(c => (
              <div key={c.titulo} className="pb-card" style={{ borderTop: '3px solid #ff9800' }}>
                <h3 style={{ color: '#ff9800' }}>{c.titulo}</h3>
                <p>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="planos">
          <h2 style={{ color: '#00e676' }}>💰 Planos e Preços</h2>
          <div className="pb-grid-4">
            {[
              { nome: 'MEI', valor: 'R$ 97/mês', cor: '#29b6f6' },
              { nome: 'Controle', valor: 'R$ 227/mês', cor: '#ff9800' },
              { nome: 'Essencial', valor: 'R$ 337/mês', cor: '#7c3aed' },
              { nome: 'Anual', valor: 'R$ 303/mês', cor: '#ab47bc', desc: 'R$ 3.639,60/ano' },
            ].map(p => (
              <div key={p.nome} className="pb-card" style={{ textAlign: 'center', borderTop: '3px solid ' + p.cor }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: p.cor }}>{p.nome}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 8 }}>{p.valor}</div>
                {p.desc && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{p.desc}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="diferenciais">
          <h2 style={{ color: '#ab47bc' }}>🏆 Diferenciais</h2>
          <div className="pb-grid-2">
            {[
              { icone: '🤖', titulo: 'IA Assistente', texto: 'Assistente fiscal 24h para dúvidas sobre notas fiscais, guias, prazos e tributos.' },
              { icone: '📱', titulo: 'PDV Online', texto: 'Venda direto pelo sistema com emissão de NF na hora. Ideal para comércio e serviços.' },
              { icone: '📊', titulo: 'Gestão Completa', texto: 'Controle de contas a pagar/receber, fluxo de caixa, DRE e muito mais em um só lugar.' },
              { icone: '🏅', titulo: 'Top 1000 SEBRAE', texto: 'Reconhecimento nacional como um dos negócios mais promissores do Brasil.' },
            ].map(d => (
              <div key={d.titulo} className="pb-card" style={{ borderTop: '3px solid #ab47bc', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{d.icone}</div>
                <h3 style={{ color: '#ab47bc' }}>{d.titulo}</h3>
                <p>{d.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="script">
          <h2 style={{ color: '#ffca28' }}>🎤 Script de Venda</h2>
          <div className="pb-grid-2">
            {[
              { passo: '1. Abertura', texto: '"Olá [nome], aqui é [seu nome] da Faço a Conta. Tudo bem?"' },
              { passo: '2. Dor', texto: '"Você ainda faz sua contabilidade do jeito antigo? Já pensou em reduzir seus impostos legalmente?"' },
              { passo: '3. Comparação', texto: '"Diferente dos contadores tradicionais, a FAC te dá inteligência tributária + gestão financeira + emissor NF tudo em um lugar."' },
              { passo: '4. Diferenciais', texto: '"Além disso, você tem IA para responder dúvidas fiscais 24h, PDV online, e abertura de CNPJ grátis."' },
              { passo: '5. Credibilidade', texto: '"Já somos Top 1000 SEBRAE, aprovados no Inovativa Brasil e temos centenas de clientes satisfeitos."' },
              { passo: '6. Fechamento', texto: '"Vamos marcar uma reunião rápida de 15min para eu te mostrar a plataforma?"' },
            ].map(s => (
              <div key={s.passo} className="pb-card" style={{ borderTop: '3px solid #ffca28' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 4 }}>{s.passo}</div>
                <p style={{ fontStyle: 'italic' }}>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="objecoes">
          <h2 style={{ color: '#f44336' }}>🛡️ Objeções</h2>
          <div className="pb-grid-2">
            {[
              { objecao: '"Já tenho contador"', resposta: 'Contador tradicional faz escrituração. A FAC faz inteligência tributária — reduzimos seus impostos legalmente enquanto o contador cuida da burocracia.' },
              { objecao: '"É caro"', resposta: 'Quanto você paga de imposto a mais hoje? Nossos clientes economizam em média 30% no IRPJ. O plano se paga sozinho.' },
              { objecao: '"Não tenho tempo"', resposta: 'A gente faz tudo pra você. Você só envia os documentos e a IA cuida do resto. 5 minutos por mês.' },
              { objecao: '"Vou pensar"', resposta: 'Entendo! Que tal uma reunião rápida de 15min para eu te mostrar como funciona na prática? Sem compromisso.' },
            ].map(o => (
              <div key={o.objecao} className="pb-card" style={{ borderTop: '3px solid #f44336' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f44336', marginBottom: 6 }}>{o.objecao}</div>
                <p>{o.resposta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="funil">
          <h2 style={{ color: '#7c3aed' }}>🔁 Funil de Vendas</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { etapa: '📋 Indicação', desc: 'Lead entra por indicação, portal, ou prospecção ativa.', cor: '#7c3aed' },
              { etapa: '📞 Reunião', desc: 'Reunião de 15-20min. Apresentar solução, entender dor.', cor: '#29b6f6' },
              { etapa: '📄 Proposta', desc: 'Enviar proposta personalizada com valor e benefícios.', cor: '#ff9800' },
              { etapa: '💳 Pagamento', desc: 'Fechamento. Escolha do plano. Emissão de NF.', cor: '#00e676' },
              { etapa: '📝 Contrato', desc: 'Assinatura digital. Envio de acesso.', cor: '#ab47bc' },
              { etapa: '🚀 Onboarding', desc: 'Ativação + suporte inicial. Acompanhamento semanal.', cor: '#ffca28' },
            ].map(f => (
              <div key={f.etapa} className="pb-card" style={{ flex: 1, minWidth: 160, borderTop: '3px solid ' + f.cor, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: f.cor }}>{f.etapa}</div>
                <p style={{ fontSize: 12 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-section" id="credibilidade">
          <h2 style={{ color: '#00e676' }}>✅ Credibilidade</h2>
          <div className="pb-highlight">
            <div className="pb-grid-3" style={{ marginTop: 0 }}>
              {[
                { num: '🏆', label: 'Top 1000 SEBRAE' },
                { num: '🚀', label: 'Inovativa Brasil' },
                { num: '📈', label: 'Centenas de clientes' },
              ].map(c => (
                <div key={c.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 4 }}>{c.num}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-section" id="regras">
          <h2 style={{ color: '#a78bfa' }}>📜 Regras do Jogo</h2>
          <div className="pb-grid-2">
            {[
              { regra: '✅ Leads entram no CRM em até 1h', desc: 'Todo lead do portal ou indicação deve ser adicionado ao CRM no mesmo dia.' },
              { regra: '📞 Retorno em até 24h', desc: 'Todo contato deve ser respondido em no máximo 24 horas úteis.' },
              { regra: '📄 Proposta em até 48h', desc: 'Após a reunião, a proposta deve ser enviada em até 2 dias.' },
              { regra: '🔄 Acompanhamento semanal', desc: 'Leads em negociação devem ter follow-up semanal registrado no CRM.' },
              { regra: '💰 Bônus por meta', desc: 'Meta mensal: 12 fechamentos. Bônus progressivo conforme tabela de comissões.' },
              { regra: '🎯 Qualidade > Quantidade', desc: 'Lead qualificado vale mais. Priorize reuniões com decisores.' },
            ].map(r => (
              <div key={r.regra} className="pb-card" style={{ borderTop: '3px solid #a78bfa' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#a78bfa', marginBottom: 4 }}>{r.regra}</div>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-footer">
          <p>Faço a Conta · Realizadores do Improvável · 2026</p>
          <p style={{ marginTop: 4 }}>CEO Jonatha Oliveira · (92) 98159-0598</p>
        </div>
      </main>
    </div>
  )
}
