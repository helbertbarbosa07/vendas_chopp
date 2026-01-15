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
        reportContent.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><i class="fas fa-spinner fa-spin"></i><p>Gerando relatório...</p></div>';
        
        // Buscar todas as vendas para filtrar
        const response = await neonAPI('get_relatorio_completo');
        const todasVendas = response.data?.vendasRecentes || [];
        
        // Buscar produtos ativos
        const produtosResponse = await neonAPI('get_produtos');
        const produtosAtivos = (produtosResponse.data || []).filter(p => p.ativo).length;
        
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
        
        // Calcular totais
        const totalVendas = vendasPeriodo.length;
        const totalFaturamento = vendasPeriodo.reduce((sum, venda) => sum + (parseFloat(venda.total) || 0), 0);
        
        // Calcular distribuição de pagamentos
        const pagamentos = {
            dinheiro: 0,
            cartao: 0,
            pix: 0
        };
        
        vendasPeriodo.forEach(venda => {
            const forma = venda.pagamento || 'dinheiro';
            if (pagamentos[forma] !== undefined) {
                pagamentos[forma] += parseFloat(venda.total) || 0;
            } else {
                // Se for outro tipo de pagamento, coloca em dinheiro
                pagamentos.dinheiro += parseFloat(venda.total) || 0;
            }
        });
        
        let html = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--primary);">
                    <h3 style="color: var(--dark); font-size: 22px;">
                        <i class="fas fa-chart-bar"></i> Relatório - ${formatarData(dataInicio)} até ${formatarData(dataFim)}
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
                    
                    <!-- GRÁFICO DE PIZZA -->
                    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <h5 style="margin-bottom: 10px; color: var(--dark); font-size: 14px;">
                            <i class="fas fa-chart-pie"></i> Visualização Gráfica
                        </h5>
                        <div style="display: flex; align-items: center; justify-content: center; height: 200px;">
                            <canvas id="pagamentosChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar gráfico de pizza
        html += `
            <script>
            document.addEventListener('DOMContentLoaded', function() {
                const ctx = document.getElementById('pagamentosChart');
                if (!ctx) return;
                
                const pagamentosData = {
                    dinheiro: ${pagamentos.dinheiro},
                    cartao: ${pagamentos.cartao},
                    pix: ${pagamentos.pix}
                };
                
                // Destruir gráfico anterior se existir
                if (window.pagamentosChart instanceof Chart) {
                    window.pagamentosChart.destroy();
                }
                
                // Criar gráfico de pizza
                window.pagamentosChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Dinheiro', 'Cartão', 'PIX'],
                        datasets: [{
                            data: [pagamentosData.dinheiro, pagamentosData.cartao, pagamentosData.pix],
                            backgroundColor: [
                                'rgba(76, 175, 80, 0.7)',
                                'rgba(33, 150, 243, 0.7)',
                                'rgba(156, 39, 176, 0.7)'
                            ],
                            borderColor: [
                                'rgba(76, 175, 80, 1)',
                                'rgba(33, 150, 243, 1)',
                                'rgba(156, 39, 176, 1)'
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.parsed;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                        return \`\${label}: R$ \${formatPrice(value)} (\${percentage}%)\`;
                                    }
                                }
                            }
                        }
                    }
                });
            });
            </script>
        `;
        
        if (vendasPeriodo.length > 0) {
            html += `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color: var(--dark); margin: 0;">
                            <i class="fas fa-history"></i> Vendas do Período (${vendasPeriodo.length})
                        </h4>
                        <span style="font-size: 14px; color: var(--gray);">
                            Média: R$ ${formatPrice(totalVendas > 0 ? totalFaturamento / totalVendas : 0)}
                        </span>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <thead>
                                <tr style="background: white;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Data</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Hora</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Valor</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Pagamento</th>
                                </tr>
                            </thead>
                            <tbody>`;
            
            vendasPeriodo.slice(0, 20).forEach(venda => {
                const pagamento = venda.pagamento || 'dinheiro';
                let badgeColor = '#d4edda'; // padrão dinheiro
                if (pagamento === 'cartao') badgeColor = '#d1ecf1';
                else if (pagamento === 'pix') badgeColor = '#f8d7da';
                
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${formatarData(venda.data)}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${venda.hora || '--:--'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: 700;">R$ ${formatPrice(venda.total)}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                            <span style="padding: 4px 8px; border-radius: 10px; background: ${badgeColor}; font-size: 12px; font-weight: 700;">
                                ${pagamento}
                            </span>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table></div>`;
            
            if (vendasPeriodo.length > 20) {
                html += `<div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray);">
                    ... e mais ${vendasPeriodo.length - 20} vendas
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
        
        // Adicionar análise por dia da semana
        if (vendasPeriodo.length > 0) {
            const vendasPorDia = {};
            vendasPeriodo.forEach(venda => {
                if (venda.data) {
                    const data = new Date(venda.data);
                    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
                    vendasPorDia[diaSemana] = (vendasPorDia[diaSemana] || 0) + 1;
                }
            });
            
            if (Object.keys(vendasPorDia).length > 0) {
                const diaMaisVendas = Object.entries(vendasPorDia).sort((a, b) => b[1] - a[1])[0];
                
                html += `
                    <div style="background: #e8f4f8; padding: 20px; border-radius: 15px; margin-top: 20px; border: 1px solid #b6e0fe;">
                        <h4 style="color: #0c5460; margin-bottom: 15px;">
                            <i class="fas fa-calendar-alt"></i> Análise por Dia da Semana
                        </h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                `;
                
                Object.entries(vendasPorDia).forEach(([dia, quantidade]) => {
                    const porcentagem = Math.round((quantidade / totalVendas) * 100);
                    html += `
                        <div style="flex: 1; min-width: 120px; background: white; padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="font-weight: 700; color: #0c5460;">${dia.charAt(0).toUpperCase() + dia.slice(1)}</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--primary);">${quantidade}</div>
                            <div style="font-size: 12px; color: var(--gray);">${porcentagem}% do total</div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: #d1ecf1; border-radius: 8px;">
                            <i class="fas fa-trophy"></i> 
                            <strong>Dia com mais vendas:</strong> ${diaMaisVendas[0].charAt(0).toUpperCase() + diaMaisVendas[0].slice(1)} 
                            (${diaMaisVendas[1]} vendas)
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
                @media print {
                    .no-print { display: none; }
                    body { margin: 0; }
                    .payment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                    canvas { max-width: 300px; margin: 0 auto; }
                }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 20px;">
                <h1>🍦 Chop Manager PRO</h1>
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

// ===== EXPORTAÇÃO EM EXCEL =====
function exportarParaExcel() {
    try {
        const tabela = document.querySelector('#reportContent table');
        if (!tabela) {
            showNotification('❌ Nenhuma tabela para exportar', 'error');
            return;
        }
        
        let csv = [];
        const linhas = tabela.querySelectorAll('tr');
        
        for (let i = 0; i < linhas.length; i++) {
            const linha = [];
            const cols = linhas[i].querySelectorAll('td, th');
            
            for (let j = 0; j < cols.length; j++) {
                // Limpar formatação HTML
                let texto = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '');
                texto = texto.replace(/(\s\s)/gm, ' ');
                texto = texto.replace(/"/g, '""');
                linha.push('"' + texto + '"');
            }
            
            csv.push(linha.join(';'));
        }
        
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, `relatorio_vendas_${new Date().toISOString().split('T')[0]}.csv`);
        } else {
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `relatorio_vendas_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        showNotification('✅ Relatório exportado para CSV', 'success');
        
    } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        showNotification('❌ Erro ao exportar relatório', 'error');
    }
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
    
    // Adicionar botão de exportação CSV se não existir
    const exportButtons = document.querySelector('.export-buttons');
    if (exportButtons) {
        if (!document.getElementById('exportExcel')) {
            exportButtons.innerHTML += `
                <button class="export-btn" id="exportExcel" style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white;">
                    <i class="fas fa-file-excel"></i>
                    Exportar Excel
                </button>
            `;
            
            document.getElementById('exportExcel')?.addEventListener('click', exportarParaExcel);
        }
    }
});

// Exportar funções
window.loadReportsComFiltro = loadReportsComFiltro;
window.gerarRelatorioPeriodo = gerarRelatorioPeriodo;
window.imprimirRelatorio = imprimirRelatorio;
window.exportarParaExcel = exportarParaExcel;
