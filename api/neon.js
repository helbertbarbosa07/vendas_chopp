const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    const { sql, params } = req.body;
    
    if (!sql) {
      return res.status(400).json({ error: 'SQL query required' });
    }
    
    console.log('Executando SQL:', sql.substring(0, 100));
    const result = await pool.query(sql, params || []);
    
    res.status(200).json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount
    });
    
  } catch (error) {
    console.error('Erro DB:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      detail: 'Erro na conexão Neon'
    });
  }
};
