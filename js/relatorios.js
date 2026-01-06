// ===== RELATÓRIOS =====
Object.assign(window.chopManager, {
    // Carregar relatórios
    loadReports: async function() {
        try {
            showLoading('reportContent', 'Gerando relatório...');
            
            const periodo = document.getElementById('reportPeriod')?.value || 'mes';
            let startDate, endDate;
            
            const hoje = new Date();
            
            switch(periodo) {
                case 'hoje':
                    startDate = endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'ontem':
                    const ontem = new Date(hoje);
                    ontem.setDate(ontem.getDate() - 1);
                    startDate = endDate = ontem.toISOString().split('T')[0];
                    break;
                case 'semana':
                    const semanaAtras = new Date(hoje);
                    semanaAtras.setDate(semanaAtras.getDate() - 7);
                    startDate = semanaAtras.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'mes':
                    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    startDate = primeiroDiaMes.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'ano':
                    const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);
                    startDate = primeiroDiaAno.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'personalizado':
                    startDate = document.getElementById('startDate')?.value;
                    endDate = document.getElementById('endDate')?.value;
                    if (!startDate || !endDate) {
                        showNotification('Selecione as datas personalizadas', 'warning');
                        return;
                    }
                    break;
            }
            
            // Buscar dados do período
            const relatorio = await NeonAPI.getRelatorioCompleto();
            
            this.renderReport(relatorio);
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            showNotification('Erro ao gerar relatório', 'error');
            
            document.getElementById('reportContent').innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px;">Erro ao carregar relatório</p>
                    <p style="font-size: 14px; margin-top: 5px; color: var(--gray);">
                        Verifique sua conexão com o banco de dados
                    </p>
                    <button class="btn-primary" onclick="window.chopManager.loadReports()" style="margin-top: 15px;">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                </div>
            `;
        }
    },

    // Renderizar relatório
    renderReport: function(relatorio) {
        const reportContent = document.getElementById('reportContent');
        
        if (!relatorio) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-chart-bar" style="font-size: 40px; opacity: 0.3;"></i>
                    <p>Sem dados para o período selecionado</p>
                </div>
            `;
            return;
        }
        
        const totalVendas = relatorio.totalVendas || 0;
        const totalProdutos = relatorio.totalProdutos || 0;
        const totalFaturamento = relatorio.totalFaturamento || 0;
        const vendasRecentes = Array.isArray(relatorio.vendasRecentes) ? relatorio.vendasRecentes : [];
        
        reportContent.innerHTML = `
            <div>
                <h3 style="color: var(--dark); margin-bottom: 20px; font-size: 24px;">
                    <i class="fas fa-chart-bar"></i> Relatório Neon
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: #f0f7ff; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">VENDAS TOTAIS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--primary);">
                            ${totalVendas}
                        </div>
                    </div>
                    
                    <div style="background: #f0fff4; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">FATURAMENTO TOTAL</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--success);">
                            R$ ${formatPrice(totalFaturamento)}
                        </div>
                    </div>
                    
                    <div style="background: #fff8e1; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">PRODUTOS ATIVOS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--warning);">
                            ${totalProdutos}
                        </div>
                    </div>
                    
                    <div style="background: #ffebee; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">ÚLTIMAS VENDAS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--danger);">
                            ${vendasRecentes.length}
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">Últimas Vendas</h4>
                    ${this.generateSalesTable(vendasRecentes)}
                </div>
                
                <div style="background: #e8f5e9; padding: 15px; border-radius: 10px;">
                    <p style="color: var(--success);">
                        <i class="fas fa-check-circle"></i> Banco de dados Neon conectado com sucesso!
                    </p>
                </div>
            </div>
        `;
    },

    // Gerar tabela de vendas
    generateSalesTable: function(vendasList) {
        if (!Array.isArray(vendasList) || vendasList.length === 0) {
            return `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-receipt" style="font-size: 40px; opacity: 0.3;"></i>
                    <p>Nenhuma venda registrada ainda</p>
                </div>
            `;
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left;">Data</th>
                        <th style="padding: 10px; text-align: left;">Hora</th>
                        <th style="padding: 10px; text-align: left;">Itens</th>
                        <th style="padding: 10px; text-align: left;">Total</th>
                        <th style="padding: 10px; text-align: left;">Pagamento</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        vendasList.forEach(venda => {
            const dataFormatada = formatDate(venda.data);
            const pagamentoClass = {
                'dinheiro': 'payment-dinheiro',
                'cartao': 'payment-cartao',
                'pix': 'payment-pix',
                'fiado': 'payment-pix'
            }[venda.pagamento] || '';
            
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${dataFormatada}</td>
                    <td style="padding: 10px;">${venda.hora || '--:--'}</td>
                    <td style="padding: 10px;">${venda.total_itens || 0} itens</td>
                    <td style="padding: 10px; font-weight: 700;">R$ ${formatPrice(venda.total)}</td>
                    <td style="padding: 10px;">
                        <span style="padding: 2px 8px; border-radius: 10px; background: #e3f2fd; color: #1565c0; font-size: 12px;">
                            ${(venda.pagamento || 'N/A').toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        return html;
    },

    // Imprimir relatório
    printReport: function() {
        const printContent = document.getElementById('reportContent').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório Chop Manager</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Relatório Chop Manager PRO</h1>
                <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                ${printContent}
            </body>
            </html>
        `;
        
        window.print();
        document.body.innerHTML = originalContent;
        location.reload();
    }
});

// Event listeners específicos de relatórios
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('reportPeriod')?.addEventListener('change', function() {
        const isCustom = this.value === 'personalizado';
        const customRange = document.getElementById('customDateRange');
        if (customRange) {
            customRange.style.display = isCustom ? 'block' : 'none';
        }
    });
    
    document.getElementById('generateReportBtn')?.addEventListener('click', () => {
        window.chopManager.loadReports();
    });
    
    document.getElementById('printReport')?.addEventListener('click', () => {
        window.chopManager.printReport();
    });
});
