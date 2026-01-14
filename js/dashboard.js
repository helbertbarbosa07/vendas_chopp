// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        showNotification('🔄 Carregando dashboard...', 'info');
        
        // Carregar dados do dashboard
        const data = await neonAPI('get_dashboard_stats');
        const dashboardData = data.data || {};
        
        // Atualizar cards do dashboard
        if (document.getElementById('todayRevenue')) {
            document.getElementById('todayRevenue').textContent = `R$ ${formatPrice(dashboardData.faturamentoHoje || 0)}`;
        }
        
        if (document.getElementById('todayChops')) {
            document.getElementById('todayChops').textContent = dashboardData.totalItens || 0;
        }
        
        if (document.getElementById('avgSale')) {
            const totalVendas = dashboardData.totalVendas || 1;
            const faturamento = dashboardData.faturamentoHoje || 0;
            const media = totalVendas > 0 ? faturamento / totalVendas : 0;
            document.getElementById('avgSale').textContent = `R$ ${formatPrice(media)}`;
        }
        
        if (document.getElementById('lowStock')) {
            document.getElementById('lowStock').textContent = dashboardData.estoqueBaixo || 0;
        }
        
        // Carregar produtos mais vendidos
        if (dashboardData.produtosMaisVendidos) {
            renderProdutosMaisVendidos(dashboardData.produtosMaisVendidos);
        }
        
        // Carregar últimas vendas
        await loadUltimasVendas();
        
        // Atualizar tempo real
        updateDateTime();
        
        // Carregar estoque baixo
        await loadEstoqueBaixo();
        
        showNotification('✅ Dashboard atualizado!', 'success');
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('❌ Erro ao carregar dashboard', 'error');
    }
}

function renderProdutosMaisVendidos(produtos) {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    if (!produtos || produtos.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum produto vendido ainda</p>';
        return;
    }
    
    let html = '<div class="top-products-list">';
    
    produtos.forEach((produto, index) => {
        const vendasHoje = produto.vendas_hoje || 0;
        const totalValor = vendasHoje * (produto.preco || 0);
        
        html += `
        <div class="top-product-item">
            <div class="top-product-emoji" style="background-color: ${produto.cor || '#36B5B0'}">
                ${produto.emoji || '🍦'}
            </div>
            <div style="flex: 1;">
                <strong>${index + 1}º ${produto.nome}</strong><br>
                <span style="font-size: 12px; color: #666;">
                    ${vendasHoje} vendas • R$ ${formatPrice(totalValor)}
                </span>
            </div>
        </div>`;
    });
    
    container.innerHTML = html + '</div>';
}

// ===== ÚLTIMAS VENDAS =====
async function loadUltimasVendas() {
    const lista = document.getElementById('recentSalesList');
    if (!lista) return;
    
    try {
        const response = await neonAPI('get_vendas_recentes');
        const vendasHoje = response.data || [];
        
        if (!vendasHoje || vendasHoje.length === 0) {
            lista.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Nenhuma venda recente</p>
                </div>`;
            return;
        }
        
        let html = `
        <div style="overflow-x:auto">
        <table class="sales-table">
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Itens</th>
                    <th>Valor</th>
                    <th>Pagamento</th>
                </tr>
            </thead>
            <tbody>`;
        
        vendasHoje.slice(0, 5).forEach(venda => {
            let hora = '--:--';
            
            if (venda.hora) {
                hora = venda.hora;
            } else if (venda.created_at) {
                hora = new Date(venda.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            const pagamento = venda.pagamento || 'dinheiro';
            const totalItens = venda.total_itens || venda.total_unidades || 1;
            
            html += `
            <tr>
                <td>${hora}</td>
                <td>${totalItens} itens</td>
                <td><strong>R$ ${formatPrice(venda.total || 0)}</strong></td>
                <td>
                    <span class="payment-badge payment-${pagamento.toLowerCase()}">
                        ${pagamento}
                    </span>
                </td>
            </tr>`;
        });
        
        lista.innerHTML = html + '</tbody></table></div>';
        
    } catch (error) {
        console.error('Erro ao carregar últimas vendas:', error);
        lista.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar vendas</p>
            </div>`;
    }
}

// ===== ESTOQUE BAIXO =====
async function loadEstoqueBaixo() {
    const container = document.getElementById('lowStockContainer');
    const lista = document.getElementById('lowStockList');
    
    if (!container || !lista) return;
    
    try {
        // Buscar produtos com estoque baixo
        if (produtos.length === 0) {
            const response = await neonAPI('get_produtos');
            produtos = response.data || [];
        }
        
        const estoqueBaixo = produtos.filter(p => 
            p.ativo && p.estoque > 0 && p.estoque <= 10
        );
        
        if (!estoqueBaixo.length) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        
        let html = '<div class="low-stock-list">';
        
        estoqueBaixo.slice(0, 6).forEach(produto => {
            const statusColor = produto.estoque <= 3 ? 'red' : 'orange';
            const statusText = produto.estoque <= 3 ? 'CRÍTICO' : 'BAIXO';
            
            html += `
            <div class="low-stock-item">
                <strong>${produto.nome}</strong><br>
                <span style="color:${statusColor}; font-weight: bold;">
                    ${produto.estoque} unidades (${statusText})
                </span>
            </div>`;
        });
        
        lista.innerHTML = html + '</div>';
        
    } catch (error) {
        console.error('Erro ao carregar estoque baixo:', error);
        container.style.display = 'none';
    }
}

// ===== AUTO UPDATE =====
setInterval(() => {
    if (document.querySelector('#dashboard')?.classList.contains('active')) {
        loadDashboard();
    }
}, 30000);

// Exportar funções
window.loadDashboard = loadDashboard;
window.loadUltimasVendas = loadUltimasVendas;
window.loadEstoqueBaixo = loadEstoqueBaixo;
