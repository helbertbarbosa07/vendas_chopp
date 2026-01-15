// ===== RELATÓRIOS =====
async function loadReportsComFiltro() {
    try {
        const periodo = document.getElementById('reportPeriod').value;
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        const customRange = document.getElementById('customDateRange');
        
        let dataInicio, dataFim;
        
        if (periodo === 'personalizado') {
            if (!startDate.value || !endDate.value) {
                showNotification('❌ Selecione ambas as datas', 'error');
                return;
            }
            dataInicio = startDate.value;
            dataFim = endDate.value;
        } else {
            // Calcular datas baseadas no período
            const hoje = new Date();
            switch(periodo) {
                case 'hoje':
                    dataInicio = hoje.toISOString().split('T')[0];
                    dataFim = dataInicio;
                    break;
                case 'ontem':
                    const ontem = new Date(hoje);
                    ontem.setDate(hoje.getDate() - 1);
                    dataInicio = ontem.toISOString().split('T')[0];
                    dataFim = dataInicio;
                    break;
                case 'semana':
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                    dataInicio = inicioSemana.toISOString().split('T')[0];
                    dataFim = hoje.toISOString().split('T')[0];
                    break;
                case 'mes':
                    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    dataInicio = inicioMes.toISOString().split('T')[0];
                    dataFim = hoje.toISOString().split('T')[0];
                    break;
                case 'ano':
                    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
                    dataInicio = inicioAno.toISOString().split('T')[0];
                    dataFim = hoje.toISOString().split('T')[0];
                    break;
            }
        }
        
        await gerarRelatorioPeriodo(dataInicio, dataFim);
        
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        showNotification('❌ Erro ao gerar relatório', 'error');
    }
}

async function gerarRelatorioPeriodo(dataInicio, dataFim) {
    try {
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><i class="fas fa-spinner fa-spin"></i><p>Gerando relatório detalhado...</p></div>';
        
        // Buscar todas as vendas com detalhes dos produtos
        const response = await neonAPI('get_relatorio_completo');
        const todasVendas = response.data?.vendasRecentes || [];
        
        // Buscar produtos ativos para estatísticas
        const produtosResponse = await neonAPI('get_produtos');
        const todosProdutos = produtosResponse.data || [];
        const produtosAtivos = todosProdutos.filter(p => p.ativo).length;
        
        // Filtrar vendas pelo período
        const vendasPeriodo = todasVendas.filter(venda => {
            if (!venda.data) return false;
            try {
                const dataVenda = new Date(venda.data);
                const inicio = new Date(dataInicio);
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59); // Incluir todo o dia final
                
                return dataVenda >= inicio && dataVenda <= fim;
            } catch (e) {
                return false;
            }
        });
        
        // Para cada venda, buscar os itens detalhados
        const vendasDetalhadas = [];
        
        for (const venda of vendasPeriodo) {
            try {
                // Buscar itens da venda com nomes dos produtos
                const itensResponse = await neonAPI('get_itens_venda', { id: venda.id });
                const itensVenda = itensResponse.data || [];
                
                // Adicionar nomes dos produtos aos itens
                const itensComNomes = await Promise.all(itensVenda.map(async (item) => {
                    const produto = todosProdutos.find(p => p.id === item.produto_id);
                    return {
                        ...item,
                        produto_nome: produto?.nome || 'Produto Desconhecido',
                        produto_emoji: produto?.emoji || '📦',
                        produto_cor: produto?.cor || '#36B5B0'
                    };
                }));
                
                vendasDetalhadas.push({
                    ...venda,
                    itens: itensComNomes
                });
                
            } catch (error) {
                console.error(`Erro ao buscar itens da venda ${venda.id}:`, error);
                // Se não conseguir os itens, usar dados básicos
                vendasDetalhadas.push({
                    ...venda,
                    itens: []
                });
            }
        }
        
        // Calcular totais
        const totalVendas = vendasDetalhadas.length;
        const totalFaturamento = vendasDetalhadas.reduce((sum, venda) => sum + (parseFloat(venda.total) || 0), 0);
        
        // Calcular produtos mais vendidos no período
        const produtosVendidos = {};
        vendasDetalhadas.forEach(venda => {
            venda.itens.forEach(item => {
                const produtoId = item.produto_id;
                const produtoNome = item.produto_nome;
                const quantidade = parseFloat(item.quantidade) || 0;
                const preco = parseFloat(item.preco) || 0;
                
                if (!produtosVendidos[produtoId]) {
                    produtosVendidos[produtoId] = {
                        nome: produtoNome,
                        emoji: item.produto_emoji,
                        cor: item.produto_cor,
                        quantidade: 0,
                        total: 0
                    };
                }
                
                produtosVendidos[produtoId].quantidade += quantidade;
                produtosVendidos[produtoId].total += quantidade * preco;
            });
        });
        
        // Ordenar produtos por quantidade vendida
        const produtosMaisVendidos = Object.values(produtosVendidos)
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5); // Top 5 produtos
        
        // Calcular distribuição de pagamentos
        const pagamentos = {
            dinheiro: 0,
            cartao: 0,
            pix: 0
        };
        
        vendasDetalhadas.forEach(venda => {
            const forma = venda.pagamento || 'dinheiro';
            if (pagamentos[forma] !== undefined) {
                pagamentos[forma] += parseFloat(venda.total) || 0;
            } else {
                pagamentos.dinheiro += parseFloat(venda.total) || 0;
            }
        });
        
        let html = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--primary);">
                    <h3 style="color: var(--dark); font-size: 22px;">
                        <i class="fas fa-chart-bar"></i> Relatório Detalhado - ${formatarData(dataInicio)} até ${formatarData(dataFim)}
                    </h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, var(--primary), #2A9D8F); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">TOTAL VENDAS</div>
                        <div style="font-size: 32px; font-weight: 900;">${totalVendas}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--success), #2E7D32); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">FATURAMENTO</div>
                        <div style="font-size: 32px; font-weight: 900;">R$ ${formatPrice(totalFaturamento)}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--warning), #F57C00); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">PRODUTOS ATIVOS</div>
                        <div style="font-size: 32px; font-weight: 900;">${produtosAtivos}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--accent), #FFB347); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">MÉDIA POR VENDA</div>
                        <div style="font-size: 32px; font-weight: 900;">R$ ${formatPrice(totalVendas > 0 ? totalFaturamento / totalVendas : 0)}</div>
                    </div>
                </div>
                
                <!-- PRODUTOS MAIS VENDIDOS -->
                ${produtosMaisVendidos.length > 0 ? `
                <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 1px solid #b6e0fe;">
                    <h4 style="color: #0c5460; margin-bottom: 15px;">
                        <i class="fas fa-crown"></i> Produtos Mais Vendidos
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ` : ''}
                
                ${produtosMaisVendidos.map((produto, index) => `
                    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <div style="font-size: 30px; margin-bottom: 10px; color: ${produto.cor};">${produto.emoji}</div>
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 5px; color: var(--dark);">${produto.nome}</div>
                        <div style="font-size: 18px; font-weight: 900; color: var(--primary);">${produto.quantidade} un.</div>
                        <div style="font-size: 14px; color: var(--gray);">R$ ${formatPrice(produto.total)}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px; background: #f8f9fa; padding: 3px 8px; border-radius: 10px;">
                            #${index + 1} mais vendido
                        </div>
                    </div>
                `).join('')}
                
                ${produtosMaisVendidos.length > 0 ? `
                    </div>
                </div>
                ` : ''}
                
                <!-- DISTRIBUIÇÃO DE PAGAMENTOS -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">
                        <i class="fas fa-credit-card"></i> Distribuição de Pagamentos
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #4CAF50;">💵</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">Dinheiro</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.dinheiro)}</div>
                            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">
                                ${totalFaturamento > 0 ? Math.round((pagamentos.dinheiro / totalFaturamento) * 100) : 0}%
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #2196F3;">💳</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">Cartão</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.cartao)}</div>
                            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">
                                ${totalFaturamento > 0 ? Math.round((pagamentos.cartao / totalFaturamento) * 100) : 0}%
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #9C27B0;">📱</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">PIX</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.pix)}</div>
                            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">
                                ${totalFaturamento > 0 ? Math.round((pagamentos.pix / totalFaturamento) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // HISTÓRICO DETALHADO DE VENDAS
        if (vendasDetalhadas.length > 0) {
            html += `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color: var(--dark); margin: 0;">
                            <i class="fas fa-history"></i> Histórico Detalhado de Vendas (${vendasDetalhadas.length})
                        </h4>
                        <span style="font-size: 14px; color: var(--gray);">
                            Média: R$ ${formatPrice(totalVendas > 0 ? totalFaturamento / totalVendas : 0)}
                        </span>
                    </div>
            `;
            
            // Agrupar vendas por data
            const vendasPorData = {};
            vendasDetalhadas.forEach(venda => {
                const data = venda.data;
                if (!vendasPorData[data]) {
                    vendasPorData[data] = [];
                }
                vendasPorData[data].push(venda);
            });
            
            // Ordenar datas
            const datasOrdenadas = Object.keys(vendasPorData).sort((a, b) => new Date(b) - new Date(a));
            
            datasOrdenadas.forEach(data => {
                const vendasDoDia = vendasPorData[data];
                const totalDia = vendasDoDia.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
                
                html += `
                    <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                            <div style="font-weight: 700; color: var(--dark);">
                                <i class="fas fa-calendar-day"></i> ${formatarData(data)}
                            </div>
                            <div style="font-weight: 900; color: var(--primary);">
                                ${vendasDoDia.length} vendas • R$ ${formatPrice(totalDia)}
                            </div>
                        </div>
                `;
                
                vendasDoDia.forEach((venda, vendaIndex) => {
                    const pagamento = venda.pagamento || 'dinheiro';
                    let badgeColor = '#d4edda';
                    if (pagamento === 'cartao') badgeColor = '#d1ecf1';
                    else if (pagamento === 'pix') badgeColor = '#f8d7da';
                    
                    html += `
                        <div style="margin-bottom: ${vendaIndex < vendasDoDia.length - 1 ? '15px' : '0'}; padding-bottom: ${vendaIndex < vendasDoDia.length - 1 ? '15px' : '0'}; border-bottom: ${vendaIndex < vendasDoDia.length - 1 ? '1px dashed #eee' : 'none'};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div>
                                    <span style="font-weight: 700; color: var(--dark);">${venda.hora || '--:--'}</span>
                                    <span style="padding: 2px 8px; border-radius: 10px; background: ${badgeColor}; font-size: 11px; font-weight: 700; margin-left: 10px;">
                                        ${pagamento}
                                    </span>
                                </div>
                                <div style="font-weight: 900; color: var(--primary);">
                                    R$ ${formatPrice(venda.total)}
                                </div>
                            </div>
                            
                            <!-- PRODUTOS DA VENDA -->
                            ${venda.itens.length > 0 ? `
                            <div style="background: #fafafa; padding: 10px; border-radius: 8px; margin-top: 10px;">
                                <div style="font-size: 12px; color: var(--gray); margin-bottom: 5px; font-weight: 700;">
                                    <i class="fas fa-box"></i> Produtos Vendidos:
                                </div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ` : ''}
                            
                            ${venda.itens.map(item => `
                                <div style="display: flex; align-items: center; background: white; padding: 5px 10px; border-radius: 6px; border: 1px solid #eee; font-size: 11px;">
                                    <span style="color: ${item.produto_cor}; margin-right: 5px;">${item.produto_emoji}</span>
                                    <span style="font-weight: 700; color: var(--dark); margin-right: 8px;">${item.produto_nome}</span>
                                    <span style="color: var(--gray); margin-right: 5px;">${item.quantidade}x</span>
                                    <span style="font-weight: 700; color: var(--primary);">R$ ${formatPrice(item.preco)}</span>
                                </div>
                            `).join('')}
                            
                            ${venda.itens.length > 0 ? `
                                </div>
                            </div>
                            ` : `
                            <div style="font-size: 11px; color: var(--gray); font-style: italic;">
                                <i class="fas fa-info-circle"></i> Detalhes dos produtos não disponíveis
                            </div>
                            `}
                        </div>
                    `;
                });
                
                html += `</div>`;
            });
            
            if (vendasDetalhadas.length > 20) {
                html += `<div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray);">
                    ... totalizando ${vendasDetalhadas.length} vendas no período
                </div>`;
            }
            
            html += `</div>`;
        } else {
            html += `
                <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-shopping-cart" style="font-size: 40px; color: var(--gray); margin-bottom: 15px;"></i>
                    <p style="color: var(--gray);">Nenhuma venda encontrada neste período</p>
                </div>
            `;
        }
        
        // RESUMO POR DIA DA SEMANA
        if (vendasDetalhadas.length > 0) {
            const vendasPorDiaSemana = {};
            vendasDetalhadas.forEach(venda => {
                if (venda.data) {
                    const data = new Date(venda.data);
                    const diaSemana = data.getDay(); // 0 = domingo, 1 = segunda, etc
                    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                    const diaNome = dias[diaSemana];
                    
                    if (!vendasPorDiaSemana[diaNome]) {
                        vendasPorDiaSemana[diaNome] = {
                            quantidade: 0,
                            total: 0
                        };
                    }
                    
                    vendasPorDiaSemana[diaNome].quantidade++;
                    vendasPorDiaSemana[diaNome].total += parseFloat(venda.total) || 0;
                }
            });
            
            if (Object.keys(vendasPorDiaSemana).length > 0) {
                const diaMaisVendas = Object.entries(vendasPorDiaSemana).sort((a, b) => b[1].quantidade - a[1].quantidade)[0];
                const diaMaisFaturamento = Object.entries(vendasPorDiaSemana).sort((a, b) => b[1].total - a[1].total)[0];
                
                html += `
                    <div style="background: #e8f4f8; padding: 20px; border-radius: 15px; margin-top: 20px; border: 1px solid #b6e0fe;">
                        <h4 style="color: #0c5460; margin-bottom: 15px;">
                            <i class="fas fa-calendar-alt"></i> Análise por Dia da Semana
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                `;
                
                const diasOrdenados = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
                
                diasOrdenados.forEach(dia => {
                    const dados = vendasPorDiaSemana[dia];
                    if (dados) {
                        const porcentagem = Math.round((dados.quantidade / totalVendas) * 100);
                        html += `
                            <div style="background: white; padding: 10px; border-radius: 8px; text-align: center;">
                                <div style="font-weight: 700; color: #0c5460; font-size: 12px;">${dia}</div>
                                <div style="font-size: 16px; font-weight: 900; color: var(--primary);">${dados.quantidade}</div>
                                <div style="font-size: 11px; color: var(--gray);">${porcentagem}%</div>
                                <div style="font-size: 10px; color: var(--success); margin-top: 3px;">
                                    R$ ${formatPrice(dados.total)}
                                </div>
                            </div>
                        `;
                    } else {
                        html += `
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center; opacity: 0.5;">
                                <div style="font-weight: 700; color: #999; font-size: 12px;">${dia}</div>
                                <div style="font-size: 16px; font-weight: 900; color: #ccc;">0</div>
                                <div style="font-size: 11px; color: #ccc;">0%</div>
                            </div>
                        `;
                    }
                });
                
                html += `
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                            <div style="padding: 10px; background: #d1ecf1; border-radius: 8px;">
                                <i class="fas fa-trophy"></i> 
                                <strong>Dia com mais vendas:</strong><br>
                                ${diaMaisVendas[0]} (${diaMaisVendas[1].quantidade} vendas)
                            </div>
                            <div style="padding: 10px; background: #d1ecf1; border-radius: 8px;">
                                <i class="fas fa-money-bill-wave"></i> 
                                <strong>Maior faturamento:</strong><br>
                                ${diaMaisFaturamento[0]} (R$ ${formatPrice(diaMaisFaturamento[1].total)})
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        reportContent.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao gerar relatório por período:', error);
        const reportContent = document.getElementById('reportContent');
        if (reportContent) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao gerar relatório: ${error.message}</p>
                    <button onclick="gerarRelatorioPeriodo('${dataInicio}', '${dataFim}')" style="margin-top: 10px; padding: 8px 15px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }
}

// ===== IMPRESSÃO DE RELATÓRIO =====
function imprimirRelatorio() {
    const reportContent = document.getElementById('reportContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Relatório Chop Manager</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; border-bottom: 2px solid #36B5B0; padding-bottom: 10px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
                .stat-card { padding: 15px; border-radius: 10px; color: white; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f5f5f5; }
                .badge { padding: 3px 8px; border-radius: 10px; font-size: 11px; }
                .product-item { display: flex; align-items: center; margin: 3px 0; }
                .product-emoji { margin-right: 5px; }
                @media print {
                    .no-print { display: none; }
                    body { margin: 0; }
                    .payment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 20px;">
                <h1>🍦 Chop Manager PRO - Relatório Detalhado</h1>
                <p>Relatório Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            ${reportContent}
            <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
                Relatório gerado automaticamente pelo Sistema Chop Manager PRO
            </div>
            <div class="no-print" style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #36B5B0; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Imprimir Relatório
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    Fechar
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Configurar botões relatórios
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateReportBtn')?.addEventListener('click', loadReportsComFiltro);
    
    // Configurar visibilidade do calendário personalizado
    const reportPeriod = document.getElementById('reportPeriod');
    const customDateRange = document.getElementById('customDateRange');
    
    if (reportPeriod && customDateRange) {
        reportPeriod.addEventListener('change', function() {
            customDateRange.style.display = this.value === 'personalizado' ? 'block' : 'none';
            
            // Preencher datas padrão para personalizado
            if (this.value === 'personalizado') {
                const hoje = new Date();
                const ontem = new Date(hoje);
                ontem.setDate(hoje.getDate() - 1);
                
                document.getElementById('startDate').value = ontem.toISOString().split('T')[0];
                document.getElementById('endDate').value = hoje.toISOString().split('T')[0];
            }
        });
        
        // Inicializar
        customDateRange.style.display = 'none';
    }
    
    // Configurar botão de impressão
    document.getElementById('printReport')?.addEventListener('click', imprimirRelatorio);
});

// Exportar funções
window.loadReportsComFiltro = loadReportsComFiltro;
window.gerarRelatorioPeriodo = gerarRelatorioPeriodo;
window.imprimirRelatorio = imprimirRelatorio;
