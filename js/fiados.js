// ===== FIADOS =====
Object.assign(window.chopManager, {
    // Carregar fiados
    carregarFiados: async function() {
        try {
            showLoading('fiadosList', 'Carregando fiados...');
            
            this.state.fiados = await NeonAPI.call('get_fiados') || [];
            const lista = document.getElementById('fiadosList');
            
            if (!Array.isArray(this.state.fiados) || this.state.fiados.length === 0) {
                lista.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-hand-holding-usd" style="font-size: 50px; opacity: 0.3;"></i>
                        <p style="margin-top: 10px;">Nenhum fiado registrado</p>
                        <button class="btn-primary" onclick="abrirModalFiado()" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i> Adicionar Fiado
                        </button>
                    </div>
                `;
                return;
            }
            
            this.calcularResumoFiados();
            
        } catch (error) {
            console.error('Erro ao carregar fiados:', error);
            showNotification('Erro ao carregar fiados', 'error');
            
            const lista = document.getElementById('fiadosList');
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--warning);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px;"></i>
                    <p style="margin-top: 10px;">Erro ao carregar fiados</p>
                    <button class="btn-primary" onclick="window.chopManager.carregarFiados()" style="margin-top: 15px;">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                </div>
            `;
        }
    },

    // Calcular resumo de fiados (simplificado - para demonstrativo)
    calcularResumoFiados: function() {
        document.getElementById('totalReceber').textContent = 'R$ 0,00';
        document.getElementById('recebidoMes').textContent = 'R$ 0,00';
        document.getElementById('clientesAtraso').textContent = '0';
        document.getElementById('fiadosAtivos').textContent = '0';
    }
});

// Funções básicas para modais de fiados
window.abrirModalFiado = function() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
};

window.exportarFiados = function() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
};

window.abrirModalFiadoParaVenda = function() {
    showNotification('Para vendas fiadas, aguarde a próxima atualização', 'info');
};

// Event listeners específicos de fiados
document.addEventListener('DOMContentLoaded', function() {
    // Filtrar fiados (desativado por enquanto)
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', () => {
            showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
        });
    }
    
    // Buscar cliente (desativado por enquanto)
    const searchCliente = document.getElementById('searchCliente');
    if (searchCliente) {
        searchCliente.addEventListener('input', () => {
            showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
        });
    }
    
    // Exportar fiados
    const btnExportFiados = document.getElementById('btnExportFiados');
    if (btnExportFiados) {
        btnExportFiados.addEventListener('click', exportarFiados);
    }
    
    // Novo fiado
    const novoFiado = document.getElementById('novoFiado');
    if (novoFiado) {
        novoFiado.addEventListener('click', abrirModalFiado);
    }
});
