# Baloeiros - App de Gerenciamento de Times de Vôlei

Um sistema completo para gerenciar presença de jogadores e sortear times de vôlei de forma inteligente e equilibrada.

## 🏐 Funcionalidades

- **Gerenciamento de Jogadores**: Cadastro com posições e níveis de habilidade
- **Controle de Eventos**: Criação e gestão de eventos de vôlei
- **Confirmação de Presença**: Sistema de RSVP com seleção múltipla
- **Sorteio Inteligente**: Algoritmo que equilibra times por gênero, posição e habilidade
- **Import/Export CSV**: Gestão em lote de dados
- **Interface Responsiva**: Funciona perfeitamente em mobile e desktop

## 🚀 Tecnologias

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Deploy**: Vercel (Frontend) + Railway (Backend)

## 📱 Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## �️ Instalação e Execução

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🎯 Como Usar

1. **Cadastre jogadores** na aba Players
2. **Crie um evento** na aba Events  
3. **Confirme presenças** na aba Confirmations
4. **Sorteie times equilibrados** na aba Teams

## 📊 Algoritmo de Balanceamento

O sistema considera:
- Distribuição equilibrada por gênero
- Posições específicas (levantador, líbero)
- Níveis de habilidade (iniciante, intermediário, avançado)
- Balanceamento automático de skills

## 🏆 Desenvolvido para o time Baloeiros