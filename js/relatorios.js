// ===== RELATÓRIOS =====
async function loadReports() {
    try {
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><i class="fas fa-spinner fa-spin"></i><p>Gerando relatório...</p></div>';
        
        const response = await neonAPI('get_relatorio_completo');
        const data = response.data || {};
        
        let html = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--primary);">
                    <h3 style="color: var(--dark); font-size: 22px;">
                        <i class="fas fa-chart-bar"></i> Relatório Geral - ${new Date().toLocaleDateString('pt-BR')}
                    </h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, var(--primary), #2A9D8F); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">TOTAL VENDAS</div>
                        <div style="font-size: 32px; font-weight: 900;">${data.totalVendas || 0}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--success), #2E7D32); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">FATURAMENTO TOTAL</div>
                        <div style="font-size: 32px; font-weight: 900;">R$ ${formatPrice(data.totalFaturamento || 0)}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--warning), #F57C00); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">PRODUTOS ATIVOS</div>
                        <div style="font-size: 32px; font-weight: 900;">${data.totalProdutos || 0}</div>
                    </div>
                </div>
            </div>
        `;
        
        if (data.vendasRecentes && data.vendasRecentes.length > 0) {
            html += `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 20px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">
                        <i class="fas fa-history"></i> Últimas Vendas
                    </h4>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: white;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Data</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Valor</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Itens</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Pagamento</th>
                                </tr>
                            </thead>
                            <tbody>`;
            
            data.vendasRecentes.slice(0, 10).forEach(venda => {
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${formatarData(venda.data)} ${venda.hora || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: 700;">R$ ${formatPrice(venda.total)}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${venda.total_itens || 1} itens</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                            <span style="padding: 4px 8px; border-radius: 10px; background: #e9ecef; font-size: 12px;">
                                ${venda.pagamento || 'dinheiro'}
                            </span>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table></div></div>`;
        }
        
        reportContent.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        const reportContent = document.getElementById('reportContent');
        if (reportContent) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao gerar relatório</p>
                </div>
            `;
        }
    }
}

// Configurar botões relatórios
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateReportBtn')?.addEventListener('click', loadReports);
});

// Exportar funções
window.loadReports = loadReports;
