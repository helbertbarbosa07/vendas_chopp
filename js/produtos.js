// ===== GESTÃO DE PRODUTOS =====
async function loadAllProducts() {
    try {
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i><p>Carregando...</p></div>';
        
        if (produtos.length === 0) {
            produtos = await neonAPI('get_produtos');
        }
        
        if (produtos.length === 0) {
            productsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-ice-cream"></i>
                    <p>Nenhum produto cadastrado</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        produtos.forEach(produto => {
            const cor = produto.cor || '#36B5B0';
            const estoqueStatus = produto.estoque === 0 ? 'ESGOTADO' : 
                                produto.estoque <= 10 ? 'BAIXO' : 'OK';
            const estoqueColor = produto.estoque === 0 ? '#dc3545' : 
                               produto.estoque <= 10 ? '#ff9800' : '#28a745';
            
            html += `
                <div class="flavor-card" style="border-color: ${cor};">
                    ${!produto.ativo ? '<div style="position: absolute; top: 10px; right: 10px; background: var(--danger); color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px;">INATIVO</div>' : ''}
                    
                    <div style="font-size: 50px; text-align: center;">
                        ${produto.emoji || '🍦'}
                    </div>
                    
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao || 'Sem descrição'}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 20px; font-weight: 900; color: ${cor};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 12px; color: ${estoqueColor}; background: ${estoqueColor}22; padding: 4px 8px; border-radius: 15px;">
                            <i class="fas fa-box"></i> ${produto.estoque} (${estoqueStatus})
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editarProduto(${produto.id})" style="flex: 1; padding: 8px; background: var(--primary); color: white; border: none; border-radius: 8px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="verEstatisticas(${produto.id})" style="flex: 1; padding: 8px; background: var(--warning); color: white; border: none; border-radius: 8px;">
                            <i class="fas fa-chart-line"></i> Estatísticas
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro produtos:', error);
    }
}

function editarProduto(id) {
    showNotification('✏️ Edição de produtos em desenvolvimento', 'info');
}

function verEstatisticas(id) {
    showNotification('📊 Estatísticas em desenvolvimento', 'info');
}

// Configurar botões produtos
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addProduct')?.addEventListener('click', () => {
        showNotification('➕ Adicionar produto em desenvolvimento', 'info');
    });
});
