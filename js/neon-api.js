// ===== CONFIGURAÇÃO NEON =====
const NeonAPI = {
    // Configuração
    API_URL: 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon',
    isLoading: false,

    // Testar conexão
    testConnection: async function() {
        try {
            console.log('🔌 Testando conexão com API...');
            
            const response = await fetch(this.API_URL, {
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
    },

    // Função principal
    call: async function(action, data = null) {
        if (this.isLoading) {
            console.log(`⏳ ${action} em espera (já carregando)`);
            return;
        }
        
        try {
            this.isLoading = true;
            console.log(`🔄 Executando: ${action}`, data);
            
            const response = await fetch(this.API_URL, {
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
            this.isLoading = false;
        }
    },

    // Métodos específicos
    getProdutos: function() {
        return this.call('get_produtos');
    },

    getProduto: function(id) {
        return this.call('get_produto', { id });
    },

    createProduto: function(data) {
        return this.call('create_produto', data);
    },

    updateProduto: function(data) {
        return this.call('update_produto', data);
    },

    deleteProduto: function(id) {
        return this.call('delete_produto', { id });
    },

    createVenda: function(data) {
        return this.call('create_venda', data);
    },

    getVendasRecentes: function() {
        return this.call('get_vendas_recentes');
    },

    getVendasSemana: function() {
        return this.call('get_vendas_semana');
    },

    getDashboardStats: function() {
        return this.call('get_dashboard_stats');
    },

    getRelatorioCompleto: function() {
        return this.call('get_relatorio_completo');
    },

    updateEstoque: function(data) {
        return this.call('update_estoque', data);
    },

    // Backup
    getVendasPeriodo: function(startDate, endDate) {
        return this.call('get_vendas_periodo', { startDate, endDate });
    }
};

// Tornar API disponível globalmente
window.NeonAPI = NeonAPI;
window.neonAPI = NeonAPI.call.bind(NeonAPI);
