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

## Valores em dinheiro (CRÍTICO — bug já aconteceu 2x)

Usuários digitam no formato brasileiro: `2.022` = dois mil e vinte e dois, `3.639,60` = três mil seiscentos e trinta e nove e sessenta.
`parseFloat("2.022")` dá **2,022** — foi assim que valores de milhares viraram "R$ 2" no banco (jul–set/2026).

- **Nunca** use `parseFloat`/`Number` direto em input de valor. Use `parseValorBR` (`src/app/crm/CrmClient.tsx` e `public/sistema.html`): vírgula = decimal; ponto só é milhar quando vem em grupos de 3 dígitos.
- **Nunca** use `<input type="number">` para dinheiro — use `type="text" inputmode="decimal"`.
- Ao preencher um input com valor existente, formate em pt-BR (`valorParaInput`), nunca `String(valor)` ("3639.6" vira 36396 ao salvar).
- Na tela, não arredonde centavos: `maximumFractionDigits: 2`, `minimumFractionDigits: 0` só para inteiros.
- SEBRAE: a conversão `÷ 0,3` é feita **só no servidor** (`route.ts`). O cliente envia o valor digitado.
- `POST /api/data` recusa `valor`/`val` com exatamente 3 casas decimais (sinal de milhar lido como decimal). Não remova essa trava.
