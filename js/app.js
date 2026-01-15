// ===== CONFIGURAÇÃO GLOBAL =====
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon';

// Variáveis globais compartilhadas
let produtos = [];
let vendas = [];
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
        if (typeof loadAllProducts === 'function') {
            await loadAllProducts();
        }
        
        // Recarregar produtos para venda se na página de vendas
        if (document.getElementById('vendas')?.classList.contains('active')) {
            if (typeof loadProductsForSale === 'function') {
                setTimeout(async () => {
                    await loadProductsForSale();
                }, 500);
            }
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

// ===== TEMPO REAL =====
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    if (document.getElementById('currentDate')) {
        document.getElementById('currentDate').textContent = now.toLocaleDateString('pt-BR', options);
    }
    
    if (document.getElementById('currentTime')) {
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('pt-BR');
    }
}

// ===== SINCRONIZAÇÃO =====
async function syncData() {
    try {
        showNotification('🔄 Sincronizando dados...', 'info');
        
        // Recarregar dados básicos
        const produtosResponse = await neonAPI('get_produtos');
        produtos = produtosResponse.data || [];
        
        // Recarregar página atual
        const activePage = document.querySelector('.page.active')?.id;
        if (activePage === 'dashboard') {
            if (typeof loadDashboard === 'function') await loadDashboard();
        } else if (activePage === 'produtos') {
            if (typeof loadAllProducts === 'function') await loadAllProducts();
        } else if (activePage === 'vendas') {
            if (typeof loadProductsForSale === 'function') await loadProductsForSale();
        } else if (activePage === 'relatorios') {
            if (typeof loadReportsComFiltro === 'function') await loadReportsComFiltro();
        }
        
        showNotification('✅ Dados sincronizados!', 'success');
        
    } catch (error) {
        console.error('Erro na sincronização:', error);
        showNotification('❌ Erro ao sincronizar', 'error');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Sistema Chop Manager PRO iniciando...');
    
    // Atualizar data/hora
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // ===== CONFIGURAR EVENTOS DO MODAL DE PRODUTO =====
    document.getElementById('closeModal')?.addEventListener('click', fecharModalProduto);
    document.getElementById('cancelModal')?.addEventListener('click', fecharModalProduto);
    document.getElementById('saveProduct')?.addEventListener('click', salvarProduto);
    
    // Fechar modal ao clicar fora
    document.getElementById('productModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModalProduto();
        }
    });
    
    // ===== CONFIGURAR NAVEGAÇÃO =====
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
                        if (typeof loadDashboard === 'function') await loadDashboard();
                    } else if (pageId === 'vendas') {
                        if (typeof loadProductsForSale === 'function') await loadProductsForSale();
                    } else if (pageId === 'produtos') {
                        if (typeof loadAllProducts === 'function') await loadAllProducts();
                    } else if (pageId === 'relatorios') {
                        if (typeof loadReportsComFiltro === 'function') await loadReportsComFiltro();
                    }
                } catch (error) {
                    console.error(`Erro ao carregar página ${pageId}:`, error);
                    showNotification(`❌ Erro ao carregar ${pageId}`, 'error');
                }
            }
        });
    });
    
    // ===== CONFIGURAR BOTÕES GERAIS =====
    // Botão sincronizar
    document.getElementById('syncButton')?.addEventListener('click', syncData);
    
    // Botão novo produto
    document.getElementById('addProduct')?.addEventListener('click', function() {
        abrirModalProduto();
    });
    
    // Seletor de emoji
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        const emojis = ['🍦', '🍨', '🍧', '🎂', '🍰', '🧁', '🍩', '🍪', '🥤', '☕', '🥛', '🧃'];
        emojiPicker.innerHTML = emojis.map(emoji => `
            <span class="emoji-option" onclick="selecionarEmoji('${emoji}')">${emoji}</span>
        `).join('');
    }
    
    // ===== TESTAR CONEXÃO E CARREGAR DADOS INICIAIS =====
    try {
        showNotification('🔌 Conectando ao servidor...', 'info');
        
        const response = await neonAPI('get_produtos');
        produtos = response.data || [];
        
        console.log(`📦 ${produtos.length} produtos carregados`);
        
        // Ativar dashboard inicial
        const dashboardTab = document.querySelector('.nav-tab[data-page="dashboard"]');
        if (dashboardTab) {
            dashboardTab.click();
        }
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showNotification('⚠️ Erro ao conectar com o servidor', 'warning');
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
window.syncData = syncData;
