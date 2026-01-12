// ===== CONFIGURAÇÃO GLOBAL =====
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon';

// Variáveis globais compartilhadas
let produtos = [];
let vendas = [];
let fiados = [];
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

// ===== API NEON =====
async function neonAPI(action, data = null) {
    if (isLoading && action !== 'create_venda') {
        console.log(`⏳ ${action} em espera (já carregando)`);
        return;
    }
    
    try {
        isLoading = true;
        console.log(`🔄 Executando: ${action}`, data);
        
        let apiAction = action;
        const actionMap = {
            'create_fiado': 'create_credito',
            'get_fiados': 'get_creditos',
            'update_fiado': 'update_credito',
            'delete_fiado': 'delete_credito'
        };
        
        if (actionMap[action]) {
            apiAction = actionMap[action];
        }
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: apiAction, 
                data: data 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Erro na API');
        }
        
        console.log(`✅ ${action} executado com sucesso`);
        return result.data;
        
    } catch (error) {
        console.error(`❌ Erro em ${action}:`, error);
        showNotification(`Erro: ${error.message}`, 'error');
        throw error;
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
// No produtos.js, remova a função antiga e deixe apenas:
function abrirModalProdutoParaNovo() {
    if (typeof abrirModalProduto === 'function') {
        abrirModalProduto(); // Chama a função do app.js
    } else {
        showNotification('❌ Sistema não configurado', 'error');
    }
}

// E atualize o event listener:
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addProduct')?.addEventListener('click', abrirModalProdutoParaNovo);
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Sistema Chop Manager PRO iniciando...');
    
    // Configurar navegação
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            const pageId = this.dataset.page;
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Carregar dados da página específica
                try {
                    if (pageId === 'dashboard') {
                        await loadDashboard();
                    } else if (pageId === 'vendas') {
                        await loadProductsForSale();
                    } else if (pageId === 'produtos') {
                        await loadAllProducts();
                    } else if (pageId === 'fiados') {
                        await carregarFiados();
                    }
                } catch (error) {
                    console.error(`Erro ao carregar página ${pageId}:`, error);
                }
            }
        });
    });
    
    // Testar conexão
    try {
        showNotification('🔌 Conectando ao servidor...', 'info');
        produtos = await neonAPI('get_produtos');
        console.log(`📦 ${produtos.length} produtos carregados`);
        
        // Carregar dashboard inicial
        await loadDashboard();
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showNotification('⚠️ Erro ao conectar com o servidor', 'warning');
    }
});
