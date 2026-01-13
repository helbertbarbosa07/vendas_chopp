// ===== GESTÃO DE PRODUTOS =====
async function loadAllProducts() {
    try {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;
        
        productsList.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i><p>Carregando produtos...</p></div>';
        
        // Buscar produtos da API
        produtos = await neonAPI('get_produtos');
        
        if (!Array.isArray(produtos) || produtos.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-ice-cream"></i>
                    <p>Nenhum produto cadastrado</p>
                    <button onclick="abrirModalProduto()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Cadastrar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }
        
        // Aplicar filtros
        const filterValue = document.getElementById('productFilter')?.value || 'todos';
        const searchTerm = document.getElementById('productSearch')?.value?.toLowerCase() || '';
        
        let produtosFiltrados = [...produtos];
        
        // Filtrar por status
        switch(filterValue) {
            case 'estoque-baixo':
                produtosFiltrados = produtos.filter(p => p.ativo && p.estoque > 0 && p.estoque <= 10);
                break;
            case 'mais-vendidos':
                produtosFiltrados = produtos.filter(p => p.ativo)
                    .sort((a, b) => (b.total_vendido || 0) - (a.total_vendido || 0));
                break;
            case 'ativos':
                produtosFiltrados = produtos.filter(p => p.ativo);
                break;
            case 'inativos':
                produtosFiltrados = produtos.filter(p => !p.ativo);
                break;
        }
        
        // Filtrar por busca
        if (searchTerm) {
            produtosFiltrados = produtosFiltrados.filter(p => 
                p.nome.toLowerCase().includes(searchTerm) ||
                (p.descricao && p.descricao.toLowerCase().includes(searchTerm))
            );
        }
        
        if (produtosFiltrados.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-search"></i>
                    <p>Nenhum produto encontrado</p>
                    <p style="font-size: 14px;">Tente outros filtros ou termos de busca</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        produtosFiltrados.forEach(produto => {
            const cor = produto.cor || '#36B5B0';
            const estoqueStatus = produto.estoque === 0 ? 'ESGOTADO' : 
                                produto.estoque <= 10 ? 'BAIXO' : 'OK';
            const estoqueColor = produto.estoque === 0 ? '#dc3545' : 
                               produto.estoque <= 10 ? '#ff9800' : '#28a745';
            
            html += `
                <div class="flavor-card" style="border-color: ${cor}; position: relative;">
                    ${!produto.ativo ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: var(--danger); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">
                            <i class="fas fa-ban"></i> INATIVO
                        </div>
                    ` : ''}
                    
                    ${produto.estoque === 0 && produto.ativo ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: var(--warning); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">
                            <i class="fas fa-exclamation-triangle"></i> ESGOTADO
                        </div>
                    ` : ''}
                    
                    <div style="font-size: 50px; text-align: center; margin-bottom: 15px;">
                        ${produto.emoji || '🍦'}
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px; color: var(--dark); text-align: center;">
                        ${produto.nome}
                    </h3>
                    
                    <p style="color: var(--gray); font-size: 14px; margin-bottom: 10px; text-align: center; height: 40px; overflow: hidden;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 20px; font-weight: 900; color: ${cor};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 12px; color: ${estoqueColor}; background: ${estoqueColor}22; padding: 4px 8px; border-radius: 15px; font-weight: 700;">
                            <i class="fas fa-box"></i> ${produto.estoque} (${estoqueStatus})
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                        <div style="font-size: 12px; color: var(--gray);">
                            <i class="fas fa-chart-line"></i> ${produto.total_vendido || 0} vendas
                        </div>
                        
                        <!-- TOGGLE ATIVO/INATIVO -->
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 12px; color: var(--gray);">Ativo:</span>
                            <label class="toggle-switch">
                                <input type="checkbox" ${produto.ativo ? 'checked' : ''} 
                                       onchange="toggleAtivoProduto(${produto.id}, this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editarProduto(${produto.id})" 
                                style="flex: 2; padding: 8px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 5px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="excluirProduto(${produto.id})" 
                                style="flex: 1; padding: 8px; background: var(--danger); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const productsList = document.getElementById('productsList');
        if (productsList) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar produtos</p>
                </div>
            `;
        }
    }
}

// Toggle Ativo/Inativo do produto
async function toggleAtivoProduto(produtoId, estaAtivo) {
    try {
        const acao = estaAtivo ? 'ativar' : 'desativar';
        
        showNotification(`🔄 ${acao === 'ativar' ? 'Ativando' : 'Desativando'} produto...`, 'info');
        
        // Atualizar na API
        await neonAPI('update_produto', {
            id: produtoId,
            ativo: estaAtivo
        });
        
        // Atualizar localmente
        const produtoIndex = produtos.findIndex(p => p.id === produtoId);
        if (produtoIndex !== -1) {
            produtos[produtoIndex].ativo = estaAtivo;
        }
        
        // Recarregar lista
        await loadAllProducts();
        
        // Se estiver na página de vendas, recarregar também
        if (document.getElementById('vendas')?.classList.contains('active')) {
            setTimeout(async () => {
                if (typeof loadProductsForSale === 'function') {
                    await loadProductsForSale();
                }
            }, 500);
        }
        
        showNotification(`✅ Produto ${acao === 'ativar' ? 'ativado' : 'desativado'}!`, 'success');
        
    } catch (error) {
        console.error('Erro ao alternar status:', error);
        showNotification('❌ Erro ao atualizar produto', 'error');
        
        // Reverter visualmente se der erro
        await loadAllProducts();
    }
}

// Editar produto - AGORA FUNCIONAL
async function editarProduto(produtoId) {
    try {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
            showNotification('❌ Produto não encontrado', 'error');
            return;
        }
        
        // Usar a função global abrirModalProduto
        if (typeof abrirModalProduto === 'function') {
            abrirModalProduto(produto);
        } else {
            showNotification('❌ Sistema não configurado', 'error');
        }
        
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        showNotification('❌ Erro ao carregar produto', 'error');
    }
}

// Excluir produto
async function excluirProduto(produtoId) {
    try {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
            showNotification('❌ Produto não encontrado', 'error');
            return;
        }
        
        if (!confirm(`Tem certeza que deseja EXCLUIR o produto "${produto.nome}"?\n\n⚠️ Esta ação não pode ser desfeita!\n📦 Estoque: ${produto.estoque} unidades\n💰 ${produto.total_vendido || 0} vendas realizadas`)) {
            return;
        }
        
        showNotification('🗑️ Excluindo produto...', 'info');
        
        // Excluir da API
        await neonAPI('delete_produto', { id: produtoId });
        
        // Remover localmente
        produtos = produtos.filter(p => p.id !== produtoId);
        
        // Recarregar lista
        await loadAllProducts();
        
        showNotification('✅ Produto excluído com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification('❌ Erro ao excluir produto', 'error');
    }
}

// Configurar botões produtos
document.addEventListener('DOMContentLoaded', function() {
    // Botão "Novo Produto"
    document.getElementById('addProduct')?.addEventListener('click', () => {
        if (typeof abrirModalProduto === 'function') {
            abrirModalProduto();
        } else {
            showNotification('❌ Sistema não configurado', 'error');
        }
    });
    
    // Filtro de produtos
    document.getElementById('productFilter')?.addEventListener('change', () => {
        loadAllProducts();
    });
    
    // Busca de produtos (com debounce)
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        let searchTimeout;
        productSearch.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadAllProducts();
            }, 300);
        });
    }
});

// Tornar funções globais
window.loadAllProducts = loadAllProducts;
window.toggleAtivoProduto = toggleAtivoProduto;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
