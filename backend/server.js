const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());

// Configuração de CORS para produção e desenvolvimento
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://baloeiros-app.vercel.app',
    'https://baloeiros-frontend.vercel.app',
    'https://vercel.app'
  ];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Permite origins na lista ou desenvolvimento
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Em produção, permite qualquer subdomínio .vercel.app
      if (origin && origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/players', require('./routes/players'));
app.use('/api/events', require('./routes/events'));
app.use('/api/confirmations', require('./routes/confirmations'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/csv', require('./routes/csv'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});