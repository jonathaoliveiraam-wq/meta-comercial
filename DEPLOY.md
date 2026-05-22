# Deploy & Fluxo de Desenvolvimento — Meta Comercial

## Repositório
- **GitHub:** https://github.com/jonathaoliveiraam-wq/meta-comercial
- **Owner:** `jonathaoliveiraam-wq` (Jonatha — admin)
- **Colaboradores:** `facoacontatech` (Juda — dev), `timoteobentes` (write)

## URLs Vercel
| Ambiente | Branch | URL |
|----------|--------|-----|
| Produção | `main` | https://meta-comercial.vercel.app |
| Preview | `dev` | URL única gerada a cada push na `dev` |

## Fluxo de trabalho

### Juda (`facoacontatech`) faz uma alteração:
1. Trabalha na branch `dev`
2. Faz `git push origin dev`
3. Vercel detecta automaticamente e gera uma URL de preview
4. Envia a URL de preview para Jonatha revisar
5. Jonatha aprova → faz merge `dev → main`
6. Vercel faz deploy automático em `meta-comercial.vercel.app`

### Jonatha faz uma alteração urgente (hotfix):
1. Trabalha direto na branch `main`
2. Faz `git push origin main`
3. Vercel atualiza produção automaticamente

## Regras de branch
- `main` — **nunca quebrar.** Só recebe merge aprovado da `dev` ou hotfix direto
- `dev` — branch de trabalho do Juda. Todo código novo vai aqui primeiro

## Configuração Vercel
- Arquivo de config: `vercel.json` (na raiz do projeto)
- Production Branch configurada: `main`
- Preview automático: qualquer push em `dev` gera deploy de preview
- Para verificar/ajustar: https://vercel.com/jonatha-oliveiras-projects/meta-comercial/settings/git
