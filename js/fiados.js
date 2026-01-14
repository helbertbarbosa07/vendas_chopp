// ===== FIADOS =====
async function carregarFiados() {
    try {
        showNotification('🔄 Carregando fiados...', 'info');
        
        const response = await neonAPI('get_fiados');
        fiados = response.data || [];
        
        renderFiadosList(fiados);
        calcularResumoFiados(fiados);
        showNotification(`✅ ${fiados.length} fiados carregados`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar fiados:', error);
        showNotification('❌ Erro ao carregar fiados', 'error');
        renderFiadosList([]);
    }
}

function renderFiadosList(fiadosData) {
    const container = document.getElementById('fiadosList');
    if (!container) return;
    
    if (!fiadosData || fiadosData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray);">
                <i class="fas fa-hand-holding-usd"></i>
                <p>Nenhum fiado registrado</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    fiadosData.forEach(fiado => {
        const clienteNome = fiado.nome_cliente || 'Cliente';
        const valorTotal = fiado.valor_total || 0;
        const valorPago = fiado.valor_pago || 0;
        const saldo = valorTotal - valorPago;
        
        html += `
            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #36B5B0;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 16px; color: var(--dark); margin-bottom: 5px; font-weight: 700;">
                            ${clienteNome}
                        </h4>
                        <p style="font-size: 12px; color: var(--gray);">
                            <i class="fas fa-calendar-day"></i> ${formatarData(fiado.data_fiado || fiado.created_at)}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="padding: 4px 12px; border-radius: 15px; font-size: 11px; background: ${fiado.pago ? '#d4edda' : '#f8d7da'}; color: ${fiado.pago ? '#155724' : '#721c24'}">
                            ${fiado.pago ? 'PAGO' : 'PENDENTE'}
                        </span>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Valor Total:</span>
                        <span style="font-weight: 700;">R$ ${formatPrice(valorTotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Valor Pago:</span>
                        <span style="color: var(--success); font-weight: 700;">R$ ${formatPrice(valorPago)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px dashed #dee2e6;">
                        <span style="font-weight: 700;">Saldo:</span>
                        <span style="color: ${saldo > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight: 900;">
                            R$ ${formatPrice(saldo)}
                        </span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    ${!fiado.pago ? `
                        <button onclick="registrarPagamento(${fiado.id})" style="flex: 1; padding: 10px; background: var(--success); color: white; border: none; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-money-bill-wave"></i> Registrar Pagamento
                        </button>
                    ` : ''}
                    <button onclick="editarFiado(${fiado.id})" style="flex: 1; padding: 10px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-edit"></i> Detalhes
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function calcularResumoFiados(fiadosList = []) {
    const totalReceber = fiadosList.reduce((sum, f) => sum + ((f.valor_total || 0) - (f.valor_pago || 0)), 0);
    const clientesAtraso = fiadosList.filter(f => !f.pago).length;
    const recebidoMes = fiadosList.reduce((sum, f) => sum + (f.valor_pago || 0), 0);
    
    if (document.getElementById('totalReceber')) {
        document.getElementById('totalReceber').textContent = `R$ ${formatPrice(totalReceber)}`;
    }
    if (document.getElementById('recebidoMes')) {
        document.getElementById('recebidoMes').textContent = `R$ ${formatPrice(recebidoMes)}`;
    }
    if (document.getElementById('clientesAtraso')) {
        document.getElementById('clientesAtraso').textContent = clientesAtraso;
    }
    if (document.getElementById('fiadosAtivos')) {
        document.getElementById('fiadosAtivos').textContent = fiadosList.filter(f => !f.pago).length;
    }
}

function registrarPagamento(id) {
    showNotification('💵 Registro de pagamento em desenvolvimento', 'info');
}

function editarFiado(id) {
    showNotification('✏️ Detalhes do fiado em desenvolvimento', 'info');
}

// Configurar botões fiados
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('novoFiado')?.addEventListener('click', () => {
        showNotification('➕ Novo fiado em desenvolvimento', 'info');
    });
});

// Exportar funções
window.carregarFiados = carregarFiados;
window.registrarPagamento = registrarPagamento;
window.editarFiado = editarFiado;
