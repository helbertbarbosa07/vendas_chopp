// ===== CONFIGURAÇÃO GLOBAL =====
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon';

// Variáveis globais compartilhadas
let produtos = [];
let vendas = [];
let fiados = [];
let carrinho = [];
let charts = {};
let isLoading = false;

// ===== FUNÇÕES UTILITÁRIAS GLOBAIS =====
function formatPrice(value) {
    if (value === undefined || value === null || value === '') return '0,00';
    const num = Number(value);
    return isNaN(num) ? '0,00' : num.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

function formatarData(dataString) {
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return 'Data inválida';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch (e) {
        return 'Data inválida';
    }
}

function showNotification(mensagem, tipo = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
        return;
    }
    
    notification.textContent = mensagem;
    notification.className = `notification ${tipo} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

async function neonAPI(action, data) {
    if (isLoading) {
        throw new Error('Aguarde a operação atual finalizar');
    }

    isLoading = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, data })
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error || 'Erro no servidor');
        }

        return json;

    } finally {
        isLoading = false;
    }
}

// ===== NAVEGAÇÃO =====
function navigateTo(pageId) {
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab) {
        tab.click();
    }
}

// ===== FUNÇÕES DE MODAL DE PRODUTO =====
function abrirModalProduto(produto = null) {
    try {
        const modal = document.getElementById('productModal');
        if (!modal) {
            showNotification('❌ Modal não encontrado', 'error');
            return;
        }
        
        const title = document.getElementById('modalTitle');
        
        if (produto) {
            // Modo edição
            title.textContent = 'Editar Produto';
            document.getElementById('productId').value = produto.id;
            document.getElementById('productName').value = produto.nome || '';
            document.getElementById('productDescription').value = produto.descricao || '';
            document.getElementById('productPrice').value = produto.preco || '';
            document.getElementById('productStock').value = produto.estoque || '';
            document.getElementById('productEmoji').value = produto.emoji || '🍦';
            document.getElementById('selectedEmoji').textContent = produto.emoji || '🍦';
            document.getElementById('productColor').value = produto.cor || '#36B5B0';
            document.getElementById('productActive').checked = produto.ativo !== false;
        } else {
            // Modo novo produto
            title.textContent = 'Novo Produto';
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('selectedEmoji').textContent = '🍦';
            document.getElementById('productEmoji').value = '🍦';
            document.getElementById('productColor').value = '#36B5B0';
            document.getElementById('productActive').checked = true;
        }
        
        modal.classList.add('active');
        
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        showNotification('❌ Erro ao abrir formulário', 'error');
    }
}

function fecharModalProduto() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function salvarProduto() {
    try {
        const produtoId = document.getElementById('productId').value;
        
        // Validar campos obrigatórios
        const nome = document.getElementById('productName').value.trim();
        const preco = parseFloat(document.getElementById('productPrice').value);
        const estoque = parseInt(document.getElementById('productStock').value);
        
        if (!nome) {
            showNotification('❌ Nome do produto é obrigatório', 'error');
            document.getElementById('productName').focus();
            return;
        }
        
        if (isNaN(preco) || preco <= 0) {
            showNotification('❌ Preço inválido. Use valores maiores que 0', 'error');
            document.getElementById('productPrice').focus();
            return;
        }
        
        if (isNaN(estoque) || estoque < 0) {
            showNotification('❌ Estoque inválido. Use valores positivos', 'error');
            document.getElementById('productStock').focus();
            return;
        }
        
        const produtoData = {
            nome: nome,
            descricao: document.getElementById('productDescription').value.trim(),
            preco: preco,
            estoque: estoque,
            emoji: document.getElementById('productEmoji').value || '🍦',
            cor: document.getElementById('productColor').value || '#36B5B0',
            ativo: document.getElementById('productActive').checked
        };
        
        showNotification('🔄 Salvando produto...', 'info');
        
        if (produtoId) {
            // Atualizar produto existente
            produtoData.id = parseInt(produtoId);
            await neonAPI('update_produto', produtoData);
            showNotification('✅ Produto atualizado com sucesso!', 'success');
        } else {
            // Criar novo produto
            await neonAPI('create_produto', produtoData);
            showNotification('✅ Produto criado com sucesso!', 'success');
        }
        
        // Fechar modal
        fecharModalProduto();
        
        // Recarregar produtos
        await loadAllProducts();
        
        // Recarregar produtos para venda se na página de vendas
        if (document.getElementById('vendas').classList.contains('active')) {
            await loadProductsForSale();
        }
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification(`❌ Erro ao salvar produto: ${error.message}`, 'error');
    }
}

function selecionarEmoji(emoji) {
    document.getElementById('selectedEmoji').textContent = emoji;
    document.getElementById('productEmoji').value = emoji;
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        showNotification('🔄 Carregando dashboard...', 'info');
        
        const data = await neonAPI('get_dashboard');
        
        if (!data) {
            showNotification('❌ Nenhum dado retornado do dashboard', 'error');
            return;
        }
        
        // Atualizar cards
        document.getElementById('totalVendasHoje').textContent = data.total_vendas_hoje || 0;
        document.getElementById('totalFiadosHoje').textContent = data.total_fiados_hoje || 0;
        document.getElementById('valorTotalHoje').textContent = `R$ ${formatPrice(data.valor_total_hoje || 0)}`;
        document.getElementById('produtosBaixoEstoque').textContent = data.produtos_baixo_estoque || 0;
        
        // Carregar produtos mais vendidos
        if (data.produtos_mais_vendidos) {
            renderProdutosMaisVendidos(data.produtos_mais_vendidos);
        }
        
        // Carregar últimas vendas
        if (data.ultimas_vendas) {
            renderUltimasVendas(data.ultimas_vendas);
        }
        
        showNotification('✅ Dashboard carregado', 'success');
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('❌ Erro ao carregar dashboard', 'error');
    }
}

function renderProdutosMaisVendidos(produtos) {
    const container = document.getElementById('produtosMaisVendidos');
    if (!container) return;
    
    if (!produtos || produtos.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum produto vendido ainda</p>';
        return;
    }
    
    container.innerHTML = produtos.map(produto => `
        <div class="produto-item">
            <div class="produto-emoji" style="background-color: ${produto.cor || '#36B5B0'}">
                ${produto.emoji || '🍦'}
            </div>
            <div class="produto-info">
                <h4>${produto.nome || 'Produto'}</h4>
                <p>${produto.total_vendido || 0} vendas</p>
            </div>
            <div class="produto-valor">
                R$ ${formatPrice(produto.total_valor || 0)}
            </div>
        </div>
    `).join('');
}

function renderUltimasVendas(vendas) {
    const container = document.getElementById('ultimasVendas');
    if (!container) return;
    
    if (!vendas || vendas.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma venda registrada</p>';
        return;
    }
    
    container.innerHTML = vendas.map(venda => `
        <div class="venda-item">
            <div class="venda-emoji" style="background-color: ${venda.cor || '#36B5B0'}">
                ${venda.emoji || '🍦'}
            </div>
            <div class="venda-info">
                <h4>${venda.nome_produto || 'Produto'}</h4>
                <p>${formatarData(venda.data_venda)}</p>
            </div>
            <div class="venda-valor">
                ${venda.quantidade}x - R$ ${formatPrice(venda.valor_total || 0)}
            </div>
        </div>
    `).join('');
}

// ===== PRODUTOS =====
async function loadAllProducts() {
    try {
        showNotification('🔄 Carregando produtos...', 'info');
        
        const response = await neonAPI('get_produtos');
        produtos = response.data || [];
        
        renderProdutosTable(produtos);
        showNotification(`✅ ${produtos.length} produtos carregados`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showNotification('❌ Erro ao carregar produtos', 'error');
        renderProdutosTable([]);
    }
}

function renderProdutosTable(produtos) {
    const tbody = document.getElementById('produtosTableBody');
    if (!tbody) return;
    
    if (!produtos || produtos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = produtos.map(produto => `
        <tr>
            <td>
                <div class="produto-emoji-small" style="background-color: ${produto.cor || '#36B5B0'}">
                    ${produto.emoji || '🍦'}
                </div>
            </td>
            <td>${produto.nome || 'Sem nome'}</td>
            <td>${produto.descricao || '-'}</td>
            <td>R$ ${formatPrice(produto.preco || 0)}</td>
            <td>
                <span class="stock-badge ${produto.estoque <= 5 ? 'low' : ''}">
                    ${produto.estoque || 0}
                </span>
            </td>
            <td>
                <span class="status-badge ${produto.ativo ? 'active' : 'inactive'}">
                    ${produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn-icon edit" onclick="abrirModalProduto(${JSON.stringify(produto).replace(/"/g, '&quot;')})" title="Editar">
                    ✏️
                </button>
                <button class="btn-icon delete" onclick="confirmarExclusaoProduto(${produto.id})" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

async function confirmarExclusaoProduto(produtoId) {
    try {
        if (!confirm('Tem certeza que deseja excluir este produto?\n\nEsta ação não poderá ser desfeita.')) {
            return;
        }
        
        showNotification('🔄 Excluindo produto...', 'info');
        await neonAPI('delete_produto', { id: produtoId });
        
        showNotification('✅ Produto excluído com sucesso', 'success');
        await loadAllProducts();
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification(`❌ Erro ao excluir produto: ${error.message}`, 'error');
    }
}

// ===== VENDAS =====
async function loadProductsForSale() {
    try {
        showNotification('🔄 Carregando produtos para venda...', 'info');
        
        const response = await neonAPI('get_produtos_ativos');
        const produtosAtivos = response.data || [];
        
        renderProductsForSale(produtosAtivos);
        updateCarrinhoDisplay();
        
        showNotification(`✅ ${produtosAtivos.length} produtos disponíveis`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar produtos para venda:', error);
        showNotification('❌ Erro ao carregar produtos', 'error');
        renderProductsForSale([]);
    }
}

function renderProductsForSale(produtos) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    if (!produtos || produtos.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <p>Nenhum produto ativo disponível.</p>
                <p>Cadastre produtos na aba "Produtos" e marque-os como ativos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = produtos.map(produto => `
        <div class="product-card" onclick="adicionarAoCarrinho(${produto.id})">
            <div class="product-emoji" style="background-color: ${produto.cor || '#36B5B0'}">
                ${produto.emoji || '🍦'}
            </div>
            <div class="product-info">
                <h3>${produto.nome || 'Produto'}</h3>
                <p class="product-desc">${produto.descricao || ''}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${formatPrice(produto.preco || 0)}</span>
                    <span class="product-stock">Estoque: ${produto.estoque || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function adicionarAoCarrinho(produtoId) {
    // Primeiro, buscar o produto atualizado na lista de produtos
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        showNotification('❌ Produto não encontrado', 'error');
        return;
    }
    
    if (produto.estoque <= 0) {
        showNotification('❌ Produto sem estoque', 'error');
        return;
    }
    
    // Verificar se já está no carrinho
    const itemIndex = carrinho.findIndex(item => item.produtoId === produtoId);
    
    if (itemIndex >= 0) {
        // Verificar estoque
        const produtoAtual = produtos.find(p => p.id === produtoId);
        if (!produtoAtual || carrinho[itemIndex].quantidade >= produtoAtual.estoque) {
            showNotification('❌ Estoque insuficiente', 'error');
            return;
        }
        carrinho[itemIndex].quantidade += 1;
    } else {
        carrinho.push({
            produtoId: produtoId,
            nome: produto.nome,
            preco: produto.preco,
            emoji: produto.emoji,
            cor: produto.cor,
            quantidade: 1
        });
    }
    
    updateCarrinhoDisplay();
    showNotification(`✅ ${produto.nome} adicionado ao carrinho`, 'success');
}

function updateCarrinhoDisplay() {
    const carrinhoContainer = document.getElementById('carrinhoItems');
    const totalElement = document.getElementById('totalCarrinho');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (carrinho.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        if (totalElement) totalElement.textContent = 'R$ 0,00';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    
    // Renderizar itens do carrinho
    if (carrinhoContainer) {
        carrinhoContainer.innerHTML = carrinho.map((item, index) => {
            const produto = produtos.find(p => p.id === item.produtoId);
            const estoqueDisponivel = produto ? produto.estoque : 0;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-emoji" style="background-color: ${item.cor}">
                        ${item.emoji}
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p>R$ ${formatPrice(item.preco)} cada</p>
                        <small>Estoque disponível: ${estoqueDisponivel}</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn-qtd minus" onclick="alterarQuantidade(${index}, -1)" ${item.quantidade <= 1 ? 'disabled' : ''}>-</button>
                        <span class="cart-item-qtd">${item.quantidade}</span>
                        <button class="btn-qtd plus" onclick="alterarQuantidade(${index}, 1)" ${item.quantidade >= estoqueDisponivel ? 'disabled' : ''}>+</button>
                        <button class="btn-remove" onclick="removerDoCarrinho(${index})">🗑️</button>
                    </div>
                    <div class="cart-item-total">
                        R$ ${formatPrice(item.preco * item.quantidade)}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Calcular total
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    if (totalElement) {
        totalElement.textContent = `R$ ${formatPrice(total)}`;
    }
}

function alterarQuantidade(index, change) {
    if (index < 0 || index >= carrinho.length) return;
    
    const produto = produtos.find(p => p.id === carrinho[index].produtoId);
    if (!produto) {
        showNotification('❌ Produto não encontrado', 'error');
        return;
    }
    
    const novaQuantidade = carrinho[index].quantidade + change;
    
    if (novaQuantidade <= 0) {
        removerDoCarrinho(index);
        return;
    }
    
    if (novaQuantidade > produto.estoque) {
        showNotification('❌ Estoque insuficiente', 'error');
        return;
    }
    
    carrinho[index].quantidade = novaQuantidade;
    updateCarrinhoDisplay();
}

function removerDoCarrinho(index) {
    if (index >= 0 && index < carrinho.length) {
        const nomeProduto = carrinho[index].nome;
        carrinho.splice(index, 1);
        updateCarrinhoDisplay();
        showNotification(`🗑️ ${nomeProduto} removido do carrinho`, 'info');
    }
}

function limparCarrinho() {
    carrinho = [];
    updateCarrinhoDisplay();
    showNotification('🗑️ Carrinho limpo', 'info');
}

async function finalizarVenda() {
    try {
        if (carrinho.length === 0) {
            showNotification('❌ Carrinho vazio', 'error');
            return;
        }
        
        const isFiado = document.getElementById('fiadoToggle')?.checked || false;
        
        if (isFiado) {
            const cliente = document.getElementById('clienteName')?.value.trim();
            if (!cliente) {
                showNotification('❌ Informe o nome do cliente para fiado', 'error');
                document.getElementById('clienteName')?.focus();
                return;
            }
            
            // Criar fiado
            const fiadoData = {
                nome_cliente: cliente,
                produtos: carrinho.map(item => `${item.quantidade}x ${item.nome}`).join(', '),
                valor_total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
                data_fiado: new Date().toISOString(),
                pago: false
            };
            
            showNotification('🔄 Registrando fiado...', 'info');
            await neonAPI('create_fiado', fiadoData);
            showNotification('✅ Fiado registrado com sucesso!', 'success');
            
        } else {
            // Registrar venda normal
            const vendaData = {
                produtos: carrinho.map(item => ({
                    produto_id: item.produtoId,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco
                })),
                valor_total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
                data_venda: new Date().toISOString()
            };
            
            showNotification('🔄 Finalizando venda...', 'info');
            await neonAPI('create_venda', vendaData);
            showNotification('✅ Venda realizada com sucesso!', 'success');
        }
        
        // Limpar carrinho
        carrinho = [];
        updateCarrinhoDisplay();
        
        // Recarregar dados
        await loadAllProducts();
        await loadProductsForSale();
        await loadDashboard();
        
        // Limpar campo do cliente
        if (document.getElementById('clienteName')) {
            document.getElementById('clienteName').value = '';
        }
        if (document.getElementById('fiadoToggle')) {
            document.getElementById('fiadoToggle').checked = false;
        }
        
    } catch (error) {
        console.error('Erro ao finalizar venda:', error);
        showNotification(`❌ Erro ao finalizar venda: ${error.message}`, 'error');
    }
}

// ===== FIADOS =====
async function carregarFiados() {
    try {
        showNotification('🔄 Carregando fiados...', 'info');
        
        const response = await neonAPI('get_fiados');
        fiados = response.data || [];
        
        renderFiadosTable(fiados);
        showNotification(`✅ ${fiados.length} fiados carregados`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar fiados:', error);
        showNotification('❌ Erro ao carregar fiados', 'error');
        renderFiadosTable([]);
    }
}

function renderFiadosTable(fiados) {
    const tbody = document.getElementById('fiadosTableBody');
    if (!tbody) return;
    
    if (!fiados || fiados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    Nenhum fiado registrado.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = fiados.map(fiado => `
        <tr>
            <td>
                <div class="cliente-avatar" style="background-color: ${fiado.cor || '#36B5B0'}">
                    ${fiado.nome_cliente?.charAt(0) || '?'}
                </div>
            </td>
            <td>${fiado.nome_cliente || 'Cliente não identificado'}</td>
            <td>${fiado.produtos || '-'}</td>
            <td>R$ ${formatPrice(fiado.valor_total || 0)}</td>
            <td>${formatarData(fiado.data_fiado)}</td>
            <td>
                <span class="status-badge ${fiado.pago ? 'active' : 'inactive'}">
                    ${fiado.pago ? 'Pago' : 'Pendente'}
                </span>
            </td>
            <td>
                ${!fiado.pago ? `
                    <button class="btn-icon confirm" onclick="marcarFiadoComoPago(${fiado.id})" title="Marcar como pago">
                        💰
                    </button>
                ` : ''}
                <button class="btn-icon delete" onclick="excluirFiado(${fiado.id})" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

async function marcarFiadoComoPago(fiadoId) {
    try {
        if (!confirm('Deseja marcar este fiado como pago?')) return;
        
        showNotification('🔄 Marcando como pago...', 'info');
        await neonAPI('update_fiado_pago', { id: fiadoId });
        
        showNotification('✅ Fiado marcado como pago', 'success');
        await carregarFiados();
        await loadDashboard();
        
    } catch (error) {
        console.error('Erro ao marcar fiado como pago:', error);
        showNotification('❌ Erro ao atualizar fiado', 'error');
    }
}

async function excluirFiado(fiadoId) {
    try {
        if (!confirm('Tem certeza que deseja excluir este fiado?')) return;
        
        showNotification('🔄 Excluindo fiado...', 'info');
        await neonAPI('delete_fiado', { id: fiadoId });
        
        showNotification('✅ Fiado excluído', 'success');
        await carregarFiados();
        
    } catch (error) {
        console.error('Erro ao excluir fiado:', error);
        showNotification('❌ Erro ao excluir fiado', 'error');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Sistema Chop Manager PRO iniciando...');
    
    // Configurar eventos do modal de produto
    document.getElementById('closeModal')?.addEventListener('click', fecharModalProduto);
    document.getElementById('cancelModal')?.addEventListener('click', fecharModalProduto);
    document.getElementById('saveProduct')?.addEventListener('click', salvarProduto);
    
    // Fechar modal ao clicar fora
    document.getElementById('productModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModalProduto();
        }
    });
    
    // Seletor de emoji
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        const emojis = ['🍦', '🍨', '🍧', '🎂', '🍰', '🧁', '🍩', '🍪', '🥤', '☕', '🥛', '🧃'];
        emojiPicker.innerHTML = emojis.map(emoji => `
            <span class="emoji-option" onclick="selecionarEmoji('${emoji}')">${emoji}</span>
        `).join('');
    }
    
    // Configurar navegação
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            const pageId = this.dataset.page;
            
            // Atualizar tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar página correta
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Carregar dados da página específica
                try {
                    if (pageId === 'dashboard') {
                        await loadDashboard();
                    } else if (pageId === 'vendas') {
                        await loadProductsForSale();
                    } else if (pageId === 'produtos') {
                        await loadAllProducts();
                    } else if (pageId === 'fiados') {
                        await carregarFiados();
                    }
                } catch (error) {
                    console.error(`Erro ao carregar página ${pageId}:`, error);
                    showNotification(`❌ Erro ao carregar ${pageId}`, 'error');
                }
            }
        });
    });
    
    // Configurar eventos dos botões de venda
    document.getElementById('limparCarrinhoBtn')?.addEventListener('click', limparCarrinho);
    document.getElementById('finalizarVendaBtn')?.addEventListener('click', finalizarVenda);
    
    // Testar conexão e carregar dados iniciais
    try {
        showNotification('🔌 Conectando ao servidor...', 'info');
        
        const response = await neonAPI('get_produtos');
        produtos = response.data || [];
        
        console.log(`📦 ${produtos.length} produtos carregados`);
        
        // Ativar dashboard inicial
        const dashboardTab = document.querySelector('.nav-tab[data-page="dashboard"]');
        if (dashboardTab) {
            dashboardTab.click();
        } else {
            // Fallback: carregar dashboard diretamente
            await loadDashboard();
        }
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showNotification('⚠️ Erro ao conectar com o servidor. Verifique sua conexão.', 'warning');
        
        // Tentar carregar interface mesmo com erro
        const dashboardTab = document.querySelector('.nav-tab[data-page="dashboard"]');
        if (dashboardTab) {
            dashboardTab.click();
        }
    }
});

// ===== EXPORTAR FUNÇÕES PARA ESCOPO GLOBAL =====
window.abrirModalProduto = abrirModalProduto;
window.fecharModalProduto = fecharModalProduto;
window.salvarProduto = salvarProduto;
window.selecionarEmoji = selecionarEmoji;
window.navigateTo = navigateTo;
window.formatPrice = formatPrice;
window.formatarData = formatarData;
window.showNotification = showNotification;
window.neonAPI = neonAPI;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.removerDoCarrinho = removerDoCarrinho;
window.limparCarrinho = limparCarrinho;
window.finalizarVenda = finalizarVenda;
window.confirmarExclusaoProduto = confirmarExclusaoProduto;
window.marcarFiadoComoPago = marcarFiadoComoPago;
window.excluirFiado = excluirFiado;
