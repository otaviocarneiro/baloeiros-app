# 🚀 Deploy Atualizado - Baloeiros App

## ✅ Status: Código no GitHub
**Repositório:** https://github.com/otaviocarneiro/baloeiros-app

---

## 🌐 Opção 1: RENDER (Recomendado)

### **Por que Render?**
- ✅ **750 horas gratuitas/mês** (suficiente para uso pessoal)
- ✅ Deploy automático do GitHub
- ✅ SSL gratuito
- ✅ Logs em tempo real

### **Passo a Passo:**

1. **Acesse:** https://render.com → Faça login com GitHub

2. **Novo Serviço:** "New +" → "Web Service"

3. **Conecte repositório:** `otaviocarneiro/baloeiros-app`

4. **Configuração:**
   ```
   Name: baloeiros-backend
   Region: Ohio (US East)
   Branch: master
   Root Directory: (deixe vazio - raiz do projeto)
   Runtime: Docker
   Build Command: (deixe vazio - Docker automático)
   Start Command: (deixe vazio - Docker automático)
   ```

   **OU se preferir Node.js:**
   ```
   Name: baloeiros-backend
   Region: Ohio (US East)
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Variáveis de Ambiente:**
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=[sua_url_supabase]
   SUPABASE_ANON_KEY=[sua_chave_supabase]
   ALLOWED_ORIGINS=https://baloeiros-app.vercel.app
   ```

6. **Deploy!** → URL: `https://baloeiros-backend.onrender.com`

---

## ⚡ Opção 2: RAILWAY (Se funcionar)

1. **Acesse:** https://railway.app
2. **"New Project" → "Deploy from GitHub repo"**
3. **Root Directory:** `backend`
4. **Mesmas variáveis de ambiente**

---

## 🎯 Frontend na Vercel

1. **Acesse:** https://vercel.com
2. **"New Project" → Conecte `otaviocarneiro/baloeiros-app`**
3. **Configuração IMPORTANTE:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Variável de Ambiente (CRÍTICA):**
   ```
   REACT_APP_API_URL=https://baloeiros-backend.onrender.com/api
   ```
   ⚠️ **Substitua pela URL real do seu backend Render**

5. **Se der 404, verifique:**
   - Root Directory está como `frontend`
   - Build foi bem-sucedido
   - Variável de ambiente está configurada

### 🔧 Configuração Manual (se automático falhar):
- **Build Command:** `cd frontend && npm run build`
- **Output Directory:** `frontend/build`

---

## 🔗 URLs Finais

- **Frontend:** https://baloeiros-app.vercel.app
- **Backend:** https://baloeiros-backend.onrender.com
- **API:** https://baloeiros-backend.onrender.com/api

---

## 💰 Custos (100% Gratuito)

- ✅ **Render:** 750h/mês grátis
- ✅ **Vercel:** Ilimitado para projetos pessoais  
- ✅ **GitHub:** Repositórios públicos gratuitos
- ✅ **Supabase:** 500MB grátis

**Total: R$ 0,00/mês** 🎉

---

## 🚀 Deploy Automático

Após configurar:
- **Push para `master`** → Deploy automático em ambas plataformas
- **Render reconstruirá** o backend
- **Vercel reconstruirá** o frontend

---

## 🆘 Troubleshooting

### Render não inicia:
- Verifique logs no dashboard
- Confirme `Root Directory: backend`
- Verifique variáveis de ambiente

### Vercel não conecta API:
- Confirme `REACT_APP_API_URL` aponta para URL do Render
- Verifique `ALLOWED_ORIGINS` no backend

### CORS Error:
- Adicione URL da Vercel em `ALLOWED_ORIGINS`
- Formato: `https://baloeiros-app.vercel.app`

---

## 📱 Teste Final

Após deploy:
1. ✅ Acesse a URL da Vercel
2. ✅ Teste cadastro de jogadores
3. ✅ Teste criação de eventos
4. ✅ Teste confirmações
5. ✅ Teste sorteio de times

**Seu app estará online e funcionando! 🏐**