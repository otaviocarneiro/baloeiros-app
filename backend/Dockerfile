# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY backend/package*.json ./

# Instalar dependências
RUN npm install --only=production

# Copiar código do backend
COPY backend/ ./

# Expor porta
EXPOSE 10000

# Variável de ambiente para porta
ENV PORT=10000

# Comando para iniciar
CMD ["npm", "start"]