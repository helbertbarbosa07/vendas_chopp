/// ===== TOP 3 PRODUTOS MAIS VENDIDOS ===
function loadTopProdutos(produtos = [], vendas = []) {
    const lista = document.getElementById('topProductsList');

    if (!produtos.length || !vendas.length) {
        lista.innerHTML = '<p>Nenhum dado disponível</p>';
        return;
    }

    // Conta vendas por produto
    const contador = {};

    vendas.forEach(venda => {
        if (Array.isArray(venda.itens)) {
            venda.itens.forEach(item => {
                const id = item.produto_id;
                const qtd = item.quantidade || 1;
                contador[id] = (contador[id] || 0) + qtd;
            });
        }
    });

    // Junta com produtos
    const top3 = produtos
        .filter(p => p.ativo)
        .map(p => ({
            nome: p.nome,
            emoji: p.emoji || '🍦',
            vendidos: contador[p.id] || 0
        }))
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 3);

    if (!top3.length) {
        lista.innerHTML = '<p>Nenhuma venda registrada</p>';
        return;
    }

    let html = '<div class="top-products-list">';

    top3.forEach((p, index) => {
        html += `
        <div class="top-product-item">
            <div class="top-product-emoji">${p.emoji}</div>
            <div>
                <strong>${index + 1}º ${p.nome}</strong><br>
                ${p.vendidos} vendidos
            </div>
        </div>`;
    });

    lista.innerHTML = html + '</div>';
}

// ===== ESTOQUE BAIXO =====
async function loadEstoqueBaixo(produtosData = []) {
    const container = document.getElementById('lowStockContainer');
    const lista = document.getElementById('lowStockList');

    if (!container || !lista) return;

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
            <strong>${produto.nome}</strong><br>
            <span style="color:${produto.estoque <= 3 ? 'red' : 'orange'}">
                ${produto.estoque <= 0 ? 'ESGOTADO' : produto.estoque + ' unidades'}
            </span>
        </div>`;
    });

    lista.innerHTML = html + '</div>';
}

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

        const faturamentoHoje = vendasHoje.reduce((t, v) => t + (parseFloat(v.total) || 0), 0);
        const totalItensHoje = vendasHoje.reduce((t, v) => t + (parseInt(v.total_itens) || 1), 0);
        const totalVendasHoje = vendasHoje.length;
        const mediaPorVenda = totalVendasHoje ? faturamentoHoje / totalVendasHoje : 0;

        const estoqueBaixo = produtos.filter(p => p.ativo && p.estoque <= 10).length;

        document.getElementById('todayRevenue').textContent = `R$ ${formatPrice(faturamentoHoje)}`;
        document.getElementById('todayChops').textContent = totalItensHoje;
        document.getElementById('avgSale').textContent = `R$ ${formatPrice(mediaPorVenda)}`;
        document.getElementById('lowStock').textContent = estoqueBaixo;

        await loadUltimasVendas(vendas);
       loadTopProdutos(produtos, vendas);

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
    const lista = document.getElementById('recentSalesList');

    if (!vendasData.length) {
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

        if (venda.hora) hora = venda.hora;
        else if (venda.created_at) {
            hora = new Date(venda.created_at).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        const pagamento = venda.pagamento || 'dinheiro';

        html += `
        <tr>
            <td>${hora}</td>
            <td>${venda.total_itens || 1} itens</td>
            <td><strong>R$ ${formatPrice(venda.total || 0)}</strong></td>
            <td>
                <span class="payment-badge payment-${pagamento.toLowerCase()}">
                    ${pagamento}
                </span>
            </td>
        </tr>`;
    });

    lista.innerHTML = html + '</tbody></table></div>';
}


// ===== GRÁFICOS DIÁRIO + SEMANAL =====
async function loadGraficosReais(vendasHoje = [], vendasTodas = []) {
    if (charts.dailyChart) charts.dailyChart.destroy();
    if (charts.weeklyChart) charts.weeklyChart.destroy();

    const ctxDaily = document.getElementById('flavorsChart')?.getContext('2d');
    if (ctxDaily) {
        const horas = ['08','10','12','14','16','18','20','22'];
        const dados = horas.map(h =>
            vendasHoje
                .filter(v => (v.hora || '').startsWith(h))
                .reduce((s, v) => s + (parseFloat(v.total) || 0), 0)
        );

        charts.dailyChart = new Chart(ctxDaily, {
            type: 'bar',
            data: {
                labels: horas.map(h => `${h}h`),
                datasets: [{ label: 'Vendas do Dia (R$)', data: dados }]
            }
        });
    }

    const ctxWeekly = document.getElementById('weeklyChart')?.getContext('2d');
    if (ctxWeekly) {
        const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
        const semana = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const dadosSemana = semana.map(d =>
            vendasTodas
                .filter(v => (v.data || v.created_at || '').includes(d.toISOString().split('T')[0]))
                .reduce((s, v) => s + (parseFloat(v.total) || 0), 0)
        );

        charts.weeklyChart = new Chart(ctxWeekly, {
            type: 'line',
            data: {
                labels: semana.map(d => dias[d.getDay()]),
                datasets: [{ label: 'Semana (R$)', data: dadosSemana, fill: true }]
            }
        });
    }
}

// ===== AUTO UPDATE =====
setInterval(() => {
    if (document.querySelector('#dashboard')?.classList.contains('active')) {
        loadDashboard();
    }
}, 30000);
