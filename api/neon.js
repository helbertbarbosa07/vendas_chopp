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

        console.log(`🔵 API Recebida: ${action}`, data);

        let result;

        switch (action) {
            case 'test':
                result = { success: true, message: 'API conectada' };
                break;

            case 'get_produtos':
                result = await sql`
                    SELECT p.*, 
                           COALESCE(SUM(v.quantidade), 0) as vendas
                    FROM produtos p
                    LEFT JOIN venda_itens v ON p.id = v.produto_id
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
                    INSERT INTO produtos (nome, descricao, preco, estoque, emoji, cor, ativo, foto)
                    VALUES (${data.nome}, ${data.descricao}, ${data.preco}, 
                            ${data.estoque}, ${data.emoji}, ${data.cor}, 
                            ${data.ativo}, ${data.foto})
                    RETURNING *
                `;
                break;

            case 'update_produto':
                result = await sql`
                    UPDATE produtos 
                    SET nome = ${data.nome},
                        descricao = ${data.descricao},
                        preco = ${data.preco},
                        estoque = ${data.estoque},
                        emoji = ${data.emoji},
                        cor = ${data.cor},
                        ativo = ${data.ativo},
                        foto = ${data.foto},
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${data.id}
                    RETURNING *
                `;
                break;

            case 'delete_produto':
                await sql`DELETE FROM produtos WHERE id = ${data.id}`;
                result = { success: true };
                break;

            case 'create_venda':
                // Criar venda principal
                const vendaResult = await sql`
                    INSERT INTO vendas (data, hora, total, pagamento)
                    VALUES (${data.data}, ${data.hora}, ${data.total}, ${data.pagamento})
                    RETURNING id
                `;
                
                const vendaId = vendaResult[0].id;
                
                // Inserir itens da venda
                for (const item of data.itens) {
                    await sql`
                        INSERT INTO venda_itens (venda_id, produto_id, nome, quantidade, preco)
                        VALUES (${vendaId}, ${item.produtoId}, ${item.nome}, ${item.quantidade}, ${item.preco})
                    `;
                    
                    // Atualizar estoque
                    await sql`
                        UPDATE produtos 
                        SET estoque = estoque - ${item.quantidade}
                        WHERE id = ${item.produtoId}
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

            case 'get_vendas_semana':
                result = await sql`
                    SELECT data, 
                           COUNT(*) as total_vendas,
                           SUM(total) as total_dia
                    FROM vendas
                    WHERE data >= CURRENT_DATE - INTERVAL '7 days'
                    GROUP BY data
                    ORDER BY data
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
                    SELECT p.id, p.nome, p.emoji, p.cor,
                           COALESCE(SUM(vi.quantidade), 0) as vendas_hoje,
                           p.preco
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

            case 'update_estoque':
                await sql`
                    UPDATE produtos 
                    SET estoque = estoque - ${data.quantidade}
                    WHERE id = ${data.produtoId}
                `;
                result = { success: true };
                break;

            case 'get_vendas_periodo':
                result = await sql`
                    SELECT v.*, 
                           COUNT(vi.id) as total_itens,
                           SUM(vi.quantidade) as total_unidades
                    FROM vendas v
                    LEFT JOIN venda_itens vi ON v.id = vi.venda_id
                    WHERE v.data BETWEEN ${data.startDate} AND ${data.endDate}
                    GROUP BY v.id
                    ORDER BY v.data DESC, v.hora DESC
                `;
                break;

            case 'get_fiados':
                // Exemplo básico - ajuste conforme sua tabela de fiados
                result = await sql`
                    SELECT * FROM fiados 
                    ORDER BY created_at DESC
                `;
                break;

            default:
                return res.status(400).json({ 
                    success: false, 
                    error: `Ação desconhecida: ${action}` 
                });
        }

        console.log(`✅ API Resposta: ${action}`, result?.length || result);

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
