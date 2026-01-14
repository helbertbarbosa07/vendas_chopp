// ===== VENDAS =====
async function loadProductsForSale() {
    try {
        showNotification('🔄 Carregando produtos para venda...', 'info');
        
        // Carregar produtos se ainda não carregados
        if (produtos.length === 0) {
            const response = await neonAPI('get_produtos');
            produtos = response.data || [];
        }
        
        const produtosAtivos = produtos.filter(p => p.ativo && p.estoque > 0);
        
        renderProductsForSale(produtosAtivos);
        updateCartDisplay();
        
        showNotification(`✅ ${produtosAtivos.length} produtos disponíveis`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar produtos para venda:', error);
        showNotification('❌ Erro ao carregar produtos', 'error');
        renderProductsForSale([]);
    }
}

function renderProductsForSale(produtosData) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    if (!produtosData || produtosData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--warning); grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Nenhum produto ativo com estoque</p>
                <button onclick="navigateTo('produtos')" style="margin-top: 15px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-plus"></i> Cadastrar Produtos
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    produtosData.forEach(produto => {
        const cor = produto.cor || '#36B5B0';
        const estoqueBaixo = produto.estoque <= 10;
        
        html += `
            <div class="flavor-card" onclick="addToCart(${produto.id})">
                ${estoqueBaixo ? `
                    <div style="position: absolute; top: 10px; right: 10px; background: var(--warning); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px;">
                        <i class="fas fa-exclamation-circle"></i> BAIXO
                    </div>
                ` : ''}
                
                <div style="font-size: 50px; text-align: center;">
                    ${produto.emoji || '🍦'}
                </div>
                
                <h3>${produto.nome}</h3>
                <p>${produto.descricao || 'Sem descrição'}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 24px; font-weight: 900; color: ${cor};">
                        R$ ${formatPrice(produto.preco)}
                    </div>
                    <div style="font-size: 14px; color: ${estoqueBaixo ? 'var(--warning)' : 'var(--success)'};">
                        <i class="fas fa-box"></i> ${produto.estoque}
                    </div>
                </div>
                
                <button style="width: 100%; margin-top: 15px; padding: 10px; background: ${cor}; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function addToCart(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        showNotification('❌ Produto não encontrado', 'error');
        return;
    }
    
    if (produto.estoque <= 0) {
        showNotification('❌ Produto sem estoque!', 'error');
        return;
    }
    
    const existingItem = carrinho.find(item => item.produtoId === produtoId);
    
    if (existingItem) {
        if (existingItem.quantidade >= produto.estoque) {
            showNotification(`❌ Estoque máximo: ${produto.estoque}`, 'warning');
            return;
        }
        existingItem.quantidade++;
        existingItem.total = existingItem.quantidade * existingItem.preco;
    } else {
        carrinho.push({
            produtoId: produto.id,
            nome: produto.nome,
            emoji: produto.emoji || '🍦',
            preco: produto.preco,
            quantidade: 1,
            total: produto.preco
        });
    }
    
    updateCartDisplay();
    showNotification(`✅ ${produto.nome} adicionado!`, 'success');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const totalValue = carrinho.reduce((sum, item) => sum + item.total, 0);
    
    if (document.getElementById('totalItems')) {
        document.getElementById('totalItems').textContent = totalItems;
    }
    if (document.getElementById('totalValue')) {
        document.getElementById('totalValue').textContent = `R$ ${formatPrice(totalValue)}`;
    }
    if (document.getElementById('totalToPay')) {
        document.getElementById('totalToPay').textContent = `R$ ${formatPrice(totalValue)}`;
    }
    
    const finalizeBtn = document.getElementById('finalizeSale');
    if (finalizeBtn) {
        finalizeBtn.disabled = carrinho.length === 0;
    }
    
    if (carrinho.length === 0) {
        if (cartItems) {
            cartItems.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--gray);">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Selecione produtos para começar</p>
                </div>
            `;
        }
        return;
    }
    
    if (cartItems) {
        let html = '<div style="max-height: 250px; overflow-y: auto;">';
        
        carrinho.forEach((item, index) => {
            const produto = produtos.find(p => p.id === item.produtoId);
            
            html += `
                <div style="display: flex; align-items: center; padding: 15px; background: white; border-radius: 10px; margin-bottom: 10px;">
                    <span style="font-size: 24px; margin-right: 15px;">${item.emoji}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${item.nome}</div>
                        <div style="font-size: 12px; color: var(--gray);">
                            R$ ${formatPrice(item.preco)} un.
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="display: flex; align-items: center; background: #f8f9fa; border-radius: 8px; padding: 5px;">
                            <button onclick="updateCartItem(${index}, -1)" style="width: 30px; height: 30px; border: none; background: #e9ecef; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span style="width: 40px; text-align: center; font-weight: 700;">${item.quantidade}</span>
                            <button onclick="updateCartItem(${index}, 1)" style="width: 30px; height: 30px; border: none; background: #e9ecef; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div style="width: 90px; text-align: right; font-weight: 700;">
                            R$ ${formatPrice(item.total)}
                        </div>
                        <button onclick="removeCartItem(${index})" style="padding: 8px; background: var(--danger); color: white; border: none; border-radius: 6px; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = html + '</div>';
    }
}

function updateCartItem(index, change) {
    if (index < 0 || index >= carrinho.length) return;
    
    const item = carrinho[index];
    const produto = produtos.find(p => p.id === item.produtoId);
    
    if (!produto) {
        showNotification('❌ Produto não encontrado', 'error');
        return;
    }
    
    const newQuantity = item.quantidade + change;
    
    if (newQuantity < 1) {
        removeCartItem(index);
        return;
    }
    
    if (newQuantity > produto.estoque) {
        showNotification(`❌ Estoque máximo: ${produto.estoque}`, 'warning');
        return;
    }
    
    item.quantidade = newQuantity;
    item.total = item.quantidade * item.preco;
    updateCartDisplay();
}

function removeCartItem(index) {
    if (index >= 0 && index < carrinho.length) {
        const nomeProduto = carrinho[index].nome;
        carrinho.splice(index, 1);
        updateCartDisplay();
        showNotification(`🗑️ ${nomeProduto} removido do carrinho`, 'info');
    }
}

function clearCart() {
    if (carrinho.length > 0) {
        if (confirm('Limpar carrinho?')) {
            carrinho = [];
            updateCartDisplay();
            showNotification('🧹 Carrinho limpo', 'success');
        }
    }
}

async function finalizeSale() {
    try {
        if (carrinho.length === 0) {
            showNotification('❌ Carrinho vazio!', 'error');
            return;
        }
        
        const formaPagamento = document.querySelector('input[name="payment"]:checked')?.value || 'dinheiro';
        const total = carrinho.reduce((sum, item) => sum + item.total, 0);
        const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        
        // Verificar estoque antes de finalizar
        for (const item of carrinho) {
            const produto = produtos.find(p => p.id === item.produtoId);
            if (!produto || produto.estoque < item.quantidade) {
                showNotification(`❌ Estoque insuficiente: ${produto?.nome || 'produto'}`, 'error');
                return;
            }
        }
        
        // Criar venda
        const vendaData = {
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            total: total,
            total_itens: totalItens,
            pagamento: formaPagamento,
            status: 'concluida',
            itens: carrinho.map(item => ({
                produto_id: item.produtoId,
                quantidade: item.quantidade,
                preco: item.preco,
                total: item.total
            }))
        };
        
        showNotification('🔄 Finalizando venda...', 'info');
        
        // Salvar venda na API
        await neonAPI('create_venda', vendaData);
        
        // Atualizar estoque localmente
        for (const item of carrinho) {
            const produtoIndex = produtos.findIndex(p => p.id === item.produtoId);
            if (produtoIndex !== -1) {
                produtos[produtoIndex].estoque -= item.quantidade;
            }
        }
        
        // Limpar carrinho
        carrinho = [];
        updateCartDisplay();
        
        // Atualizar dashboard
        if (typeof loadDashboard === 'function') {
            await loadDashboard();
        }
        
        // Recarregar produtos para venda
        if (document.getElementById('vendas')?.classList.contains('active')) {
            await loadProductsForSale();
        }
        
        showNotification(`✅ Venda finalizada! R$ ${formatPrice(total)}`, 'success');
        
    } catch (error) {
        console.error('Erro ao finalizar venda:', error);
        showNotification('❌ Erro ao finalizar venda', 'error');
    }
}

// Configurar botões
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('clearCart')?.addEventListener('click', clearCart);
    document.getElementById('finalizeSale')?.addEventListener('click', finalizeSale);
});

// Exportar funções
window.loadProductsForSale = loadProductsForSale;
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.finalizeSale = finalizeSale;
window.updateCartDisplay = updateCartDisplay;
