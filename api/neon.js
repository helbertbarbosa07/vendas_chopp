const { Pool } = require('pg');

// Configuração do pool de conexão
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { 
    require: true,
    rejectUnauthorized: false 
  },
  max: 5, // Número máximo de conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Middleware de tratamento de erros
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool:', err);
});

module.exports = async (req, res) => {
  // Configurar CORS mais completo
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Resposta para preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Aceitar apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.' 
    });
  }
  
  try {
    // Verificar se tem body
    if (!req.body) {
      return res.status(400).json({ 
        success: false, 
        error: 'Corpo da requisição vazio' 
      });
    }
    
    const { action, data } = req.body;
    
    console.log(`📥 Ação recebida: ${action}`, data ? 'com dados' : 'sem dados');
    
    if (!action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ação (action) é obrigatória' 
      });
    }
    
    let query, params = [];
    let client;
    
    try {
      // Obter conexão do pool
      client = await pool.connect();
      console.log('✅ Conexão com Neon estabelecida');
      
      // Mapear ações para queries
      switch(action) {
        // ===== TESTE =====
        case 'test':
          return res.status(200).json({
            success: true,
            data: {
              message: 'API Neon conectada com sucesso!',
              timestamp: new Date().toISOString(),
              status: 'online'
            }
          });
          
        // ===== PRODUTOS =====
        case 'get_produtos':
          query = `
            SELECT *, 
                   (SELECT COUNT(*) FROM produtos p2 WHERE p2.ativo = true) as total_ativos,
                   (SELECT COUNT(*) FROM produtos p2 WHERE p2.estoque < 10 AND p2.ativo = true) as estoque_baixo
            FROM produtos 
            WHERE ativo = true 
            ORDER BY nome
          `;
          break;
          
        case 'get_produto':
          query = 'SELECT * FROM produtos WHERE id = $1';
          params = [data?.id];
          break;
          
        case 'create_produto':
          query = `
            INSERT INTO produtos (nome, descricao, preco, estoque, emoji, cor, ativo, foto)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `;
          params = [
            data.nome, 
            data.descricao || '', 
            parseFloat(data.preco), 
            parseInt(data.estoque) || 0,
            data.emoji || '🍦',
            data.cor || '#36B5B0',
            data.ativo !== false,
            data.foto || null
          ];
          break;
          
        case 'update_produto':
          query = `
            UPDATE produtos 
            SET nome = $1, descricao = $2, preco = $3, estoque = $4, 
                emoji = $5, cor = $6, ativo = $7, foto = $8
            WHERE id = $9
            RETURNING *
          `;
          params = [
            data.nome,
            data.descricao || '',
            parseFloat(data.preco),
            parseInt(data.estoque) || 0,
            data.emoji || '🍦',
            data.cor || '#36B5B0',
            data.ativo !== false,
            data.foto || null,
            parseInt(data.id)
          ];
          break;
          
        case 'delete_produto':
          query = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
          params = [parseInt(data?.id)];
          break;
          
        case 'update_estoque':
          // Subtrair do estoque (para vendas)
          query = 'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2 RETURNING *';
          params = [parseInt(data.quantidade), parseInt(data.produtoId)];
          break;
          
        // ===== VENDAS =====
        case 'create_venda':
          // Calcular total de itens
          const totalItens = data.itens.reduce((sum, item) => sum + (item.quantidade || 0), 0);
          
          query = `
            INSERT INTO vendas (data, hora, total_itens, total, pagamento, itens)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `;
          params = [
            data.data,
            data.hora,
            totalItens,
            parseFloat(data.total),
            data.pagamento,
            JSON.stringify(data.itens)
          ];
          break;
          
        case 'get_vendas_recentes':
          query = `
            SELECT * FROM vendas 
            WHERE data = CURRENT_DATE
            ORDER BY created_at DESC 
            LIMIT 10
          `;
          break;
          
        case 'get_vendas_semana':
          query = `
            SELECT 
              data,
              COUNT(*) as total_vendas,
              SUM(total) as total_dia,
              SUM(total_itens) as total_itens_dia
            FROM vendas 
            WHERE data >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY data
            ORDER BY data
          `;
          break;
          
        case 'get_vendas_periodo':
          query = `
            SELECT * FROM vendas 
            WHERE data BETWEEN $1 AND $2
            ORDER BY data DESC, hora DESC
          `;
          params = [data.startDate, data.endDate];
          break;
          
        // ===== DASHBOARD =====
        case 'get_dashboard_stats':
          // Vendas de hoje
          const hoje = new Date().toISOString().split('T')[0];
          
          query = `
            WITH vendas_hoje AS (
              SELECT 
                COUNT(*) as total_vendas,
                SUM(total) as faturamento_hoje,
                SUM(total_itens) as total_itens
              FROM vendas 
              WHERE data = $1
            ),
            produtos_stats AS (
              SELECT 
                COUNT(*) as total_produtos,
                SUM(CASE WHEN estoque < 10 THEN 1 ELSE 0 END) as estoque_baixo
              FROM produtos 
              WHERE ativo = true
            ),
            produtos_vendidos AS (
              SELECT 
                p.id,
                p.nome,
                p.emoji,
                p.cor,
                p.preco,
                (
                  SELECT COUNT(*) 
                  FROM vendas v 
                  WHERE v.data = $1 
                  AND EXISTS (
                    SELECT 1 
                    FROM jsonb_array_elements(v.itens) as item
                    WHERE (item->>'produtoId')::int = p.id
                  )
                ) as vendas_hoje
              FROM produtos p
              WHERE p.ativo = true
            )
            SELECT 
              vh.*,
              ps.*,
              (SELECT json_agg(pv) FROM produtos_vendidos pv WHERE pv.vendas_hoje > 0) as produtos_mais_vendidos
            FROM vendas_hoje vh, produtos_stats ps
          `;
          params = [hoje];
          break;
          
        // ===== RELATÓRIOS =====
        case 'get_relatorio_completo':
          query = `
            WITH total_vendas AS (
              SELECT COUNT(*) as total FROM vendas
            ),
            total_produtos AS (
              SELECT COUNT(*) as total FROM produtos WHERE ativo = true
            ),
            faturamento_total AS (
              SELECT COALESCE(SUM(total), 0) as total FROM vendas
            ),
            vendas_recentes AS (
              SELECT * FROM vendas 
              ORDER BY created_at DESC 
              LIMIT 20
            )
            SELECT 
              (SELECT total FROM total_vendas) as "totalVendas",
              (SELECT total FROM total_produtos) as "totalProdutos",
              (SELECT total FROM faturamento_total) as "totalFaturamento",
              (SELECT json_agg(vr) FROM vendas_recentes vr) as "vendasRecentes"
          `;
          break;
          
        default:
          return res.status(400).json({
            success: false,
            error: `Ação '${action}' não implementada`,
            actions_suportadas: [
              'test',
              'get_produtos', 'get_produto', 'create_produto', 'update_produto', 'delete_produto', 'update_estoque',
              'create_venda', 'get_vendas_recentes', 'get_vendas_semana', 'get_vendas_periodo',
              'get_dashboard_stats', 'get_relatorio_completo'
            ]
          });
      }
      
      // Executar query
      console.log(`📊 Executando query para: ${action}`);
      const result = await client.query(query, params);
      
      // Log para debug
      console.log(`✅ ${action} executado:`, {
        rows: result.rows?.length || 0,
        rowCount: result.rowCount
      });
      
      // Retornar resposta
      return res.status(200).json({
        success: true,
        data: result.rows || [],
        rowCount: result.rowCount || 0,
        timestamp: new Date().toISOString()
      });
      
    } finally {
      // Liberar conexão
      if (client) {
        client.release();
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na API:', error);
    
    // Detalhar erro específico
    let errorMessage = error.message;
    let errorCode = 500;
    
    if (error.code === '28P01') {
      errorMessage = 'Erro de autenticação no banco de dados. Verifique a senha.';
    } else if (error.code === '3D000') {
      errorMessage = 'Banco de dados não existe.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Não foi possível conectar ao banco de dados.';
      errorCode = 503;
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Servidor de banco de dados não encontrado.';
    }
    
    return res.status(errorCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code
    });
  }
};
