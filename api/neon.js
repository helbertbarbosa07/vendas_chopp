import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { sql, params } = req.body || {};

    if (!sql) {
      return res.status(400).json({
        success: false,
        error: 'SQL não enviada'
      });
    }

    const result = await pool.query(sql, params || []);

    return res.status(200).json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount
    });

  } catch (error) {
    console.error('Erro Neon:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao executar query',
      detail: error.message
    });
  }
}
