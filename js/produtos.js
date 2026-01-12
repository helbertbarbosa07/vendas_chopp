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
        
        // Aplicar filtro se existir
        const filterValue = document.getElementById('productFilter')?.value || 'todos';
        const searchTerm = document.getElementById('productSearch')?.value?.toLowerCase() || '';
        
        let produtosFiltrados = [...produtos];
        
        // Aplicar filtro por status
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
            default:
                // "todos" - não filtra
                break;
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
                    
                    <p style="color: var(--gray); font-size: 14px; margin-bottom: 10px; text-align: center; height: 40px; overflow: hidden; line-height: 1.3;">
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
                        <button onclick="toggleDisponibilidadeProduto(${produto.id}, ${produto.ativo})" 
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
        if (productsList) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px;"></i>
                    <p style="margin-top: 15px;">Erro ao carregar produtos</p>
                    <p style="font-size: 14px; opacity: 0.7;">${error.message}</p>
                </div>
            `;
        }
    }
}

// Toggle disponibilidade do produto
async function toggleDisponibilidadeProduto(produtoId, estaAtivo) {
    try {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
            showNotification('Produto não encontrado', 'error');
            return;
        }

        const novoStatus = !estaAtivo;

        await neonAPI('update_produto', {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            estoque: produto.estoque,
            emoji: produto.emoji,
            cor: produto.cor,
            ativo: novoStatus
        });

        await loadAllProducts();
        showNotification(
            `Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
            'success'
        );

    } catch (error) {
        console.error(error);
        showNotification('Erro ao atualizar produto', 'error');
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
        
        // Verificar se a função existe
        if (typeof window.abrirModalProduto === 'function') {
            window.abrirModalProduto(produto);
        } else {
            showNotification('❌ Sistema não configurado corretamente', 'error');
            console.error('Função abrirModalProduto não encontrada');
        }
        
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        showNotification('❌ Erro ao carregar produto para edição', 'error');
    }
}

// Configurar botões produtos
document.addEventListener('DOMContentLoaded', function() {
    // Botão "Novo Produto"
    const addProductBtn = document.getElementById('addProduct');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            if (typeof window.abrirModalProduto === 'function') {
                window.abrirModalProduto();
            } else {
                showNotification('❌ Sistema não configurado', 'error');
            }
        });
    }
    
    // Filtro de produtos
    const productFilter = document.getElementById('productFilter');
    if (productFilter) {
        productFilter.addEventListener('change', () => {
            loadAllProducts();
        });
    }
    
    // Busca de produtos (debounce para não sobrecarregar)
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

// Tornar funções disponíveis globalmente
window.toggleDisponibilidadeProduto = toggleDisponibilidadeProduto;
window.editarProduto = editarProduto;
