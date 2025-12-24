// api/neon.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Permite que seu frontend converse com esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { sql: query, params = [] } = req.body;
    const result = await sql(query, params);
    res.status(200).json({ success: true, rows: result });
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
