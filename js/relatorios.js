// relatorio.js
import { neonAPI, showNotification, formatPrice, showLoading, formatarData } from './main.js';

// ===== FUNÇÕES DE RELATÓRIOS =====
export async function loadReports() {
    try {
        showLoading('reportContent', 'Gerando relatório...');
        
        const relatorio = await neonAPI('get_relatorio_completo');
        
        if (!relatorio) {
            throw new Error('Relatório vazio');
        }
        
        const reportContent = document.getElementById('reportContent');
        
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
                    ${generateSalesTable(vendasRecentes)}
                </div>
                
                <div style="background: #e8f5e9; padding: 15px; border-radius: 10px;">
                    <p style="color: var(--success);">
                        <i class="fas fa-check-circle"></i> Banco de dados Neon conectado com sucesso!
                    </p>
                </div>
            </div>
        `;
        
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
                <button class="btn-primary" onclick="relatorioModule.loadReports()" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
}

export function generateSalesTable(vendasList) {
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
        const dataFormatada = formatarData(venda.data);
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
}

export async function backupData() {
    try {
        showNotification('🔄 Gerando backup...', 'info');
        
        const [produtosData, vendasData] = await Promise.all([
            neonAPI('get_produtos'),
            neonAPI('get_vendas_periodo', {
                startDate: '2024-01-01',
                endDate: new Date().toISOString().split('T')[0]
            })
        ]);
        
        const backup = {
            produtos: produtosData,
            vendas: vendasData,
            timestamp: new Date().toISOString(),
            totalProdutos: Array.isArray(produtosData) ? produtosData.length : 0,
            totalVendas: Array.isArray(vendasData) ? vendasData.length : 0,
            totalFaturamento: Array.isArray(vendasData) ? vendasData.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0) : 0
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_neon_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('✅ Backup gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar backup:', error);
        showNotification('❌ Erro ao gerar backup', 'error');
    }
}

export async function loadConfig() {
    try {
        const relatorio = await neonAPI('get_relatorio_completo');
        
        const totalProdutos = relatorio?.totalProdutos || 0;
        const totalVendas = relatorio?.totalVendas || 0;
        const totalFaturamento = relatorio?.totalFaturamento || 0;
        
        document.getElementById('totalProducts').innerText = totalProdutos;
        document.getElementById('totalSales').innerText = totalVendas;
        document.getElementById('totalRevenue').innerText = `R$ ${formatPrice(totalFaturamento)}`;
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        document.getElementById('totalProducts').innerText = '0';
        document.getElementById('totalSales').innerText = '0';
        document.getElementById('totalRevenue').innerText = 'R$ 0,00';
    }
}

export function printReport() {
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

// Exportar módulo
export default {
    loadReports,
    backupData,
    loadConfig,
    printReport
};
