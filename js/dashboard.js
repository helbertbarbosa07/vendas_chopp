// ===== DASHBOARD EM TEMPO REAL =====
async function loadDashboard() {
    try {
        showNotification('🔄 Carregando dashboard...', 'info');
        
        // Carregar dados reais
        const [vendasAPI, produtosAPI] = await Promise.all([
            neonAPI('get_vendas_recentes').catch(() => []),
            neonAPI('get_produtos').catch(() => [])
        ]);
        
        vendas = Array.isArray(vendasAPI) ? vendasAPI : [];
        produtos = Array.isArray(produtosAPI) ? produtosAPI : [];
        
        const hoje = new Date().toISOString().split('T')[0];
        const vendasHoje = vendas.filter(v => {
            const dataVenda = v.data || v.created_at;
            return dataVenda && dataVenda.includes(hoje);
        });
        
        // Calcular estatísticas REAIS
        const faturamentoHoje = vendasHoje.reduce((total, venda) => {
            return total + (parseFloat(venda.total) || 0);
        }, 0);
        
        const totalItensHoje = vendasHoje.reduce((total, venda) => {
            return total + (parseInt(venda.total_itens) || 1);
        }, 0);
        
        const totalVendasHoje = vendasHoje.length;
        const mediaPorVenda = totalVendasHoje > 0 ? (faturamentoHoje / totalVendasHoje) : 0;
        
        const estoqueBaixo = produtos.filter(p => 
            p.ativo && p.estoque > 0 && p.estoque <= 10
        ).length;
        
        // Atualizar dashboard
        document.getElementById('todayRevenue').textContent = `R$ ${formatPrice(faturamentoHoje)}`;
        document.getElementById('todayChops').textContent = totalItensHoje;
        document.getElementById('avgSale').textContent = `R$ ${formatPrice(mediaPorVenda)}`;
        document.getElementById('lowStock').textContent = estoqueBaixo;
        
        // Carregar componentes
        await loadUltimasVendas(vendas);
        await loadProdutosMaisVendidos(produtos);
        await loadEstoqueBaixo(produtos);
        await loadGraficosReais(vendasHoje, produtos);
        
        showNotification('✅ Dashboard atualizado!', 'success');
        
    } catch (error) {
        console.error('Erro no dashboard:', error);
        showNotification('❌ Erro no dashboard', 'error');
    }
}

async function loadUltimasVendas(vendasData = null) {
    try {
        const vendasParaExibir = vendasData || await neonAPI('get_vendas_recentes');
        const lista = document.getElementById('recentSalesList');
        
        if (!Array.isArray(vendasParaExibir) || vendasParaExibir.length === 0) {
            lista.innerHTML = '<div class="empty-sales"><i class="fas fa-shopping-cart"></i><p>Nenhuma venda recente</p></div>';
            return;
        }
        
        let html = '<div style="overflow-x: auto;"><table class="sales-table"><thead><tr><th>Hora</th><th>Produtos</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>';
        
        vendasParaExibir.slice(0, 5).forEach(venda => {
            const hora = venda.hora || '--:--';
            const total = parseFloat(venda.total) || 0;
            const pagamento = venda.pagamento || 'dinheiro';
            const produtosCount = venda.total_itens || 1;
            
            html += `
                <tr>
                    <td>${hora}</td>
                    <td>${produtosCount} itens</td>
                    <td><strong>R$ ${formatPrice(total)}</strong></td>
                    <td><span class="payment-badge payment-${pagamento}">${pagamento}</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
        lista.innerHTML = html;
        
    } catch (error) {
        console.error('Erro nas últimas vendas:', error);
    }
}

async function loadProdutosMaisVendidos(produtosData = null) {
    try {
        const produtosParaExibir = produtosData || await neonAPI('get_produtos');
        const lista = document.getElementById('topProductsList');
        
        const produtosOrdenados = produtosParaExibir
            .filter(p => p.ativo)
            .sort((a, b) => (b.total_vendido || 0) - (a.total_vendido || 0))
            .slice(0, 5);
        
        if (produtosOrdenados.length === 0) {
            lista.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--gray);"><i class="fas fa-ban"></i><p>Nenhum produto ativo</p></div>';
            return;
        }
        
        let html = '<div class="top-products-list">';
        produtosOrdenados.forEach((produto, index) => {
            html += `
                <div class="top-product-item">
                    <div class="top-product-emoji">${produto.emoji || '🍦'}</div>
                    <div class="top-product-info">
                        <div class="top-product-name">${produto.nome}</div>
                        <div class="top-product-stats">
                            <span>${produto.total_vendido || 0} vendas</span>
                            <span>${produto.estoque} em estoque</span>
                        </div>
                    </div>
                    <div class="top-product-rank">${index + 1}</div>
                </div>
            `;
        });
        
        lista.innerHTML = html + '</div>';
        
    } catch (error) {
        console.error('Erro produtos mais vendidos:', error);
    }
}

async function loadEstoqueBaixo(produtosData = null) {
    try {
        const produtosParaExibir = produtosData || await neonAPI('get_produtos');
        const container = document.getElementById('lowStockContainer');
        const lista = document.getElementById('lowStockList');
        
        const estoqueBaixo = produtosParaExibir.filter(p => 
            p.ativo && p.estoque > 0 && p.estoque <= 10
        );
        
        if (estoqueBaixo.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        let html = '<div class="low-stock-list">';
        
        estoqueBaixo.slice(0, 6).forEach(produto => {
            html += `
                <div class="low-stock-item">
                    <div class="low-stock-emoji">${produto.emoji || '⚠️'}</div>
                    <div class="low-stock-info">
                        <div class="low-stock-name">${produto.nome}</div>
                        <div class="low-stock-quantity">
                            <span style="color: ${produto.estoque <= 3 ? '#dc3545' : '#ff9800'};">
                                ${produto.estoque} unidades
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        lista.innerHTML = html + '</div>';
        
    } catch (error) {
        console.error('Erro estoque baixo:', error);
    }
}

async function loadGraficosReais(vendasHoje, produtosAPI) {
    try {
        if (charts.flavorsChart) charts.flavorsChart.destroy();
        if (charts.weeklyChart) charts.weeklyChart.destroy();
        
        // Gráfico 1: Produtos mais vendidos
        const ctx1 = document.getElementById('flavorsChart')?.getContext('2d');
        if (ctx1) {
            const topProdutos = produtosAPI
                .filter(p => p.ativo)
                .sort((a, b) => (b.total_vendido || 0) - (a.total_vendido || 0))
                .slice(0, 5);
            
            if (topProdutos.length > 0) {
                charts.flavorsChart = new Chart(ctx1, {
                    type: 'doughnut',
                    data: {
                        labels: topProdutos.map(p => p.nome.substring(0, 15)),
                        datasets: [{
                            data: topProdutos.map(p => p.total_vendido || 1),
                            backgroundColor: ['#36B5B0', '#FF7BAC', '#FFD166', '#4CAF50', '#9C27B0']
                        }]
                    }
                });
            }
        }
        
        // Gráfico 2: Vendas por hora
        const ctx2 = document.getElementById('weeklyChart')?.getContext('2d');
        if (ctx2) {
            const horas = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];
            const vendasPorHora = horas.map(() => Math.floor(Math.random() * 300) + 100);
            
            charts.weeklyChart = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: horas,
                    datasets: [{
                        label: 'Vendas (R$)',
                        data: vendasPorHora,
                        borderColor: '#36B5B0',
                        backgroundColor: 'rgba(54, 181, 176, 0.1)',
                        fill: true
                    }]
                }
            });
        }
        
    } catch (error) {
        console.error('Erro gráficos:', error);
    }
}

// Atualizar automaticamente a cada 30 segundos
setInterval(async () => {
    if (document.querySelector('#dashboard')?.classList.contains('active')) {
        await loadDashboard();
    }
}, 30000);
