// ===== VENDAS =====
Object.assign(window.chopManager, {
    // Carregar produtos para venda
    loadProductsForSale: async function() {
        try {
            console.log('🛍️ Carregando produtos para venda...');
            showLoading('productsGrid', 'Carregando produtos...');
            
            if (!Array.isArray(this.state.produtos) || this.state.produtos.length === 0) {
                this.state.produtos = await NeonAPI.getProdutos();
            }
            
            const productsGrid = document.getElementById('productsGrid');
            
            if (!Array.isArray(this.state.produtos)) {
                productsGrid.innerHTML = `
                    <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                        <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                    </div>
                `;
                return;
            }
            
            const produtosAtivos = this.state.produtos.filter(p => p.ativo && p.estoque > 0);
            
            if (produtosAtivos.length === 0) {
                productsGrid.innerHTML = `
                    <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <i class="fas fa-ice-cream" style="font-size: 50px; opacity: 0.3;"></i>
                        <p style="margin-top: 10px; color: var(--gray);">Nenhum produto cadastrado</p>
                        <button class="btn-primary" onclick="navigateTo('produtos')" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i> Cadastrar Produtos
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '';
            produtosAtivos.forEach(produto => {
                const estoqueStatus = produto.estoque < 5 ? 'style="color: var(--danger);"' : '';
                const fotoHTML = produto.foto ? 
                    `<img src="${produto.foto}" class="product-photo" style="width: 80px; height: 80px;">` :
                    `<div class="flavor-emoji">${produto.emoji || '🍦'}</div>`;
                
                html += `
                    <div class="flavor-card" onclick="window.chopManager.addToCart(${produto.id})" 
                         style="border-color: ${produto.cor || '#36B5B0'};">
                        ${fotoHTML}
                        <h3 class="flavor-name">${produto.nome}</h3>
                        <p class="flavor-description">${produto.descricao || 'Sem descrição'}</p>
                        <div class="flavor-footer">
                            <div class="flavor-price" style="color: ${produto.cor || '#36B5B0'};">R$ ${formatPrice(produto.preco)}</div>
                            <div class="flavor-stock ${produto.estoque < 5 ? 'low' : ''}" ${estoqueStatus}>
                                <i class="fas fa-box"></i> ${produto.estoque}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            productsGrid.innerHTML = html;
            this.updateCart();
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            showNotification('Erro ao carregar produtos', 'error');
        }
    },

    // Adicionar ao carrinho
    addToCart: function(produtoId) {
        const produto = this.state.produtos.find(p => p.id === produtoId);
        if (!produto) {
            showNotification('Produto não encontrado!', 'error');
            return;
        }
        
        if (produto.estoque <= 0) {
            showNotification('Produto sem estoque!', 'error');
            return;
        }
        
        const existingItem = this.state.carrinho.find(item => item.produtoId === produtoId);
        
        if (existingItem) {
            if (existingItem.quantidade >= produto.estoque) {
                showNotification('Estoque insuficiente!', 'warning');
                return;
            }
            existingItem.quantidade++;
            existingItem.total = existingItem.quantidade * existingItem.preco;
        } else {
            this.state.carrinho.push({
                produtoId: produto.id,
                nome: produto.nome,
                emoji: produto.emoji || '🍦',
                preco: produto.preco,
                quantidade: 1,
                total: produto.preco
            });
        }
        
        this.updateCart();
        showNotification(`${produto.emoji || '🍦'} ${produto.nome} adicionado!`, 'success');
    },

    // Atualizar item do carrinho
    updateCartItem: function(index, change) {
        const item = this.state.carrinho[index];
        const produto = this.state.produtos.find(p => p.id === item.produtoId);
        
        if (!produto) return;
        
        const newQuantity = item.quantidade + change;
        
        if (newQuantity < 1) {
            this.removeCartItem(index);
            return;
        }
        
        if (newQuantity > produto.estoque) {
            showNotification('Estoque insuficiente!', 'warning');
            return;
        }
        
        item.quantidade = newQuantity;
        item.total = item.quantidade * item.preco;
        this.updateCart();
    },

    // Remover item do carrinho
    removeCartItem: function(index) {
        if (index >= 0 && index < this.state.carrinho.length) {
            this.state.carrinho.splice(index, 1);
            this.updateCart();
            showNotification('Item removido do carrinho!', 'info');
        }
    },

    // Atualizar carrinho
    updateCart: function() {
        const cartItems = document.getElementById('cartItems');
        const totalItems = this.state.carrinho.reduce((sum, item) => sum + (item.quantidade || 0), 0);
        const totalValue = this.state.carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
        
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalValue').textContent = `R$ ${formatPrice(totalValue)}`;
        document.getElementById('totalToPay').textContent = `R$ ${formatPrice(totalValue)}`;
        
        const finalizeBtn = document.getElementById('finalizeSale');
        if (finalizeBtn) {
            finalizeBtn.disabled = this.state.carrinho.length === 0;
        }
        
        if (this.state.carrinho.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-sales" style="padding: 20px; text-align: center;">
                    <i class="fas fa-shopping-cart" style="font-size: 40px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Selecione os produtos para começar</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        this.state.carrinho.forEach((item, index) => {
            html += `
                <tr>
                    <td>
                        <div class="cart-item-info">
                            <span class="cart-item-emoji">${item.emoji}</span>
                            <div>
                                <div style="font-weight: 700;">${item.nome}</div>
                                <div style="font-size: 12px; color: var(--gray);">R$ ${formatPrice(item.preco)} un.</div>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: center;">
                        <div class="quantity-control">
                            <button onclick="window.chopManager.updateCartItem(${index}, -1)" class="quantity-btn">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value">${item.quantidade}</span>
                            <button onclick="window.chopManager.updateCartItem(${index}, 1)" class="quantity-btn">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td style="text-align: right; font-weight: 800;">
                        R$ ${formatPrice(item.total)}
                    </td>
                    <td style="text-align: center;">
                        <button onclick="window.chopManager.removeCartItem(${index})" class="remove-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr> 
            `;
        });
        
        html += `</tbody></table>`;
        cartItems.innerHTML = html;
    },

    // Limpar carrinho
    clearCart: function() {
        if (this.state.carrinho.length === 0) return;
        
        if (confirm('Limpar todo o carrinho?')) {
            this.state.carrinho = [];
            this.updateCart();
            showNotification('Carrinho limpo!', 'info');
        }
    },

    // Finalizar venda
    finalizeSale: async function() {
        try {
            if (this.state.carrinho.length === 0) {
                showNotification('Carrinho vazio!', 'warning');
                return;
            }
            
            const formaPagamento = document.querySelector('input[name="payment"]:checked')?.value || 'dinheiro';
            const total = this.state.carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
            
            if (formaPagamento === 'fiado') {
                showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
                return;
            }
            
            const novaVenda = {
                data: new Date().toISOString().split('T')[0],
                hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                itens: this.state.carrinho.map(item => ({
                    produtoId: item.produtoId,
                    nome: item.nome,
                    quantidade: item.quantidade,
                    preco: item.preco
                })),
                total: total,
                pagamento: formaPagamento
            };
            
            await NeonAPI.createVenda(novaVenda);
            
            for (const item of this.state.carrinho) {
                await NeonAPI.updateEstoque({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade
                });
            }
            
            this.state.carrinho = [];
            
            this.updateCart();
            await this.loadDashboard();
            await this.loadProductsForSale();
            
            showNotification(`✅ Venda finalizada! R$ ${formatPrice(total)}`, 'success');
            
            setTimeout(() => {
                this.navigateTo('dashboard');
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            showNotification('❌ Erro ao finalizar venda!', 'error');
        }
    }
});

// Event listeners específicos de vendas
document.addEventListener('DOMContentLoaded', function() {
    // Limpar carrinho
    document.getElementById('clearCart')?.addEventListener('click', () => {
        window.chopManager.clearCart();
    });
    
    // Finalizar venda
    document.getElementById('finalizeSale')?.addEventListener('click', () => {
        window.chopManager.finalizeSale();
    });
});
