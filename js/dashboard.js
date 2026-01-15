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
        
        // Carregar gráfico de vendas mensais
        await loadVendasMensaisChart();
        
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
        const cor = produto.cor || '#36B5B0';
        
        html += `
        <div class="top-product-item">
            <div class="top-product-emoji" style="color: ${cor}; font-size: 24px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${cor}20; margin-right: 15px;">
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

// ===== GRÁFICO DE VENDAS MENSAL =====
async function loadVendasMensaisChart() {
    try {
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        
        // Meses do ano
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        // Inicializar array com zeros
        const vendasPorMes = new Array(12).fill(0);
        
        // Buscar todas as vendas (em um sistema real, teríamos uma API específica)
        const response = await neonAPI('get_relatorio_completo');
        const todasVendas = response.data?.vendasRecentes || [];
        
        // Filtrar vendas do ano atual e somar por mês
        todasVendas.forEach(venda => {
            if (venda.data) {
                try {
                    const dataVenda = new Date(venda.data);
                    if (dataVenda.getFullYear() === anoAtual) {
                        const mes = dataVenda.getMonth(); // 0-11
                        vendasPorMes[mes] += parseFloat(venda.total) || 0;
                    }
                } catch (e) {
                    console.warn('Data de venda inválida:', venda.data);
                }
            }
        });
        
        // Criar ou atualizar gráfico
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;
        
        // Destruir gráfico anterior se existir
        if (window.monthlyChart instanceof Chart) {
            window.monthlyChart.destroy();
        }
        
        // Cores para o gráfico
        const cores = Array.from({length: 12}, (_, i) => {
            const hue = (i * 30) % 360;
            return `hsla(${hue}, 70%, 60%, 0.7)`;
        });
        
        // Criar novo gráfico
        window.monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: `Vendas ${anoAtual} (R$)`,
                    data: vendasPorMes,
                    backgroundColor: cores,
                    borderColor: cores.map(cor => cor.replace('0.7', '1')),
                    borderWidth: 1,
                    borderRadius: 5,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `R$ ${formatPrice(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + formatPrice(value);
                            },
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        title: {
                            display: true,
                            text: 'Valor (R$)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar gráfico mensal:', error);
        const ctx = document.getElementById('monthlyChart');
        if (ctx) {
            const parent = ctx.parentElement;
            parent.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar gráfico de vendas</p>
                    <button onclick="loadVendasMensaisChart()" style="margin-top: 10px; padding: 8px 15px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }
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
            
            // Definir cor do badge
            let badgeClass = 'payment-badge';
            if (pagamento === 'dinheiro') badgeClass += ' payment-dinheiro';
            else if (pagamento === 'cartao') badgeClass += ' payment-cartao';
            else if (pagamento === 'pix') badgeClass += ' payment-pix';
            else badgeClass += ' payment-dinheiro';
            
            html += `
            <tr>
                <td>${hora}</td>
                <td>${totalItens} itens</td>
                <td><strong>R$ ${formatPrice(venda.total || 0)}</strong></td>
                <td>
                    <span class="${badgeClass}">
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
            const statusColor = produto.estoque <= 3 ? '#dc3545' : '#fd7e14';
            const statusText = produto.estoque <= 3 ? 'CRÍTICO' : 'BAIXO';
            const cor = produto.cor || '#36B5B0';
            
            html += `
            <div class="low-stock-item">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <span style="font-size: 20px; color: ${cor};">${produto.emoji || '📦'}</span>
                    <strong>${produto.nome}</strong>
                </div>
                <span style="color:${statusColor}; font-weight: bold; font-size: 12px;">
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

// ===== ATUALIZAÇÃO AUTOMÁTICA =====
setInterval(() => {
    if (document.querySelector('#dashboard')?.classList.contains('active')) {
        loadDashboard();
    }
}, 30000); // Atualiza a cada 30 segundos

// Exportar funções
window.loadDashboard = loadDashboard;
window.loadUltimasVendas = loadUltimasVendas;
window.loadEstoqueBaixo = loadEstoqueBaixo;
window.loadVendasMensaisChart = loadVendasMensaisChart;
