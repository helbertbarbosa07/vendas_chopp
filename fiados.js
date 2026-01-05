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
                        <button class="btn-primary" onclick="window.chopManager.abrirModalFiado()" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i> Adicionar Fiado
                        </button>
                    </div>
                `;
                return;
            }
            
            this.calcularResumoFiados();
            this.renderFiadosList();
            
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

    // Calcular resumo de fiados
    calcularResumoFiados: function() {
        if (!Array.isArray(this.state.fiados)) return;
        
        const totalReceber = this.state.fiados
            .filter(f => f.status !== 'pago')
            .reduce((sum, f) => sum + (parseFloat(f.total_devedor) - parseFloat(f.total_pago || 0)), 0);
        
        const recebidoMes = this.state.fiados
            .filter(f => {
                const data = new Date(f.created_at);
                const hoje = new Date();
                return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
            })
            .reduce((sum, f) => sum + parseFloat(f.total_pago || 0), 0);
        
        const clientesAtraso = this.state.fiados.filter(f => f.status === 'atrasado').length;
        const fiadosAtivos = this.state.fiados.filter(f => f.status === 'pendente').length;
        
        document.getElementById('totalReceber').textContent = `R$ ${formatPrice(totalReceber)}`;
        document.getElementById('recebidoMes').textContent = `R$ ${formatPrice(recebidoMes)}`;
        document.getElementById('clientesAtraso').textContent = clientesAtraso;
        document.getElementById('fiadosAtivos').textContent = fiadosAtivos;
    },

    // Renderizar lista de fiados
    renderFiadosList: function() {
        const lista = document.getElementById('fiadosList');
        const filterStatus = document.getElementById('filterStatus')?.value || 'todos';
        const searchCliente = document.getElementById('searchCliente')?.value.toLowerCase() || '';
        
        let fiadosFiltrados = [...this.state.fiados];
        
        if (filterStatus !== 'todos') {
            fiadosFiltrados = fiadosFiltrados.filter(f => f.status === filterStatus);
        }
        
        if (searchCliente) {
            fiadosFiltrados = fiadosFiltrados.filter(f => 
                f.cliente_nome.toLowerCase().includes(searchCliente) ||
                (f.cliente_telefone && f.cliente_telefone.includes(searchCliente))
            );
        }
        
        if (fiadosFiltrados.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-search" style="font-size: 40px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px;">Nenhum fiado encontrado</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left;">Cliente</th>
                        <th style="padding: 12px; text-align: left;">Telefone</th>
                        <th style="padding: 12px; text-align: left;">Valor</th>
                        <th style="padding: 12px; text-align: left;">Pago</th>
                        <th style="padding: 12px; text-align: left;">Status</th>
                        <th style="padding: 12px; text-align: left;">Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        fiadosFiltrados.forEach((fiado, index) => {
            const deve = parseFloat(fiado.total_devedor) - parseFloat(fiado.total_pago || 0);
            const statusColor = {
                'pendente': 'warning',
                'pago': 'success',
                'atrasado': 'danger',
                'parcial': 'info'
            }[fiado.status] || 'secondary';
            
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px;">${fiado.cliente_nome}</td>
                    <td style="padding: 12px;">${fiado.cliente_telefone || '--'}</td>
                    <td style="padding: 12px; font-weight: 700;">R$ ${formatPrice(fiado.total_devedor)}</td>
                    <td style="padding: 12px; color: var(--success);">R$ ${formatPrice(fiado.total_pago || 0)}</td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 15px; background: var(--${statusColor}); color: white; font-size: 12px; font-weight: 700;">
                            ${fiado.status.toUpperCase()}
                        </span>
                    </td>
                    <td style="padding: 12px;">
                        <button onclick="window.chopManager.registrarPagamento(${index})" 
                                style="padding: 6px 12px; background: var(--success); color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>
                        <button onclick="window.chopManager.editarFiado(${index})" 
                                style="padding: 6px 12px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        lista.innerHTML = html;
    },

    // Abrir modal de fiado
    abrirModalFiado: function() {
        showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
    },

    // Registrar pagamento
    registrarPagamento: function(index) {
        showNotification('Funcionalidade de pagamento em desenvolvimento', 'info');
    },

    // Editar fiado
    editarFiado: function(index) {
        showNotification('Funcionalidade de edição em desenvolvimento', 'info');
    },

    // Exportar fiados
    exportarFiados: function() {
        showNotification('Funcionalidade de exportação em desenvolvimento', 'info');
    }
});

// Event listeners específicos de fiados
document.addEventListener('DOMContentLoaded', function() {
    // Filtrar fiados
    document.getElementById('filterStatus')?.addEventListener('change', () => {
        window.chopManager.renderFiadosList();
    });
    
    // Buscar cliente
    document.getElementById('searchCliente')?.addEventListener('input', () => {
        window.chopManager.renderFiadosList();
    });
    
    // Exportar fiados
    document.getElementById('btnExportFiados')?.addEventListener('click', () => {
        window.chopManager.exportarFiados();
    });
    
    // Novo fiado
    document.getElementById('novoFiado')?.addEventListener('click', () => {
        window.chopManager.abrirModalFiado();
    });
});
