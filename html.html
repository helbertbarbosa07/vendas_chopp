<!DOCTYPE html>
<html lang="pt-BR"> 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍦 Chop Manager PRO - Sistema Completo</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        /* ===== VARIÁVEIS E RESET ===== */
        :root {
            --primary: #36B5B0;
            --secondary: #FF7BAC;
            --accent: #FFD166;
            --dark: #2A2D43;
            --light: #F8F9FA;
            --success: #4CAF50;
            --warning: #FF9800;
            --danger: #F44336;
            --gray: #6c757d;
            --shadow: 0 5px 15px rgba(0,0,0,0.1);
            --radius: 15px;
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        /* ===== LAYOUT PRINCIPAL ===== */
        .app-container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 25px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            overflow: hidden;
            min-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        
        /* ===== HEADER ===== */
        .header {
            background: linear-gradient(135deg, var(--primary), #2A9D8F);
            color: white;
            padding: 25px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 5px solid var(--secondary);
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '🍦🍨🍧';
            position: absolute;
            font-size: 60px;
            opacity: 0.1;
            right: 30px;
            top: 10px;
            transform: rotate(-15deg);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .logo-icon {
            font-size: 45px;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .logo-text h1 {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .logo-text span {
            color: var(--accent);
            font-weight: 900;
        }
        
        /* ===== NAVEGAÇÃO ===== */
        .nav-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 3px solid var(--primary);
            padding: 0 20px;
            overflow-x: auto;
        }
        
        .nav-tab {
            padding: 20px 25px;
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 700;
            color: var(--gray);
            cursor: pointer;
            transition: var(--transition);
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            white-space: nowrap;
        }
        
        .nav-tab:hover {
            color: var(--dark);
            background: rgba(54, 181, 176, 0.1);
        }
        
        .nav-tab.active {
            color: var(--primary);
            background: white;
        }
        
        .nav-tab.active::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--secondary);
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        
        /* ===== CONTEÚDO ===== */
        .main-content {
            flex: 1;
            padding: 30px;
            background: #f9f9f9;
        }
        
        .page {
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .page.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* ===== FORMAS DE PAGAMENTO ===== */
        .payment-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .payment-option {
            position: relative;
            cursor: pointer;
        }
        
        .payment-option input {
            display: none;
        }
        
        .payment-card {
            background: white;
            border: 3px solid #dee2e6;
            border-radius: 15px;
            padding: 25px 20px;
            text-align: center;
            transition: var(--transition);
        }
        
        .payment-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            border-color: var(--primary);
        }
        
        .payment-option input:checked + .payment-card {
            border-color: var(--success);
            background: linear-gradient(135deg, #f8fff9, #e8f5e9);
            transform: scale(1.05);
            box-shadow: 0 15px 30px rgba(76, 175, 80, 0.2);
        }
        
        .payment-icon {
            font-size: 40px;
            margin-bottom: 15px;
            display: block;
        }
        
        .payment-name {
            font-size: 18px;
            font-weight: 700;
            color: var(--dark);
        }
        
        /* ===== PERSONALIZAÇÃO DE EMOJI ===== */
        .emoji-picker {
            position: absolute;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 15px;
            z-index: 100;
            display: none;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            max-width: 300px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .emoji-picker.show {
            display: grid;
        }
        
        .emoji-option {
            font-size: 24px;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            text-align: center;
            transition: var(--transition);
        }
        
        .emoji-option:hover {
            background: #f0f0f0;
            transform: scale(1.2);
        }
        
        .emoji-selected {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-top: 10px;
        }
        
        .emoji-selected span {
            font-size: 30px;
        }
        
        /* ===== BOTÕES ===== */
        .export-buttons {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .export-btn {
            padding: 15px 25px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
        }
        
        .export-btn.print {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
        }
        
        .export-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        /* ===== NOTIFICAÇÕES ===== */
        .notification {
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 20px 30px;
            border-radius: 15px;
            color: white;
            font-weight: 700;
            z-index: 2000;
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
            display: none;
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
            backdrop-filter: blur(10px);
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification.show {
            display: block;
        }
        
        .notification.success {
            background: linear-gradient(135deg, var(--success), #3d8b40);
        }
        
        .notification.error {
            background: linear-gradient(135deg, var(--danger), #d32f2f);
        }
        
        .notification.info {
            background: linear-gradient(135deg, var(--primary), #2A9D8F);
        }
        
        /* ===== RESPONSIVIDADE ===== */
        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                text-align: center;
                gap: 20px;
                padding: 20px;
            }
            
            .nav-tabs {
                overflow-x: auto;
                padding: 0 10px;
            }
            
            .nav-tab {
                padding: 15px 20px;
                font-size: 14px;
                white-space: nowrap;
            }
            
            .payment-options {
                grid-template-columns: 1fr;
            }
            
            .export-buttons {
                flex-direction: column;
            }
            
            .export-btn {
                width: 100%;
                justify-content: center;
            }
        }
        
        /* ===== ESTILOS BÁSICOS ===== */
        .page-title {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .page-title i {
            font-size: 32px;
            color: var(--primary);
            background: rgba(54, 181, 176, 0.1);
            padding: 15px;
            border-radius: 50%;
        }
        
        .page-title h2 {
            font-size: 32px;
            color: var(--dark);
            font-weight: 800;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            border-top: 5px solid var(--primary);
            transition: var(--transition);
            position: relative;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        
        .flavors-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }
        
        .flavor-card {
            background: white;
            border-radius: 20px;
            padding: 25px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--shadow);
            border: 3px solid transparent;
        }
        
        .flavor-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            border-color: var(--primary);
        }
        
        .cart-container {
            background: white;
            border-radius: 25px;
            padding: 30px;
            box-shadow: var(--shadow);
            margin-top: 30px;
        }
        
        .btn-primary {
            padding: 15px 30px;
            background: linear-gradient(135deg, var(--primary), #2A9D8F);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(54, 181, 176, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(54, 181, 176, 0.4);
        }
        
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
            backdrop-filter: blur(5px);
        }
        
        .modal-overlay.active {
            display: flex;
        }
        
        .modal {
            background: white;
            border-radius: 25px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
            color: var(--dark);
            font-size: 16px;
        }
        
        .form-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #dee2e6;
            border-radius: 10px;
            font-size: 16px;
            transition: var(--transition);
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(54, 181, 176, 0.1);
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            background: var(--dark);
            color: white;
            font-size: 14px;
            border-top: 5px solid var(--primary);
        }
        
        /* ===== ESTILOS PARA ÚLTIMAS VENDAS ===== */
        .recent-sales-container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: var(--shadow);
            margin-top: 30px;
        }
        
        .sales-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .sales-header h3 {
            color: var(--dark);
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .sales-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .sales-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            color: var(--dark);
            font-weight: 700;
            border-bottom: 2px solid var(--primary);
            font-size: 14px;
        }
        
        .sales-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        
        .sales-table tr:hover {
            background: #f8f9fa;
        }
        
        .payment-badge {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
        }
        
        .payment-dinheiro {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .payment-cartao {
            background: #e3f2fd;
            color: #1565c0;
        }
        
        .payment-pix {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .empty-sales {
            text-align: center;
            padding: 30px 20px;
            color: var(--gray);
        }
        
        .empty-sales i {
            font-size: 40px;
            margin-bottom: 10px;
            opacity: 0.3;
        }
        
        /* ===== ESTILOS PARA FOTO DO PRODUTO ===== */
        .photo-upload-container {
            border: 2px dashed #dee2e6;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            margin-bottom: 15px;
        }
        
        .photo-upload-container:hover {
            border-color: var(--primary);
            background: rgba(54, 181, 176, 0.05);
        }
        
        .photo-preview {
            max-width: 150px;
            max-height: 150px;
            border-radius: 10px;
            object-fit: cover;
            margin-bottom: 10px;
            display: none;
        }
        
        .photo-preview.show {
            display: block;
        }
        
        .upload-icon {
            font-size: 40px;
            color: var(--primary);
            margin-bottom: 10px;
        }
        
        /* ===== ESTILOS PARA PRODUTOS MAIS VENDIDOS ===== */
        .top-products-container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: var(--shadow);
            margin-top: 30px;
        }
        
        .top-products-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .top-product-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 15px;
            transition: var(--transition);
        }
        
        .top-product-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .top-product-emoji {
            font-size: 30px;
            margin-right: 15px;
        }
        
        .top-product-info {
            flex: 1;
        }
        
        .top-product-name {
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .top-product-stats {
            display: flex;
            justify-content: space-between;
            color: var(--gray);
            font-size: 12px;
        }
        
        .top-product-rank {
            width: 25px;
            height: 25px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 12px;
            margin-left: 10px;
        }
        
        /* ===== ESTILOS PARA ESTOQUE BAIXO ===== */
        .low-stock-container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: var(--shadow);
            margin-top: 30px;
            border: 2px solid var(--warning);
        }
        
        .low-stock-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .low-stock-item {
            background: #fff3cd;
            border-radius: 15px;
            padding: 15px;
            display: flex;
            align-items: center;
            transition: var(--transition);
        }
        
        .low-stock-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 152, 0, 0.2);
        }
        
        .low-stock-emoji {
            font-size: 25px;
            margin-right: 10px;
        }
        
        .low-stock-info {
            flex: 1;
        }
        
        .low-stock-name {
            font-weight: 700;
            color: #856404;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .low-stock-quantity {
            color: #856404;
            font-size: 12px;
        }
        
        .warning-icon {
            color: var(--warning);
            font-size: 18px;
            margin-left: 10px;
        }
        
        /* ===== ESTILOS PARA GRID DE DASHBOARD ===== */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        @media (max-width: 500px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* ===== LOADING ===== */
        .loading {
            text-align: center;
            padding: 50px;
            color: var(--gray);
        }
        
        .loading i {
            font-size: 40px;
            margin-bottom: 15px;
            color: var(--primary);
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- HEADER -->
        <header class="header">
            <div class="logo">
                <div class="logo-icon">🍦</div>
                <div class="logo-text">
                    <h1>CHOP <span>MANAGER</span> PRO</h1>
                    <div style="font-size: 14px; opacity: 0.9;">Sistema Completo de Vendas</div>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 20px;">
                <div class="day-info">
                    <div id="currentDate" style="font-size: 16px; margin-bottom: 5px;">Carregando...</div>
                    <div id="currentTime" style="font-size: 24px; font-weight: 800; color: var(--accent);">00:00:00</div>
                </div>
                
                <button onclick="syncData()" id="syncButton" style="
                    background: linear-gradient(135deg, var(--secondary), #FF4081);
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    padding: 10px 18px; 
                    cursor: pointer; 
                    font-size: 13px; 
                    font-weight: 700;
                    display: flex; 
                    align-items: center; 
                    gap: 8px;
                    transition: var(--transition);
                    box-shadow: 0 4px 12px rgba(255, 123, 172, 0.3);
                    white-space: nowrap;
                    height: fit-content;">
                    <i class="fas fa-sync-alt"></i> Sincronizar
                </button>
            </div>
        </header>
        
        <!-- NAVEGAÇÃO -->
        <nav class="nav-tabs">
            <button class="nav-tab active" data-page="dashboard">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </button>
            <button class="nav-tab" data-page="vendas">
                <i class="fas fa-cash-register"></i> Vender
            </button>
            <button class="nav-tab" data-page="produtos">
                <i class="fas fa-ice-cream"></i> Produtos
            </button>
            <button class="nav-tab" data-page="fiados">
                <i class="fas fa-hand-holding-usd"></i> Fiados
            </button>
            <button class="nav-tab" data-page="relatorios">
                <i class="fas fa-chart-pie"></i> Relatórios
            </button>
            <button class="nav-tab" data-page="config">
                <i class="fas fa-cog"></i> Configurações
            </button>
        </nav>
        
        <!-- CONTEÚDO PRINCIPAL -->
        <main class="main-content">
            <!-- DASHBOARD -->
            <section id="dashboard" class="page active">
                <div class="page-title">
                    <i class="fas fa-tachometer-alt"></i>
                    <h2>Dashboard de Vendas</h2>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Faturamento Hoje</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--dark);" id="todayRevenue">R$ 0,00</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Chops Vendidos</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--dark);" id="todayChops">0</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-ice-cream"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Média por Venda</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--dark);" id="avgSale">R$ 0,00</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-calculator"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Estoque Baixo</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--dark);" id="lowStock">0</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                </div>
                
                <!-- GRÁFICOS -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0;">
                    <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                        <h3 style="margin-bottom: 15px; color: var(--dark); font-size: 18px;">
                            <i class="fas fa-chart-pie"></i> Produtos Mais Vendidos
                        </h3>
                        <canvas id="flavorsChart" height="200"></canvas>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                        <h3 style="margin-bottom: 15px; color: var(--dark); font-size: 18px;">
                            <i class="fas fa-chart-line"></i> Evolução Semanal
                        </h3>
                        <canvas id="weeklyChart" height="200"></canvas>
                    </div>
                </div>
                
                <!-- DASHBOARD GRID -->
                <div class="dashboard-grid">
                    <!-- ÚLTIMAS VENDAS -->
                    <div class="recent-sales-container">
                        <div class="sales-header">
                            <h3><i class="fas fa-history"></i> Últimas Vendas</h3>
                            <button class="btn-primary" id="btnVerTodas" style="padding: 8px 15px; font-size: 12px;">
                                Ver Todas
                            </button>
                        </div>
                        <div id="recentSalesList" class="loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Carregando últimas vendas...</p>
                        </div>
                    </div>
                    
                    <!-- PRODUTOS MAIS VENDIDOS -->
                    <div class="top-products-container">
                        <div class="sales-header">
                            <h3><i class="fas fa-crown"></i> Top Produtos</h3>
                            <button class="btn-primary" id="btnVerTodosProdutos" style="padding: 8px 15px; font-size: 12px;">
                                Ver Todos
                            </button>
                        </div>
                        <div id="topProductsList" class="loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Carregando produtos...</p>
                        </div>
                    </div>
                </div>
                
                <!-- ESTOQUE BAIXO -->
                <div class="low-stock-container" id="lowStockContainer" style="display: none;">
                    <div class="sales-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Estoque Baixo</h3>
                        <button class="btn-primary" id="btnReporEstoque" style="padding: 8px 15px; font-size: 12px; background: var(--warning);">
                            Repor Estoque
                        </button>
                    </div>
                    <div id="lowStockList" class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Verificando estoque...</p>
                    </div>
                </div>
            </section>
            
            <!-- VENDAS -->
            <section id="vendas" class="page">
                <div class="page-title">
                    <i class="fas fa-cash-register"></i>
                    <h2>Vender Chop</h2>
                </div>
                
                <!-- PRODUTOS -->
                <div>
                    <h3 style="margin: 15px 0; color: var(--dark); font-size: 20px;">
                        <i class="fas fa-ice-cream"></i> Selecione os Produtos
                    </h3>
                    <div class="flavors-grid" id="productsGrid">
                        <div class="loading" style="grid-column: 1 / -1;">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Carregando produtos...</p>
                        </div>
                    </div>
                </div>
                
                <!-- CARRINHO -->
                <div class="cart-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="color: var(--dark); font-size: 22px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-shopping-cart"></i> Carrinho
                        </h3>
                        <button class="btn-primary" style="background: var(--danger); padding: 10px 20px; font-size: 14px;" id="clearCart">
                            <i class="fas fa-trash"></i> Limpar
                        </button>
                    </div>
                    
                    <div id="cartItems" style="max-height: 250px; overflow-y: auto; margin-bottom: 20px;">
                        <div class="loading">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Selecione os produtos para começar</p>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                            <span>Total de Itens:</span>
                            <span id="totalItems">0</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                            <span>Valor Total:</span>
                            <span id="totalValue">R$ 0,00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: 900; color: var(--dark); padding-top: 10px; border-top: 2px solid #dee2e6;">
                            <span>TOTAL:</span>
                            <span id="totalToPay">R$ 0,00</span>
                        </div>
                    </div>
                    
                    <!-- FORMAS DE PAGAMENTO -->
                    <div style="margin: 20px 0;">
                        <h4 style="margin-bottom: 15px; color: var(--dark); font-size: 18px;">
                            <i class="fas fa-credit-card"></i> Forma de Pagamento
                        </h4>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="dinheiro" checked>
                                <div class="payment-card">
                                    <span class="payment-icon">💵</span>
                                    <div class="payment-name">Dinheiro</div>
                                </div>
                            </label>
                            
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cartao">
                                <div class="payment-card">
                                    <span class="payment-icon">💳</span>
                                    <div class="payment-name">Cartão</div>
                                </div>
                            </label>
                            
                            <label class="payment-option">
                                <input type="radio" name="payment" value="pix">
                                <div class="payment-card">
                                    <span class="payment-icon">📱</span>
                                    <div class="payment-name">PIX</div>
                                </div>
                            </label>
                            
                            <label class="payment-option">
                                <input type="radio" name="payment" value="fiado">
                                <div class="payment-card">
                                    <span class="payment-icon">📝</span>
                                    <div class="payment-name">Fiado</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <button class="btn-primary" id="finalizeSale" disabled style="width: 100%;">
                        <i class="fas fa-check-circle"></i>
                        FINALIZAR VENDA
                    </button>
                </div>
            </section>
            
            <!-- PRODUTOS -->
            <section id="produtos" class="page">
                <div class="page-title">
                    <i class="fas fa-ice-cream"></i>
                    <h2>Gestão de Produtos</h2>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <p style="color: var(--gray); font-size: 16px;">
                        Cadastre e gerencie seus produtos
                    </p>
                    <button class="btn-primary" id="addProduct" style="padding: 12px 25px; font-size: 16px;">
                        <i class="fas fa-plus"></i>
                        Novo Produto
                    </button>
                </div>
                
                <!-- FILTROS DE PRODUTOS -->
                <div style="background: white; padding: 15px; border-radius: 15px; box-shadow: var(--shadow); margin-bottom: 20px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 700; color: var(--dark); font-size: 14px;">Filtrar por:</label>
                            <select id="productFilter" style="padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px; min-width: 150px;">
                                <option value="todos">Todos os Produtos</option>
                                <option value="estoque-baixo">Estoque Baixo</option>
                                <option value="mais-vendidos">Mais Vendidos</option>
                                <option value="ativos">Ativos</option>
                                <option value="inativos">Inativos</option>
                            </select>
                        </div>
                        
                        <div style="flex: 1; min-width: 200px;">
                            <input type="text" id="productSearch" placeholder="Buscar produto..." style="width: 100%; padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px;">
                        </div>
                    </div>
                </div>
                
                <div class="flavors-grid" id="productsList">
                    <div class="loading" style="grid-column: 1 / -1;">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Carregando produtos...</p>
                    </div>
                </div>
            </section>
            
            <!-- FIADOS -->
            <section id="fiados" class="page">
                <div class="page-title">
                    <i class="fas fa-hand-holding-usd"></i>
                    <h2>Controle de Fiados</h2>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <p style="color: var(--gray); font-size: 16px;">
                        Gerencie vendas fiadas e recebimentos
                    </p>
                    <button class="btn-primary" id="novoFiado" style="padding: 12px 25px; font-size: 16px;">
                        <i class="fas fa-plus"></i>
                        Novo Fiado
                    </button>
                </div>
                
                <!-- RESUMO DE FIADOS -->
                <div class="stats-grid" style="margin-bottom: 30px;">
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Total a Receber</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--dark);" id="totalReceber">R$ 0,00</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Recebido Mês</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--success);" id="recebidoMes">R$ 0,00</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-cash-register"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Clientes em Atraso</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--danger);" id="clientesAtraso">0</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div style="font-size: 14px; color: var(--gray); margin-bottom: 10px;">Fiados Ativos</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--warning);" id="fiadosAtivos">0</div>
                        <div style="position: absolute; right: 20px; top: 20px; font-size: 30px; opacity: 0.1;">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                </div>
                
                <!-- FILTROS -->
                <div style="background: white; padding: 15px; border-radius: 15px; box-shadow: var(--shadow); margin-bottom: 20px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 700; color: var(--dark); font-size: 14px;">Status:</label>
                            <select id="filterStatus" style="padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px; min-width: 150px;">
                                <option value="todos">Todos</option>
                                <option value="pendente">Pendentes</option>
                                <option value="atrasado">Em Atraso</option>
                                <option value="pago">Pagos</option>
                                <option value="parcial">Parcialmente Pagos</option>
                            </select>
                        </div>
                        
                        <div style="flex: 1; min-width: 200px;">
                            <input type="text" id="searchCliente" placeholder="Buscar cliente..." style="width: 100%; padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px;">
                        </div>
                        
                        <button class="btn-primary" id="btnExportFiados" style="padding: 10px 20px; font-size: 14px;">
                            <i class="fas fa-file-export"></i> Exportar
                        </button>
                    </div>
                </div>
                
                <!-- LISTA DE FIADOS -->
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                    <div id="fiadosList" class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Carregando fiados...</p>
                    </div>
                </div>
            </section>
            
            <!-- RELATÓRIOS -->
            <section id="relatorios" class="page">
                <div class="page-title">
                    <i class="fas fa-chart-pie"></i>
                    <h2>Relatórios e Exportação</h2>
                </div>
                
                <!-- FILTROS -->
                <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow); margin-bottom: 20px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 700; color: var(--dark); font-size: 14px;">Período:</label>
                            <select id="reportPeriod" style="padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px; min-width: 150px;">
                                <option value="hoje">Hoje</option>
                                <option value="ontem">Ontem</option>
                                <option value="semana">Esta Semana</option>
                                <option value="mes" selected>Este Mês</option>
                                <option value="ano">Este Ano</option>
                                <option value="personalizado">Personalizado</option>
                            </select>
                        </div>
                        
                        <div id="customDateRange" style="display: none; flex: 1;">
                            <div style="display: flex; gap: 10px;">
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 700; color: var(--dark); font-size: 14px;">De:</label>
                                    <input type="date" id="startDate" style="padding: 10px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px; width: 100%;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 700; color: var(--dark); font-size: 14px;">Até:</label>
                                    <input type="date" id="endDate" style="padding: 10px; border: 2px solid #dee2e6; border-radius: 10px; font-size: 14px; width: 100%;">
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-left: auto;">
                            <button class="btn-primary" id="generateReportBtn" style="font-size: 14px; padding: 10px 20px;">
                                <i class="fas fa-sync-alt"></i>
                                Gerar Relatório
                            </button>
                        </div>
                    </div>
                    
                    <!-- BOTÕES DE EXPORTAÇÃO -->
                    <div class="export-buttons">
                        <button class="export-btn print" id="printReport">
                            <i class="fas fa-print"></i>
                            Imprimir Relatório
                        </button>
                    </div>
                </div>
                
                <!-- CONTEÚDO DO RELATÓRIO -->
                <div id="reportContent" style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                    <div style="text-align: center; padding: 40px 20px; color: var(--gray);">
                        <i class="fas fa-chart-pie" style="font-size: 60px; margin-bottom: 15px; opacity: 0.3;"></i>
                        <p style="font-size: 16px;">Selecione um período e clique em "Gerar Relatório"</p>
                    </div>
                </div>
            </section>
            
            <!-- CONFIGURAÇÕES -->
            <section id="config" class="page">
                <div class="page-title">
                    <i class="fas fa-cog"></i>
                    <h2>Configurações do Sistema</h2>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                    <!-- BACKUP -->
                    <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                        <h3 style="margin-bottom: 15px; color: var(--dark); font-size: 18px;">
                            <i class="fas fa-database"></i> Backup de Dados
                        </h3>
                        <p style="color: var(--gray); margin-bottom: 20px; font-size: 14px;">
                            Faça backup de todos os dados do sistema.
                        </p>
                        <button class="btn-primary" id="backupBtn" style="width: 100%; padding: 12px;">
                            <i class="fas fa-save"></i>
                            Fazer Backup
                        </button>
                    </div>
                    
                    <!-- INFORMAÇÕES -->
                    <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: var(--shadow);">
                        <h3 style="margin-bottom: 15px; color: var(--dark); font-size: 18px;">
                            <i class="fas fa-info-circle"></i> Informações do Sistema
                        </h3>
                        <div style="color: var(--gray); font-size: 14px;">
                            <p><strong>Versão:</strong> Chop Manager PRO 2.1</p>
                            <p><strong>Produtos:</strong> <span id="totalProducts">0</span></p>
                            <p><strong>Vendas:</strong> <span id="totalSales">0</span></p>
                            <p><strong>Faturamento Total:</strong> <span id="totalRevenue">R$ 0,00</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- FOOTER -->
        <footer class="footer">
            <p>🍦 Sistema Chop Manager PRO - Versão 2.1</p>
            <p style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
                Sistema completo para gestão de vendas de sorvete
            </p>
        </footer>
    </div>
    
    <!-- MODAL DE PRODUTO -->
    <div class="modal-overlay" id="productModal">
        <div class="modal">
            <div style="padding: 20px; background: linear-gradient(135deg, var(--primary), #2A9D8F); color: white; border-radius: 15px 15px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-ice-cream"></i>
                        <span id="modalTitle">Novo Produto</span>
                    </div>
                    <button id="closeModal" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                        &times;
                    </button>
                </div>
            </div>
            
            <div style="padding: 20px;">
                <form id="productForm">
                    <input type="hidden" id="productId">
                    
                    <!-- FOTO DO PRODUTO -->
                    <div class="form-group">
                        <label class="form-label">Foto do Produto (opcional)</label>
                        <div class="photo-upload-container" id="photoUploadContainer">
                            <div class="upload-icon">
                                <i class="fas fa-camera"></i>
                            </div>
                            <p style="color: var(--gray); margin-bottom: 8px; font-size: 14px;">Clique para adicionar uma foto</p>
                            <p style="font-size: 12px; color: var(--gray);">Formatos: JPG, PNG (max. 2MB)</p>
                            <img id="photoPreview" class="photo-preview" alt="Preview da foto">
                        </div>
                        <input type="file" id="productPhoto" accept="image/*" style="display: none;">
                        <input type="hidden" id="productPhotoData">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Nome do Produto *</label>
                        <input type="text" id="productName" class="form-input" placeholder="Ex: Casquinha de Chocolate" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="productDescription" class="form-input" rows="2" placeholder="Descreva o produto..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Preço (R$) *</label>
                        <input type="number" id="productPrice" class="form-input" step="0.01" min="0" placeholder="5.00" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Estoque Inicial *</label>
                        <input type="number" id="productStock" class="form-input" min="0" placeholder="100" required>
                    </div>
                    
                    <!-- PERSONALIZAÇÃO DE EMOJI -->
                    <div class="form-group">
                        <label class="form-label">Emoji do Produto</label>
                        <div class="emoji-selected" id="emojiSelector">
                            <span id="selectedEmoji">🍦</span>
                            <span style="color: var(--gray); font-size: 14px;">Clique para escolher um emoji</span>
                        </div>
                        <div class="emoji-picker" id="emojiPicker">
                            <!-- Emojis serão inseridos por JavaScript -->
                        </div>
                        <input type="hidden" id="productEmoji" value="🍦">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor de Identificação</label>
                        <input type="color" id="productColor" value="#36B5B0" style="width: 100%; height: 40px; border-radius: 10px; border: 2px solid #dee2e6; cursor: pointer;">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="productActive" checked style="width: 20px; height: 20px;">
                            <span>Produto Ativo</span>
                        </label>
                    </div>
                </form>
            </div>
            
            <div style="padding: 15px 20px; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-primary" id="cancelModal" style="background: var(--gray); padding: 10px 20px;">
                    Cancelar
                </button>
                <button class="btn-primary" id="saveProduct" style="padding: 10px 20px;">
                    Salvar Produto
                </button>
            </div>
        </div>
    </div>
    
    <!-- MODAL FIADO -->
    <div class="modal-overlay" id="fiadoModal">
        <div class="modal" style="max-width: 600px;">
            <div style="padding: 20px; background: linear-gradient(135deg, #FF7BAC, #FF4081); color: white; border-radius: 15px 15px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-hand-holding-usd"></i>
                        <span id="modalFiadoTitle">Novo Fiado</span>
                    </div>
                    <button id="closeFiadoModal" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                        &times;
                    </button>
                </div>
            </div>
            
            <div style="padding: 20px;">
                <form id="fiadoForm">
                    <input type="hidden" id="fiadoIndex">
                    
                    <div class="form-group">
                        <label class="form-label">Nome do Cliente *</label>
                        <input type="text" id="nomeCliente" class="form-input" placeholder="Nome completo" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="text" id="telefoneCliente" class="form-input" placeholder="(11) 99999-9999">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Produtos *</label>
                        <div id="produtosFiadoContainer">
                            <!-- Produtos serão adicionados dinamicamente -->
                        </div>
                        <button type="button" class="btn-primary" id="addProdutoFiado" style="margin-top: 10px; padding: 8px 15px; font-size: 14px;">
                            <i class="fas fa-plus"></i> Adicionar Produto
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Prazo de Pagamento *</label>
                        <input type="date" id="prazoPagamento" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Data de Retirada</label>
                        <input type="date" id="dataRetirada" class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Valor Pago Inicial (se houver)</label>
                        <input type="number" id="valorPago" class="form-input" step="0.01" min="0" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Observações</label>
                        <textarea id="observacoes" class="form-input" rows="3" placeholder="Observações importantes..."></textarea>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 20px;">
                        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
                            <span>Total:</span>
                            <span id="fiadoTotal">R$ 0,00</span>
                        </div>
                    </div>
                </form>
            </div>
            
            <div style="padding: 15px 20px; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-primary" id="cancelFiadoModal" style="background: var(--gray); padding: 10px 20px;">
                    Cancelar
                </button>
                <button class="btn-primary" id="saveFiado" style="padding: 10px 20px;">
                    Salvar Fiado
                </button>
            </div>
        </div>
    </div>
    
    <!-- MODAL PAGAMENTO FIADO -->
    <div class="modal-overlay" id="pagamentoModal">
        <div class="modal" style="max-width: 500px;">
            <div style="padding: 20px; background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; border-radius: 15px 15px 0 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Registrar Pagamento</span>
                    </div>
                    <button onclick="fecharPagamentoModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                        &times;
                    </button>
                </div>
            </div>
            
            <div style="padding: 20px;">
                <div id="pagamentoInfo" style="margin-bottom: 20px;"></div>
                
                <div class="form-group">
                    <label class="form-label">Valor do Pagamento *</label>
                    <input type="number" id="valorPagamento" class="form-input" step="0.01" min="0" placeholder="0.00" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Data do Pagamento</label>
                    <input type="date" id="dataPagamento" class="form-input">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Forma de Pagamento</label>
                    <select id="formaPagamento" class="form-input">
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">PIX</option>
                        <option value="cartao">Cartão</option>
                        <option value="transferencia">Transferência</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Observações</label>
                    <textarea id="obsPagamento" class="form-input" rows="2" placeholder="Observações sobre o pagamento..."></textarea>
                </div>
            </div>
            
            <div style="padding: 15px 20px; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-primary" onclick="fecharPagamentoModal()" style="background: var(--gray); padding: 10px 20px;">
                    Cancelar
                </button>
                <button class="btn-primary" onclick="confirmarPagamento()" style="padding: 10px 20px;">
                    Registrar Pagamento
                </button>
            </div>
        </div>
    </div>
    
    <!-- NOTIFICAÇÕES -->
    <div class="notification" id="notification"></div>
<script>
// ===== CONFIGURAÇÃO NEON =====
// IMPORTANTE: Escolha uma das opções abaixo para API_URL:
const API_URL = 'https://helbertbarbosa07-vendaschopp.vercel.app/api/neon'; // URL completa para produção
// const API_URL = '/api/neon'; // Para desenvolvimento local
// const API_URL = 'api/neon'; // Alternativa sem barra inicial

let produtos = [];
let vendas = [];
let fiados = [];
let carrinho = [];
let charts = {};
let isLoading = false;

// ===== TESTE DE CONEXÃO =====
async function testConnection() {
    try {
        console.log('🔌 Testando conexão com API...');
        
        const response = await fetch(API_URL, {
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
}

// ===== FUNÇÃO PRINCIPAL NEON =====
async function neonAPI(action, data = null) {
    if (isLoading) {
        console.log(`⏳ ${action} em espera (já carregando)`);
        return;
    }
    
    try {
        isLoading = true;
        console.log(`🔄 Executando: ${action}`, data);
        
        const response = await fetch(API_URL, {
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
        isLoading = false;
    }
}

// ===== FUNÇÕES AUXILIARES =====
function formatPrice(value) {
    if (value === undefined || value === null || value === '') return '0.00';
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2).replace('.', ',');
}

function formatarData(dataString) {
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return 'Data inválida';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch (e) {
        return 'Data inválida';
    }
}

function showLoading(elementId, message = 'Carregando...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 30px; color: var(--primary);"></i>
                <p style="margin-top: 10px; color: var(--gray);">${message}</p>
            </div>
        `;
    }
}

function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('pt-BR', optionsDate);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('pt-BR');
}

function showNotification(mensagem, tipo = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
        return;
    }
    
    notification.textContent = mensagem;
    notification.className = `notification ${tipo} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showFallbackData() {
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
                <button onclick="syncData()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
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
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Sistema Neon carregando...');
    console.log('🌐 Ambiente:', {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        pathname: window.location.pathname,
        API_URL: API_URL
    });
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    setupNavigation();
    setupEventListeners();
    initComponents();
    
    // Testar conexão primeiro
    showNotification('🔌 Conectando ao servidor...', 'info');
    const isConnected = await testConnection();
    
    if (isConnected) {
        try {
            showNotification('🔄 Conectando ao banco de dados Neon...', 'info');
            
            // Teste simples primeiro - tentar carregar produtos
            produtos = await neonAPI('get_produtos');
            console.log('✅ Neon conectado! Produtos:', produtos?.length || 0);
            
            if (Array.isArray(produtos)) {
                await loadDashboard();
                await loadProductsForSale();
                showNotification('✅ Sistema conectado com sucesso!', 'success');
            } else {
                throw new Error('Resposta inválida do servidor');
            }
            
        } catch (error) {
            console.error('❌ Falha na conexão com dados:', error);
            showNotification('⚠️ Conectado, mas erro nos dados. Modo limitado.', 'warning');
            showFallbackData();
        }
    } else {
        showNotification('❌ Servidor offline. Modo desconectado.', 'error');
        showFallbackData();
    }
});

// ===== NAVEGAÇÃO =====
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const pageId = this.dataset.page;

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');

                switch(pageId) {
                    case 'dashboard': loadDashboard(); break;
                    case 'vendas': loadProductsForSale(); break;
                    case 'produtos': loadProductsList(); break;
                    case 'fiados': carregarFiados(); break;
                    case 'relatorios': loadReports(); break;
                    case 'config': loadConfig(); break;
                }
            }
        });
    });
}

function setupEventListeners() {
    document.getElementById('clearCart')?.addEventListener('click', clearCart);
    document.getElementById('finalizeSale')?.addEventListener('click', finalizeSale);
    
    document.getElementById('addProduct')?.addEventListener('click', () => openProductModal());
    document.getElementById('productFilter')?.addEventListener('change', loadProductsList);
    document.getElementById('productSearch')?.addEventListener('input', loadProductsList);
    document.getElementById('saveProduct')?.addEventListener('click', saveProduct);
    document.getElementById('closeModal')?.addEventListener('click', closeProductModal);
    document.getElementById('cancelModal')?.addEventListener('click', closeProductModal);
    
    document.getElementById('btnVerTodas')?.addEventListener('click', () => navigateTo('relatorios'));
    document.getElementById('btnVerTodosProdutos')?.addEventListener('click', () => navigateTo('produtos'));
    document.getElementById('btnReporEstoque')?.addEventListener('click', () => navigateTo('produtos'));
    
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
    
    document.getElementById('reportPeriod')?.addEventListener('change', function() {
        const isCustom = this.value === 'personalizado';
        document.getElementById('customDateRange').style.display = isCustom ? 'block' : 'none';
    });
    
    document.getElementById('generateReportBtn')?.addEventListener('click', loadReports);
    document.getElementById('printReport')?.addEventListener('click', printReport);
    document.getElementById('backupBtn')?.addEventListener('click', backupData);
}

function initComponents() {
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
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        console.log('📊 Carregando dashboard...');
        showLoading('recentSalesList', 'Carregando dashboard...');
        showLoading('topProductsList', 'Carregando produtos...');
        
        const stats = await neonAPI('get_dashboard_stats');
        
        // Garantir que os valores existam
        const faturamentoHoje = stats?.faturamentoHoje || 0;
        const totalItens = stats?.totalItens || 0;
        const totalVendas = stats?.totalVendas || 0;
        const estoqueBaixo = stats?.estoqueBaixo || 0;
        const mediaVenda = totalVendas > 0 ? faturamentoHoje / totalVendas : 0;
        
        document.getElementById('todayRevenue').textContent = `R$ ${formatPrice(faturamentoHoje)}`;
        document.getElementById('todayChops').textContent = totalItens;
        document.getElementById('avgSale').textContent = `R$ ${formatPrice(mediaVenda)}`;
        document.getElementById('lowStock').textContent = estoqueBaixo;
        
        // Carregar vendas recentes
        await loadRecentSales();
        
        // Carregar produtos mais vendidos
        await loadTopProducts(stats?.produtosMaisVendidos || []);
        
        // Carregar estoque baixo
        await loadLowStockProducts();
        
        // Atualizar gráficos
        await updateCharts();
        
    } catch (error) {
        console.error('Erro no dashboard:', error);
        showNotification('Erro ao carregar dashboard', 'error');
        
        // Fallback
        document.getElementById('todayRevenue').textContent = 'R$ 0,00';
        document.getElementById('todayChops').textContent = '0';
        document.getElementById('avgSale').textContent = 'R$ 0,00';
        document.getElementById('lowStock').textContent = '0';
        
        const recentSalesList = document.getElementById('recentSalesList');
        const topProductsList = document.getElementById('topProductsList');
        
        if (recentSalesList) {
            recentSalesList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar vendas</p>
                </div>
            `;
        }
        
        if (topProductsList) {
            topProductsList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar produtos</p>
                </div>
            `;
        }
    }
}

async function loadRecentSales() {
    try {
        const recentSales = await neonAPI('get_vendas_recentes');
        const recentSalesList = document.getElementById('recentSalesList');
        
        if (!recentSales || recentSales.length === 0) {
            recentSalesList.innerHTML = `
                <div class="empty-sales">
                    <i class="fas fa-receipt"></i>
                    <p>Nenhuma venda registrada</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="sales-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Itens</th>
                        <th>Total</th>
                        <th>Pagamento</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        recentSales.forEach(venda => {
            const pagamentoClass = {
                'dinheiro': 'payment-dinheiro',
                'cartao': 'payment-cartao',
                'pix': 'payment-pix',
                'fiado': 'payment-pix'
            }[venda.pagamento] || '';
            
            html += `
                <tr>
                    <td>${venda.hora || '--:--'}</td>
                    <td>${venda.total_itens || 0} itens</td>
                    <td><strong>R$ ${formatPrice(venda.total)}</strong></td>
                    <td><span class="payment-badge ${pagamentoClass}">${(venda.pagamento || 'N/A').toUpperCase()}</span></td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
        recentSalesList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar vendas recentes:', error);
        const recentSalesList = document.getElementById('recentSalesList');
        recentSalesList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar vendas</p>
            </div>
        `;
    }
}

async function loadTopProducts(produtosData) {
    const topProductsList = document.getElementById('topProductsList');
    
    if (!Array.isArray(produtosData) || produtosData.length === 0) {
        topProductsList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-chart-line"></i>
                <p>Sem dados de vendas hoje</p>
            </div>
        `;
        return;
    }
    
    const produtosComVendas = produtosData.filter(p => (p.vendas_hoje || 0) > 0);
    
    if (produtosComVendas.length === 0) {
        topProductsList.innerHTML = `
            <div class="empty-sales">
                <i class="fas fa-chart-line"></i>
                <p>Sem dados de vendas hoje</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="top-products-list">';
    
    produtosComVendas.forEach((produto, index) => {
        const vendasCount = produto.vendas_hoje || 0;
        html += `
            <div class="top-product-item">
                <div class="top-product-emoji">${produto.emoji || '🍦'}</div>
                <div class="top-product-info">
                    <div class="top-product-name">${produto.nome}</div>
                    <div class="top-product-stats">
                        <span>${vendasCount} vendas</span>
                        <span>R$ ${formatPrice(produto.preco * vendasCount)}</span>
                    </div>
                </div>
                <div class="top-product-rank">${index + 1}</div>
            </div>
        `;
    });
    
    html += '</div>';
    topProductsList.innerHTML = html;
}

async function loadLowStockProducts() {
    try {
        const todosProdutos = await neonAPI('get_produtos');
        const lowStockList = document.getElementById('lowStockList');
        const lowStockContainer = document.getElementById('lowStockContainer');
        
        if (!Array.isArray(todosProdutos)) {
            lowStockContainer.style.display = 'none';
            return;
        }
        
        const produtosBaixoEstoque = todosProdutos.filter(p => p.estoque < 10 && p.ativo);
        
        if (produtosBaixoEstoque.length === 0) {
            lowStockContainer.style.display = 'none';
            return;
        }
        
        lowStockContainer.style.display = 'block';
        let html = '<div class="low-stock-list">';
        
        produtosBaixoEstoque.slice(0, 6).forEach(produto => {
            html += `
                <div class="low-stock-item">
                    <div class="low-stock-emoji">${produto.emoji || '🍦'}</div>
                    <div class="low-stock-info">
                        <div class="low-stock-name">${produto.nome}</div>
                        <div class="low-stock-quantity">${produto.estoque} unidades restantes</div>
                    </div>
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        lowStockList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar estoque baixo:', error);
        document.getElementById('lowStockContainer').style.display = 'none';
    }
}

// ===== VENDAS =====
async function loadProductsForSale() {
    try {
        console.log('🛍️ Carregando produtos para venda...');
        showLoading('productsGrid', 'Carregando produtos...');
        
        produtos = await neonAPI('get_produtos');
        const productsGrid = document.getElementById('productsGrid');
        
        if (!Array.isArray(produtos)) {
            productsGrid.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                </div>
            `;
            return;
        }
        
        const produtosAtivos = produtos.filter(p => p.ativo && p.estoque > 0);
        
        if (produtosAtivos.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-ice-cream" style="font-size: 50px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Nenhum produto cadastrado</p>
                    <button class="btn-primary" onclick="navigateTo('produtos')" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Cadastrar Produtos
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '';
        produtosAtivos.forEach(produto => {
            const estoqueStatus = produto.estoque < 5 ? 'style="color: var(--danger);"' : '';
            const fotoHTML = produto.foto ? 
                `<img src="${produto.foto}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">` :
                `<div style="font-size: 50px; margin-bottom: 15px;">${produto.emoji || '🍦'}</div>`;
            
            html += `
                <div class="flavor-card" onclick="addToCart(${produto.id})" 
                     style="border-color: ${produto.cor || '#36B5B0'};">
                    ${fotoHTML}
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px; color: var(--dark);">
                        ${produto.nome}
                    </h3>
                    <p style="color: var(--gray); font-size: 14px; margin-bottom: 15px; min-height: 40px;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 24px; font-weight: 900; color: ${produto.cor || '#36B5B0'};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 14px; color: var(--gray);" ${estoqueStatus}>
                            <i class="fas fa-box"></i> ${produto.estoque}
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = html;
        updateCart();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showNotification('Erro ao carregar produtos', 'error');
    }
}

// Funções do carrinho
window.addToCart = function(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        showNotification('Produto não encontrado!', 'error');
        return;
    }
    
    if (produto.estoque <= 0) {
        showNotification('Produto sem estoque!', 'error');
        return;
    }
    
    const existingItem = carrinho.find(item => item.produtoId === produtoId);
    
    if (existingItem) {
        if (existingItem.quantidade >= produto.estoque) {
            showNotification('Estoque insuficiente!', 'warning');
            return;
        }
        existingItem.quantidade++;
        existingItem.total = existingItem.quantidade * existingItem.preco;
    } else {
        carrinho.push({
            produtoId: produto.id,
            nome: produto.nome,
            emoji: produto.emoji || '🍦',
            preco: produto.preco,
            quantidade: 1,
            total: produto.preco
        });
    }
    
    updateCart();
    showNotification(`${produto.emoji || '🍦'} ${produto.nome} adicionado!`, 'success');
};

window.updateCartItem = function(index, change) {
    const item = carrinho[index];
    const produto = produtos.find(p => p.id === item.produtoId);
    
    if (!produto) return;
    
    const newQuantity = item.quantidade + change;
    
    if (newQuantity < 1) {
        removeCartItem(index);
        return;
    }
    
    if (newQuantity > produto.estoque) {
        showNotification('Estoque insuficiente!', 'warning');
        return;
    }
    
    item.quantidade = newQuantity;
    item.total = item.quantidade * item.preco;
    updateCart();
};

window.removeCartItem = function(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho.splice(index, 1);
        updateCart();
        showNotification('Item removido do carrinho!', 'info');
    }
};

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = carrinho.reduce((sum, item) => sum + (item.quantidade || 0), 0);
    const totalValue = carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = `R$ ${formatPrice(totalValue)}`;
    document.getElementById('totalToPay').textContent = `R$ ${formatPrice(totalValue)}`;
    
    const finalizeBtn = document.getElementById('finalizeSale');
    finalizeBtn.disabled = carrinho.length === 0;
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-sales" style="padding: 20px; text-align: center;">
                <i class="fas fa-shopping-cart" style="font-size: 40px; opacity: 0.3;"></i>
                <p style="margin-top: 10px; color: var(--gray);">Selecione os produtos para começar</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Produto</th>
                    <th style="padding: 10px; text-align: center;">Qtd</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                    <th style="padding: 10px; text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    carrinho.forEach((item, index) => {
        html += `
            <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">${item.emoji}</span>
                        <div>
                            <div style="font-weight: 700;">${item.nome}</div>
                            <div style="font-size: 12px; color: var(--gray);">R$ ${formatPrice(item.preco)} un.</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <div style="display: inline-flex; align-items: center; background: #f8f9fa; border-radius: 8px; padding: 2px;">
                        <button onclick="updateCartItem(${index}, -1)" 
                                style="width: 30px; height: 30px; border: none; background: none; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span style="width: 40px; text-align: center; font-weight: 700;">${item.quantidade}</span>
                        <button onclick="updateCartItem(${index}, 1)" 
                                style="width: 30px; height: 30px; border: none; background: none; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td style="padding: 10px; text-align: right; font-weight: 800;">
                    R$ ${formatPrice(item.total)}
                </td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="removeCartItem(${index})" 
                            style="background: var(--danger); color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr> 
        `;
    });
    
    html += `</tbody></table>`;
    cartItems.innerHTML = html;
}

function clearCart() {
    if (carrinho.length === 0) return;
    
    if (confirm('Limpar todo o carrinho?')) {
        carrinho = [];
        updateCart();
        showNotification('Carrinho limpo!', 'info');
    }
}

async function finalizeSale() {
    try {
        if (carrinho.length === 0) {
            showNotification('Carrinho vazio!', 'warning');
            return;
        }
        
        const formaPagamento = document.querySelector('input[name="payment"]:checked')?.value || 'dinheiro';
        const total = carrinho.reduce((sum, item) => sum + (item.total || 0), 0);
        
        if (formaPagamento === 'fiado') {
            showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
            return;
        }
        
        const novaVenda = {
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            itens: carrinho.map(item => ({
                produtoId: item.produtoId,
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            total: total,
            pagamento: formaPagamento
        };
        
        await neonAPI('create_venda', novaVenda);
        
        for (const item of carrinho) {
            await neonAPI('update_estoque', {
                produtoId: item.produtoId,
                quantidade: item.quantidade
            });
        }
        
        carrinho = [];
        
        updateCart();
        await loadDashboard();
        await loadProductsForSale();
        
        showNotification(`✅ Venda finalizada! R$ ${formatPrice(total)}`, 'success');
        
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao finalizar venda:', error);
        showNotification('❌ Erro ao finalizar venda!', 'error');
    }
}

// ===== PRODUTOS =====
async function loadProductsList() {
    try {
        showLoading('productsList', 'Carregando produtos...');
        
        produtos = await neonAPI('get_produtos');
        const filter = document.getElementById('productFilter')?.value || 'todos';
        const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
        
        if (!Array.isArray(produtos)) {
            const productsList = document.getElementById('productsList');
            productsList.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: var(--warning);"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Erro ao carregar produtos</p>
                </div>
            `;
            return;
        }
        
        let produtosFiltrados = [...produtos];
        
        if (filter === 'estoque-baixo') {
            produtosFiltrados = produtosFiltrados.filter(p => p.estoque < 10);
        } else if (filter === 'mais-vendidos') {
            produtosFiltrados = produtosFiltrados.filter(p => (p.vendas || 0) > 0);
            produtosFiltrados.sort((a, b) => (b.vendas || 0) - (a.vendas || 0));
        } else if (filter === 'ativos') {
            produtosFiltrados = produtosFiltrados.filter(p => p.ativo !== false);
        } else if (filter === 'inativos') {
            produtosFiltrados = produtosFiltrados.filter(p => p.ativo === false);
        }
        
        if (search) {
            produtosFiltrados = produtosFiltrados.filter(p => 
                p.nome.toLowerCase().includes(search) ||
                (p.descricao && p.descricao.toLowerCase().includes(search))
            );
        }
        
        const productsList = document.getElementById('productsList');
        
        if (produtosFiltrados.length === 0) {
            productsList.innerHTML = `
                <div class="empty-sales" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-ice-cream" style="font-size: 50px; opacity: 0.3;"></i>
                    <p style="margin-top: 10px; color: var(--gray);">Nenhum produto encontrado</p>
                    <button class="btn-primary" onclick="navigateTo('produtos')" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Adicionar Produto
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '';
        produtosFiltrados.forEach(produto => {
            const estoqueStatus = produto.estoque < 10 ? 'style="color: var(--danger);"' : '';
            const activeStatus = produto.ativo !== false ? 'Ativo' : 'Inativo';
            const activeClass = produto.ativo !== false ? 'background: #e8f5e9; color: #2e7d32;' : 'background: #ffebee; color: #c62828;';
            const vendasCount = produto.vendas || 0;
            const fotoHTML = produto.foto ? 
                `<img src="${produto.foto}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">` :
                `<div style="font-size: 40px; margin-bottom: 10px;">${produto.emoji || '🍦'}</div>`;
            
            html += `
                <div class="flavor-card" onclick="editProduct(${produto.id})" 
                     style="border-color: ${produto.cor || '#36B5B0'}; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        ${fotoHTML}
                        <span style="padding: 4px 10px; border-radius: 15px; font-size: 12px; ${activeClass}">
                            ${activeStatus}
                        </span>
                    </div>
                    
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px; color: var(--dark);">
                        ${produto.nome}
                    </h3>
                    
                    <p style="color: var(--gray); font-size: 13px; margin-bottom: 15px; min-height: 40px;">
                        ${produto.descricao || 'Sem descrição'}
                    </p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 22px; font-weight: 900; color: ${produto.cor || '#36B5B0'};">
                            R$ ${formatPrice(produto.preco)}
                        </div>
                        <div style="font-size: 14px; color: var(--gray);" ${estoqueStatus}>
                            <i class="fas fa-box"></i> ${produto.estoque}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gray);">
                        <span><i class="fas fa-shopping-cart"></i> ${vendasCount} vendas</span>
                        <span>R$ ${formatPrice(vendasCount * produto.preco)}</span>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-primary" onclick="event.stopPropagation(); editProduct(${produto.id})"
                                style="flex: 1; padding: 8px; font-size: 12px; background: var(--primary);">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="event.stopPropagation(); deleteProduct(${produto.id})"
                                style="padding: 8px 12px; border: none; border-radius: 8px; background: var(--danger); color: white; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showNotification('Erro ao carregar produtos', 'error');
    }
}

// ===== MODAL DE PRODUTO =====
window.editProduct = async function(id) {
    try {
        const produtoData = await neonAPI('get_produto', { id });
        if (produtoData && produtoData[0]) {
            openProductModal(produtoData[0]);
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        showNotification('Erro ao carregar produto', 'error');
    }
};

function openProductModal(produto = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    const preview = document.getElementById('photoPreview');
    
    if (produto) {
        title.textContent = 'Editar Produto';
        document.getElementById('productId').value = produto.id;
        document.getElementById('productName').value = produto.nome;
        document.getElementById('productDescription').value = produto.descricao || '';
        document.getElementById('productPrice').value = produto.preco;
        document.getElementById('productStock').value = produto.estoque;
        document.getElementById('productEmoji').value = produto.emoji || '🍦';
        document.getElementById('selectedEmoji').textContent = produto.emoji || '🍦';
        document.getElementById('productColor').value = produto.cor || '#36B5B0';
        document.getElementById('productActive').checked = produto.ativo !== false;
        
        if (produto.foto) {
            preview.src = produto.foto;
            preview.classList.add('show');
            document.getElementById('productPhotoData').value = produto.foto;
        } else {
            preview.src = '';
            preview.classList.remove('show');
            document.getElementById('productPhotoData').value = '';
        }
    } else {
        title.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('selectedEmoji').textContent = '🍦';
        document.getElementById('productEmoji').value = '🍦';
        document.getElementById('productColor').value = '#36B5B0';
        document.getElementById('productActive').checked = true;
        preview.src = '';
        preview.classList.remove('show');
        document.getElementById('productPhotoData').value = '';
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

async function saveProduct() {
    try {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const id = document.getElementById('productId').value;
        const isEditing = !!id;
        
        const produtoData = {
            nome: document.getElementById('productName').value,
            descricao: document.getElementById('productDescription').value,
            preco: Number(document.getElementById('productPrice').value),
            estoque: parseInt(document.getElementById('productStock').value),
            emoji: document.getElementById('productEmoji').value,
            cor: document.getElementById('productColor').value,
            ativo: document.getElementById('productActive').checked,
            foto: document.getElementById('productPhotoData').value || null
        };
        
        if (isEditing) {
            produtoData.id = parseInt(id);
            await neonAPI('update_produto', produtoData);
            showNotification('✅ Produto atualizado no Neon!', 'success');
        } else {
            await neonAPI('create_produto', produtoData);
            showNotification('✅ Produto criado no Neon!', 'success');
        }
        
        closeProductModal();
        await loadProductsList();
        await loadProductsForSale();
        await loadDashboard();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification('❌ Erro ao salvar produto no Neon!', 'error');
    }
}

window.deleteProduct = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        await neonAPI('delete_produto', { id });
        showNotification('✅ Produto excluído do Neon!', 'success');
        
        await loadProductsList();
        await loadProductsForSale();
        await loadDashboard();
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification('❌ Erro ao excluir produto do Neon!', 'error');
    }
};

// ===== GRÁFICOS =====
async function updateCharts() {
    try {
        const vendasSemana = await neonAPI('get_vendas_semana');
        const stats = await neonAPI('get_dashboard_stats');
        
        // Gráfico de produtos mais vendidos
        const flavorsCtx = document.getElementById('flavorsChart');
        if (flavorsCtx) {
            if (charts.flavors) charts.flavors.destroy();
            
            const produtosComVendas = stats?.produtosMaisVendidos || [];
            
            if (Array.isArray(produtosComVendas) && produtosComVendas.length > 0 && produtosComVendas.some(p => p.vendas_hoje > 0)) {
                const produtosComDados = produtosComVendas.filter(p => p.vendas_hoje > 0);
                
                charts.flavors = new Chart(flavorsCtx, {
                    type: 'doughnut',
                    data: {
                        labels: produtosComDados.map(p => 
                            p.nome.substring(0, 12) + (p.nome.length > 12 ? '...' : '')
                        ),
                        datasets: [{
                            data: produtosComDados.map(p => p.vendas_hoje),
                            backgroundColor: produtosComDados.map(p => p.cor || '#36B5B0'),
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { 
                                position: 'bottom',
                                labels: {
                                    padding: 15,
                                    font: {
                                        size: 9
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                flavorsCtx.parentElement.innerHTML = `
                    <div style="text-align: center; padding: 30px; color: var(--gray);">
                        <i class="fas fa-chart-pie" style="font-size: 40px; opacity: 0.3;"></i>
                        <p>Sem vendas hoje para gráfico</p>
                        <p style="font-size: 12px; margin-top: 5px;">Faça algumas vendas para ver o gráfico</p>
                    </div>
                `;
            }
        }
        
        // Gráfico de evolução semanal
        const weeklyCtx = document.getElementById('weeklyChart');
        if (weeklyCtx) {
            if (charts.weekly) charts.weekly.destroy();
            
            if (Array.isArray(vendasSemana) && vendasSemana.length > 0) {
                const dias = vendasSemana.map(v => {
                    try {
                        const data = new Date(v.data);
                        return data.toLocaleDateString('pt-BR', { weekday: 'short' });
                    } catch (e) {
                        return 'Data';
                    }
                });
                
                const totais = vendasSemana.map(v => {
                    const total = parseFloat(v.total_dia);
                    return isNaN(total) ? 0 : total;
                });
                
                if (totais.some(total => total > 0)) {
                    charts.weekly = new Chart(weeklyCtx, {
                        type: 'line',
                        data: {
                            labels: dias,
                            datasets: [{
                                label: 'Faturamento (R$)',
                                data: totais,
                                borderColor: '#36B5B0',
                                backgroundColor: 'rgba(54, 181, 176, 0.1)',
                                borderWidth: 3,
                                tension: 0.3,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return 'R$ ' + value;
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else {
                    weeklyCtx.parentElement.innerHTML = `
                        <div style="text-align: center; padding: 30px; color: var(--gray);">
                            <i class="fas fa-chart-line" style="font-size: 40px; opacity: 0.3;"></i>
                            <p>Sem dados de vendas na semana</p>
                            <p style="font-size: 12px; margin-top: 5px;">Vendas aparecerão aqui após 7 dias</p>
                        </div>
                    `;
                }
            } else {
                weeklyCtx.parentElement.innerHTML = `
                    <div style="text-align: center; padding: 30px; color: var(--gray);">
                        <i class="fas fa-chart-line" style="font-size: 40px; opacity: 0.3;"></i>
                        <p>Carregando dados semanais...</p>
                    </div>
                `;
            }
        }
        
    } catch (error) {
        console.error('Erro ao atualizar gráficos:', error);
        
        const flavorsCtx = document.getElementById('flavorsChart');
        const weeklyCtx = document.getElementById('weeklyChart');
        
        if (flavorsCtx) {
            flavorsCtx.parentElement.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--warning);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px;"></i>
                    <p>Erro ao carregar gráfico</p>
                </div>
            `;
        }
        
        if (weeklyCtx) {
            weeklyCtx.parentElement.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--warning);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px;"></i>
                    <p>Erro ao carregar gráfico semanal</p>
                </div>
            `;
        }
    }
}

// ===== RELATÓRIOS =====
async function loadReports() {
    try {
        showLoading('reportContent', 'Gerando relatório...');
        
        const relatorio = await neonAPI('get_relatorio_completo');
        
        if (!relatorio) {
            throw new Error('Relatório vazio');
        }
        
        const reportContent = document.getElementById('reportContent');
        
        const totalVendas = relatorio.totalVendas || 0;
        const totalProdutos = relatorio.totalProdutos || 0;
        const totalFaturamento = relatorio.totalFaturamento || 0;
        const vendasRecentes = Array.isArray(relatorio.vendasRecentes) ? relatorio.vendasRecentes : [];
        
        reportContent.innerHTML = `
            <div>
                <h3 style="color: var(--dark); margin-bottom: 20px; font-size: 24px;">
                    <i class="fas fa-chart-bar"></i> Relatório Neon
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: #f0f7ff; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">VENDAS TOTAIS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--primary);">
                            ${totalVendas}
                        </div>
                    </div>
                    
                    <div style="background: #f0fff4; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">FATURAMENTO TOTAL</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--success);">
                            R$ ${formatPrice(totalFaturamento)}
                        </div>
                    </div>
                    
                    <div style="background: #fff8e1; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">PRODUTOS ATIVOS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--warning);">
                            ${totalProdutos}
                        </div>
                    </div>
                    
                    <div style="background: #ffebee; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: var(--gray);">ÚLTIMAS VENDAS</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--danger);">
                            ${vendasRecentes.length}
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4 style="color: var(--dark); margin-bottom: 15px;">Últimas Vendas</h4>
                    ${generateSalesTable(vendasRecentes)}
                </div>
                
                <div style="background: #e8f5e9; padding: 15px; border-radius: 10px;">
                    <p style="color: var(--success);">
                        <i class="fas fa-check-circle"></i> Banco de dados Neon conectado com sucesso!
                    </p>
                </div>
            </div>
        `;
        
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
                <button class="btn-primary" onclick="loadReports()" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
}

function generateSalesTable(vendasList) {
    if (!Array.isArray(vendasList) || vendasList.length === 0) {
        return `
            <div style="text-align: center; padding: 30px; color: var(--gray);">
                <i class="fas fa-receipt" style="font-size: 40px; opacity: 0.3;"></i>
                <p>Nenhuma venda registrada ainda</p>
            </div>
        `;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
                <tr style="background: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">Data</th>
                    <th style="padding: 10px; text-align: left;">Hora</th>
                    <th style="padding: 10px; text-align: left;">Itens</th>
                    <th style="padding: 10px; text-align: left;">Total</th>
                    <th style="padding: 10px; text-align: left;">Pagamento</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    vendasList.forEach(venda => {
        const dataFormatada = formatarData(venda.data);
        const pagamentoClass = {
            'dinheiro': 'payment-dinheiro',
            'cartao': 'payment-cartao',
            'pix': 'payment-pix',
            'fiado': 'payment-pix'
        }[venda.pagamento] || '';
        
        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${dataFormatada}</td>
                <td style="padding: 10px;">${venda.hora || '--:--'}</td>
                <td style="padding: 10px;">${venda.total_itens || 0} itens</td>
                <td style="padding: 10px; font-weight: 700;">R$ ${formatPrice(venda.total)}</td>
                <td style="padding: 10px;">
                    <span style="padding: 2px 8px; border-radius: 10px; background: #e3f2fd; color: #1565c0; font-size: 12px;">
                        ${(venda.pagamento || 'N/A').toUpperCase()}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

function printReport() {
    const printContent = document.getElementById('reportContent').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório Chop Manager</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Relatório Chop Manager PRO</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            ${printContent}
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

// ===== CONFIGURAÇÕES =====
async function loadConfig() {
    try {
        const relatorio = await neonAPI('get_relatorio_completo');
        
        const totalProdutos = relatorio?.totalProdutos || 0;
        const totalVendas = relatorio?.totalVendas || 0;
        const totalFaturamento = relatorio?.totalFaturamento || 0;
        
        document.getElementById('totalProducts').innerText = totalProdutos;
        document.getElementById('totalSales').innerText = totalVendas;
        document.getElementById('totalRevenue').innerText = `R$ ${formatPrice(totalFaturamento)}`;
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        document.getElementById('totalProducts').innerText = '0';
        document.getElementById('totalSales').innerText = '0';
        document.getElementById('totalRevenue').innerText = 'R$ 0,00';
    }
}

async function backupData() {
    try {
        showNotification('🔄 Gerando backup...', 'info');
        
        const [produtosData, vendasData] = await Promise.all([
            neonAPI('get_produtos'),
            neonAPI('get_vendas_periodo', {
                startDate: '2024-01-01',
                endDate: new Date().toISOString().split('T')[0]
            })
        ]);
        
        const backup = {
            produtos: produtosData,
            vendas: vendasData,
            timestamp: new Date().toISOString(),
            totalProdutos: Array.isArray(produtosData) ? produtosData.length : 0,
            totalVendas: Array.isArray(vendasData) ? vendasData.length : 0,
            totalFaturamento: Array.isArray(vendasData) ? vendasData.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0) : 0
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_neon_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('✅ Backup gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar backup:', error);
        showNotification('❌ Erro ao gerar backup', 'error');
    }
}

// ===== FIADOS (simplificado) =====
async function carregarFiados() {
    try {
        showLoading('fiadosList', 'Carregando fiados...');
        
        fiados = await neonAPI('get_fiados');
        const lista = document.getElementById('fiadosList');
        
        if (!Array.isArray(fiados) || fiados.length === 0) {
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
        
        calcularResumoFiados();
        
    } catch (error) {
        console.error('Erro ao carregar fiados:', error);
        showNotification('Erro ao carregar fiados', 'error');
    }
}

function calcularResumoFiados() {
    document.getElementById('totalReceber').textContent = 'R$ 0,00';
    document.getElementById('clientesAtraso').textContent = '0';
    document.getElementById('fiadosAtivos').textContent = '0';
}

// ===== FUNÇÕES GLOBAIS =====
window.navigateTo = function(pageId) {
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab) {
        tab.click();
    }
};

window.syncData = async function() {
    try {
        showNotification('🔄 Sincronizando com Neon...', 'info');
        
        await loadDashboard();
        await loadProductsForSale();
        await loadProductsList();
        
        showNotification('✅ Dados sincronizados!', 'success');
        
    } catch (error) {
        console.error('Erro na sincronização:', error);
        showNotification('❌ Erro na sincronização', 'error');
    }
};

// Funções básicas para modais de fiados
function abrirModalFiado() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

function abrirModalFiadoParaVenda() {
    showNotification('Para vendas fiadas, aguarde a próxima atualização', 'info');
}

function exportarFiados() {
    showNotification('Funcionalidade de fiados em desenvolvimento', 'info');
}

// ===== DEPURAÇÃO =====
// Adicione esta função para testar no console
window.debugConnection = async function() {
    console.log('🔧 Iniciando debug de conexão...');
    console.log('📡 URL da API:', API_URL);
    
    try {
        console.log('1. Testando conexão básica...');
        const test1 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'test' })
        });
        console.log('Status:', test1.status, 'OK:', test1.ok);
        
        console.log('2. Testando ação get_produtos...');
        const test2 = await neonAPI('get_produtos');
        console.log('Produtos recebidos:', Array.isArray(test2) ? test2.length : 'Não é array');
        
        console.log('3. Verificando ambiente...');
        console.log('User Agent:', navigator.userAgent);
        console.log('Online:', navigator.onLine);
        
    } catch (error) {
        console.error('❌ Debug falhou:', error);
    }
};
</script>
</body>
</html> , você pode corrijir o arquivo relatorio.js, produtos.js, main.js, fiados.js baseado no arquivo geral , pfv e me enviar cada arquivo separado
