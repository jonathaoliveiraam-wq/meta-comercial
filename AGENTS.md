<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Layout canônico — arquivos HTML são a referência obrigatória

Os arquivos em `public/` são a fonte de verdade para o layout. Os componentes Next.js em `src/app/` DEVEM replicar fielmente esses arquivos:

| Rota Next.js | HTML canônico |
|---|---|
| `src/app/parceiros/page.tsx` | `public/parceiros.html` |
| `src/app/dashboard/` | `public/sistema.html` |

**Nunca reescreva um componente de layout do zero.** Sempre compare com o HTML original antes de qualquer alteração visual.

## Links de navegação (CRÍTICO)

| De | Para |
|---|---|
| Dashboard → CRM | `/crm` (nunca `/crm.html`) |
| CRM → Dashboard | `/sistema.html` (nunca `/dashboard`) |
| Home | `/sistema.html` |

## Fórmula de equivalência de planos (Dashboard)

`equiv = recTotal / 337` — cada lançamento é convertido em planos equivalentes de R$337.
Meta: 240 planos equivalentes.
