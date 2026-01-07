// fiados.js
import { neonAPI, showNotification, showLoading } from './main.js';

// Variáveis do módulo
let fiados = [];

// ===== FUNÇÕES DE FIADOS =====
export async function carregarFiados() {
    try {
        showLoading('fiadosList', 'Carregando fiados...');
        
        fiados = await neonAPI('get_fiados');
        const lista = document.getElementById('fiadosList');
        
        if (!Array.isArray(fiados) || fiados.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-hand-holding-usd" style="font-size: 50px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px;">Nenhum fiado registrado</p>
                    <button class="btn-primary" onclick="fiadosModule.abrirModalFiado()" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Adicionar Fiado
                    </button>
                </div>
            `;
            return;
        }
        
        calcularResumoFiados();
        
    } catch (error) {
        console.error('Erro ao carregar fiados:', error);
        showNotification('Erro ao carregar fiados', 'error');
    }
}

export function calcularResumoFiados() {
    document.getElementById('totalReceber').textContent = 'R$ 0,00';
    document.getElementById('clientesAtraso').textContent = '0';
    document.getElementById('fiadosAtivos').textContent = '0';
}

export function abrirModalFiado() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

export function abrirModalFiadoParaVenda() {
    showNotification('Para vendas fiadas, aguarde a próxima atualização', 'info');
}

export function exportarFiados() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

// Configuração de eventos específicos do módulo de fiados
export function setupFiadoEventListeners() {
    document.getElementById('novoFiado')?.addEventListener('click', abrirModalFiado);
    document.getElementById('btnExportFiados')?.addEventListener('click', exportarFiados);
    
    document.getElementById('filterStatus')?.addEventListener('change', carregarFiados);
    document.getElementById('searchCliente')?.addEventListener('input', carregarFiados);
    
    // Eventos para modais de fiados (se existirem)
    document.getElementById('closeFiadoModal')?.addEventListener('click', fecharFiadoModal);
    document.getElementById('cancelFiadoModal')?.addEventListener('click', fecharFiadoModal);
    document.getElementById('saveFiado')?.addEventListener('click', salvarFiado);
    document.getElementById('addProdutoFiado')?.addEventListener('click', adicionarProdutoFiado);
}

// Funções auxiliares para modais de fiados
export function fecharFiadoModal() {
    document.getElementById('fiadoModal').classList.remove('active');
}

export function salvarFiado() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

export function adicionarProdutoFiado() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

export function fecharPagamentoModal() {
    document.getElementById('pagamentoModal').classList.remove('active');
}

export function confirmarPagamento() {
    showNotification('Funcionalidade de pagamento de fiados em desenvolvimento', 'info');
}

// Exportar módulo
export default {
    carregarFiados,
    abrirModalFiado,
    abrirModalFiadoParaVenda,
    exportarFiados,
    setupFiadoEventListeners,
    fecharFiadoModal,
    salvarFiado,
    adicionarProdutoFiado,
    fecharPagamentoModal,
    confirmarPagamento
};
