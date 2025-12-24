// api/neon.js
import { neon } from '@neondatabase/serverless';

// Obtém a string de conexão do banco
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Configuração CORS para permitir seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responde a requisições OPTIONS (pré-flight do CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.' 
    });
  }
  
  try {
    // Extrai a query SQL e parâmetros do corpo da requisição
    const { sql: query, params = [] } = req.body;
    
    // Validação básica
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query SQL é obrigatória' 
      });
    }
    
    // Executa a query no banco Neon
    const result = await sql(query, params);
    
    // Retorna sucesso
    res.status(200).json({ 
      success: true, 
      rows: result,
      rowCount: result.length 
    });
    
  } catch (error) {
    console.error('❌ Erro na API Neon:', error.message);
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Erro ao executar query no banco de dados' 
    });
  }
}
