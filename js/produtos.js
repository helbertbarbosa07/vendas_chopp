// ===== SISTEMA DE FIADOS =====
async function carregarFiados() {
    try {
        const lista = document.getElementById('fiadosList');
        lista.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i><p>Carregando fiados...</p></div>';
        
        fiados = await neonAPI('get_fiados');
        
        if (!Array.isArray(fiados) || fiados.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-hand-holding-usd"></i>
                    <p>Nenhum fiado registrado</p>
                </div>
            `;
            calcularResumoFiados();
            return;
        }
        
        calcularResumoFiados(fiados);
        
        let html = '';
        fiados.forEach(fiado => {
            const clienteNome = fiado.cliente_nome || 'Cliente';
            const valorTotal = fiado.valor_total || 0;
            const valorPago = fiado.valor_pago || 0;
            const saldo = valorTotal - valorPago;
            const atrasado = fiado.status === 'pendente' && new Date(fiado.data_vencimento) < new Date();
            
            html += `
                <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid ${atrasado ? '#dc3545' : '#36B5B0'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; color: var(--dark); margin-bottom: 5px; font-weight: 700;">
                                ${clienteNome}
                            </h4>
                            <p style="font-size: 12px; color: var(--gray);">
                                <i class="fas fa-calendar-day"></i> Vence: ${formatarData(fiado.data_vencimento)}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <span style="padding: 4px 12px; border-radius: 15px; font-size: 11px; background: ${atrasado ? '#f8d7da' : '#d4edda'}; color: ${atrasado ? '#721c24' : '#155724'}">
                                ${atrasado ? 'ATRASADO' : fiado.status?.toUpperCase() || 'PENDENTE'}
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
                            <span style="font-weight: 700;">Saldo Devedor:</span>
                            <span style="color: ${saldo > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight: 900;">
                                R$ ${formatPrice(saldo)}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="registrarPagamento(${fiado.id})" style="flex: 1; padding: 10px; background: var(--success); color: white; border: none; border-radius: 8px;">
                            <i class="fas fa-money-bill-wave"></i> Registrar Pagamento
                        </button>
                        <button onclick="editarFiado(${fiado.id})" style="padding: 10px 15px; background: var(--primary); color: white; border: none; border-radius: 8px;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        lista.innerHTML = html;
        
    } catch (error) {
        console.error('Erro fiados:', error);
    }
}

function calcularResumoFiados(fiadosList = []) {
    const totalReceber = fiadosList.reduce((sum, f) => sum + ((f.valor_total || 0) - (f.valor_pago || 0)), 0);
    const clientesAtraso = fiadosList.filter(f => f.status === 'pendente' && new Date(f.data_vencimento) < new Date()).length;
    
    document.getElementById('totalReceber').textContent = `R$ ${formatPrice(totalReceber)}`;
    document.getElementById('recebidoMes').textContent = `R$ ${formatPrice(totalReceber * 0.3)}`;
    document.getElementById('clientesAtraso').textContent = clientesAtraso;
    document.getElementById('fiadosAtivos').textContent = fiadosList.filter(f => f.status !== 'pago').length;
}

function registrarPagamento(id) {
    showNotification('💵 Registro de pagamento em desenvolvimento', 'info');
}

function editarFiado(id) {
    showNotification('✏️ Edição de fiados em desenvolvimento', 'info');
}

// Configurar botões fiados
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('novoFiado')?.addEventListener('click', () => {
        showNotification('➕ Novo fiado em desenvolvimento', 'info');
    });
});
