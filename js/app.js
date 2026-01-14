// ===== CONFIGURAÇÃO GLOBAL =====
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon';

// Variáveis globais compartilhadas
let produtos = [];
let vendas = [];
let fiados = [];
let carrinho = [];
let charts = {};
let isLoading = false;
let fiadoSelecionadoId = null;

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

// ===== CONTROLE DE VISIBILIDADE DA ABA FIADOS =====
function toggleFiadoTab(mostrar) {
    const fiadoTab = document.querySelector('.nav-tab[data-page="fiados"]');
    if (fiadoTab) {
        if (mostrar) {
            fiadoTab.style.display = 'flex';
        } else {
            fiadoTab.style.display = 'none';
        }
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

// ===== FUNÇÕES DE MODAL DE FIADO =====
function abrirModalFiado(fiado = null) {
    try {
        const modal = document.getElementById('fiadoModal');
        if (!modal) {
            showNotification('❌ Modal de fiado não encontrado', 'error');
            return;
        }
        
        const title = document.getElementById('modalFiadoTitle');
        
        if (fiado) {
            // Modo edição
            title.textContent = 'Editar Fiado';
            document.getElementById('fiadoIndex').value = fiado.id;
            document.getElementById('nomeCliente').value = fiado.nome_cliente || '';
            document.getElementById('telefoneCliente').value = fiado.telefone || '';
            document.getElementById('prazoPagamento').value = fiado.data_vencimento || '';
            document.getElementById('dataRetirada').value = fiado.data_fiado || '';
            document.getElementById('valorPago').value = fiado.valor_pago || 0;
            document.getElementById('observacoes').value = fiado.observacoes || '';
            
            // Carregar produtos do fiado
            document.getElementById('produtosFiadoContainer').innerHTML = fiado.produtos || '';
            
            // Calcular total
            document.getElementById('fiadoTotal').textContent = `R$ ${formatPrice(fiado.valor_total || 0)}`;
        } else {
            // Modo novo fiado
            title.textContent = 'Novo Fiado';
            document.getElementById('fiadoForm').reset();
            document.getElementById('fiadoIndex').value = '';
            
            // Limpar produtos
            document.getElementById('produtosFiadoContainer').innerHTML = '';
            
            // Configurar data padrão
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('prazoPagamento').value = hoje;
            document.getElementById('dataRetirada').value = hoje;
            
            // Resetar total
            document.getElementById('fiadoTotal').textContent = 'R$ 0,00';
        }
        
        modal.classList.add('active');
        
    } catch (error) {
        console.error('Erro ao abrir modal de fiado:', error);
        showNotification('❌ Erro ao abrir formulário de fiado', 'error');
    }
}

function fecharFiadoModal() {
    const modal = document.getElementById('fiadoModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function fecharPagamentoModal() {
    const modal = document.getElementById('pagamentoModal');
    if (modal) {
        modal.classList.remove('active');
    }
    fiadoSelecionadoId = null;
}

// Função para registrar pagamento de fiado
async function confirmarPagamento() {
    try {
        const valor = parseFloat(document.getElementById('valorPagamento')?.value || 0);
        const data = document.getElementById('dataPagamento')?.value;
        const forma = document.getElementById('formaPagamento')?.value || 'dinheiro';
        const observacoes = document.getElementById('obsPagamento')?.value || '';
        
        if (valor <= 0) {
            showNotification('❌ Valor do pagamento inválido', 'error');
            return;
        }
        
        if (!fiadoSelecionadoId) {
            showNotification('❌ Nenhum fiado selecionado', 'error');
            return;
        }
        
        const fiado = fiados.find(f => f.id === fiadoSelecionadoId);
        if (!fiado) {
            showNotification('❌ Fiado não encontrado', 'error');
            return;
        }
        
        showNotification('🔄 Registrando pagamento...', 'info');
        
        try {
            // Chamar API para atualizar fiado como pago
            await neonAPI('update_fiado_pago', { 
                id: fiadoSelecionadoId,
                valor_pago: valor,
                data_pagamento: data,
                forma_pagamento: forma,
                observacoes: observacoes
            });
            
            // Atualizar localmente
            const fiadoIndex = fiados.findIndex(f => f.id === fiadoSelecionadoId);
            if (fiadoIndex !== -1) {
                fiados[fiadoIndex].valor_pago = (fiados[fiadoIndex].valor_pago || 0) + valor;
                if (fiados[fiadoIndex].valor_pago >= fiados[fiadoIndex].valor_total) {
                    fiados[fiadoIndex].pago = true;
                }
            }
            
            // Fechar modal
            fecharPagamentoModal();
            
            // Recarregar fiados
            if (typeof carregarFiados === 'function') {
                await carregarFiados();
            }
            
            showNotification('✅ Pagamento registrado com sucesso!', 'success');
            
        } catch (apiError) {
            console.error('Erro na API:', apiError);
            showNotification('⚠️ Pagamento registrado localmente', 'warning');
            
            // Atualizar localmente mesmo se API falhar
            const fiadoIndex = fiados.findIndex(f => f.id === fiadoSelecionadoId);
            if (fiadoIndex !== -1) {
                fiados[fiadoIndex].valor_pago = (fiados[fiadoIndex].valor_pago || 0) + valor;
                if (fiados[fiadoIndex].valor_pago >= fiados[fiadoIndex].valor_total) {
                    fiados[fiadoIndex].pago = true;
                }
                
                // Recarregar visualização
                if (typeof carregarFiados === 'function') {
                    await carregarFiados();
                }
            }
        }
        
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        showNotification('❌ Erro ao registrar pagamento', 'error');
    }
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
        } else if (activePage === 'fiados') {
            if (typeof carregarFiados === 'function') await carregarFiados();
        } else if (activePage === 'relatorios') {
            if (typeof loadReports === 'function') await loadReports();
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
    
    // ===== CONFIGURAR EVENTOS DO MODAL DE FIADO =====
    document.getElementById('closeFiadoModal')?.addEventListener('click', fecharFiadoModal);
    document.getElementById('cancelFiadoModal')?.addEventListener('click', fecharFiadoModal);
    
    // Botão de fechar modal de pagamento (se existir)
    const closePagamentoBtn = document.querySelector('#pagamentoModal button[onclick*="fecharPagamentoModal"]');
    if (closePagamentoBtn) {
        closePagamentoBtn.addEventListener('click', fecharPagamentoModal);
    }
    
    // Botão de confirmar pagamento (se existir)
    const confirmarPagamentoBtn = document.querySelector('#pagamentoModal button[onclick*="confirmarPagamento"]');
    if (confirmarPagamentoBtn) {
        confirmarPagamentoBtn.addEventListener('click', confirmarPagamento);
    }
    
    // Fechar modais ao clicar fora
    document.getElementById('fiadoModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            fecharFiadoModal();
        }
    });
    
    document.getElementById('pagamentoModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            fecharPagamentoModal();
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
                    } else if (pageId === 'fiados') {
                        if (typeof carregarFiados === 'function') await carregarFiados();
                    } else if (pageId === 'relatorios') {
                        if (typeof loadReports === 'function') await loadReports();
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
    
    // Botão novo fiado
    document.getElementById('novoFiado')?.addEventListener('click', function() {
        abrirModalFiado();
    });
    
    // Seletor de emoji
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        const emojis = ['🍦', '🍨', '🍧', '🎂', '🍰', '🧁', '🍩', '🍪', '🥤', '☕', '🥛', '🧃'];
        emojiPicker.innerHTML = emojis.map(emoji => `
            <span class="emoji-option" onclick="selecionarEmoji('${emoji}')">${emoji}</span>
        `).join('');
    }
    
    // ===== INICIALMENTE ESCONDER A ABA FIADOS =====
    setTimeout(() => {
        toggleFiadoTab(false);
    }, 100);
    
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
window.toggleFiadoTab = toggleFiadoTab;

// Funções de fiado
window.abrirModalFiado = abrirModalFiado;
window.fecharFiadoModal = fecharFiadoModal;
window.fecharPagamentoModal = fecharPagamentoModal;
window.confirmarPagamento = confirmarPagamento;
