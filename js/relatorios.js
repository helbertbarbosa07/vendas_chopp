// ===== RELATÓRIOS =====
Object.assign(window.chopManager, {
    // Carregar relatórios
    loadReports: async function() {
        try {
            showLoading('reportContent', 'Gerando relatório...');
            
            const periodo = document.getElementById('reportPeriod')?.value || 'mes';
            let startDate, endDate;
            
            const hoje = new Date();
            
            switch(periodo) {
                case 'hoje':
                    startDate = endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'ontem':
                    const ontem = new Date(hoje);
                    ontem.setDate(ontem.getDate() - 1);
                    startDate = endDate = ontem.toISOString().split('T')[0];
                    break;
                case 'semana':
                    const semanaAtras = new Date(hoje);
                    semanaAtras.setDate(semanaAtras.getDate() - 7);
                    startDate = semanaAtras.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'mes':
                    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    startDate = primeiroDiaMes.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'ano':
                    const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);
                    startDate = primeiroDiaAno.toISOString().split('T')[0];
                    endDate = hoje.toISOString().split('T')[0];
                    break;
                case 'personalizado':
                    startDate = document.getElementById('startDate')?.value;
                    endDate = document.getElementById('endDate')?.value;
                    break;
            }
            
            // Buscar dados do período
            const [vendasPeriodo, produtosData, relatorioCompleto] = await Promise.all([
                NeonAPI.getVendasPeriodo(startDate, endDate),
                NeonAPI.getProdutos(),
                NeonAPI.getRelatorioCompleto()
            ]);
            
            this.renderReport(vendasPeriodo, produtosData, relatorioCompleto, startDate, endDate);
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            showNotification('Erro ao gerar relatório', 'error');
            
            document.getElementById('reportContent').innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px;">Erro ao carregar relatório</p>
                    <p style="font-size: 14px; margin-top: 5px; color: var(--gray);">
                        Verifique sua conexão com o banco de dados
                    </p>
                    <button class="btn-primary" onclick="window.chopManager.loadReports()" style="margin-top: 15px;">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                </div>
            `;
        }
    },

    // Renderizar relatório
    renderReport: function(vendasPeriodo, produtosData, relatorioCompleto, startDate, endDate) {
        const reportContent = document.getElementById('reportContent');
        
        if (!Array.isArray(vendasPeriodo) || !Array.isArray(produtosData)) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--gray);">
                    <i class="fas fa-chart-bar" style="font-size: 40px; opacity: 0.3;"></i>
                    <p>Sem dados para o período selecionado</p>
                </div>
            `;
            return;
        }
        
        // Calcular estatísticas
        const totalVendas = vendasPeriodo.length;
        const totalFaturamento = vendasPeriodo.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
        const totalItens
