// dashboard.js
import { neonAPI, showNotification, formatPrice, showLoading } from './main.js';

// ===== FUNÇÕES DO DASHBOARD =====
export async function loadDashboard() {
    try {
        console.log('📊 Carregando dashboard...');
        showLoading('recentSalesList', 'Carregando dashboard...');
        showLoading('topProductsList', 'Carregando produtos...');
        
        const stats = await neonAPI('get_dashboard_stats');
        
        // Garantir que os valores existam
        const faturamentoHoje = stats?.faturamentoHoje || 0;
        const totalItens = stats?.totalItens || 0;
        const totalVendas = stats?.totalVendas || 0;
        const estoqueBaixo = stats?.estoqueBaixo || 0;
        const mediaVenda = totalVendas > 0 ? faturamentoHoje / totalVendas : 0;
        
        document.getElementById('todayRevenue').textContent = `R$ ${formatPrice(faturamentoHoje)}`;
        document.getElementById('todayChops').textContent = totalItens;
        document.getElementById('avgSale').textContent = `R$ ${formatPrice(mediaVenda)}`;
        document.getElementById('lowStock').textContent = estoqueBaixo;
        
        // Carregar vendas recentes
        await loadRecentSales();
        
        // Carregar produtos mais vendidos
        await loadTopProducts(stats?.produtosMaisVendidos || []);
        
        // Carregar estoque baixo
        await loadLowStockProducts();
        
    } catch (error) {
        console.error('Erro no dashboard:', error);
        showNotification('Erro ao carregar dashboard', 'error');
        
        // Fallback
        document.getElementById('todayRevenue').textContent = 'R$ 0,00';
        document.getElementById('todayChops').textContent = '0';
        document.getElementById('avgSale').textContent = 'R$ 0,00';
        document.getElementById('lowStock').textContent = '0';
        
        const recentSalesList = document.getElementById('recentSalesList');
        const topProductsList = document.getElementById('topProductsList');
        
        if (recentSalesList) {
            recentSalesList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar vendas</p>
                </div>
            `;
        }
        
        if (topProductsList) {
            topProductsList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar produtos</p>
                </div>
            `;
        }
    }
}

export async function loadRecentSales() {
    try {
        const recentSales = await neonAPI('get_vendas_recentes');
        const recentSalesList = document.getElementById('recentSalesList');
        
        if (!recentSales || recentSales.length === 0) {
            recentSalesList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-receipt"></i>
                    <p>Nenhuma venda registrada</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="sales-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Itens</th>
                        <th>Total</th>
                        <th>Pagamento</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        recentSales.forEach(venda => {
            const pagamentoClass = {
                'dinheiro': 'payment-dinheiro',
                'cartao': 'payment-cartao',
                'pix': 'payment-pix',
                'fiado': 'payment-pix'
            }[venda.pagamento] || '';
            
            html += `
                <tr>
                    <td>${venda.hora || '--:--'}</td>
                    <td>${venda.total_itens || 0} itens</td>
                    <td><strong>R$ ${formatPrice(venda.total)}</strong></td>
                    <td><span class="payment-badge ${pagamentoClass}">${(venda.pagamento || 'N/A').toUpperCase()}</span></td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
        recentSalesList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar vendas recentes:', error);
        const recentSalesList = document.getElementById('recentSalesList');
        recentSalesList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar vendas</p>
            </div>
        `;
    }
}

export async function loadTopProducts(produtosData) {
    const topProductsList = document.getElementById('topProductsList');
    
    if (!Array.isArray(produtosData) || produtosData.length === 0) {
        topProductsList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-chart-line"></i>
                <p>Sem dados de vendas hoje</p>
            </div>
        `;
        return;
    }
    
    const produtosComVendas = produtosData.filter(p => (p.vendas_hoje || 0) > 0);
    
    if (produtosComVendas.length === 0) {
        topProductsList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-chart-line"></i>
                <p>Sem dados de vendas hoje</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="top-products-list">';
    
    produtosComVendas.forEach((produto, index) => {
        const vendasCount = produto.vendas_hoje || 0;
        html += `
            <div class="top-product-item">
                <div class="top-product-emoji">${produto.emoji || '🍦'}</div>
                <div class="top-product-info">
                    <div class="top-product-name">${produto.nome}</div>
                    <div class="top-product-stats">
                        <span>${vendasCount} vendas</span>
                        <span>R$ ${formatPrice(produto.preco * vendasCount)}</span>
                    </div>
                </div>
                <div class="top-product-rank">${index + 1}</div>
            </div>
        `;
    });
    
    html += '</div>';
    topProductsList.innerHTML = html;
}

export async function loadLowStockProducts() {
    try {
        const todosProdutos = await neonAPI('get_produtos');
        const lowStockList = document.getElementById('lowStockList');
        const lowStockContainer = document.getElementById('lowStockContainer');
        
        if (!Array.isArray(todosProdutos)) {
            lowStockContainer.style.display = 'none';
            return;
        }
        
        const produtosBaixoEstoque = todosProdutos.filter(p => p.estoque < 10 && p.ativo);
        
        if (produtosBaixoEstoque.length === 0) {
            lowStockContainer.style.display = 'none';
            return;
        }
        
        lowStockContainer.style.display = 'block';
        let html = '<div class="low-stock-list">';
        
        produtosBaixoEstoque.slice(0, 6).forEach(produto => {
            html += `
                <div class="low-stock-item">
                    <div class="low-stock-emoji">${produto.emoji || '🍦'}</div>
                    <div class="low-stock-info">
                        <div class="low-stock-name">${produto.nome}</div>
                        <div class="low-stock-quantity">${produto.estoque} unidades restantes</div>
                    </div>
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        lowStockList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar estoque baixo:', error);
        document.getElementById('lowStockContainer').style.display = 'none';
    }
}

// Exportar módulo
export default {
    loadDashboard,
    loadRecentSales,
    loadTopProducts,
    loadLowStockProducts
};
