// ===== FIADOS =====
let fiadoSelecionadoId = null;

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
        const atrasado = !fiado.pago && fiado.data_vencimento && new Date(fiado.data_vencimento) < new Date();
        
        html += `
            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid ${atrasado ? 'var(--danger)' : (fiado.pago ? 'var(--success)' : '#36B5B0')};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 16px; color: var(--dark); margin-bottom: 5px; font-weight: 700;">
                            ${clienteNome}
                        </h4>
                        <p style="font-size: 12px; color: var(--gray);">
                            <i class="fas fa-calendar-day"></i> ${formatarData(fiado.data_fiado || fiado.created_at)}
                            ${fiado.data_vencimento ? ` • Vence: ${formatarData(fiado.data_vencimento)}` : ''}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="padding: 4px 12px; border-radius: 15px; font-size: 11px; background: ${atrasado ? '#f8d7da' : (fiado.pago ? '#d4edda' : '#fff3cd')}; color: ${atrasado ? '#721c24' : (fiado.pago ? '#155724' : '#856404')}">
                            ${atrasado ? 'ATRASADO' : (fiado.pago ? 'PAGO' : 'PENDENTE')}
                        </span>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="margin-bottom: 10px;">
                        <strong>Produtos:</strong>
                        <p style="font-size: 13px; color: var(--gray); margin-top: 5px;">${fiado.produtos || 'Sem descrição'}</p>
                    </div>
                    
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
                    <button onclick="excluirFiado(${fiado.id})" style="padding: 10px 15px; background: var(--danger); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function registrarPagamento(id) {
    try {
        fiadoSelecionadoId = id;
        const fiado = fiados.find(f => f.id === id);
        
        if (!fiado) {
            showNotification('❌ Fiado não encontrado', 'error');
            return;
        }
        
        // Abrir modal de pagamento
        const modal = document.getElementById('pagamentoModal');
        if (modal) {
            const infoDiv = document.getElementById('pagamentoInfo');
            if (infoDiv) {
                infoDiv.innerHTML = `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p><strong>Cliente:</strong> ${fiado.nome_cliente}</p>
                        <p><strong>Saldo Devedor:</strong> R$ ${formatPrice((fiado.valor_total || 0) - (fiado.valor_pago || 0))}</p>
                        <p><strong>Valor Total:</strong> R$ ${formatPrice(fiado.valor_total || 0)}</p>
                    </div>
                `;
            }
            
            // Configurar data atual como padrão
            const hoje = new Date().toISOString().split('T')[0];
            const dataPagamento = document.getElementById('dataPagamento');
            if (dataPagamento) {
                dataPagamento.value = hoje;
            }
            
            // Configurar valor do saldo como padrão
            const valorPagamento = document.getElementById('valorPagamento');
            if (valorPagamento) {
                valorPagamento.value = (fiado.valor_total || 0) - (fiado.valor_pago || 0);
            }
            
            modal.classList.add('active');
        }
        
    } catch (error) {
        console.error('Erro ao abrir modal de pagamento:', error);
        showNotification('❌ Erro ao processar pagamento', 'error');
    }
}

function fecharPagamentoModal() {
    const modal = document.getElementById('pagamentoModal');
    if (modal) {
        modal.classList.remove('active');
    }
    fiadoSelecionadoId = null;
}

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
        
        const fiado = fiados.find(f => f.id === fiadoSelecionadoId);
        if (!fiado) {
            showNotification('❌ Fiado não encontrado', 'error');
            return;
        }
        
        showNotification('🔄 Registrando pagamento...', 'info');
        
        // Atualizar fiado na API
        await neonAPI('update_fiado_pago', { id: fiadoSelecionadoId });
        
        // Fechar modal
        fecharPagamentoModal();
        
        // Recarregar fiados
        await carregarFiados();
        
        showNotification('✅ Pagamento registrado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        showNotification('❌ Erro ao registrar pagamento', 'error');
    }
}

async function excluirFiado(id) {
    try {
        const fiado = fiados.find(f => f.id === id);
        if (!fiado) {
            showNotification('❌ Fiado não encontrado', 'error');
            return;
        }
        
        const confirmacao = fiado.pago 
            ? `Tem certeza que deseja excluir o fiado de ${fiado.nome_cliente}?\n\nEste fiado já está PAGO.`
            : `Tem certeza que deseja excluir o fiado de ${fiado.nome_cliente}?\n\nSaldo pendente: R$ ${formatPrice((fiado.valor_total || 0) - (fiado.valor_pago || 0))}`;
        
        if (!confirm(confirmacao)) {
            return;
        }
        
        showNotification('🔄 Excluindo fiado...', 'info');
        
        await neonAPI('delete_fiado', { id: id });
        
        // Recarregar fiados
        await carregarFiados();
        
        showNotification('✅ Fiado excluído com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao excluir fiado:', error);
        showNotification('❌ Erro ao excluir fiado', 'error');
    }
}

function editarFiado(id) {
    const fiado = fiados.find(f => f.id === id);
    if (fiado) {
        showNotification(`✏️ Editando fiado de ${fiado.nome_cliente}...`, 'info');
        // Aqui você pode implementar um modal de edição completo
        // Por enquanto mostramos os detalhes
        const detalhes = `
            Cliente: ${fiado.nome_cliente}
            Telefone: ${fiado.telefone || 'Não informado'}
            Produtos: ${fiado.produtos}
            Valor Total: R$ ${formatPrice(fiado.valor_total || 0)}
            Valor Pago: R$ ${formatPrice(fiado.valor_pago || 0)}
            Status: ${fiado.pago ? 'PAGO' : 'PENDENTE'}
            Data: ${formatarData(fiado.data_fiado)}
            ${fiado.data_vencimento ? `Vencimento: ${formatarData(fiado.data_vencimento)}` : ''}
            ${fiado.observacoes ? `Observações: ${fiado.observacoes}` : ''}
        `;
        alert(detalhes);
    }
}

function calcularResumoFiados(fiadosList = []) {
    const totalReceber = fiadosList.reduce((sum, f) => sum + ((f.valor_total || 0) - (f.valor_pago || 0)), 0);
    const clientesAtraso = fiadosList.filter(f => !f.pago && f.data_vencimento && new Date(f.data_vencimento) < new Date()).length;
    const recebidoMes = fiadosList.filter(f => f.pago).reduce((sum, f) => sum + (f.valor_total || 0), 0);
    
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

// Configurar botões fiados
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('novoFiado')?.addEventListener('click', () => {
        abrirModalNovoFiado();
    });
});

function abrirModalNovoFiado() {
    showNotification('➕ Modal de novo fiado em desenvolvimento', 'info');
    // Implementar modal completo para criar novo fiado
}

// Exportar funções
window.carregarFiados = carregarFiados;
window.registrarPagamento = registrarPagamento;
window.editarFiado = editarFiado;
window.excluirFiado = excluirFiado;
window.fecharPagamentoModal = fecharPagamentoModal;
window.confirmarPagamento = confirmarPagamento;
