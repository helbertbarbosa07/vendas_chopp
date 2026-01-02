// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Sua API Neon
const neonAPI = require('./api/neon');

// Rota da API
app.post('/api/neon', neonAPI);

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Servidor Chop Manager Online!');
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}/api/neon`);
});
