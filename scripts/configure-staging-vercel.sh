#!/bin/bash
# Script para configurar as variáveis de ambiente do projeto staging no Vercel
# Uso: DB_HOST=<host-staging> DB_PASSWORD=<senha-staging> bash scripts/configure-staging-vercel.sh

PROJECT="meta-comercial-staging"

echo "🔧 Configurando variáveis de ambiente no Vercel ($PROJECT)..."

# Banco de dados staging
npx vercel env add DB_HOST production --project $PROJECT <<< "${DB_HOST}"
npx vercel env add DB_PORT production --project $PROJECT <<< "5432"
npx vercel env add DB_NAME production --project $PROJECT <<< "postgres"
npx vercel env add DB_USER production --project $PROJECT <<< "postgres"
npx vercel env add DB_PASSWORD production --project $PROJECT <<< "${DB_PASSWORD}"

# Telegram (mesmo do prod ou criar novo bot para staging)
npx vercel env add TG_TOKEN production --project $PROJECT <<< "${TG_TOKEN:-}"
npx vercel env add TG_CHATID production --project $PROJECT <<< "${TG_CHATID:-}"

echo "✅ Variáveis configuradas!"
echo ""
echo "Próximo passo: fazer o deploy do staging"
echo "  npx vercel deploy --prod --project meta-comercial-staging"
