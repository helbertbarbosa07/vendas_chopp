// api/neon-simple.js (versão genérica simplificada)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { 
    require: true,
    rejectUnauthorized: false 
  }
});

// Criar tabelas iniciais (execute uma vez)
const initSQL = `
-- Execute esta query uma vez no console SQL do Neon
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  emoji VARCHAR(10) DEFAULT '🍦',
  cor VARCHAR(20) DEFAULT '#36B5B0',
  ativo BOOLEAN DEFAULT TRUE,
  foto TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  total_itens INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  pagamento VARCHAR(20) NOT NULL,
  itens JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  
  try {
    const { action, data } = req.body;
    
    if (!action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ação é obrigatória' 
      });
    }
    
    let query, params = [];
    
    // Mapear ações para queries
    switch(action) {
      case 'get_produtos':
        query = 'SELECT * FROM produtos ORDER BY nome';
        break;
        
      case 'create_produto':
        query = `
          INSERT INTO produtos (nome, descricao, preco, estoque, emoji, cor, ativo, foto)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        params = [
          data.nome, data.descricao, data.preco, data.estoque, 
          data.emoji, data.cor, data.ativo, data.foto
        ];
        break;
        
      case 'create_venda':
        query = `
          INSERT INTO vendas (data, hora, total_itens, total, pagamento, itens)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        params = [
          data.data, data.hora, data.totalItens, data.total, 
          data.pagamento, JSON.stringify(data.itens)
        ];
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: `Ação '${action}' não suportada`
        });
    }
    
    const result = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      data: result.rows || [],
      rowCount: result.rowCount || 0
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
