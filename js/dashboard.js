// ===== DASHBOARD EM TEMPO REAL =====
async function loadDashboard() {
    try {
        showNotification('🔄 Carregando dashboard...', 'info');

        const [vendasAPI, produtosAPI] = await Promise.all([
            neonAPI('get_vendas_recentes').catch(() => []),
            neonAPI('get_produtos').catch(() => [])
        ]);

        vendas = Array.isArray(vendasAPI) ? vendasAPI : [];
        produtos = Array.isArray(produtosAPI) ? produtosAPI : [];

        if (!vendas.length && !produtos.length) return;

        const hoje = new Date().toISOString().split('T')[0];

        const vendasHoje = vendas.filter(v => {
            const dataVenda = v.data || v.created_at || '';
            return dataVenda.includes(hoje);
        });

        const faturamentoHoje = vendasHoje.reduce((total, venda) => {
            return total + (parseFloat(venda.total) || 0);
        }, 0);

        const totalItensHoje = vendasHoje.reduce((total, venda) => {
            return total + (parseInt(venda.total_itens) || 1);
        }, 0);

        const totalVendasHoje = vendasHoje.length;
        const mediaPorVenda = totalVendasHoje > 0
            ? faturamentoHoje / totalVendasHoje
            : 0;

        const estoqueBaixo = produtos.filter(p =>
            p.ativo && p.estoque <= 10
        ).length;

        document.getElementById('todayRevenue').textContent =
            `R$ ${formatPrice(faturamentoHoje)}`;
        document.getElementById('todayChops').textContent =
            totalItensHoje;
        document.getElementById('avgSale').textContent =
            `R$ ${formatPrice(mediaPorVenda)}`;
        document.getElementById('lowStock').textContent =
            estoqueBaixo;

        await loadUltimasVendas(vendas);
        await loadProdutosMaisVendidos(produtos);
        await loadEstoqueBaixo(produtos);
        await loadGraficosReais(vendasHoje, vendas);


        showNotification('✅ Dashboard atualizado!', 'success');

    } catch (error) {
        console.error('Erro no dashboard:', error);
        showNotification('❌ Erro no dashboard', 'error');
    }
}

// ===== ÚLTIMAS VENDAS =====
async function loadUltimasVendas(vendasData = []) {
    try {
        const lista = document.getElementById('recentSalesList');

        if (!Array.isArray(vendasData) || vendasData.length === 0) {
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
                    <th>Produtos</th>
                    <th>Valor</th>
                    <th>Pagamento</th>
                </tr>
            </thead>
            <tbody>`;

        vendasData.slice(0, 5).forEach(venda => {
            let hora = '--:--';

            if (venda.hora) {
                hora = venda.hora;
            } else if (venda.created_at) {
                hora = new Date(venda.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            const total = parseFloat(venda.total) || 0;
            const produtosCount = venda.total_itens || 1;
            const pagamento = venda.pagamento || 'dinheiro';
            const pagamentoClass = pagamento.toLowerCase();

            html += `
            <tr>
                <td>${hora}</td>
                <td>${produtosCount} itens</td>
                <td><strong>R$ ${formatPrice(total)}</strong></td>
                <td>
                    <span class="payment-badge payment-${pagamentoClass}">
                        ${pagamento}
                    </span>
                </td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        lista.innerHTML = html;

    } catch (error) {
        console.error('Erro últimas vendas:', error);
    }
}

// ===== PRODUTOS MAIS VENDIDOS =====
async function loadProdutosMaisVendidos(produtosData = []) {
    try {
        const lista = document.getElementById('topProductsList');

        const produtosOrdenados = produtosData
            .filter(p => p.ativo)
            .sort((a, b) => (b.total_vendido || 0) - (a.total_vendido || 0))
            .slice(0, 5);

        if (!produtosOrdenados.length) {
            lista.innerHTML = `
                <div style="text-align:center;padding:20px;color:var(--gray)">
                    <i class="fas fa-ban"></i>
                    <p>Nenhum produto ativo</p>
                </div>`;
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
            </div>`;
        });

        lista.innerHTML = html + '</div>';

    } catch (error) {
        console.error('Erro produtos mais vendidos:', error);
    }
}

// ===== ESTOQUE BAIXO =====
async function loadEstoqueBaixo(produtosData = []) {
    try {
        const container = document.getElementById('lowStockContainer');
        const lista = document.getElementById('lowStockList');

        const estoqueBaixo = produtosData.filter(p =>
            p.ativo && p.estoque <= 10
        );

        if (!estoqueBaixo.length) {
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
                        <span style="color:${produto.estoque <= 3 ? '#dc3545' : '#ff9800'}">
                            ${produto.estoque <= 0 ? 'ESGOTADO' : produto.estoque + ' unidades'}
                        </span>
                    </div>
                </div>
            </div>`;
        });

        lista.innerHTML = html + '</div>';

    } catch (error) {
        console.error('Erro estoque baixo:', error);
    }
}


// ===== GRÁFICOS DIÁRIO + SEMANAL =====
async function loadGraficosReais(vendasHoje = [], vendasTodas = []) {
    try {
        if (charts.dailyChart) charts.dailyChart.destroy();
        if (charts.weeklyChart) charts.weeklyChart.destroy();

        // ===== GRÁFICO DIÁRIO (HOJE) =====
        const ctxDaily = document.getElementById('flavorsChart')?.getContext('2d');
        if (ctxDaily) {
            const horas = ['08','10','12','14','16','18','20','22'];

            const vendasPorHora = horas.map(h =>
                vendasHoje
                    .filter(v => (v.hora || '').startsWith(h))
                    .reduce((s, v) => s + (parseFloat(v.total) || 0), 0)
            );

            charts.dailyChart = new Chart(ctxDaily, {
                type: 'bar',
                data: {
                    labels: horas.map(h => `${h}h`),
                    datasets: [{
                        label: 'Vendas do Dia (R$)',
                        data: vendasPorHora,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }

        // ===== GRÁFICO SEMANAL =====
        const ctxWeekly = document.getElementById('weeklyChart')?.getContext('2d');
        if (ctxWeekly) {
            const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

            const hoje = new Date();
            const semana = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(hoje.getDate() - i);
                semana.push(d);
            }

            const vendasSemana = semana.map(dia => {
                const dataStr = dia.toISOString().split('T')[0];

                return vendasTodas
                    .filter(v => {
                        const dataVenda = v.data || v.created_at || '';
                        return dataVenda.includes(dataStr);
                    })
                    .reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
            });

            charts.weeklyChart = new Chart(ctxWeekly, {
                type: 'line',
                data: {
                    labels: semana.map(d => diasSemana[d.getDay()]),
                    datasets: [{
                        label: 'Faturamento da Semana (R$)',
                        data: vendasSemana,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }

    } catch (error) {
        console.error('Erro gráficos diário/semanal:', error);
    }
}


// ===== AUTO UPDATE =====
setInterval(async () => {
    if (document.querySelector('#dashboard')?.classList.contains('active')) {
        await loadDashboard();
    }
}, 30000);
