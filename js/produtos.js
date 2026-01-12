// ===== GESTÃO DE PRODUTOS (CORRIGIDO E OTIMIZADO) =====

// Lista global já existente no app.js
// let produtos = [];

async function loadAllProducts() {
    try {
        const productsList = document.getElementById('productsList');
        const productSearch = document.getElementById('productSearch');
        if (!productsList) return;

        productsList.innerHTML = `
            <div style="text-align:center;padding:40px">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando produtos...</p>
            </div>
        `;

        // Busca produtos
        produtos = await neonAPI('get_produtos');

        if (!Array.isArray(produtos) || produtos.length === 0) {
            productsList.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--gray)">
                    <i class="fas fa-ice-cream"></i>
                    <p>Nenhum produto cadastrado</p>
                </div>
            `;
            return;
        }

        // Texto de busca
        const searchText = productSearch ? productSearch.value.toLowerCase() : '';

        // FILTRO: busca + ocultar inativos
        const produtosFiltrados = produtos.filter(p =>
            p.ativo === true &&
            (
                p.nome.toLowerCase().includes(searchText) ||
                (p.descricao || '').toLowerCase().includes(searchText)
            )
        );

        if (produtosFiltrados.length === 0) {
            productsList.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--gray)">
                    <p>Nenhum produto encontrado</p>
                </div>
            `;
            return;
        }

        productsList.innerHTML = produtosFiltrados.map(produto => `
            <div class="product-card">
                <div class="product-header">
                    <span class="color-dot" style="background:${produto.cor || '#ccc'}"></span>
                    <strong>${produto.nome}</strong>
                </div>

                <p>${produto.descricao || 'Sem descrição'}</p>

                <div class="product-info">
                    <span>R$ ${Number(produto.preco).toFixed(2)}</span>
                    <span>Estoque: ${produto.estoque}</span>
                </div>

                <div class="product-actions">
                    <button onclick="editarProduto(${produto.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="danger"
                        onclick="toggleDisponibilidadeProduto(${produto.id}, ${produto.ativo})">
                        <i class="fas fa-eye-slash"></i> Ocultar
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error(error);
        showNotification('Erro ao carregar produtos', 'error');
    }
}

// ✅ CORREÇÃO PRINCIPAL: função agora é async
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
            cor: produto.cor,
            ativo: novoStatus
        });

        await loadAllProducts();

        showNotification(
            `Produto ${novoStatus ? 'ativado' : 'ocultado'} com sucesso`,
            'success'
        );

    } catch (error) {
        console.error(error);
        showNotification('Erro ao atualizar produto', 'error');
    }
}

// BUSCA COM DEBOUNCE
document.addEventListener('DOMContentLoaded', () => {
    const productSearch = document.getElementById('productSearch');
    if (!productSearch) return;

    let timeout;
    productSearch.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(loadAllProducts, 300);
    });
});

// EXPORTA PARA O HTML
window.toggleDisponibilidadeProduto = toggleDisponibilidadeProduto;
window.editarProduto = editarProduto;

/*
TESTE MANUAL:
1. Cadastre produto ativo
2. Clique em "Ocultar"
3. Produto some da lista
4. Banco mantém ativo = false
*/
