// ===== PRODUTOS =====
Object.assign(window.chopManager, {
    // Carregar lista de produtos
    loadProductsList: async function() {
        try {
            showLoading('productsList', 'Carregando produtos...');
            
            if (!Array.isArray(this.state.produtos) || this.state.produtos.length === 0) {
                this.state.produtos = await NeonAPI.getProdutos();
            }
            
            const filter = document.getElementById('productFilter')?.value || 'todos';
            const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
            
            if (!Array.isArray(this.state.produtos)) {
                const productsList = document.getElementById('productsList');
                productsList.innerHTML = `
                    <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                        <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                    </div>
                `;
                return;
            }
            
            let produtosFiltrados = [...this.state.produtos];
            
            if (filter === 'estoque-baixo') {
                produtosFiltrados = produtosFiltrados.filter(p => p.estoque < 10);
            } else if (filter === 'mais-vendidos') {
                produtosFiltrados = produtosFiltrados.filter(p => (p.vendas || 0) > 0);
                produtosFiltrados.sort((a, b) => (b.vendas || 0) - (a.vendas || 0));
            } else if (filter === 'ativos') {
                produtosFiltrados = produtosFiltrados.filter(p => p.ativo !== false);
            } else if (filter === 'inativos') {
                produtosFiltrados = produtosFiltrados.filter(p => p.ativo === false);
            }
            
            if (search) {
                produtosFiltrados = produtosFiltrados.filter(p => 
                    p.nome.toLowerCase().includes(search) ||
                    (p.descricao && p.descricao.toLowerCase().includes(search))
                );
            }
            
            const productsList = document.getElementById('productsList');
            
            if (produtosFiltrados.length === 0) {
                productsList.innerHTML = `
                    <div class="products-empty">
                        <i class="fas fa-ice-cream" style="font-size: 50px; opacity: 0.3;"></i>
                        <p style="margin-top: 10px; color: var(--gray);">Nenhum produto encontrado</p>
                        <button class="btn-primary" onclick="navigateTo('produtos')" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i> Adicionar Produto
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '';
            produtosFiltrados.forEach(produto => {
                const estoqueStatus = produto.estoque < 10 ? 'low' : '';
                const activeStatus = produto.ativo !== false ? 'Ativo' : 'Inativo';
                const activeClass = produto.ativo !== false ? 'active' : 'inactive';
                const vendasCount = produto.vendas || 0;
                const fotoHTML = produto.foto ? 
                    `<img src="${produto.foto}" class="product-photo">` :
                    `<div class="product-emoji">${produto.emoji || '🍦'}</div>`;
                
                html += `
                    <div class="product-card" onclick="window.chopManager.editProduct(${produto.id})" 
                         style="border-color: ${produto.cor || '#36B5B0'};">
                        <div class="product-header">
                            ${fotoHTML}
                            <span class="product-status ${activeClass}">${activeStatus}</span>
                        </div>
                        
                        <h3 class="product-name">${produto.nome}</h3>
                        
                        <p class="product-description">${produto.descricao || 'Sem descrição'}</p>
                        
                        <div class="product-footer">
                            <div class="product-price" style="color: ${produto.cor || '#36B5B0'};">R$ ${formatPrice(produto.preco)}</div>
                            <div class="product-stock ${estoqueStatus}">
                                <i class="fas fa-box"></i> ${produto.estoque}
                            </div>
                        </div>
                        
                        <div class="product-sales">
                            <span><i class="fas fa-shopping-cart"></i> ${vendasCount} vendas</span>
                            <span>R$ ${formatPrice(vendasCount * produto.preco)}</span>
                        </div>
                        
                        <div class="product-actions">
                            <button class="product-action-btn edit" onclick="event.stopPropagation(); window.chopManager.editProduct(${produto.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="product-action-btn delete" onclick="event.stopPropagation(); window.chopManager.deleteProduct(${produto.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            productsList.innerHTML = html;
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            showNotification('Erro ao carregar produtos', 'error');
        }
    },

    // Abrir modal de produto
    editProduct: async function(id) {
        try {
            const produtoData = await NeonAPI.getProduto(id);
            if (produtoData && produtoData[0]) {
                this.openProductModal(produtoData[0]);
            }
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            showNotification('Erro ao carregar produto', 'error');
        }
    },

    // Abrir modal de produto (nova ou edição)
    openProductModal: function(produto = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('modalTitle');
        const preview = document.getElementById('photoPreview');
        
        if (produto) {
            title.textContent = 'Editar Produto';
            document.getElementById('productId').value = produto.id;
            document.getElementById('productName').value = produto.nome;
            document.getElementById('productDescription').value = produto.descricao || '';
            document.getElementById('productPrice').value = produto.preco;
            document.getElementById('productStock').value = produto.estoque;
            document.getElementById('productEmoji').value = produto.emoji || '🍦';
            document.getElementById('selectedEmoji').textContent = produto.emoji || '🍦';
            document.getElementById('productColor').value = produto.cor || '#36B5B0';
            document.getElementById('productActive').checked = produto.ativo !== false;
            
            if (produto.foto) {
                preview.src = produto.foto;
                preview.classList.add('show');
                document.getElementById('productPhotoData').value = produto.foto;
            } else {
                preview.src = '';
                preview.classList.remove('show');
                document.getElementById('productPhotoData').value = '';
            }
        } else {
            title.textContent = 'Novo Produto';
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('selectedEmoji').textContent = '🍦';
            document.getElementById('productEmoji').value = '🍦';
            document.getElementById('productColor').value = '#36B5B0';
            document.getElementById('productActive').checked = true;
            preview.src = '';
            preview.classList.remove('show');
            document.getElementById('productPhotoData').value = '';
        }
        
        modal.classList.add('active');
    },

    // Fechar modal de produto
    closeProductModal: function() {
        document.getElementById('productModal').classList.remove('active');
    },

    // Salvar produto
    saveProduct: async function() {
        try {
            const form = document.getElementById('productForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const id = document.getElementById('productId').value;
            const isEditing = !!id;
            
            const produtoData = {
                nome: document.getElementById('productName').value,
                descricao: document.getElementById('productDescription').value,
                preco: Number(document.getElementById('productPrice').value),
                estoque: parseInt(document.getElementById('productStock').value),
                emoji: document.getElementById('productEmoji').value,
                cor: document.getElementById('productColor').value,
                ativo: document.getElementById('productActive').checked,
                foto: document.getElementById('productPhotoData').value || null
            };
            
            if (isEditing) {
                produtoData.id = parseInt(id);
                await NeonAPI.updateProduto(produtoData);
                showNotification('✅ Produto atualizado no Neon!', 'success');
            } else {
                await NeonAPI.createProduto(produtoData);
                showNotification('✅ Produto criado no Neon!', 'success');
            }
            
            this.closeProductModal();
            await this.loadProductsList();
            await this.loadProductsForSale();
            await this.loadDashboard();
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            showNotification('❌ Erro ao salvar produto no Neon!', 'error');
        }
    },

    // Excluir produto
    deleteProduct: async function(id) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        
        try {
            await NeonAPI.deleteProduto(id);
            showNotification('✅ Produto excluído do Neon!', 'success');
            
            await this.loadProductsList();
            await this.loadProductsForSale();
            await this.loadDashboard();
            
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            showNotification('❌ Erro ao excluir produto do Neon!', 'error');
        }
    }
});

// Event listeners específicos de produtos
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar produto
    document.getElementById('addProduct')?.addEventListener('click', () => {
        window.chopManager.openProductModal();
    });
    
    // Filtro de produtos
    document.getElementById('productFilter')?.addEventListener('change', () => {
        window.chopManager.loadProductsList();
    });
    
    // Busca de produtos
    document.getElementById('productSearch')?.addEventListener('input', () => {
        window.chopManager.loadProductsList();
    });
    
    // Salvar produto
    document.getElementById('saveProduct')?.addEventListener('click', () => {
        window.chopManager.saveProduct();
    });
    
    // Fechar modal
    document.getElementById('closeModal')?.addEventListener('click', () => {
        window.chopManager.closeProductModal();
    });
    
    document.getElementById('cancelModal')?.addEventListener('click', () => {
        window.chopManager.closeProductModal();
    });
});
