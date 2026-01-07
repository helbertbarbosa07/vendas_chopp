// main.js
// ===== CONFIGURAÇÃO NEON =====
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon';

// Variáveis globais
let produtos = [];
let vendas = [];
let fiados = [];
let carrinho = [];
let charts = {};
let isLoading = false;

// ===== FUNÇÕES DE UTILIDADE =====
export function formatPrice(value) {
    if (value === undefined || value === null || value === '') return '0.00';
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2).replace('.', ',');
}

export function formatarData(dataString) {
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

export function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('pt-BR', optionsDate);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('pt-BR');
}

export function showNotification(mensagem, tipo = 'info') {
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

export function showLoading(elementId, message = 'Carregando...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 30px; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--gray);">${message}</p>
            </div>
        `;
    }
}

// ===== API NEON =====
export async function testConnection() {
    try {
        console.log('🔌 Testando conexão com API...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'test' })
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API conectada:', data);
            return true;
        } else {
            console.error('❌ API não respondeu corretamente');
            return false;
        }
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
        return false;
    }
}

export async function neonAPI(action, data = null) {
    if (isLoading) {
        console.log(`⏳ ${action} em espera (já carregando)`);
        return;
    }
    
    try {
        isLoading = true;
        console.log(`🔄 Executando: ${action}`, data);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, data })
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
            let errorDetail = '';
            try {
                const errorText = await response.text();
                errorDetail = errorText;
                console.error('❌ Resposta do servidor:', errorText);
            } catch (e) {
                errorDetail = 'Não foi possível ler resposta';
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetail}`);
        }
        
        const result = await response.json();
        console.log('📦 Dados recebidos:', result);
        
        if (!result.success) {
            throw new Error(result.error || 'Erro na API');
        }
        
        console.log(`✅ ${action} executado com sucesso`);
        return result.data;
        
    } catch (error) {
        console.error(`❌ Erro em ${action}:`, error);
        
        let errorMsg = error.message;
        if (error.name === 'TypeError') {
            if (error.message.includes('fetch')) {
                errorMsg = 'Erro de conexão com a API. Verifique:';
                errorMsg += '\n1. URL da API está correta?';
                errorMsg += '\n2. Servidor está rodando?';
                errorMsg += '\n3. Problema de CORS?';
            } else if (error.message.includes('JSON')) {
                errorMsg = 'Resposta inválida da API';
            }
        } else if (error.message.includes('Failed to fetch')) {
            errorMsg = 'Não foi possível conectar ao servidor';
        }
        
        showNotification(`Erro: ${errorMsg}`, 'error');
        throw error;
    } finally {
        isLoading = false;
    }
}

// ===== NAVEGAÇÃO =====
export function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const pageId = this.dataset.page;

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
}

// ===== INICIALIZAÇÃO =====
export async function initializeApp() {
    console.log('🚀 Sistema Neon carregando...');
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    setupNavigation();
    setupEventListeners();
    initComponents();
    
    // Testar conexão primeiro
    showNotification('🔌 Conectando ao servidor...', 'info');
    const isConnected = await testConnection();
    
    if (isConnected) {
        try {
            showNotification('🔄 Conectando ao banco de dados Neon...', 'info');
            
            produtos = await neonAPI('get_produtos');
            console.log('✅ Neon conectado! Produtos:', produtos?.length || 0);
            
            if (Array.isArray(produtos)) {
                showNotification('✅ Sistema conectado com sucesso!', 'success');
            } else {
                throw new Error('Resposta inválida do servidor');
            }
            
        } catch (error) {
            console.error('❌ Falha na conexão com dados:', error);
            showNotification('⚠️ Conectado, mas erro nos dados. Modo limitado.', 'warning');
        }
    } else {
        showNotification('❌ Servidor offline. Modo desconectado.', 'error');
    }
}

// ===== CONFIGURAÇÃO DE EVENTOS =====
export function setupEventListeners() {
    document.getElementById('clearCart')?.addEventListener('click', clearCart);
    document.getElementById('finalizeSale')?.addEventListener('click', finalizeSale);
    
    document.getElementById('btnVerTodas')?.addEventListener('click', () => navigateTo('relatorios'));
    document.getElementById('btnVerTodosProdutos')?.addEventListener('click', () => navigateTo('produtos'));
    document.getElementById('btnReporEstoque')?.addEventListener('click', () => navigateTo('produtos'));
    
    document.getElementById('reportPeriod')?.addEventListener('change', function() {
        const isCustom = this.value === 'personalizado';
        document.getElementById('customDateRange').style.display = isCustom ? 'block' : 'none';
    });
    
    document.getElementById('generateReportBtn')?.addEventListener('click', loadReports);
    document.getElementById('printReport')?.addEventListener('click', printReport);
    document.getElementById('backupBtn')?.addEventListener('click', backupData);
    
    document.getElementById('syncButton')?.addEventListener('click', syncData);
}

export function initComponents() {
    const emojis = ["🍦", "🍨", "🍧", "🍫", "🍓", "🍌", "🍇", "🍎", "🍉", "🍊", "🍋", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑"];
    const picker = document.getElementById('emojiPicker');
    const selector = document.getElementById('emojiSelector');
    
    if (picker && selector) {
        picker.innerHTML = '';
        emojis.forEach(emoji => {
            const div = document.createElement('div');
            div.className = 'emoji-option';
            div.textContent = emoji;
            div.onclick = () => {
                document.getElementById('selectedEmoji').textContent = emoji;
                document.getElementById('productEmoji').value = emoji;
                picker.classList.remove('show');
            };
            picker.appendChild(div);
        });
        
        selector.addEventListener('click', (e) => {
            e.stopPropagation();
            picker.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && !selector.contains(e.target)) {
                picker.classList.remove('show');
            }
        });
    }
    
    const paymentOptions = document.querySelectorAll('.payment-option input');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            document.querySelectorAll('.payment-card').forEach(card => {
                card.style.borderColor = '#dee2e6';
            });
            
            if (this.checked) {
                this.closest('.payment-card').style.borderColor = '#4CAF50';
            }
        });
    });
}

// ===== FUNÇÕES GLOBAIS =====
export function navigateTo(pageId) {
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab) {
        tab.click();
    }
}

export async function syncData() {
    try {
        showNotification('🔄 Sincronizando com Neon...', 'info');
        showNotification('✅ Dados sincronizados!', 'success');
        
    } catch (error) {
        console.error('Erro na sincronização:', error);
        showNotification('❌ Erro na sincronização', 'error');
    }
}

// ===== CARRINHO =====
export function addToCart(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        showNotification('Produto não encontrado!', 'error');
        return;
    }
    
    if (produto.estoque <= 0) {
        showNotification('Produto sem estoque!', 'error');
        return;
    }
    
    const existingItem = carrinho.find(item => item.produtoId === produtoId);
    
    if (existingItem) {
        if (existingItem.quantidade >= produto.estoque) {
            showNotification('Estoque insuficiente!', 'warning');
            return;
        }
        existingItem.quantidade++;
        existingItem.total = existingItem.quantidade * existingItem.preco;
    } else {
        carrinho.push({
            produtoId: produto.id,
            nome: produto.nome,
            emoji: produto.emoji || '🍦',
            preco: produto.preco,
            quantidade: 1,
            total: produto.preco
        });
    }
    
    updateCart();
    showNotification(`${produto.emoji || '🍦'} ${produto.nome} adicionado!`, 'success');
}

export function updateCartItem(index, change) {
    const item = carrinho[index];
    const produto = produtos.find(p => p.id === item.produtoId);
    
    if (!produto) return;
    
    const newQuantity = item.quantidade + change;
    
    if (newQuantity < 1) {
        removeCartItem(index);
        return;
    }
    
    if (newQuantity > produto.estoque) {
        showNotification('Estoque insuficiente!', 'warning');
        return;
    }
    
    item.quantidade = newQuantity;
    item.total = item.quantidade * item.preco;
    updateCart();
}

export function removeCartItem(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho.splice(index, 1);
        updateCart();
        showNotification('Item removido do carrinho!', 'info');
    }
}

export function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = carrinho.reduce((sum, item) => sum + (item.quantidade || 0), 0);
    const totalValue = carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = `R$ ${formatPrice(totalValue)}`;
    document.getElementById('totalToPay').textContent = `R$ ${formatPrice(totalValue)}`;
    
    const finalizeBtn = document.getElementById('finalizeSale');
    finalizeBtn.disabled = carrinho.length === 0;
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-sales" style="padding: 20px; text-align: center;">
                <i class="fas fa-shopping-cart" style="font-size: 40px; opacity: 0.3;"></i>
                <p style="margin-top: 10px; color: var(--gray);">Selecione os produtos para começar</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Produto</th>
                    <th style="padding: 10px; text-align: center;">Qtd</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                    <th style="padding: 10px; text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    carrinho.forEach((item, index) => {
        html += `
            <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">${item.emoji}</span>
                        <div>
                            <div style="font-weight: 700;">${item.nome}</div>
                            <div style="font-size: 12px; color: var(--gray);">R$ ${formatPrice(item.preco)} un.</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <div style="display: inline-flex; align-items: center; background: #f8f9fa; border-radius: 8px; padding: 2px;">
                        <button onclick="main.updateCartItem(${index}, -1)" 
                                style="width: 30px; height: 30px; border: none; background: none; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span style="width: 40px; text-align: center; font-weight: 700;">${item.quantidade}</span>
                        <button onclick="main.updateCartItem(${index}, 1)" 
                                style="width: 30px; height: 30px; border: none; background: none; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td style="padding: 10px; text-align: right; font-weight: 800;">
                    R$ ${formatPrice(item.total)}
                </td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="main.removeCartItem(${index})" 
                            style="background: var(--danger); color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr> 
        `;
    });
    
    html += `</tbody></table>`;
    cartItems.innerHTML = html;
}

export function clearCart() {
    if (carrinho.length === 0) return;
    
    if (confirm('Limpar todo o carrinho?')) {
        carrinho = [];
        updateCart();
        showNotification('Carrinho limpo!', 'info');
    }
}

export async function finalizeSale() {
    try {
        if (carrinho.length === 0) {
            showNotification('Carrinho vazio!', 'warning');
            return;
        }
        
        const formaPagamento = document.querySelector('input[name="payment"]:checked')?.value || 'dinheiro';
        const total = carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
        
        if (formaPagamento === 'fiado') {
            showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
            return;
        }
        
        const novaVenda = {
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            itens: carrinho.map(item => ({
                produtoId: item.produtoId,
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            total: total,
            pagamento: formaPagamento
        };
        
        await neonAPI('create_venda', novaVenda);
        
        for (const item of carrinho) {
            await neonAPI('update_estoque', {
                produtoId: item.produtoId,
                quantidade: item.quantidade
            });
        }
        
        carrinho = [];
        
        updateCart();
        showNotification(`✅ Venda finalizada! R$ ${formatPrice(total)}`, 'success');
        
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao finalizar venda:', error);
        showNotification('❌ Erro ao finalizar venda!', 'error');
    }
}

// ===== DEPURAÇÃO =====
export async function debugConnection() {
    console.log('🔧 Iniciando debug de conexão...');
    console.log('📡 URL da API:', API_URL);
    
    try {
        console.log('1. Testando conexão básica...');
        const test1 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'test' })
        });
        console.log('Status:', test1.status, 'OK:', test1.ok);
        
        console.log('2. Testando ação get_produtos...');
        const test2 = await neonAPI('get_produtos');
        console.log('Produtos recebidos:', Array.isArray(test2) ? test2.length : 'Não é array');
        
        console.log('3. Verificando ambiente...');
        console.log('User Agent:', navigator.userAgent);
        console.log('Online:', navigator.onLine);
        
    } catch (error) {
        console.error('❌ Debug falhou:', error);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeApp);
