# 🚀 Guia de Deploy - Baloeiros App# Scripts de Desenvolvimento e Deploy



## 📋 Pré-requisitos## Desenvolvimento Local



1. **Conta no GitHub** (gratuita)### 1. Instalar Dependências

2. **Conta no Railway** (gratuita) - https://railway.app

3. **Conta na Vercel** (gratuita) - https://vercel.com```bash

# Backend

## 🏗️ Passo 1: Configurar Repositório GitHubcd backend

npm install

1. Crie um repositório no GitHub chamado `baloeiros-app`

2. No terminal do projeto, execute:# Frontend

cd ../frontend

```bashnpm install

cd /home/ovc/Documents/Projects/VoleiConfirmaApp```

git add .

git commit -m "Initial commit - Baloeiros App"### 2. Configurar Banco de Dados (Supabase)

git branch -M main

git remote add origin https://github.com/SEU_USUARIO/baloeiros-app.git1. Acesse [supabase.com](https://supabase.com)

git push -u origin main2. Crie um novo projeto

```3. No SQL Editor, execute o script `backend/database/schema.sql`

4. Copie as credenciais para o arquivo `.env`

## 🚂 Passo 2: Deploy do Backend no Railway

### 3. Configurar Variáveis de Ambiente

1. Acesse https://railway.app e faça login com GitHub

2. Clique em "New Project" → "Deploy from GitHub repo"**Backend (`backend/.env`):**

3. Selecione o repositório `baloeiros-app````bash

4. Railway detectará automaticamente o Node.jscp backend/.env.example backend/.env

5. Configure as variáveis de ambiente:```

   - `SUPABASE_URL`: [Sua URL do Supabase]

   - `SUPABASE_ANON_KEY`: [Sua chave anônima do Supabase]Edite com suas credenciais:

   - `NODE_ENV`: production```env

SUPABASE_URL=your_supabase_url_here

### 🔧 Configurações Adicionais no Railway:SUPABASE_ANON_KEY=your_supabase_anon_key_here

- **Root Directory**: `backend`SUPABASE_SERVICE_KEY=your_supabase_service_key_here

- **Build Command**: `npm install`PORT=3001

- **Start Command**: `npm start`NODE_ENV=development

FRONTEND_URL=http://localhost:3000

6. O Railway fornecerá uma URL tipo: `https://seu-projeto.railway.app````



## ⚡ Passo 3: Deploy do Frontend na Vercel### 4. Executar em Desenvolvimento



1. Acesse https://vercel.com e faça login com GitHub```bash

2. Clique em "New Project"# Terminal 1 - Backend

3. Selecione o repositório `baloeiros-app`cd backend

4. Configure:npm run dev

   - **Framework Preset**: Create React App

   - **Root Directory**: `frontend`# Terminal 2 - Frontend

   - **Build Command**: `npm run build`cd frontend

   - **Output Directory**: `build`npm start

```

5. Configure a variável de ambiente:

   - `REACT_APP_API_URL`: `https://seu-projeto.railway.app/api`Acesse: http://localhost:3000



6. A Vercel fornecerá uma URL tipo: `https://baloeiros-app.vercel.app`## Deploy em Produção



## 🔗 Passo 4: Conectar Frontend e Backend### Frontend (Vercel)



1. No Railway, adicione a variável de ambiente:1. **Via Vercel CLI:**

   - `ALLOWED_ORIGINS`: `https://baloeiros-app.vercel.app,http://localhost:3000````bash

cd frontend

2. Faça um novo deploy clicando em "Redeploy" no Railwaynpm install -g vercel

npm run build

## ✅ Passo 5: Testar a Aplicaçãovercel --prod

```

Acesse sua URL da Vercel e teste todas as funcionalidades:

- ✅ Cadastro de jogadores2. **Via GitHub (Recomendado):**

- ✅ Criação de eventos- Conecte seu repositório no dashboard da Vercel

- ✅ Confirmação de presença- Configure as variáveis de ambiente:

- ✅ Sorteio de times  - `REACT_APP_API_URL`: URL da API em produção

- ✅ Import/Export CSV

### Backend (Railway)

## 🎯 URLs Finais

1. **Via Railway CLI:**

- **Frontend**: https://baloeiros-app.vercel.app```bash

- **Backend**: https://seu-projeto.railway.appcd backend

- **API**: https://seu-projeto.railway.app/apinpm install -g @railway/cli

railway login

## 🆘 Troubleshootingrailway init

railway add

### Problema: CORS Errorrailway deploy

**Solução**: Verifique se a URL da Vercel está correta em `ALLOWED_ORIGINS` no Railway```



### Problema: API não conecta2. **Via GitHub (Recomendado):**

**Solução**: Verifique se `REACT_APP_API_URL` aponta para a URL correta do Railway- Conecte seu repositório no dashboard do Railway

- Configure as variáveis de ambiente do Supabase

### Problema: Banco de dados- Deploy automático

**Solução**: Confirme que as credenciais do Supabase estão corretas no Railway

### Alternativas de Deploy

## 💰 Custos

**Frontend:**

- ✅ **GitHub**: Gratuito- Netlify

- ✅ **Railway**: Gratuito (500h/mês)- GitHub Pages

- ✅ **Vercel**: Gratuito- Heroku

- ✅ **Supabase**: Gratuito (500MB storage)

**Backend:**

**Total: R$ 0,00/mês** 🎉- Render

- Heroku

## 🔄 Deploy Automático- Google Cloud Run

- AWS Lambda

Após configurar, qualquer push para `main` disparará deploy automático:

- Railway reconstruirá o backend### Variáveis de Ambiente - Produção

- Vercel reconstruirá o frontend

**Frontend:**

## 📞 Suporte```env

REACT_APP_API_URL=https://your-backend-url.railway.app/api

Se encontrar problemas, verifique:```

1. Logs no Railway Dashboard

2. Logs no Vercel Dashboard  **Backend:**

3. Console do navegador para erros frontend```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Scripts Úteis

### Backend
```bash
npm start          # Produção
npm run dev        # Desenvolvimento com nodemon
npm test           # Executar testes
```

### Frontend
```bash
npm start          # Desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
npm run eject      # Ejetar configuração do Create React App
```

## Monitoramento

### Logs de Produção
- **Frontend**: Vercel Analytics
- **Backend**: Railway Logs
- **Database**: Supabase Dashboard

### Health Checks
- Backend: `GET /health`
- Frontend: Status visual no dashboard

## Backup e Segurança

### Backup do Banco
- Supabase faz backup automático
- Export manual via dashboard
- Scripts de backup personalizados

### Variáveis Sensíveis
- Nunca commitar arquivos `.env`
- Usar secrets das plataformas de deploy
- Rotacionar chaves periodicamente

## Troubleshooting

### Problemas Comuns

1. **CORS Error:**
   - Verificar `FRONTEND_URL` no backend
   - Configurar domínios corretos

2. **Database Connection:**
   - Verificar credenciais do Supabase
   - Testar conectividade

3. **Build Errors:**
   - Limpar cache: `npm ci`
   - Verificar versões do Node.js

### Comandos de Debug

```bash
# Verificar logs do backend
railway logs

# Verificar build do frontend
npm run build

# Testar API
curl https://your-backend-url.railway.app/health
```