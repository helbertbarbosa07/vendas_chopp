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
        
        // Buscar fiados
        const fiadosResponse = await neonAPI('get_fiados');
        const todosFiados = fiadosResponse.data || [];
        
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
        
        // Filtrar fiados pelo período
        const fiadosPeriodo = todosFiados.filter(fiado => {
            if (!fiado.data_fiado && !fiado.created_at) return false;
            try {
                const dataFiado = new Date(fiado.data_fiado || fiado.created_at);
                const inicio = new Date(dataInicio);
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59);
                
                return dataFiado >= inicio && dataFiado <= fim;
            } catch (e) {
                return false;
            }
        });
        
        // Calcular totais
        const totalVendas = vendasPeriodo.length;
        const totalFaturamento = vendasPeriodo.reduce((sum, venda) => sum + (parseFloat(venda.total) || 0), 0);
        const totalFiados = fiadosPeriodo.length;
        const totalFiadosPendentes = fiadosPeriodo.filter(f => !f.pago).reduce((sum, f) => sum + (parseFloat(f.valor_total) - parseFloat(f.valor_pago || 0)), 0);
        
        // Calcular distribuição de pagamentos
        const pagamentos = {
            dinheiro: 0,
            cartao: 0,
            pix: 0,
            fiado: 0
        };
        
        vendasPeriodo.forEach(venda => {
            const forma = venda.pagamento || 'dinheiro';
            if (pagamentos[forma] !== undefined) {
                pagamentos[forma] += parseFloat(venda.total) || 0;
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
                    
                    <div style="background: linear-gradient(135deg, #FF7BAC, #FF4081); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">FIADOS PENDENTES</div>
                        <div style="font-size: 32px; font-weight: 900;">R$ ${formatPrice(totalFiadosPendentes)}</div>
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
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #2196F3;">💳</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">Cartão</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.cartao)}</div>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #9C27B0;">📱</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">PIX</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.pix)}</div>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-size: 24px; color: #FF9800;">📝</div>
                            <div style="font-size: 14px; font-weight: 700; margin: 5px 0;">Fiado</div>
                            <div style="font-size: 18px; font-weight: 900;">R$ ${formatPrice(pagamentos.fiado)}</div>
                        </div>
                    </div>
                </div>
            </div>
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
                let badgeColor = '#e9ecef';
                if (pagamento === 'dinheiro') badgeColor = '#d4edda';
                else if (pagamento === 'cartao') badgeColor = '#d1ecf1';
                else if (pagamento === 'pix') badgeColor = '#f8d7da';
                else if (pagamento === 'fiado') badgeColor = '#fff3cd';
                
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
        }
        
        if (fiadosPeriodo.length > 0) {
            html += `
                <div style="background: #fff3cd; padding: 20px; border-radius: 15px; margin-top: 20px; border: 1px solid #ffeaa7;">
                    <h4 style="color: #856404; margin-bottom: 15px;">
                        <i class="fas fa-hand-holding-usd"></i> Fiados do Período (${fiadosPeriodo.length})
                    </h4>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <thead>
                                <tr style="background: #ffeaa7;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #fdcb6e;">Cliente</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #fdcb6e;">Data</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #fdcb6e;">Valor</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #fdcb6e;">Status</th>
                                </tr>
                            </thead>
                            <tbody>`;
            
            fiadosPeriodo.slice(0, 10).forEach(fiado => {
                const status = fiado.pago ? 'PAGO' : (fiado.data_vencimento && new Date(fiado.data_vencimento) < new Date() ? 'ATRASADO' : 'PENDENTE');
                let statusColor = '#856404';
                let statusBg = '#fff3cd';
                if (status === 'PAGO') {
                    statusColor = '#155724';
                    statusBg = '#d4edda';
                } else if (status === 'ATRASADO') {
                    statusColor = '#721c24';
                    statusBg = '#f8d7da';
                }
                
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ffeaa7;">${fiado.nome_cliente}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ffeaa7;">${formatarData(fiado.data_fiado || fiado.created_at)}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ffeaa7; font-weight: 700;">R$ ${formatPrice(fiado.valor_total)}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ffeaa7;">
                            <span style="padding: 4px 8px; border-radius: 10px; background: ${statusBg}; color: ${statusColor}; font-size: 12px; font-weight: 700;">
                                ${status}
                            </span>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table></div></div>`;
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
