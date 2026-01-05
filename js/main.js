// ===== SISTEMA PRINCIPAL =====
const ChopManager = {
    // Estado global
    state: {
        produtos: [],
        vendas: [],
        fiados: [],
        carrinho: [],
        charts: {},
        currentPage: 'dashboard',
        isLoading: false
    },

    // Inicialização
    init: async function() {
        console.log('🚀 Sistema Chop Manager inicializando...');
        
        try {
            // Atualizar data e hora
            this.updateDateTime();
            setInterval(() => this.updateDateTime(), 1000);
            
            // Configurar navegação
            this.setupNavigation();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Inicializar componentes
            this.initComponents();
            
            // Testar conexão
            showNotification('🔌 Conectando ao servidor...', 'info');
            const isConnected = await NeonAPI.testConnection();
            
            if (isConnected) {
                try {
                    showNotification('🔄 Conectando ao banco de dados Neon...', 'info');
                    
                    // Carregar produtos
                    this.state.produtos = await NeonAPI.getProdutos();
                    console.log('✅ Neon conectado! Produtos:', this.state.produtos?.length || 0);
                    
                    if (Array.isArray(this.state.produtos)) {
                        await this.loadDashboard();
                        await this.loadProductsForSale();
                        showNotification('✅ Sistema conectado com sucesso!', 'success');
                    } else {
                        throw new Error('Resposta inválida do servidor');
                    }
                    
                } catch (error) {
                    console.error('❌ Falha na conexão com dados:', error);
                    showNotification('⚠️ Conectado, mas erro nos dados. Modo limitado.', 'warning');
                    this.showFallbackData();
                }
            } else {
                showNotification('❌ Servidor offline. Modo desconectado.', 'error');
                this.showFallbackData();
            }
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            showNotification('Erro ao inicializar o sistema', 'error');
        }
    },

    // Atualizar data e hora
    updateDateTime: function() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        const dateElement = document.getElementById('currentDate');
        const timeElement = document.getElementById('currentTime');
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('pt-BR', optionsDate);
        }
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('pt-BR');
        }
    },

    // Configurar navegação
    setupNavigation: function() {
        const tabs = document.querySelectorAll('.nav-tab');
        const pages = document.querySelectorAll('.page');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const pageId = tab.dataset.page;
                this.navigateTo(pageId);
            });
        });

        // Navegação inicial
        this.navigateTo('dashboard');
    },

    // Navegar para página
    navigateTo: function(pageId) {
        // Atualizar tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`.nav-tab[data-page="${pageId}"]`)?.classList.add('active');

        // Atualizar páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.state.currentPage = pageId;
            
            // Carregar conteúdo da página
            this.loadPageContent(pageId);
        }
    },

    // Carregar conteúdo da página
    loadPageContent: function(pageId) {
        switch(pageId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'vendas':
                this.loadProductsForSale();
                break;
            case 'produtos':
                this.loadProductsList();
                break;
            case 'fiados':
                this.carregarFiados();
                break;
            case 'relatorios':
                this.loadReports();
                break;
            case 'config':
                this.loadConfig();
                break;
        }
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Sincronizar
        document.getElementById('syncButton')?.addEventListener('click', () => this.syncData());
        
        // Botões de navegação
        document.getElementById('btnVerTodas')?.addEventListener('click', () => this.navigateTo('relatorios'));
        document.getElementById('btnVerTodosProdutos')?.addEventListener('click', () => this.navigateTo('produtos'));
        document.getElementById('btnReporEstoque')?.addEventListener('click', () => this.navigateTo('produtos'));
    },

    // Inicializar componentes
    initComponents: function() {
        // Emoji picker
        this.initEmojiPicker();
        
        // Payment options
        this.initPaymentOptions();
        
        // Photo upload
        this.initPhotoUpload();
    },

    // Inicializar emoji picker
    initEmojiPicker: function() {
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
    },

    // Inicializar opções de pagamento
    initPaymentOptions: function() {
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
    },

    // Inicializar upload de foto
    initPhotoUpload: function() {
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
    },

    // Sincronizar dados
    syncData: async function() {
        try {
            showNotification('🔄 Sincronizando com Neon...', 'info');
            
            await this.loadDashboard();
            await this.loadProductsForSale();
            await this.loadProductsList();
            
            showNotification('✅ Dados sincronizados!', 'success');
            
        } catch (error) {
            console.error('Erro na sincronização:', error);
            showNotification('❌ Erro na sincronização', 'error');
        }
    },

    // Mostrar dados de fallback (offline)
    showFallbackData: function() {
        console.log('📱 Exibindo dados de fallback (modo offline)');
        
        // Dashboard
        document.getElementById('todayRevenue').textContent = 'R$ 0,00';
        document.getElementById('todayChops').textContent = '0';
        document.getElementById('avgSale').textContent = 'R$ 0,00';
        document.getElementById('lowStock').textContent = '0';
        
        // Vendas Recentes
        const recentSalesList = document.getElementById('recentSalesList');
        if (recentSalesList) {
            recentSalesList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-wifi-slash"></i>
                    <p>Modo offline</p>
                </div>
            `;
        }
        
        // Produtos Top
        const topProductsList = document.getElementById('topProductsList');
        if (topProductsList) {
            topProductsList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-wifi-slash"></i>
                    <p>Modo offline</p>
                </div>
            `;
        }
        
        // Produtos para venda
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--warning); grid-column: 1 / -1;">
                    <i class="fas fa-wifi-slash" style="font-size: 50px;"></i>
                    <p style="margin-top: 10px;">Modo offline</p>
                    <p style="font-size: 14px; margin-top: 5px;">Conecte-se ao servidor para carregar produtos</p>
                    <button onclick="window.chopManager.syncData()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-redo"></i> Tentar reconectar
                    </button>
                </div>
            `;
        }
        
        // Gráficos
        const flavorsChartContainer = document.querySelector('#flavorsChart')?.parentElement;
        const weeklyChartContainer = document.querySelector('#weeklyChart')?.parentElement;
        
        if (flavorsChartContainer) {
            flavorsChartContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-wifi-slash" style="font-size: 40px; opacity: 0.3;"></i>
                    <p>Modo offline</p>
                </div>
            `;
        }
        
        if (weeklyChartContainer) {
            weeklyChartContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-wifi-slash" style="font-size: 40px; opacity: 0.3;"></i>
                    <p>Modo offline</p>
                </div>
            `;
        }
    },

    // Funções de cada página (serão implementadas nos arquivos específicos)
    loadDashboard: async function() {
        console.log('📊 Carregando dashboard...');
        // Implementado em dashboard.js
    },

    loadProductsForSale: async function() {
        console.log('🛍️ Carregando produtos para venda...');
        // Implementado em vendas.js
    },

    loadProductsList: async function() {
        console.log('📦 Carregando lista de produtos...');
        // Implementado em produtos.js
    },

    carregarFiados: async function() {
        console.log('💰 Carregando fiados...');
        // Implementado em fiados.js
    },

    loadReports: async function() {
        console.log('📈 Carregando relatórios...');
        // Implementado em relatorios.js
    },

    loadConfig: async function() {
        console.log('⚙️ Carregando configurações...');
        // Implementado em main.js
    }
};

// Tornar o sistema disponível globalmente
window.chopManager = ChopManager;

// Funções globais
window.navigateTo = function(pageId) {
    ChopManager.navigateTo(pageId);
};

window.syncData = function() {
    ChopManager.syncData();
};
