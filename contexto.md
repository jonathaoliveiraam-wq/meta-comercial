# Contexto do Projeto — Meta Comercial Next

## Objetivo
Transformar o sistema `meta-comercial` original (4 HTML single-page apps com JSONBin.io backend) em um Next.js 16 App Router com SQLite local, drag+drop kanban, env vars protegidas, e visual original preservado.

## Stack
- **Framework:** Next.js 16 (Turbopack, App Router)
- **Database:** SQLite via `better-sqlite3`
- **Drag+Drop:** @dnd-kit (core, sortable, utilities)
- **Gráficos:** Chart.js + react-chartjs-2
- **CSS:** classes globais em `src/app/globals.css` (sem Tailwind)

## Arquitetura
- Single API route: `POST /api/data` com campo `action` (30+ ações) — dispatch pattern igual ao JSONBin original
- GET `/api/data?tipo=...` para leitura de entidades
- Páginas são server components que buscam dados iniciais, client components para interatividade
- Sidebar compartilhada com `variant` ('dashboard' | 'crm')
- Banco SQLite em `data/meta-comercial.db` (seed via `npm run seed`)

## Rotas
| Rota | Descrição | Login |
|------|-----------|-------|
| `/dashboard` | Dashboard com KPIs, Chart.js, clientes | hardcoded: comercial/123456, financeiro/F@c2026 |
| `/crm` | Kanban CRM com 6 colunas + renovação | mesmo do dashboard |
| `/clientes` | CRUD clientes mensais/anuais | — |
| `/lancamentos` | CRUD lançamentos com equivalência | — |
| `/parceiros-admin` | Gestão de parceiros (admin) | — |
| `/parceiros` | Portal do parceiro | login contra tabela `parceiros` |
| `/playbook` | Playbook comercial estilizado | — |

## Tabelas SQLite
9 tabelas em `src/lib/db.ts`:
- `clientes_mensais`, `clientes_anuais`, `lancamentos`, `parceiros`
- `crm_leads`, `crm_renovacoes`, `renovacoes_historico`, `leads_portal`, `configuracoes`

## Funcionalidades Implementadas

### Dashboard (`/dashboard`)
- Login split-screen com gradiente e partículas
- 3 KPIs (clientes, faturamento, leads)
- Donuts Chart.js (planos, parceiros)
- Bar chart (planos vs meta)
- Gráfico mensal
- Grade de receita recorrente
- Tabela de clientes mensais/anuais

### CRM (`/crm`)
- Kanban com 6 colunas (Indicação → Reunião → Proposta → Pagamento → Contrato → Onboarding)
- Drag+drop com @dnd-kit (PointerSensor, activationConstraint 8px)
- Sidebar internas: Clientes Novos / Renovação
- Stats bar com 6 indicadores por view
- Cards com: nome, whats, segmento, parceiro, obs, data, valor, plano
- Botões: Avançar (com interceptação para modal de pagamento na etapa 3), Voltar, Excluir
- **Modal Novo Lead:** nome, whats, segmento, plano (mensal/anual/personalizado/serviço), valor, Sebrae toggle
- **Modal Pagamento:** seleção de plano (mensal/anual/personalizado), valor, Sebrae toggle, lança em clientes_mensais/anuais/lancamentos automaticamente
- **Renovação view** com 5 colunas, modais próprios
- **Sincronizar:** importa leads do portal para o CRM
- Persistência via API (`moverLead`, `confirmarPagamento`, etc.)

### Clientes (`/clientes`)
- Filtros por nome, plano, data
- Inline edit + delete com confirmação
- Tabela unificada (mensais + anuais)

### Lançamentos (`/lancamentos`)
- Formulário: qty, valor, tipo (Recebido/SEBRAE toggle), descrição, data
- Cálculo automático: valorRec (se Sebrae: val/0.3), recTotal, equiv (recTotal / anual)
- Editar/excluir

### Parceiros Admin (`/parceiros-admin`)
- CRUD completo de parceiros
- Reset de senha
- Faixas de comissão (R$150/200/250/300)
- Barra de progresso por parceiro
- Lista de clientes por parceiro (colapsável)
- Badges de status

### Parceiros Portal (`/parceiros`)
- Login real contra tabela `parceiros`
- **Termo de parceria** com scroll-to-accept (primeiro acesso)
- **Painel:** stats reais (clientes, indicações, a receber), faixa atual, barra de progresso, recorrência R$50/cliente, banner Clube Elite
- **Clientes:** tabela de clientes indicados
- **Indicar Cliente:** formulário → `leads_portal`
- **Meu Perfil:** editar nome, whats, email, nascimento, PIX

### Playbook (`/playbook`)
- Classes `.pb-*` do globals.css
- Hero com gradiente, sidebar fixa de navegação
- Seções: missão, produto, público, planos, diferenciais, script, objeções, funil, credibilidade, regras
- Grid de cards com cores por seção
- Footer e links para outras páginas

## Telegram
- `src/lib/telegram.ts` — envia notificação se TG_TOKEN e TG_CHATID estiverem preenchidos no `.env.local`
- Gatilhos: nova indicação de parceiro, lead manual no CRM, venda fechada, renovação confirmada
- Silencioso se env vars vazias (padrão)

## Pendente
- **Autenticação:** substituir senhas hardcoded por tabela `usuarios` com bcrypt

## Estrutura de Arquivos
```
src/
├── app/
│   ├── api/
│   │   └── data/route.ts        # API universal (30+ actions)
│   ├── crm/
│   │   ├── page.tsx             # Server component
│   │   ├── CrmClient.tsx        # Client component com kanban + modals
│   │   ├── KanbanColumn.tsx     # Droppable column
│   │   ├── KanbanCard.tsx       # Sortable card
│   │   └── KanbanCardOverlay.tsx
│   ├── dashboard/page.tsx       # Dashboard com Chart.js
│   ├── clientes/page.tsx        # CRUD clientes
│   ├── lancamentos/page.tsx     # CRUD lançamentos
│   ├── parceiros-admin/page.tsx # Gestão de parceiros
│   ├── parceiros/page.tsx       # Portal do parceiro
│   ├── playbook/page.tsx        # Playbook
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Sidebar.tsx              # Sidebar (variant: dashboard | crm)
├── lib/
│   ├── db.ts                    # SQLite init + schema
│   ├── api.ts                   # Helpers + constants
│   ├── types.ts                 # Interfaces
│   └── telegram.ts              # Notificações Telegram
├── .env.local                   # Chaves (gitignored)
└── scripts/seed.ts              # Seed do dump.json
```

## Comandos
- `npm run dev` — dev server em :3000
- `npm run build` — build
- `npm run seed` — re-seed do dump.json
- `npm run typecheck` — TS check
