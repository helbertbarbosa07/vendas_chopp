// produtos.js
import { neonAPI, showNotification, formatPrice, showLoading, navigateTo } from './main.js';

// ===== FUNÇÕES DE PRODUTOS =====
export async function loadProductsList() {
    try {
        showLoading('productsList', 'Carregando produtos...');
        
        const produtos = await neonAPI('get_produtos');
        const filter = document.getElementById('productFilter')?.value || 'todos';
        const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
        
        if (!Array.isArray(produtos)) {
            const productsList = document.getElementById('productsList');
            productsList.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                </div>
            `;
            return;
        }
        
        let produtosFiltrados = [...produtos];
        
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
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-ice-cream" style="font-size: 50px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Nenhum produto encontrado</p>
                    <button class="btn-primary" onclick="produtosModule.openProductModal()" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Adicionar Produto
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '';
        produtosFiltrados.forEach(produto => {
            const estoqueStatus = produto.estoque < 10 ? 'style="color: var(--danger);"' : '';
            const activeStatus = produto.ativo !== false ? 'Ativo' : 'Inativo';
            const activeClass = produto.ativo !== false ? 'background: #e8f5e9; color: #2e7d32;' : 'background: #ffebee; color: #c62828;';
            const vendasCount = produto.vendas || 0;
            const fotoHTML = produto.foto ? 
                `<img src="${produto.foto}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">` :
                `<div style="font-size: 40px; margin-bottom: 10px;">${produto.emoji || '🍦'}</div>`;
            
            html += `
                <div class="flavor-card" onclick="produtosModule.editProduct(${produto.id})" 
                     style="border-color: ${produto.cor || '#36B5B0'}; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        ${fotoHTML}
                        <span style="padding: 4px 10px; border-radius: 15px; font-size: 12px; ${activeClass}">
                            ${activeStatus}
                        </span>
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px; color: var(--dark);">
                        ${produto.nome}
                    </h3>
                    
                    <p style="color: var(--gray); font-size: 13px; margin-bottom: 15px; min-height: 40px;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 22px; font-weight: 900; color: ${produto.cor || '#36B5B0'};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 14px; color: var(--gray);" ${estoqueStatus}>
                            <i class="fas fa-box"></i> ${produto.estoque}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gray);">
                        <span><i class="fas fa-shopping-cart"></i> ${vendasCount} vendas</span>
                        <span>R$ ${formatPrice(vendasCount * produto.preco)}</span>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-primary" onclick="event.stopPropagation(); produtosModule.editProduct(${produto.id})"
                                style="flex: 1; padding: 8px; font-size: 12px; background: var(--primary);">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="event.stopPropagation(); produtosModule.deleteProduct(${produto.id})"
                                style="padding: 8px 12px; border: none; border-radius: 8px; background: var(--danger); color: white; cursor: pointer;">
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
}

export async function loadProductsForSale() {
    try {
        console.log('🛍️ Carregando produtos para venda...');
        showLoading('productsGrid', 'Carregando produtos...');
        
        const produtos = await neonAPI('get_produtos');
        const productsGrid = document.getElementById('productsGrid');
        
        if (!Array.isArray(produtos)) {
            productsGrid.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                </div>
            `;
            return;
        }
        
        const produtosAtivos = produtos.filter(p => p.ativo && p.estoque > 0);
        
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
                `<img src="${produto.foto}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">` :
                `<div style="font-size: 50px; margin-bottom: 15px;">${produto.emoji || '🍦'}</div>`;
            
            html += `
                <div class="flavor-card" onclick="main.addToCart(${produto.id})" 
                     style="border-color: ${produto.cor || '#36B5B0'};">
                    ${fotoHTML}
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px; color: var(--dark);">
                        ${produto.nome}
                    </h3>
                    <p style="color: var(--gray); font-size: 14px; margin-bottom: 15px; min-height: 40px;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 24px; font-weight: 900; color: ${produto.cor || '#36B5B0'};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 14px; color: var(--gray);" ${estoqueStatus}>
                            <i class="fas fa-box"></i> ${produto.estoque}
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showNotification('Erro ao carregar produtos', 'error');
    }
}

// ===== MODAL DE PRODUTO =====
export async function editProduct(id) {
    try {
        const produtoData = await neonAPI('get_produto', { id });
        if (produtoData && produtoData[0]) {
            openProductModal(produtoData[0]);
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        showNotification('Erro ao carregar produto', 'error');
    }
}

export function openProductModal(produto = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
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
        form.reset();
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
}

export function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

export async function saveProduct() {
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
            await neonAPI('update_produto', produtoData);
            showNotification('✅ Produto atualizado no Neon!', 'success');
        } else {
            await neonAPI('create_produto', produtoData);
            showNotification('✅ Produto criado no Neon!', 'success');
        }
        
        closeProductModal();
        await loadProductsList();
        await loadProductsForSale();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification('❌ Erro ao salvar produto no Neon!', 'error');
    }
}

export async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        await neonAPI('delete_produto', { id });
        showNotification('✅ Produto excluído do Neon!', 'success');
        
        await loadProductsList();
        await loadProductsForSale();
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification('❌ Erro ao excluir produto do Neon!', 'error');
    }
}

// Configuração de eventos específicos do módulo de produtos
export function setupProductEventListeners() {
    document.getElementById('addProduct')?.addEventListener('click', () => openProductModal());
    document.getElementById('productFilter')?.addEventListener('change', loadProductsList);
    document.getElementById('productSearch')?.addEventListener('input', loadProductsList);
    document.getElementById('saveProduct')?.addEventListener('click', saveProduct);
    document.getElementById('closeModal')?.addEventListener('click', closeProductModal);
    document.getElementById('cancelModal')?.addEventListener('click', closeProductModal);
    
    const photoContainer = document.getElementById('photoUploadContainer');
    const photoInput = document.getElementById('productPhoto');
    
    if (photoContainer && photoInput) {
        photoContainer.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('Imagem muito grande! Máximo 2MB.', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64String = e.target.result;
                    const preview = document.getElementById('photoPreview');
                    preview.src = base64String;
                    preview.classList.add('show');
                    document.getElementById('productPhotoData').value = base64String;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Exportar módulo
export default {
    loadProductsList,
    loadProductsForSale,
    editProduct,
    openProductModal,
    closeProductModal,
    saveProduct,
    deleteProduct,
    setupProductEventListeners
};
