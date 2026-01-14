// api/neon.js
import { neon } from '@neondatabase/serverless';

// Configuração do banco de dados
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Só aceita POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { action, data } = req.body;

        console.log(`🔵 API Recebida: ${action}`, data ? 'Com dados' : 'Sem dados');

        let result;

        switch (action) {
            case 'test':
                result = { success: true, message: 'API conectada' };
                break;
            // Adicione estes cases no switch do neon.js:

case 'get_fiados':
    result = await sql`
        SELECT * FROM fiados 
        ORDER BY created_at DESC
    `;
    break;

                case 'create_fiado':
                    result = await sql`
                        INSERT INTO fiados 
                        (nome_cliente, telefone, produtos, valor_total, valor_pago, pago, data_fiado, data_vencimento, observacoes)
                        VALUES 
                        (${data.nome_cliente}, ${data.telefone}, ${data.produtos}, 
                         ${data.valor_total}, ${data.valor_pago || 0}, ${data.pago || false},
                         ${data.data_fiado}, ${data.data_vencimento}, ${data.observacoes})
                        RETURNING *
                    `;
                    break;
                
                case 'update_fiado_pago':
                    await sql`
                        UPDATE fiados 
                        SET pago = true, 
                            valor_pago = valor_total,
                            data_pagamento = CURRENT_DATE
                        WHERE id = ${data.id}
                    `;
                    result = { success: true };
                    break;
                
                case 'delete_fiado':
                    await sql`DELETE FROM fiados WHERE id = ${data.id}`;
                    result = { success: true };
                    break;
            case 'get_produtos':
                result = await sql`
                    SELECT p.*, 
                           COALESCE(SUM(vi.quantidade), 0) as vendas
                    FROM produtos p
                    LEFT JOIN venda_itens vi ON p.id = vi.produto_id
                    GROUP BY p.id
                    ORDER BY p.nome
                `;
                break;

            case 'get_produto':
                result = await sql`
                    SELECT * FROM produtos 
                    WHERE id = ${data.id}
                `;
                break;

            case 'create_produto':
                result = await sql`
                    INSERT INTO produtos (nome, descricao, preco, estoque, emoji, cor, ativo)
                    VALUES (${data.nome}, ${data.descricao}, ${data.preco}, 
                            ${data.estoque}, ${data.emoji}, ${data.cor}, 
                            ${data.ativo})
                    RETURNING *
                `;
                break;

            case 'update_produto':
                if (!data?.id) {
                    return res.status(400).json({
                        success: false,
                        error: 'ID do produto não informado'
                    });
                }

                // Construir query dinamicamente para evitar campos undefined
                const updateFields = [];
                const updateValues = [];
                
                if (data.nome !== undefined) {
                    updateFields.push('nome');
                    updateValues.push(data.nome);
                }
                if (data.descricao !== undefined) {
                    updateFields.push('descricao');
                    updateValues.push(data.descricao);
                }
                if (data.preco !== undefined) {
                    updateFields.push('preco');
                    updateValues.push(data.preco);
                }
                if (data.estoque !== undefined) {
                    updateFields.push('estoque');
                    updateValues.push(data.estoque);
                }
                if (data.emoji !== undefined) {
                    updateFields.push('emoji');
                    updateValues.push(data.emoji);
                }
                if (data.cor !== undefined) {
                    updateFields.push('cor');
                    updateValues.push(data.cor);
                }
                if (data.ativo !== undefined) {
                    updateFields.push('ativo');
                    updateValues.push(data.ativo);
                }

                if (updateFields.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Nenhum campo para atualizar'
                    });
                }

                // Construir query SQL manualmente
                const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
                const query = `
                    UPDATE produtos 
                    SET ${setClause}
                    WHERE id = $1
                    RETURNING *
                `;
                
                const params = [data.id, ...updateValues];
                result = await sql(query, params);
                break;

            case 'delete_produto':
                if (!data?.id) {
                    return res.status(400).json({
                        success: false,
                        error: 'ID do produto não informado'
                    });
                }

                // Verificar se o produto está em vendas
                const checkVendas = await sql`
                    SELECT COUNT(*) as total FROM venda_itens 
                    WHERE produto_id = ${data.id}
                `;
                
                if (checkVendas[0]?.total > 0) {
                    // Se está em vendas, apenas marcar como inativo
                    await sql`
                        UPDATE produtos 
                        SET ativo = false 
                        WHERE id = ${data.id}
                    `;
                    result = { success: true, message: 'Produto marcado como inativo (está em vendas)' };
                } else {
                    // Se não está em vendas, excluir
                    await sql`DELETE FROM produtos WHERE id = ${data.id}`;
                    result = { success: true, message: 'Produto excluído' };
                }
                break;

            case 'create_venda':
                const {
                    data: dataVenda,
                    hora,
                    total,
                    total_itens,
                    pagamento,
                    status,
                    itens
                } = data;

                // Validar dados
                if (!itens || itens.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Nenhum item na venda'
                    });
                }

                // Criar venda principal
                const vendaResult = await sql`
                    INSERT INTO vendas (data, hora, total, total_itens, pagamento, status)
                    VALUES (
                        ${dataVenda || new Date().toISOString().split('T')[0]},
                        ${hora || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })},
                        ${total || 0},
                        ${total_itens || itens.reduce((sum, item) => sum + (item.quantidade || 0), 0)},
                        ${pagamento || 'dinheiro'},
                        ${status || 'concluida'}
                    )
                    RETURNING id
                `;

                const vendaId = vendaResult[0]?.id;
                if (!vendaId) {
                    throw new Error('Falha ao criar venda');
                }

                // Inserir itens da venda
                for (const item of itens) {
                    if (!item.produto_id || !item.quantidade) continue;
                    
                    await sql`
                        INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco)
                        VALUES (
                            ${vendaId},
                            ${item.produto_id},
                            ${item.quantidade},
                            ${item.preco || 0}
                        )
                    `;

                    // Atualizar estoque
                    await sql`
                        UPDATE produtos
                        SET estoque = estoque - ${item.quantidade}
                        WHERE id = ${item.produto_id} AND estoque >= ${item.quantidade}
                    `;
                }

                result = { success: true, vendaId };
                break;

            case 'get_vendas_recentes':
                result = await sql`
                    SELECT v.*, 
                           COUNT(vi.id) as total_itens,
                           SUM(vi.quantidade) as total_unidades
                    FROM vendas v
                    LEFT JOIN venda_itens vi ON v.id = vi.venda_id
                    WHERE v.data = CURRENT_DATE
                    GROUP BY v.id
                    ORDER BY v.hora DESC
                    LIMIT 10
                `;
                break;

            case 'get_dashboard_stats':
                // Faturamento hoje
                const faturamentoHoje = await sql`
                    SELECT COALESCE(SUM(total), 0) as total
                    FROM vendas
                    WHERE data = CURRENT_DATE
                `;
                
                // Total de itens vendidos hoje
                const totalItens = await sql`
                    SELECT COALESCE(SUM(vi.quantidade), 0) as total
                    FROM vendas v
                    JOIN venda_itens vi ON v.id = vi.venda_id
                    WHERE v.data = CURRENT_DATE
                `;
                
                // Total de vendas hoje
                const totalVendas = await sql`
                    SELECT COUNT(*) as total
                    FROM vendas
                    WHERE data = CURRENT_DATE
                `;
                
                // Estoque baixo
                const estoqueBaixo = await sql`
                    SELECT COUNT(*) as total
                    FROM produtos
                    WHERE estoque < 10 AND ativo = true
                `;
                
                // Produtos mais vendidos hoje
                const produtosMaisVendidos = await sql`
                    SELECT p.id, p.nome, p.emoji, p.cor, p.preco,
                           COALESCE(SUM(vi.quantidade), 0) as vendas_hoje
                    FROM produtos p
                    LEFT JOIN venda_itens vi ON p.id = vi.produto_id
                    LEFT JOIN vendas v ON vi.venda_id = v.id AND v.data = CURRENT_DATE
                    WHERE p.ativo = true
                    GROUP BY p.id, p.nome, p.emoji, p.cor, p.preco
                    ORDER BY vendas_hoje DESC
                    LIMIT 5
                `;
                
                result = {
                    faturamentoHoje: faturamentoHoje[0]?.total || 0,
                    totalItens: totalItens[0]?.total || 0,
                    totalVendas: totalVendas[0]?.total || 0,
                    estoqueBaixo: estoqueBaixo[0]?.total || 0,
                    produtosMaisVendidos: produtosMaisVendidos || []
                };
                break;

            case 'get_relatorio_completo':
                const totalVendasTotal = await sql`SELECT COUNT(*) as total FROM vendas`;
                const totalProdutos = await sql`SELECT COUNT(*) as total FROM produtos WHERE ativo = true`;
                const totalFaturamento = await sql`SELECT COALESCE(SUM(total), 0) as total FROM vendas`;
                const vendasRecentes = await sql`
                    SELECT v.*, 
                           COUNT(vi.id) as total_itens
                    FROM vendas v
                    LEFT JOIN venda_itens vi ON v.id = vi.venda_id
                    GROUP BY v.id
                    ORDER BY v.data DESC, v.hora DESC
                    LIMIT 20
                `;
                
                result = {
                    totalVendas: totalVendasTotal[0]?.total || 0,
                    totalProdutos: totalProdutos[0]?.total || 0,
                    totalFaturamento: totalFaturamento[0]?.total || 0,
                    vendasRecentes: vendasRecentes || []
                };
                break;

            case 'get_fiados':
                try {
                    result = await sql`
                        SELECT * FROM fiados 
                        ORDER BY created_at DESC
                    `;
                } catch (error) {
                    // Se a tabela fiados não existir, retornar array vazio
                    result = [];
                }
                break;

            default:
                return res.status(400).json({ 
                    success: false, 
                    error: `Ação desconhecida: ${action}` 
                });
        }

        console.log(`✅ API Resposta: ${action}`);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Erro na API:', error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

