// ===== GESTÃO DE PRODUTOS =====
async function loadAllProducts() {
    try {
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i><p>Carregando produtos...</p></div>';
        
        // Buscar produtos da API
        produtos = await neonAPI('get_produtos');
        
        if (!Array.isArray(produtos) || produtos.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-ice-cream"></i>
                    <p>Nenhum produto cadastrado</p>
                    <button onclick="abrirModalProduto()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px;">
                        <i class="fas fa-plus"></i> Cadastrar Primeiro Produto
                    </button>
                </div>
            `;
            return;
        }
        
        // Aplicar filtro se existir
        const filterValue = document.getElementById('productFilter')?.value || 'todos';
        const searchTerm = document.getElementById('productSearch')?.value?.toLowerCase() || '';
        
        let produtosFiltrados = produtos;
        
        // Aplicar filtro por status
        if (filterValue === 'estoque-baixo') {
            produtosFiltrados = produtos.filter(p => p.ativo && p.estoque > 0 && p.estoque <= 10);
        } else if (filterValue === 'mais-vendidos') {
            produtosFiltrados = produtos.filter(p => p.ativo)
                .sort((a, b) => (b.total_vendido || 0) - (a.total_vendido || 0));
        } else if (filterValue === 'ativos') {
            produtosFiltrados = produtos.filter(p => p.ativo);
        } else if (filterValue === 'inativos') {
            produtosFiltrados = produtos.filter(p => !p.ativo);
        }
        
        // Aplicar busca
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
                    <p style="font-size: 14px; margin-top: 5px;">Tente alterar os filtros de busca</p>
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
            const vendasCount = produto.total_vendido || 0;
            
            html += `
                <div class="flavor-card" style="border-color: ${cor}; position: relative;">
                    ${!produto.ativo ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: var(--danger); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; z-index: 1;">
                            <i class="fas fa-ban"></i> INATIVO
                        </div>
                    ` : ''}
                    
                    ${produto.estoque === 0 && produto.ativo ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: var(--warning); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; z-index: 1;">
                            <i class="fas fa-exclamation-triangle"></i> ESGOTADO
                        </div>
                    ` : ''}
                    
                    <div style="font-size: 50px; text-align: center; margin-bottom: 15px;">
                        ${produto.emoji || '🍦'}
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px; color: var(--dark); text-align: center;">
                        ${produto.nome}
                    </h3>
                    
                    <p style="color: var(--gray); font-size: 14px; margin-bottom: 10px; text-align: center; height: 60px; overflow: hidden;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 20px; font-weight: 900; color: ${cor};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="
                            font-size: 12px; 
                            color: ${estoqueColor};
                            background: ${estoqueColor}22; 
                            padding: 4px 8px;
                            border-radius: 15px;
                            font-weight: 700;
                        ">
                            <i class="fas fa-box"></i> ${produto.estoque} (${estoqueStatus})
                        </div>
                    </div>
                    
                    <div style="font-size: 12px; color: var(--gray); text-align: center; margin-bottom: 10px;">
                        <i class="fas fa-chart-line"></i> ${vendasCount} vendas
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editarProduto(${produto.id})" 
                                style="
                                    flex: 1; 
                                    padding: 8px; 
                                    background: var(--primary); 
                                    color: white; 
                                    border: none; 
                                    border-radius: 8px; 
                                    cursor: pointer;
                                    font-weight: 700;
                                    font-size: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 5px;
                                ">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="toggleDisponibilidade(${produto.id}, ${produto.ativo})" 
                                style="
                                    flex: 1; 
                                    padding: 8px; 
                                    background: ${produto.ativo ? 'var(--warning)' : 'var(--success)'}; 
                                    color: white; 
                                    border: none; 
                                    border-radius: 8px; 
                                    cursor: pointer;
                                    font-weight: 700;
                                    font-size: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 5px;
                                ">
                            <i class="fas ${produto.ativo ? 'fa-eye-slash' : 'fa-eye'}"></i> 
                            ${produto.ativo ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 50px;"></i>
                <p style="margin-top: 15px;">Erro ao carregar produtos</p>
                <p style="font-size: 14px; opacity: 0.7;">${error.message}</p>
            </div>
        `;
    }
}

// Toggle disponibilidade do produto
async function toggleDisponibilidade(produtoId, estaAtivo) {
    try {
        const novoStatus = !estaAtivo;
        const acao = novoStatus ? 'ativar' : 'desativar';
        
        if (!confirm(`Deseja ${acao} este produto?`)) {
            return;
        }
        
        showNotification(`🔄 ${acao === 'ativar' ? 'Ativando' : 'Desativando'} produto...`, 'info');
        
        // Atualizar na API
        await neonAPI('update_produto', {
            id: produtoId,
            ativo: novoStatus
        });
        
        // Atualizar localmente
        const produtoIndex = produtos.findIndex(p => p.id === produtoId);
        if (produtoIndex !== -1) {
            produtos[produtoIndex].ativo = novoStatus;
        }
        
        // Recarregar lista
        await loadAllProducts();
        
        showNotification(`✅ Produto ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`, 'success');
        
        // Se estiver na página de vendas, recarregar também
        if (document.getElementById('vendas')?.classList.contains('active')) {
            await loadProductsForSale();
        }
        
    } catch (error) {
        console.error('Erro ao alternar disponibilidade:', error);
        showNotification('❌ Erro ao atualizar produto', 'error');
    }
}

// Editar produto
async function editarProduto(produtoId) {
    try {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
            showNotification('❌ Produto não encontrado', 'error');
            return;
        }
        
        // Preencher modal de edição (usar o mesmo modal de novo produto)
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        document.getElementById('productId').value = produto.id;
        document.getElementById('productName').value = produto.nome;
        document.getElementById('productDescription').value = produto.descricao || '';
        document.getElementById('productPrice').value = produto.preco;
        document.getElementById('productStock').value = produto.estoque;
        document.getElementById('productEmoji').value = produto.emoji || '🍦';
        document.getElementById('selectedEmoji').textContent = produto.emoji || '🍦';
        document.getElementById('productColor').value = produto.cor || '#36B5B0';
        document.getElementById('productActive').checked = produto.ativo;
        
        // Mostrar modal
        document.getElementById('productModal').classList.add('active');
        
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        showNotification('❌ Erro ao carregar produto para edição', 'error');
    }
}

// Configurar botões produtos
document.addEventListener('DOMContentLoaded', function() {
    // Botão "Novo Produto"
    document.getElementById('addProduct')?.addEventListener('click', () => {
        abrirModalProduto();
    });
    
    // Filtro de produtos
    document.getElementById('productFilter')?.addEventListener('change', () => {
        loadAllProducts();
    });
    
    // Busca de produtos
    document.getElementById('productSearch')?.addEventListener('input', () => {
        loadAllProducts();
    });
});

// Função para abrir modal de novo produto
function abrirModalProduto() {
    document.getElementById('modalTitle').textContent = 'Novo Produto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('selectedEmoji').textContent = '🍦';
    document.getElementById('productEmoji').value = '🍦';
    document.getElementById('productColor').value = '#36B5B0';
    document.getElementById('productActive').checked = true;
    
    // Limpar preview de foto
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
        photoPreview.style.display = 'none';
    }
    
    document.getElementById('productModal').classList.add('active');
}
