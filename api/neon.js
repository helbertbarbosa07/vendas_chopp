// api/neon.js - Serverless Function para Vercel
const { Pool } = require('pg');

// Configuração do pool de conexão
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Para requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.' 
    });
  }

  try {
    console.log('📦 Recebendo requisição para Neon API');
    
    const { sql, params = [] } = req.body;
    
    if (!sql) {
      return res.status(400).json({ 
        success: false, 
        error: 'SQL query é obrigatória' 
      });
    }

    console.log('🔍 Executando query:', sql.substring(0, 100) + '...');
    
    // Executar query no banco
    const result = await pool.query(sql, params);
    
    console.log(`✅ Query executada. ${result.rowCount || 0} linhas retornadas.`);
    
    // Retornar resultado
    return res.status(200).json({
      success: true,
      rows: result.rows || [],
      rowCount: result.rowCount || 0
    });
    
  } catch (error) {
    console.error('❌ Erro na execução da query:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
};
