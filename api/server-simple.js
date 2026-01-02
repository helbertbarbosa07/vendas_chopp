// server-simple.js
const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || 'postgresql://usuario:senha@servidor/banco',
  ssl: { rejectUnauthorized: false }
});

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200).end();
    return;
  }
  
  if (req.url === '/api/neon' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { sql, params = [], action, data } = JSON.parse(body);
        
        if (action === 'ping') {
          const result = await pool.query('SELECT NOW() as time');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            rows: result.rows,
            message: 'API conectada ao Neon!' 
          }));
          return;
        }
        
        if (sql) {
          const result = await pool.query(sql, params);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            rows: result.rows,
            rowCount: result.rowCount 
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'SQL é obrigatório' 
          }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: error.message 
        }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'API Chop Manager',
      endpoints: ['POST /api/neon'],
      status: 'online'
    }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📡 Teste a API: http://localhost:${PORT}/api/neon`);
});
