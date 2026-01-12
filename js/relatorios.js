// ===== SISTEMA DE RELATÓRIOS =====
async function loadReports() {
    try {
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '<div style="text-align: center; padding: 60px 20px;"><i class="fas fa-spinner fa-spin"></i><p>Gerando relatório...</p></div>';
        
        const [vendasAPI, produtosAPI, fiadosAPI] = await Promise.all([
            neonAPI('get_vendas_recentes').catch(() => []),
            neonAPI('get_produtos').catch(() => []),
            neonAPI('get_fiados').catch(() => [])
        ]);
        
        const hoje = new Date().toISOString().split('T')[0];
        const vendasHoje = vendasAPI.filter(v => (v.data || v.created_at)?.includes(hoje));
        
        const totalVendas = vendasHoje.length;
        const totalFaturamento = vendasHoje.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
        const totalProdutos = produtosAPI.length;
        const totalFiados = fiadosAPI.length;
        
        // Calcular formas de pagamento
        const pagamentos = {};
        vendasHoje.forEach(v => {
            const tipo = v.pagamento || 'dinheiro';
            pagamentos[tipo] = (pagamentos[tipo] || 0) + (parseFloat(v.total) || 0);
        });
        
        reportContent.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--primary);">
                    <h3 style="color: var(--dark); font-size: 22px;">
                        <i class="fas fa-chart-bar"></i> Relatório - ${new Date().toLocaleDateString('pt-BR')}
                    </h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #36B5B0, #2A9D8F); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">VENDAS HOJE</div>
                        <div style="font-size: 32px; font-weight: 900;">${totalVendas}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">FATURAMENTO</div>
                        <div style="font-size: 32px; font-weight: 900;">R$ ${formatPrice(totalFaturamento)}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #FF9800, #F57C00); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">PRODUTOS</div>
                        <div style="font-size: 32px; font-weight: 900;">${totalProdutos}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #F44336, #D32F2F); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                        <div style="font-size: 13px; opacity: 0.9;">FIADOS</div>
                        <div style="font-size: 32px; font-weight: 900;">${totalFiados}</div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">
                        <i class="fas fa-credit-card"></i> Formas de Pagamento
                    </h4>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${Object.entries(pagamentos).map(([tipo, valor]) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: white; border-radius: 10px;">
                                <span style="font-weight: 700;">${tipo.toUpperCase()}</span>
                                <div>
                                    <div style="font-weight: 900;">R$ ${formatPrice(valor)}</div>
                                    <div style="font-size: 12px; color: var(--gray);">
                                        ${((valor / totalFaturamento) * 100).toFixed(1)}% do total
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro relatórios:', error);
    }
}

// Configurar botões relatórios
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateReportBtn')?.addEventListener('click', loadReports);
});
