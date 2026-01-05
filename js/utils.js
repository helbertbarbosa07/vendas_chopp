// ===== UTILITÁRIOS GERAIS =====
const ChopUtils = {
    // Formatar preço
    formatPrice: function(value) {
        if (value === undefined || value === null || value === '') return '0,00';
        const num = Number(value);
        return isNaN(num) ? '0,00' : num.toFixed(2).replace('.', ',');
    },

    // Formatar data
    formatDate: function(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Data inválida';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return 'Data inválida';
        }
    },

    // Formatar hora
    formatTime: function(timeString) {
        try {
            const time = new Date(`1970-01-01T${timeString}`);
            if (isNaN(time.getTime())) return '--:--';
            return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return timeString || '--:--';
        }
    },

    // Mostrar loading
    showLoading: function(elementId, message = 'Carregando...') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    },

    // Mostrar notificação
    showNotification: function(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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

    // Validar email
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar telefone
    isValidPhone: function(phone) {
        const re = /^(\d{2})\s?(\d{4,5})-?(\d{4})$/;
        return re.test(phone);
    },

    // Gerar ID único
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Capitalizar texto
    capitalize: function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    // Formatar CPF/CNPJ
    formatDocument: function(doc) {
        if (!doc) return '';
        const cleaned = doc.replace(/\D/g, '');
        
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cleaned.length === 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return doc;
    },

    // Formatar moeda para input
    formatCurrencyInput: function(value) {
        return value.replace(/\D/g, '')
            .replace(/(\d)(\d{2})$/, '$1,$2')
            .replace(/(?=(\d{3})+(\D))\B/g, '.');
    },

    // Parse moeda para número
    parseCurrency: function(value) {
        return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    },

    // Debounce para inputs
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Download arquivo
    downloadFile: function(filename, content, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Copiar para clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Texto copiado para a área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            this.showNotification('Erro ao copiar texto', 'error');
        });
    },

    // Verificar se é número
    isNumber: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Verificar se está vazio
    isEmpty: function(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    // Truncar texto
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Calcular idade
    calculateAge: function(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    // Formatar bytes
    formatBytes: function(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
};

// Tornar funções disponíveis globalmente
window.formatPrice = ChopUtils.formatPrice;
window.formatDate = ChopUtils.formatDate;
window.showNotification = ChopUtils.showNotification;
window.showLoading = ChopUtils.showLoading;
