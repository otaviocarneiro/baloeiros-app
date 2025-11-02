#!/bin/bash

# Script de inicialização do projeto VoleiConfirma
# Execute este script na primeira vez para configurar tudo

echo "🏐 Configurando VoleiConfirma..."
echo "================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js antes de continuar."
    echo "   Baixe em: https://nodejs.org/"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm antes de continuar."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"
echo ""

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do backend"
    exit 1
fi

echo "✅ Dependências do backend instaladas"
echo ""

# Criar arquivo .env do backend se não existir
if [ ! -f .env ]; then
    echo "⚙️  Criando arquivo .env do backend..."
    cp .env.example .env
    echo "📝 Arquivo .env criado. IMPORTANTE: Configure as credenciais do Supabase!"
    echo ""
fi

# Voltar para o diretório raiz e instalar dependências do frontend
cd ../frontend
echo "📦 Instalando dependências do frontend..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do frontend"
    exit 1
fi

echo "✅ Dependências do frontend instaladas"
echo ""

# Voltar para o diretório raiz
cd ..

echo "🎉 Configuração inicial concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o Supabase:"
echo "   - Acesse https://supabase.com"
echo "   - Crie um novo projeto"
echo "   - Execute o script backend/database/schema.sql no SQL Editor"
echo "   - Copie as credenciais para backend/.env"
echo ""
echo "2. Inicie o desenvolvimento:"
echo "   # Terminal 1 - Backend"
echo "   cd backend && npm run dev"
echo ""
echo "   # Terminal 2 - Frontend"
echo "   cd frontend && npm start"
echo ""
echo "3. Acesse: http://localhost:3000"
echo ""
echo "📚 Documentação completa: README.md"
echo "🚀 Guia de deploy: DEPLOY.md"
echo ""
echo "✨ Bom desenvolvimento!"