// api/neon.js
const { Pool } = require('pg');

// Configurar pool de conexões com Neon
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Função principal da API
module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Use POST.'
    });
  }
  
  try {
    const { action, data, sql, params = [] } = req.body;
    
    console.log(`🔍 Ação: ${action || 'query direta'}`);
    
    let result;
    
    // Executar ações específicas
    if (action) {
      result = await handleAction(action, data);
    } else if (sql) {
      // Executar query direta
      result = await pool.query(sql, params);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Nenhuma ação ou query especificada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result.rows || result,
      rowCount: result.rowCount || 0
    });
    
  } catch (error) {
    console.error('❌ Erro na API:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
};

// Handler para ações específicas
async function handleAction(action, data) {
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    switch (action) {
      // ===== PRODUTOS =====
      case 'get_produtos':
        return await pool.query(`
          SELECT * FROM produtos 
          WHERE ativo = true 
          ORDER BY nome
        `);
        
      case 'get_produto':
        return await pool.query(
          'SELECT * FROM produtos WHERE id = $1',
          [data.id]
        );
        
      case 'create_produto':
        const produto = data;
        return await pool.query(`
          INSERT INTO produtos (nome, descricao, preco, estoque, emoji, cor, ativo, foto)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `, [
          produto.nome, produto.descricao, produto.preco, produto.estoque,
          produto.emoji, produto.cor, produto.ativo, produto.foto
        ]);
        
      case 'update_produto':
        const updateProduto = data;
        return await pool.query(`
          UPDATE produtos 
          SET nome = $1, descricao = $2, preco = $3, estoque = $4, 
              emoji = $5, cor = $6, ativo = $7, foto = $8
          WHERE id = $9
          RETURNING *
        `, [
          updateProduto.nome, updateProduto.descricao, updateProduto.preco, 
          updateProduto.estoque, updateProduto.emoji, updateProduto.cor,
          updateProduto.ativo, updateProduto.foto, updateProduto.id
        ]);
        
      case 'delete_produto':
        return await pool.query(
          'DELETE FROM produtos WHERE id = $1 RETURNING id',
          [data.id]
        );
        
      case 'update_estoque':
        return await pool.query(`
          UPDATE produtos 
          SET estoque = estoque - $1, vendas = vendas + $1
          WHERE id = $2
          RETURNING *
        `, [data.quantidade, data.produtoId]);
        
      // ===== VENDAS =====
      case 'create_venda':
        const venda = data;
        const vendaResult = await pool.query(`
          INSERT INTO vendas (data, hora, total, pagamento)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [venda.data, venda.hora, venda.total, venda.pagamento]);
        
        // Inserir itens da venda
        for (const item of venda.itens) {
          await pool.query(`
            INSERT INTO venda_itens (venda_id, produto_id, nome, quantidade, preco)
            VALUES ($1, $2, $3, $4, $5)
          `, [vendaResult.rows[0].id, item.produtoId, item.nome, item.quantidade, item.preco]);
        }
        
        return vendaResult;
        
      case 'get_vendas_hoje':
        const hoje = new Date().toISOString().split('T')[0];
        return await pool.query(`
          SELECT v.*, 
                 COALESCE(
                   (SELECT SUM(vi.quantidade) 
                    FROM venda_itens vi 
                    WHERE vi.venda_id = v.id), 0
                 ) as total_itens
          FROM vendas v
          WHERE v.data = $1
          ORDER BY v.hora DESC
        `, [hoje]);
        
      case 'get_vendas_recentes':
        return await pool.query(`
          SELECT v.*, 
                 COALESCE(
                   (SELECT SUM(vi.quantidade) 
                    FROM venda_itens vi 
                    WHERE vi.venda_id = v.id), 0
                 ) as total_itens
          FROM vendas v
          ORDER BY v.data DESC, v.hora DESC
          LIMIT 10
        `);
        
      case 'get_vendas_periodo':
        return await pool.query(`
          SELECT v.*, 
                 COALESCE(
                   (SELECT SUM(vi.quantidade) 
                    FROM venda_itens vi 
                    WHERE vi.venda_id = v.id), 0
                 ) as total_itens
          FROM vendas v
          WHERE v.data BETWEEN $1 AND $2
          ORDER BY v.data DESC, v.hora DESC
        `, [data.startDate, data.endDate]);
        
      // ===== FIADOS =====
      case 'get_fiados':
        return await pool.query(`
          SELECT f.*,
                 COALESCE(
                   (SELECT SUM(fp.valor) 
                    FROM fiado_pagamentos fp 
                    WHERE fp.fiado_id = f.id), 0
                 ) as total_pago
          FROM fiados f
          ORDER BY f.created_at DESC
        `);
        
      case 'create_fiado':
        const fiado = data;
        const fiadoResult = await pool.query(`
          INSERT INTO fiados (nome_cliente, telefone, total, valor_pago, 
                             prazo_pagamento, data_retirada, observacoes, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `, [
          fiado.nomeCliente, fiado.telefone, fiado.total, fiado.valorPago,
          fiado.prazoPagamento, fiado.dataRetirada, fiado.observacoes, fiado.status
        ]);
        
        return fiadoResult;
        
      case 'registrar_pagamento':
        const pagamento = data;
        await pool.query(`
          INSERT INTO fiado_pagamentos (fiado_id, valor, data, forma, observacoes)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          pagamento.fiadoId, pagamento.valor, pagamento.data,
          pagamento.forma, pagamento.observacoes
        ]);
        
        // Atualizar status do fiado
        const fiadoAtual = await pool.query(
          'SELECT total, valor_pago FROM fiados WHERE id = $1',
          [pagamento.fiadoId]
        );
        
        const novoValorPago = (fiadoAtual.rows[0].valor_pago || 0) + pagamento.valor;
        const status = novoValorPago >= fiadoAtual.rows[0].total ? 'pago' : 'parcial';
        
        await pool.query(`
          UPDATE fiados 
          SET valor_pago = $1, status = $2
          WHERE id = $3
        `, [novoValorPago, status, pagamento.fiadoId]);
        
        return { success: true };
        
      // ===== ESTATÍSTICAS =====
      case 'get_estatisticas':
        const hojeStats = new Date().toISOString().split('T')[0];
        
        const [totalVendas, faturamentoHoje, produtosMaisVendidos, estoqueBaixo] = await Promise.all([
          pool.query('SELECT COUNT(*) as count FROM vendas WHERE data = $1', [hojeStats]),
          pool.query('SELECT COALESCE(SUM(total), 0) as total FROM vendas WHERE data = $1', [hojeStats]),
          pool.query(`
            SELECT p.*, 
                   COALESCE(
                     (SELECT SUM(vi.quantidade) 
                      FROM venda_itens vi 
                      WHERE vi.produto_id = p.id AND vi.created_at::date = $1), 0
                   ) as vendas_hoje
            FROM produtos p
            WHERE p.ativo = true
            ORDER BY vendas_hoje DESC
            LIMIT 5
          `, [hojeStats]),
          pool.query('SELECT COUNT(*) as count FROM produtos WHERE estoque < 10 AND ativo = true', [])
        ]);
        
        return {
          totalVendas: parseInt(totalVendas.rows[0].count),
          faturamentoHoje: parseFloat(faturamentoHoje.rows[0].total),
          produtosMaisVendidos: produtosMaisVendidos.rows,
          estoqueBaixo: parseInt(estoqueBaixo.rows[0].count)
        };
        
      case 'get_vendas_semana':
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
        
        return await pool.query(`
          SELECT 
            data,
            SUM(total) as total_dia,
            COUNT(*) as qtd_vendas
          FROM vendas
          WHERE data >= $1
          GROUP BY data
          ORDER BY data
        `, [umaSemanaAtras.toISOString().split('T')[0]]);
        
      default:
        throw new Error(`Ação não reconhecida: ${action}`);
    }
  } finally {
    await pool.end();
  }
}
