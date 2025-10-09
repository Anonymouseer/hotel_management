document.addEventListener('DOMContentLoaded', () => {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    let purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
    let stockMovements = JSON.parse(localStorage.getItem('stockMovements')) || [];
    if (inventory.length === 0) {
        inventory = [
            {
                id: 'inv-001',
                name: 'Fresh Salmon',
                category: 'ingredients',
                currentStock: 25,
                minStock: 10,
                unitPrice: 45000,
                unit: 'kg',
                totalValue: 1125000,
                status: 'in-stock',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'inv-002',
                name: 'Jasmine Rice',
                category: 'ingredients',
                currentStock: 5,
                minStock: 20,
                unitPrice: 15000,
                unit: 'kg',
                totalValue: 75000,
                status: 'low-stock',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'inv-003',
                name: 'Coconut Milk',
                category: 'ingredients',
                currentStock: 0,
                minStock: 15,
                unitPrice: 8000,
                unit: 'liters',
                totalValue: 0,
                status: 'out-of-stock',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'inv-004',
                name: 'Fresh Shrimp',
                category: 'ingredients',
                currentStock: 30,
                minStock: 15,
                unitPrice: 35000,
                unit: 'kg',
                totalValue: 1050000,
                status: 'in-stock',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'inv-005',
                name: 'Cooking Oil',
                category: 'ingredients',
                currentStock: 8,
                minStock: 10,
                unitPrice: 12000,
                unit: 'liters',
                totalValue: 96000,
                status: 'low-stock',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'inv-006',
                name: 'Paper Napkins',
                category: 'supplies',
                currentStock: 50,
                minStock: 20,
                unitPrice: 5000,
                unit: 'boxes',
                totalValue: 250000,
                status: 'in-stock',
                lastUpdated: new Date().toISOString()
            }
        ];
        saveInventory();
    }

    if (suppliers.length === 0) {
        suppliers = [
            {
                id: 'sup-001',
                name: 'Fresh Seafood Co.',
                contactPerson: 'John Smith',
                email: 'john@freshseafood.com',
                phone: '+62 812-3456-7890',
                address: 'Jl. Raya Pantai Indah, Jakarta Utara',
                status: 'active'
            },
            {
                id: 'sup-002',
                name: 'Premium Ingredients Ltd.',
                contactPerson: 'Sarah Johnson',
                email: 'sarah@premiumingredients.com',
                phone: '+62 813-9876-5432',
                address: 'Jl. Sudirman No. 123, Jakarta Selatan',
                status: 'active'
            }
        ];
        saveSuppliers();
    }

    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    const totalItemsEl = document.getElementById('total-items');
    const lowStockItemsEl = document.getElementById('low-stock-items');
    const outOfStockItemsEl = document.getElementById('out-of-stock-items');
    const totalValueEl = document.getElementById('total-value');
    const recentActivitiesEl = document.getElementById('recent-activities');
    const lowStockAlertsEl = document.getElementById('low-stock-alerts');
    const alertCountEl = document.getElementById('alert-count');
    
    const stockTableBody = document.getElementById('stock-table-body');
    const stockSearch = document.getElementById('stock-search');
    const categoryFilter = document.getElementById('category-filter');
    
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const mainContainer = document.querySelector('.main-container');

    const stockModal = document.getElementById('stock-modal');
    const supplierModal = document.getElementById('supplier-modal');
    const stockForm = document.getElementById('stock-form');
    const supplierForm = document.getElementById('supplier-form');
    
    const addStockBtn = document.getElementById('add-stock-btn');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const createPurchaseBtn = document.getElementById('create-purchase-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const exportBtn = document.getElementById('export-btn');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function generateId(prefix) {
        return prefix + '-' + Math.random().toString(36).substr(2, 9);
    }

    function saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function saveSuppliers() {
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
    }

    function savePurchaseOrders() {
        localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
    }

    function saveStockMovements() {
        localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
    }

    function addStockMovement(itemId, type, quantity, reason = '') {
        const movement = {
            id: generateId('mov'),
            itemId: itemId,
            type: type,
            quantity: quantity,
            reason: reason,
            timestamp: new Date().toISOString()
        };
        stockMovements.unshift(movement);
        saveStockMovements();
    }

    function updateItemStatus(item) {
        if (item.currentStock === 0) {
            item.status = 'out-of-stock';
        } else if (item.currentStock <= item.minStock) {
            item.status = 'low-stock';
        } else {
            item.status = 'in-stock';
        }
        item.totalValue = item.currentStock * item.unitPrice;
        item.lastUpdated = new Date().toISOString();
    }

    function handleStorageChange(e) {
        if (e.key === 'inventory' || e.key === 'stockMovements' || e.key === 'suppliers' || e.key === 'purchaseOrders') {
            console.log(`Storage updated for ${e.key}. Reloading data.`);
            inventory = JSON.parse(localStorage.getItem('inventory')) || [];
            suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
            purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
            stockMovements = JSON.parse(localStorage.getItem('stockMovements')) || [];

            const activeSection = document.querySelector('.content-section.active');
            if (activeSection) {
                const sectionName = activeSection.id.replace('-section', '');
                loadSectionData(sectionName);
            }
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        const icon = darkModeToggle.querySelector('i');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        localStorage.setItem('darkMode', isDarkMode);
    }

    function initializeDarkMode() {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            icon.className = 'fas fa-sun';
        }
    }

    function toggleSidebar() {
        const isCollapsed = sidebar.classList.contains('collapsed');
        const isMobile = window.innerWidth <= 1024;
        
        if (isCollapsed) {
            sidebar.classList.remove('collapsed');
            if (isMobile) sidebar.classList.add('force-visible');
            mainContainer.classList.remove('sidebar-collapsed');
            if (isMobile) sidebarBackdrop.classList.add('active');
            sidebarToggle.querySelector('i').className = 'fas fa-times';
        } else {
            sidebar.classList.add('collapsed');
            if (isMobile) sidebar.classList.remove('force-visible');
            mainContainer.classList.add('sidebar-collapsed');
            if (isMobile) sidebarBackdrop.classList.remove('active');
            sidebarToggle.querySelector('i').className = 'fas fa-bars';
        }
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
    }
    function initializeSidebar() {
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('force-visible');
            mainContainer.classList.add('sidebar-collapsed');
            sidebarBackdrop.classList.remove('active');
            sidebarToggle.querySelector('i').className = 'fas fa-bars';
        } else {
            sidebar.classList.remove('collapsed');
            if (window.innerWidth <= 1024) sidebar.classList.add('force-visible');
            mainContainer.classList.remove('sidebar-collapsed');
            if (window.innerWidth <= 1024) sidebarBackdrop.classList.add('active');
            sidebarToggle.querySelector('i').className = 'fas fa-times';
        }
    }

    function closeSidebarOnBackdrop() {
        sidebarBackdrop.addEventListener('click', () => {
            if (!sidebar.classList.contains('collapsed')) {
                toggleSidebar();
            }
        });
    }

    function showSection(sectionName) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        navItems.forEach(item => {
            item.parentElement.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.parentElement.classList.add('active');
        }
        
        updatePageHeader(sectionName);
        
        loadSectionData(sectionName);
    }

    function updatePageHeader(sectionName) {
        const headers = {
            dashboard: {
                title: 'Inventory Dashboard',
                subtitle: 'Monitor your stock levels and inventory performance'
            },
            stock: {
                title: 'Stock Management',
                subtitle: 'Manage your inventory items and stock levels'
            },
            suppliers: {
                title: 'Suppliers',
                subtitle: 'Manage your supplier information and contacts'
            },
            purchases: {
                title: 'Purchase Orders',
                subtitle: 'Track and manage your purchase orders'
            },
            reports: {
                title: 'Inventory Reports',
                subtitle: 'Generate and view inventory reports'
            },
            settings: {
                title: 'Inventory Settings',
                subtitle: 'Configure inventory management settings'
            }
        };
        
        const header = headers[sectionName];
        if (header) {
            pageTitle.textContent = header.title;
            pageSubtitle.textContent = header.subtitle;
        }
    }

    function loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'stock':
                loadStockManagement();
                break;
            case 'suppliers':
                loadSuppliers();
                break;
            case 'purchases':
                loadPurchases();
                break;
            case 'reports':
                loadReports();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }

    function loadDashboard() {
        updateDashboardStats();
        loadRecentActivities();
        loadLowStockAlerts();
    }

    function updateDashboardStats() {
        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
        const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;
        const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

        totalItemsEl.textContent = totalItems;
        lowStockItemsEl.textContent = lowStockItems;
        outOfStockItemsEl.textContent = outOfStockItems;
        totalValueEl.textContent = formatCurrency(totalValue);
    }

    function loadRecentActivities() {
        const recentMovements = stockMovements.slice(0, 5);
        
        if (recentMovements.length === 0) {
            recentActivitiesEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No Recent Activity</h3>
                    <p>Stock movements will appear here</p>
                </div>
            `;
            return;
        }

        recentActivitiesEl.innerHTML = recentMovements.map(movement => {
            const item = inventory.find(i => i.id === movement.itemId);
            const itemName = item ? item.name : 'Unknown Item';
            const timeAgo = getTimeAgo(movement.timestamp);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${movement.type === 'in' ? 'arrow-up' : 'arrow-down'}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${movement.type === 'in' ? 'Stock Added' : 'Stock Used'}: ${itemName}</h4>
                        <p>Quantity: ${movement.quantity} ${movement.reason ? `- ${movement.reason}` : ''}</p>
                    </div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            `;
        }).join('');
    }

    function loadLowStockAlerts() {
        const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
        
        alertCountEl.textContent = lowStockItems.length;
        
        if (lowStockItems.length === 0) {
            lowStockAlertsEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>All Stock Levels Good</h3>
                    <p>No low stock alerts at this time</p>
                </div>
            `;
            return;
        }

        lowStockAlertsEl.innerHTML = lowStockItems.map(item => {
            const timeAgo = getTimeAgo(item.lastUpdated);
            
            return `
                <div class="alert-item">
                    <div class="alert-icon">
                        <i class="fas fa-${item.status === 'out-of-stock' ? 'times' : 'exclamation-triangle'}"></i>
                    </div>
                    <div class="alert-content">
                        <h4>${item.name}</h4>
                        <p>Current: ${item.currentStock} ${item.unit} | Min: ${item.minStock} ${item.unit}</p>
                    </div>
                    <div class="alert-time">${timeAgo}</div>
                </div>
            `;
        }).join('');
    }

    function getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    function loadStockManagement() {
        renderStockTable(inventory);
    }

    function renderStockTable(items) {
        if (items.length === 0) {
            stockTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i class="fas fa-boxes"></i>
                        <h3>No Inventory Items</h3>
                        <p>Add your first inventory item to get started</p>
                    </td>
                </tr>
            `;
            return;
        }

        stockTableBody.innerHTML = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.currentStock} ${item.unit}</td>
                <td>${item.minStock} ${item.unit}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.totalValue)}</td>
                <td><span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm edit" onclick="editStockItem('${item.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-sm" onclick="adjustStock('${item.id}')" title="Adjust Stock">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="btn-sm delete" onclick="deleteStockItem('${item.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function filterStock() {
        const searchTerm = stockSearch.value.toLowerCase();
        const category = categoryFilter.value;
        
        let filteredItems = inventory;
        
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }
        
        if (category) {
            filteredItems = filteredItems.filter(item => item.category === category);
        }
        
        renderStockTable(filteredItems);
    }

    function loadSuppliers() {
        const suppliersGrid = document.getElementById('suppliers-grid');
        
        if (suppliers.length === 0) {
            suppliersGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-truck"></i>
                    <h3>No Suppliers</h3>
                    <p>Add your first supplier to get started</p>
                </div>
            `;
            return;
        }

        suppliersGrid.innerHTML = suppliers.map(supplier => `
            <div class="supplier-card">
                <div class="supplier-header">
                    <div>
                        <div class="supplier-name">${supplier.name}</div>
                        <div class="supplier-contact">${supplier.contactPerson}</div>
                    </div>
                    <div class="supplier-actions">
                        <button class="btn-sm edit" onclick="editSupplier('${supplier.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-sm delete" onclick="deleteSupplier('${supplier.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="supplier-info">
                    <p><i class="fas fa-envelope"></i> ${supplier.email}</p>
                    <p><i class="fas fa-phone"></i> ${supplier.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${supplier.address}</p>
                </div>
            </div>
        `).join('');
    }

    function loadPurchases() {
        const purchasesTableBody = document.getElementById('purchases-table-body');
        
        if (purchaseOrders.length === 0) {
            purchasesTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>No Purchase Orders</h3>
                        <p>Create your first purchase order to get started</p>
                    </td>
                </tr>
            `;
            return;
        }

        purchasesTableBody.innerHTML = purchaseOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.supplierName}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.items.length} items</td>
                <td>${formatCurrency(order.totalAmount)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm" onclick="viewPurchaseOrder('${order.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-sm edit" onclick="editPurchaseOrder('${order.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function loadReports() {
        const reportsContainer = document.getElementById('reports-container');
        reportsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <h3>Select Report Type</h3>
                <p>Choose a report type and date range to generate your report</p>
            </div>
        `;
    }

    function generateReport() {
        const reportType = document.getElementById('report-type').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        const reportsContainer = document.getElementById('reports-container');
        
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        let reportContent = '';
        
        switch (reportType) {
            case 'stock-levels':
                reportContent = generateStockLevelsReport(startDate, endDate);
                break;
            case 'movement':
                reportContent = generateMovementReport(startDate, endDate);
                break;
            case 'valuation':
                reportContent = generateValuationReport(startDate, endDate);
                break;
            case 'supplier':
                reportContent = generateSupplierReport(startDate, endDate);
                break;
        }
        
        reportsContainer.innerHTML = reportContent;
    }

    function generateStockLevelsReport(startDate, endDate) {
        const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
        const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
        
        return `
            <div class="report-content">
                <h3>Stock Levels Report</h3>
                <p>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                
                <div class="report-stats">
                    <div class="stat-item">
                        <span>Total Items:</span>
                        <strong>${inventory.length}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Total Value:</span>
                        <strong>${formatCurrency(totalValue)}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Low Stock Items:</span>
                        <strong>${lowStockItems.length}</strong>
                    </div>
                </div>
                
                <h4>Low Stock Items</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Current Stock</th>
                            <th>Min Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowStockItems.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.currentStock} ${item.unit}</td>
                                <td>${item.minStock} ${item.unit}</td>
                                <td><span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function generateMovementReport(startDate, endDate) {
        const filteredMovements = stockMovements.filter(movement => {
            const movementDate = new Date(movement.timestamp);
            return movementDate >= new Date(startDate) && movementDate <= new Date(endDate);
        });
        
        return `
            <div class="report-content">
                <h3>Stock Movement Report</h3>
                <p>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredMovements.map(movement => {
                            const item = inventory.find(i => i.id === movement.itemId);
                            return `
                                <tr>
                                    <td>${new Date(movement.timestamp).toLocaleDateString()}</td>
                                    <td>${item ? item.name : 'Unknown'}</td>
                                    <td>${movement.type}</td>
                                    <td>${movement.quantity}</td>
                                    <td>${movement.reason || '-'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function generateValuationReport(startDate, endDate) {
        const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
        const categoryValues = {};
        
        inventory.forEach(item => {
            if (!categoryValues[item.category]) {
                categoryValues[item.category] = 0;
            }
            categoryValues[item.category] += item.totalValue;
        });
        
        return `
            <div class="report-content">
                <h3>Inventory Valuation Report</h3>
                <p>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                
                <div class="report-stats">
                    <div class="stat-item">
                        <span>Total Inventory Value:</span>
                        <strong>${formatCurrency(totalValue)}</strong>
                    </div>
                </div>
                
                <h4>Value by Category</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Value</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(categoryValues).map(([category, value]) => `
                            <tr>
                                <td>${category}</td>
                                <td>${formatCurrency(value)}</td>
                                <td>${((value / totalValue) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function generateSupplierReport(startDate, endDate) {
        return `
            <div class="report-content">
                <h3>Supplier Performance Report</h3>
                <p>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suppliers.map(supplier => `
                            <tr>
                                <td>${supplier.name}</td>
                                <td>${supplier.contactPerson}</td>
                                <td>${supplier.email}</td>
                                <td>${supplier.phone}</td>
                                <td><span class="status-badge ${supplier.status}">${supplier.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function loadSettings() {
        const lowStockThreshold = localStorage.getItem('lowStockThreshold') || '20';
        const emailAlerts = localStorage.getItem('emailAlerts') === 'true';
        const defaultUnit = localStorage.getItem('defaultUnit') || 'pcs';
        
        document.getElementById('low-stock-threshold').value = lowStockThreshold;
        document.getElementById('email-alerts').checked = emailAlerts;
        document.getElementById('default-unit').value = defaultUnit;
    }

    function saveSettings() {
        const lowStockThreshold = document.getElementById('low-stock-threshold').value;
        const emailAlerts = document.getElementById('email-alerts').checked;
        const defaultUnit = document.getElementById('default-unit').value;
        
        localStorage.setItem('lowStockThreshold', lowStockThreshold);
        localStorage.setItem('emailAlerts', emailAlerts);
        localStorage.setItem('defaultUnit', defaultUnit);
        
        alert('Settings saved successfully!');
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    function addStockItem() {
        document.getElementById('modal-title').textContent = 'Add Stock Item';
        openModal('stock-modal');
    }

    function editStockItem(itemId) {
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;
        
        document.getElementById('modal-title').textContent = 'Edit Stock Item';
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-category').value = item.category;
        document.getElementById('current-stock').value = item.currentStock;
        document.getElementById('min-stock').value = item.minStock;
        document.getElementById('unit-price').value = item.unitPrice;
        document.getElementById('item-unit').value = item.unit;
        
        stockForm.dataset.itemId = itemId;
        
        openModal('stock-modal');
    }

    function deleteStockItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            inventory = inventory.filter(item => item.id !== itemId);
            saveInventory();
            loadStockManagement();
            loadDashboard();
        }
    }

    function adjustStock(itemId) {
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;
        
        const adjustment = prompt(`Current stock: ${item.currentStock} ${item.unit}\nEnter adjustment (+ for increase, - for decrease):`);
        if (adjustment === null) return;
        
        const adjustmentValue = parseInt(adjustment);
        if (isNaN(adjustmentValue)) {
            alert('Please enter a valid number');
            return;
        }
        
        const newStock = item.currentStock + adjustmentValue;
        if (newStock < 0) {
            alert('Stock cannot be negative');
            return;
        }
        
        item.currentStock = newStock;
        updateItemStatus(item);
        saveInventory();
        
        addStockMovement(itemId, adjustmentValue > 0 ? 'in' : 'out', Math.abs(adjustmentValue), 'Manual adjustment');
        
        loadStockManagement();
        loadDashboard();
    }

    function addSupplier() {
        document.getElementById('supplier-modal-title').textContent = 'Add Supplier';
        openModal('supplier-modal');
    }

    function editSupplier(supplierId) {
        const supplier = suppliers.find(s => s.id === supplierId);
        if (!supplier) return;
        
        document.getElementById('supplier-modal-title').textContent = 'Edit Supplier';
        document.getElementById('supplier-name').value = supplier.name;
        document.getElementById('contact-person').value = supplier.contactPerson;
        document.getElementById('supplier-email').value = supplier.email;
        document.getElementById('supplier-phone').value = supplier.phone;
        document.getElementById('supplier-address').value = supplier.address;
        
        supplierForm.dataset.supplierId = supplierId;
        
        openModal('supplier-modal');
    }

    function deleteSupplier(supplierId) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            suppliers = suppliers.filter(s => s.id !== supplierId);
            saveSuppliers();
            loadSuppliers();
        }
    }

    function handleStockFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('item-name').value,
            category: document.getElementById('item-category').value,
            currentStock: parseInt(document.getElementById('current-stock').value),
            minStock: parseInt(document.getElementById('min-stock').value),
            unitPrice: parseFloat(document.getElementById('unit-price').value),
            unit: document.getElementById('item-unit').value
        };
        
        const itemId = stockForm.dataset.itemId;
        
        if (itemId) {
            const item = inventory.find(i => i.id === itemId);
            if (item) {
                Object.assign(item, formData);
                updateItemStatus(item);
            }
        } else {
            const newItem = {
                id: generateId('inv'),
                ...formData,
                status: 'in-stock',
                lastUpdated: new Date().toISOString()
            };
            updateItemStatus(newItem);
            inventory.push(newItem);
        }
        
        saveInventory();
        closeModal('stock-modal');
        loadStockManagement();
        loadDashboard();
    }

    function handleSupplierFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('supplier-name').value,
            contactPerson: document.getElementById('contact-person').value,
            email: document.getElementById('supplier-email').value,
            phone: document.getElementById('supplier-phone').value,
            address: document.getElementById('supplier-address').value,
            status: 'active'
        };
        
        const supplierId = supplierForm.dataset.supplierId;
        
        if (supplierId) {
            const supplier = suppliers.find(s => s.id === supplierId);
            if (supplier) {
                Object.assign(supplier, formData);
            }
        } else {
            const newSupplier = {
                id: generateId('sup'),
                ...formData
            };
            suppliers.push(newSupplier);
        }
        
        saveSuppliers();
        closeModal('supplier-modal');
        loadSuppliers();
    }

    function exportData() {
        const data = {
            inventory: inventory,
            suppliers: suppliers,
            purchaseOrders: purchaseOrders,
            stockMovements: stockMovements,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    stockSearch.addEventListener('input', filterStock);
    categoryFilter.addEventListener('change', filterStock);

    stockForm.addEventListener('submit', handleStockFormSubmit);
    supplierForm.addEventListener('submit', handleSupplierFormSubmit);

    addStockBtn.addEventListener('click', addStockItem);
    addSupplierBtn.addEventListener('click', addSupplier);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    exportBtn.addEventListener('click', exportData);

    document.getElementById('generate-report-btn').addEventListener('click', generateReport);

    document.getElementById('low-stock-threshold').addEventListener('change', saveSettings);
    document.getElementById('email-alerts').addEventListener('change', saveSettings);
    document.getElementById('default-unit').addEventListener('change', saveSettings);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    window.addEventListener('storage', handleStorageChange);

    window.editStockItem = editStockItem;
    window.deleteStockItem = deleteStockItem;
    window.adjustStock = adjustStock;
    window.editSupplier = editSupplier;
    window.deleteSupplier = deleteSupplier;
    window.closeModal = closeModal;

    function init() {
        showSection('dashboard');
        loadSettings();
        initializeDarkMode();
        initializeSidebar();
        closeSidebarOnBackdrop();
    }

    init();
});
