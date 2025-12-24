// api/neon.js
import { Pool } from '@vercel/postgres';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { sql, params = [] } = req.body;

    if (!sql) {
      return res.status(400).json({ 
        success: false, 
        error: 'SQL query é obrigatória' 
      });
    }

    console.log('Executando query:', sql.substring(0, 200));
    
    const result = await pool.query(sql, params);
    
    res.status(200).json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount
    });
    
  } catch (error) {
    console.error('Erro na query:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
