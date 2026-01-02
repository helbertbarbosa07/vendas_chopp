// api/neon.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { 
    require: true,
    rejectUnauthorized: false 
  }
});

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Lidar com preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.' 
    });
  }
  
  try {
    const { sql, params = [] } = req.body;
    
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'SQL é obrigatório e deve ser uma string' 
      });
    }
    
    console.log(`📤 Executando SQL: ${sql.substring(0, 200)}...`);
    
    // Executar query
    const result = await pool.query(sql, params);
    
    // Retornar resultado
    return res.status(200).json({
      success: true,
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
      command: result.command || '',
      fields: result.fields ? result.fields.map(f => f.name) : []
    });
    
  } catch (error) {
    console.error('❌ Erro no Neon:', error);
    
    // Retornar erro detalhado
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
};
