document.addEventListener('DOMContentLoaded', () => {
    function getInventoryData() {
        return JSON.parse(localStorage.getItem('inventory')) || [];
    }

    function updateProductStock(productId, quantityUsed) {
        const inventory = getInventoryData();
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const inventoryItem = inventory.find(item => {
            const itemName = item.name.toLowerCase();
            const productName = product.name.toLowerCase();
            
            // Direct name match
            if (itemName === productName) return true;
            
            const keyWords = ['shrimp', 'salmon', 'rice', 'coconut', 'garlic', 'avocado', 'soup', 'fried', 'orange', 'coffee', 'tea', 'chocolate', 'ice', 'mango'];
            return keyWords.some(keyword => 
                itemName.includes(keyword) && productName.includes(keyword)
            );
        });
        
        if (inventoryItem) {
            inventoryItem.currentStock = Math.max(0, inventoryItem.currentStock - quantityUsed);
            inventoryItem.totalValue = inventoryItem.currentStock * inventoryItem.unitPrice;
            inventoryItem.lastUpdated = new Date().toISOString();
            if (inventoryItem.currentStock === 0) {
                inventoryItem.status = 'out-of-stock';
            } else if (inventoryItem.currentStock <= inventoryItem.minStock) {
                inventoryItem.status = 'low-stock';
            } else {
                inventoryItem.status = 'in-stock';
            }
            
            localStorage.setItem('inventory', JSON.stringify(inventory));
            
            const stockMovements = JSON.parse(localStorage.getItem('stockMovements')) || [];
            stockMovements.unshift({
                id: 'mov-' + Math.random().toString(36).substr(2, 9),
                itemId: inventoryItem.id,
                type: 'out',
                quantity: quantityUsed,
                reason: `POS Sale - ${product.name}`,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
        }
    }

    function checkProductAvailability(productId) {
        const inventory = getInventoryData();
        const product = products.find(p => p.id === productId);
        if (!product) {
            return { available: true, stock: 999, status: 'in-stock' };
        }
        
        const inventoryItem = inventory.find(item => {
            const itemName = item.name.toLowerCase();
            const productName = product.name.toLowerCase();
            
            if (itemName === productName) return true;
            
            const keyWords = ['shrimp', 'salmon', 'rice', 'coconut', 'garlic', 'avocado', 'soup', 'fried', 'orange', 'coffee', 'tea', 'chocolate', 'ice', 'mango'];
            return keyWords.some(keyword => 
                itemName.includes(keyword) && productName.includes(keyword)
            );
        });
        
        if (inventoryItem) {
            return {
                available: inventoryItem.currentStock > 0,
                stock: inventoryItem.currentStock,
                status: inventoryItem.status
            };
        }
        
        return { available: true, stock: 999, status: 'in-stock' };
    }

    const initialProducts = [
        { 
            id: 'app-001', 
            name: 'Lechon Kawali', 
            price: 350, 
            category: 'appetizers', 
            description: 'Filipino Favorite', 
            image: 'foodimg/lechonkawali.png',
            variants: ['Small', 'Medium', 'Large'],
            additions: ['Lemon', 'Extra Spice', 'Garlic'],
            prepTime: '15 min',
            popularity: 'hot'
        },
        { 
            id: 'app-002', 
            name: 'Pork Humba', 
            price: 280, 
            category: 'appetizers', 
            description: 'Sweet & Savory', 
            image: 'foodimg/porkhumba.png',
            variants: ['Regular', 'Extra Garlic'],
            additions: ['Butter', 'Chili Oil'],
            prepTime: '12 min',
            popularity: 'new'
        },
        { 
            id: 'app-003', 
            name: 'Thai Hot Seafood', 
            price: 420, 
            category: 'appetizers', 
            description: 'Creamy', 
            image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop&crop=center',
            variants: ['Mild', 'Medium', 'Hot'],
            additions: ['Coconut Milk', 'Lime'],
            prepTime: '20 min',
            popularity: 'popular'
        },
        { 
            id: 'app-004', 
            name: 'Avocado Salad', 
            price: 250, 
            category: 'appetizers', 
            description: 'Fresh greens', 
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&crop=center',
            variants: ['Small', 'Large'],
            additions: ['Olive Oil', 'Balsamic'],
            prepTime: '8 min',
            popularity: 'healthy'
        },
        { 
            id: 'app-005', 
            name: 'Soup Bowl', 
            price: 180, 
            category: 'appetizers', 
            description: 'Warm comfort', 
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Large'],
            additions: ['Crackers', 'Herbs'],
            prepTime: '10 min',
            popularity: 'comfort'
        },
        { 
            id: 'app-006', 
            name: 'Fried Rice Special', 
            price: 280, 
            category: 'appetizers', 
            description: 'Asian style', 
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Extra Large'],
            additions: ['Soy Sauce', 'Chili'],
            prepTime: '18 min',
            popularity: 'classic'
        },
        
        { 
            id: 'sea-001', 
            name: 'Grilled Salmon', 
            price: 650, 
            category: 'seafood', 
            description: 'Fresh Atlantic', 
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop&crop=center',
            variants: ['200g', '300g', '400g'],
            additions: ['Lemon Butter', 'Herbs'],
            prepTime: '25 min',
            popularity: 'premium'
        },
        { 
            id: 'sea-002', 
            name: 'Lobster Tail', 
            price: 1500, 
            category: 'seafood', 
            description: 'Premium quality', 
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center',
            variants: ['Small', 'Medium', 'Large'],
            additions: ['Garlic Butter', 'Lemon'],
            prepTime: '30 min',
            popularity: 'luxury'
        },
        { 
            id: 'sea-003', 
            name: 'Crab Legs', 
            price: 850, 
            category: 'seafood', 
            description: 'Alaskan king', 
            image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop&crop=center',
            variants: ['Half Pound', 'Full Pound'],
            additions: ['Melted Butter', 'Old Bay'],
            prepTime: '20 min',
            popularity: 'special'
        },
        
        { 
            id: 'fish-001', 
            name: 'Red Snapper', 
            price: 550, 
            category: 'fish', 
            description: 'Pan seared', 
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center',
            variants: ['Whole', 'Fillet'],
            additions: ['Capers', 'White Wine'],
            prepTime: '22 min',
            popularity: 'fresh'
        },
        { 
            id: 'fish-002', 
            name: 'Tuna Steak', 
            price: 580, 
            category: 'fish', 
            description: 'Sushi grade', 
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
            variants: ['Rare', 'Medium', 'Well Done'],
            additions: ['Wasabi', 'Soy Sauce'],
            prepTime: '15 min',
            popularity: 'premium'
        },
        
        { 
            id: 'shrimp-001', 
            name: 'Shrimp Fried Spicy Sauce', 
            price: 380, 
            category: 'shrimp', 
            description: 'Medium heat', 
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d9?w=300&h=200&fit=crop&crop=center',
            variants: ['Small', 'Medium', 'Large'],
            additions: ['Lemon', 'Extra Spice'],
            prepTime: '18 min',
            popularity: 'spicy'
        },
        { 
            id: 'shrimp-002', 
            name: 'Coconut Shrimp', 
            price: 360, 
            category: 'shrimp', 
            description: 'Crispy coating', 
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
            variants: ['6 pieces', '12 pieces'],
            additions: ['Sweet Chili', 'Mango Sauce'],
            prepTime: '16 min',
            popularity: 'tropical'
        },
        
        { 
            id: 'rice-001', 
            name: 'Jasmine Rice', 
            price: 50, 
            category: 'rice', 
            description: 'Fragrant', 
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center',
            variants: ['Small', 'Large'],
            additions: ['Coconut Milk'],
            prepTime: '12 min',
            popularity: 'staple'
        },
        { 
            id: 'rice-002', 
            name: 'Fried Rice Deluxe', 
            price: 250, 
            category: 'rice', 
            description: 'Mixed vegetables', 
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Extra Large'],
            additions: ['Egg', 'Chicken'],
            prepTime: '15 min',
            popularity: 'classic'
        },
        
        { 
            id: 'drink-001', 
            name: 'Fresh Orange Juice', 
            price: 120, 
            category: 'drinks', 
            description: 'Fresh squeezed', 
            image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop&crop=center',
            variants: ['Small', 'Large'],
            additions: ['Ice', 'No Ice'],
            prepTime: '3 min',
            popularity: 'fresh'
        },
        { 
            id: 'drink-002', 
            name: 'Iced Coffee', 
            price: 150, 
            category: 'drinks', 
            description: 'Cold brew', 
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Large'],
            additions: ['Milk', 'Sugar'],
            prepTime: '5 min',
            popularity: 'caffeinated'
        },
        { 
            id: 'drink-003', 
            name: 'Green Tea', 
            price: 100, 
            category: 'drinks', 
            description: 'Premium blend', 
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop&crop=center',
            variants: ['Hot', 'Iced'],
            additions: ['Honey', 'Lemon'],
            prepTime: '4 min',
            popularity: 'healthy'
        },
        { 
            id: 'drink-004', 
            name: 'Coconut Water', 
            price: 90, 
            category: 'drinks', 
            description: 'Natural', 
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Large'],
            additions: ['Ice', 'Lime'],
            prepTime: '2 min',
            popularity: 'refreshing'
        },
        
        { 
            id: 'dessert-001', 
            name: 'Chocolate Cake', 
            price: 220, 
            category: 'dessert', 
            description: 'Rich & moist', 
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop&crop=center',
            variants: ['Slice', 'Whole'],
            additions: ['Ice Cream', 'Berries'],
            prepTime: '8 min',
            popularity: 'indulgent'
        },
        { 
            id: 'dessert-002', 
            name: 'Ice Cream', 
            price: 120, 
            category: 'dessert', 
            description: 'Vanilla bean', 
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop&crop=center',
            variants: ['1 Scoop', '2 Scoops', '3 Scoops'],
            additions: ['Chocolate Sauce', 'Caramel'],
            prepTime: '3 min',
            popularity: 'sweet'
        },
        { 
            id: 'dessert-003', 
            name: 'Mango Sticky Rice', 
            price: 180, 
            category: 'dessert', 
            description: 'Traditional Thai', 
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
            variants: ['Regular', 'Large'],
            additions: ['Coconut Cream'],
            prepTime: '10 min',
            popularity: 'traditional'
        }
    ];

    let products = JSON.parse(localStorage.getItem('posProducts')) || initialProducts;

    let config = JSON.parse(localStorage.getItem('posConfig')) || { restaurantName: 'Solara Hotel', taxRate: 0.026 };
    let tables = JSON.parse(localStorage.getItem('posTables')) || ['1A', '1B', '1C', '1D', '1E', '2A', '2B', '2C', '2D', '2E', '2F', 'O1', 'O2', 'O3'];

    let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    let orderQueue = JSON.parse(localStorage.getItem('posOrderQueue')) || [];

    let currentOrder = {
        items: new Map(),
        customerName: '',
        table: '',
        orderType: 'dine-in',
        discount: 0,
        taxRate: config.taxRate || 0.026, // Use tax rate from config
        promoCode: '',
        paymentMethod: 'cash' // Default payment method
    };

    const productGrid = document.getElementById('product-grid');
    const orderItemsContainer = document.getElementById('order-items');
    const categoryTabsContainer = document.getElementById('category-tabs-container');
    const searchInput = document.getElementById('product-search');
    const orderQueueCards = document.getElementById('order-queue-cards');
    const customerNameInput = document.querySelector('.customer-name-input');
    const tableSelect = document.querySelector('.table-select');
    const orderTypeTabs = document.querySelectorAll('.order-type-tab');
    const clearAllBtn = document.querySelector('.clear-all-btn');
    const proceedPaymentBtn = document.querySelector('.proceed-payment-btn');
    const promoCodeInput = document.querySelector('.promo-code-input');
    const applyBtn = document.querySelector('.apply-btn');
    const paymentMethodTabs = document.querySelectorAll('.payment-method-tab');

    const discountRateInput = document.getElementById('discount-rate');
    const taxRateInput = document.getElementById('tax-rate');
    const receiptModal = document.getElementById('receipt-modal');
    const closeReceiptBtn = document.getElementById('close-receipt-btn');
    const printReceiptBtn = document.getElementById('print-receipt-btn');

    const salesReportModal = document.getElementById('sales-report-modal');
    const closeSalesReportBtn = document.getElementById('close-sales-report-btn');
    const generateSalesReportBtn = document.getElementById('generate-sales-report-btn');

    const orderDetailsModal = document.getElementById('order-details-modal');
    const closeOrderDetailsBtn = document.getElementById('close-order-details-btn');
    const closeOrderDetailsSecondaryBtn = document.getElementById('close-order-details-secondary-btn');
    const printOrderDetailsBtn = document.getElementById('print-order-details-btn');

    const salesReportLinks = document.querySelectorAll('[data-action="open-sales-report"]');

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const mainContainer = document.querySelector('.main-container');

    const orderHistoryTableBody = document.getElementById('order-history-table-body');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    // START: New Dashboard Elements
    const dashboardTotalRevenueEl = document.getElementById('dashboard-total-revenue');
    const dashboardTotalOrdersEl = document.getElementById('dashboard-total-orders');
    const dashboardLowStockEl = document.getElementById('dashboard-low-stock');
    const dashboardOutOfStockEl = document.getElementById('dashboard-out-of-stock');
    const dashboardTopItemsEl = document.getElementById('dashboard-top-items');
    const dashboardActivityFeedEl = document.getElementById('dashboard-activity-feed');
    // END: New Dashboard Elements

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function generateOrderId() {
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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
        } else {
            const icon = darkModeToggle.querySelector('i');
            icon.className = 'fas fa-moon';
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
        // Check if user previously collapsed it
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
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', () => {
                if (!sidebar.classList.contains('collapsed')) {
                    toggleSidebar();
                }
            });
        }
    }

    function renderCategoryTabs() {
        if (!categoryTabsContainer) return;

        let categories = JSON.parse(localStorage.getItem('posCategories'));
        if (!categories || categories.length === 0) {
            // Fallback to deriving from products if no categories are managed
            categories = [...new Set(products.map(p => p.category))];
        }

        categoryTabsContainer.innerHTML = categories.map((cat, index) => `
            <button class="category-tab ${index === 0 ? 'active' : ''}" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');

        // Re-attach event listeners
        const categoryTabs = categoryTabsContainer.querySelectorAll('.category-tab');
        if (categoryTabs.length > 0) {
            categoryTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    categoryTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const category = tab.dataset.category;
                    renderProducts(category, searchInput.value);
                });
            });
        }
    }

    function renderTableOptions() {
        if (!tableSelect) return;

        const currentSelection = tableSelect.value;
        tableSelect.innerHTML = '<option value="">Select table</option>';

        const groupedTables = {
            "Floor 1": [],
            "Floor 2": [],
            "Outdoor": [],
            "Others": []
        };

        // Group tables based on their name prefix
        tables.forEach(table => {
            if (table.startsWith('1')) groupedTables["Floor 1"].push(table);
            else if (table.startsWith('2')) groupedTables["Floor 2"].push(table);
            else if (table.startsWith('O')) groupedTables["Outdoor"].push(table);
            else groupedTables["Others"].push(table);
        });

        // Create <optgroup> for each category
        for (const groupName in groupedTables) {
            const groupTables = groupedTables[groupName];
            if (groupTables.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = groupName;
                groupTables.forEach(table => {
                    const option = document.createElement('option');
                    option.value = table;
                    option.textContent = table;
                    optgroup.appendChild(option);
                });
                tableSelect.appendChild(optgroup);
            }
        }

        tableSelect.value = currentSelection;
    }

    function renderProducts(category = 'appetizers', searchTerm = '') {
        productGrid.innerHTML = '';
        
        let categoryFilteredProducts = products;
        
        if (category !== 'all') {
            categoryFilteredProducts = products.filter(p => p.category === category);
        }
        
        let finalFilteredProducts = categoryFilteredProducts;
        if (searchTerm) {
            finalFilteredProducts = categoryFilteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        finalFilteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const availability = checkProductAvailability(product.id);
        const isOutOfStock = !availability.available;
        
        const popularityBadge = getPopularityBadge(product.popularity);
        
        let stockBadge = '';
        if (isOutOfStock) {
            stockBadge = '<span class="stock-badge out-of-stock">Out of Stock</span>';
        } else if (availability.status === 'low-stock') {
            stockBadge = '<span class="stock-badge low-stock">Low Stock</span>';
        }
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${popularityBadge}
                ${stockBadge}
            </div>
            <div class="product-title">${product.name}</div>
            <div class="product-price">${formatCurrency(product.price)} / serving</div>
            <div class="product-description">${product.description}</div>
            <div class="product-details">
                <div class="prep-time">
                    <i class="fas fa-clock"></i>
                    <span>${product.prepTime}</span>
                </div>
                <div class="variants">
                    <i class="fas fa-list"></i>
                    <span>${product.variants.length} variants</span>
                </div>
                ${!isOutOfStock ? `<div class="stock-info">
                    <i class="fas fa-boxes"></i>
                    <span>Stock: ${availability.stock}</span>
                </div>` : ''}
            </div>
            <div class="product-actions">
                <div class="quantity-controls">
                    <button class="qty-btn decrease-qty" data-product-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>-</button>
                    <span class="qty-display" id="qty-${product.id}">0</span>
                    <button class="qty-btn increase-qty" data-product-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>+</button>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to cart'}
                </button>
            </div>
        `;
        
        if (isOutOfStock) {
            card.classList.add('out-of-stock');
        }
        
        return card;
    }

    function getPopularityBadge(popularity) {
        const badges = {
            'hot': '<span class="popularity-badge hot">🔥 Hot</span>',
            'new': '<span class="popularity-badge new">✨ New</span>',
            'popular': '<span class="popularity-badge popular">⭐ Popular</span>',
            'healthy': '<span class="popularity-badge healthy">🥗 Healthy</span>',
            'comfort': '<span class="popularity-badge comfort">🏠 Comfort</span>',
            'classic': '<span class="popularity-badge classic">👑 Classic</span>',
            'premium': '<span class="popularity-badge premium">💎 Premium</span>',
            'luxury': '<span class="popularity-badge luxury">👑 Luxury</span>',
            'special': '<span class="popularity-badge special">🎯 Special</span>',
            'fresh': '<span class="popularity-badge fresh">🐟 Fresh</span>',
            'spicy': '<span class="popularity-badge spicy">🌶️ Spicy</span>',
            'tropical': '<span class="popularity-badge tropical">🌴 Tropical</span>',
            'staple': '<span class="popularity-badge staple">🍚 Staple</span>',
            'fresh': '<span class="popularity-badge fresh">🍊 Fresh</span>',
            'caffeinated': '<span class="popularity-badge caffeinated">☕ Caffeinated</span>',
            'refreshing': '<span class="popularity-badge refreshing">💧 Refreshing</span>',
            'indulgent': '<span class="popularity-badge indulgent">🍰 Indulgent</span>',
            'sweet': '<span class="popularity-badge sweet">🍨 Sweet</span>',
            'traditional': '<span class="popularity-badge traditional">🥭 Traditional</span>'
        };
        return badges[popularity] || '';
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (currentOrder.items.has(productId)) {
            currentOrder.items.get(productId).quantity++;
        } else {
            currentOrder.items.set(productId, {
                product: product,
                quantity: 1,
                variant: product.variants[0] || 'Regular',
                addition: product.additions[0] || 'None'
            });
        }

        updateQuantityDisplay(productId);
        renderOrderItems();
        updatePaymentSummary();
    }

    function increaseQuantity(productId) {
        if (currentOrder.items.has(productId)) {
            currentOrder.items.get(productId).quantity++;
            updateQuantityDisplay(productId);
            renderOrderItems();
            updatePaymentSummary();
        }
    }

    function decreaseQuantity(productId) {
        if (currentOrder.items.has(productId)) {
            const item = currentOrder.items.get(productId);
            if (item.quantity > 1) {
                item.quantity--;
                updateQuantityDisplay(productId);
                renderOrderItems();
                updatePaymentSummary();
            } else {
                currentOrder.items.delete(productId);
                updateQuantityDisplay(productId);
                renderOrderItems();
                updatePaymentSummary();
            }
        }
    }

    function updateQuantityDisplay(productId) {
        const qtyDisplay = document.getElementById(`qty-${productId}`);
        if (qtyDisplay) {
            const quantity = currentOrder.items.has(productId) ? currentOrder.items.get(productId).quantity : 0;
            qtyDisplay.textContent = quantity;
        }
    }

    function removeFromCart(productId) {
        currentOrder.items.delete(productId);
        updateQuantityDisplay(productId);
        renderOrderItems();
        updatePaymentSummary();
    }

    function updateVariant(productId, variant) {
        if (currentOrder.items.has(productId)) {
            currentOrder.items.get(productId).variant = variant;
            renderOrderItems();
        }
    }

    function updateAddition(productId, addition) {
        if (currentOrder.items.has(productId)) {
            currentOrder.items.get(productId).addition = addition;
            renderOrderItems();
        }
    }

    function clearCart() {
        currentOrder.items.clear();
        products.forEach(product => {
            // This function is not defined in the provided code, assuming it exists
            updateQuantityDisplay(product.id);
        });
        renderOrderItems();
        updatePaymentSummary();
    }

    function renderOrderItems() {
        orderItemsContainer.innerHTML = '';

        if (currentOrder.items.size === 0) {
            orderItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No items in cart</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Add items from the menu to get started</p>
                </div>
            `;
            return;
        }

        for (const [productId, item] of currentOrder.items) {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
                </div>
                <div class="order-item-details">
                    <div class="order-item-title">${item.product.name}</div>
                    <div class="order-item-variant">
                        <span class="variant-label">Variant:</span>
                        <select class="variant-select" data-product-id="${productId}">
                            ${item.product.variants.map(v => 
                                `<option value="${v}" ${v === item.variant ? 'selected' : ''}>${v}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="order-item-addition">
                        <span class="addition-label">Addition:</span>
                        <select class="addition-select" data-product-id="${productId}">
                            ${item.product.additions.map(a => 
                                `<option value="${a}" ${a === item.addition ? 'selected' : ''}>${a}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="order-item-price">${formatCurrency(item.product.price * item.quantity)}</div>
                </div>
                <div class="order-item-controls">
                    <button class="qty-btn decrease-qty" data-product-id="${productId}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn increase-qty" data-product-id="${productId}">+</button>
                    <button class="qty-btn remove-btn" data-product-id="${productId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
        }
    }

    function updatePaymentSummary() {
        let subtotal = 0;
        
        for (const [productId, item] of currentOrder.items) {
            subtotal += item.product.price * item.quantity;
        }

        const discountAmount = subtotal * currentOrder.discount;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * currentOrder.taxRate;
        const total = taxableAmount + taxAmount;

        subtotalEl.textContent = formatCurrency(subtotal);
        discountEl.textContent = `-${formatCurrency(discountAmount)}`;
        taxEl.textContent = formatCurrency(taxAmount);
        totalEl.textContent = formatCurrency(total);
    }
    
    function processPayment() {
        if (currentOrder.items.size === 0) {
            alert('Cannot process payment for an empty order.');
            return;
        }

        if (!currentOrder.customerName.trim()) {
            alert('Please enter customer name.');
            return;
        }

        if (currentOrder.orderType === 'dine-in' && !currentOrder.table) {
            alert('Please select a table for dine-in orders.');
            return;
        }

        for (const [productId, item] of currentOrder.items) {
            const availability = checkProductAvailability(productId);
            if (!availability.available) {
                alert(`${item.product.name} is out of stock. Please remove it from the order.`);
                return;
            }
            if (availability.stock < item.quantity) {
                alert(`Insufficient stock for ${item.product.name}. Available: ${availability.stock}, Required: ${item.quantity}`);
                return;
            }
        }

        const subtotal = Array.from(currentOrder.items.values()).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const discountAmount = subtotal * currentOrder.discount;
        const taxAmount = (subtotal - discountAmount) * currentOrder.taxRate;
        const totalAmount = subtotal - discountAmount + taxAmount;
        const order = {
            id: generateOrderId(),
            customer: currentOrder.customerName,
            table: currentOrder.table,
            orderType: currentOrder.orderType,
            items: Array.from(currentOrder.items.values()), // This is already an array of objects
            timestamp: new Date().toISOString(), // Use ISO string for consistency
            status: 'pending',
            paymentMethod: currentOrder.paymentMethod,
            subtotal: subtotal,
            discount: discountAmount,
            tax: taxAmount,
            total: totalAmount
        };

        for (const [productId, item] of currentOrder.items) {
            updateProductStock(productId, item.quantity);
        }

        allOrders.push(order);
        localStorage.setItem('allOrders', JSON.stringify(allOrders));

        orderQueue.unshift(order);
        localStorage.setItem('posOrderQueue', JSON.stringify(orderQueue));

        renderOrderQueue();

        showReceipt(order);
        
        // Clear current order
        clearCart();
        customerNameInput.value = '';
        tableSelect.value = '';
        promoCodeInput.value = '';
        currentOrder.customerName = '';
        currentOrder.table = '';
        currentOrder.promoCode = '';
        currentOrder.discount = 0;
        if (discountRateInput) discountRateInput.value = 0;
        updatePaymentSummary();
        currentOrder.paymentMethod = 'cash';

        paymentMethodTabs.forEach(t => t.classList.remove('active'));
        const cashTab = document.querySelector('.payment-method-tab[data-method="cash"]'); 
        if (cashTab) cashTab.classList.add('active');
        
        const activeCategory = document.querySelector('.category-tab.active').dataset.category;
        renderProducts(activeCategory, searchInput.value);
    }

    const orderStatuses = ['pending', 'cooking', 'ready', 'completed', 'canceled'];
    let currentOrderQueueFilter = 'all'; function renderOrderQueue() {
        if (!orderQueueCards) return;

        orderQueueCards.innerHTML = '';

        if (orderQueue.length === 0) {
            orderQueueCards.innerHTML = '<p style="color: var(--text-muted);">No pending orders.</p>';
            return;
        }

        let filteredQueue = orderQueue;
        if (currentOrderQueueFilter !== 'all') {
            filteredQueue = orderQueue.filter(order => order.status === currentOrderQueueFilter && order.status !== 'completed');
        }

        filteredQueue.forEach(order => {
            const card = document.createElement('div');
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const statusOptions = orderStatuses.map(s => 
                `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
            ).join('');
            
            let orderTypeInfo = '';
            if (order.orderType === 'dine-in') {
                orderTypeInfo = `<span><i class="fas fa-utensils"></i> ${order.table}</span>`;
            } else {
                orderTypeInfo = `<span><i class="fas fa-shopping-cart"></i> ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</span>`;
            }

            let closeButtonHtml = '';
            if (order.status === 'canceled' || order.status === 'completed') {
                closeButtonHtml = `<button class="close-order-btn" data-order-id="${order.id}" title="Close Order"><i class="fas fa-times"></i></button>`;
            }

            let completeButtonHtml = '';
            if (order.status === 'ready') {
                completeButtonHtml = `<button class="complete-order-btn" data-order-id="${order.id}" title="Complete Order">
                    <i class="fas fa-check-circle"></i> Complete Order
                </button>`;
            }
            card.className = `order-card ${order.status}`;
            card.innerHTML = `
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-status ${order.status}">${statusText}</span>
                    ${closeButtonHtml}
                </div>
                <div class="order-details">
                    <p class="customer-name">${order.customer}</p>
                    <p class="order-time">${order.timestamp}</p>
                    <div class="order-info">
                        <span><i class="fas fa-shopping-bag"></i> ${totalItems} Items</span>
                        ${orderTypeInfo}
                    </div>
                    <div class="order-total">
                        <span>Total: ${formatCurrency(order.total)}</span>
                    </div>
                    <div class="order-actions">
                        <label>Status:</label>
                        <select class="status-select" data-order-id="${order.id}">
                            ${statusOptions}
                        </select>
                        ${completeButtonHtml}
                    </div>
                </div>
            `;
            orderQueueCards.appendChild(card);
        });
    }

    function changeOrderStatus(orderId, newStatus) {
        const order = orderQueue.find(o => o.id === orderId);
        const allOrdersIndex = allOrders.findIndex(o => o.id === orderId);

        if (order) {
            order.status = newStatus;
            renderOrderQueue();
            localStorage.setItem('posOrderQueue', JSON.stringify(orderQueue));
            if (allOrdersIndex > -1) {
                allOrders[allOrdersIndex].status = newStatus;
                localStorage.setItem('allOrders', JSON.stringify(allOrders));
                
                // Update dashboard if an order is completed
                const dashboardTab = document.querySelector('.main-tab-btn[data-tab="dashboard"]');
                if (dashboardTab && dashboardTab.classList.contains('active')) updateDashboard();

                // Re-render history if it's the active tab
                const historyTab = document.querySelector('.main-tab-btn[data-tab="history"]');
                if (historyTab && historyTab.classList.contains('active')) {
                    renderOrderHistory();
                }
            }
        }
    }

    // SAVE TO DATABASE upon completion
    async function saveSaleToDatabase(order) {
        const payload = {
            transaction_id: order.id,
            customerName: order.customer,
            tableLocation: order.orderType === 'dine-in' && order.table ? order.table : (order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)),
            items: order.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                total: item.product.price * item.quantity
            }))
        };

        try {
            const response = await fetch('save_food_sale.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!result.success) console.error('Failed to save sale to DB:', result.error);
        } catch (error) { console.error('Error saving sale to DB:', error); }
    }

    function completeOrder(orderId) {
        const order = orderQueue.find(o => o.id === orderId);
        const allOrdersIndex = allOrders.findIndex(o => o.id === orderId);

        if (order) {
            order.status = 'completed';
            saveSaleToDatabase(order);

            if (allOrdersIndex > -1) {
                allOrders[allOrdersIndex].status = 'completed';
                localStorage.setItem('allOrders', JSON.stringify(allOrders));
            }
            renderOrderQueue();
            localStorage.setItem('posOrderQueue', JSON.stringify(orderQueue));

            // Automatically remove from queue after 5 seconds
            setTimeout(() => {
                closeCanceledOrder(orderId);
            }, 5000);
        }
    }

    function closeCanceledOrder(orderId) {
        const orderIndex = orderQueue.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
            orderQueue.splice(orderIndex, 1);
            renderOrderQueue();
            localStorage.setItem('posOrderQueue', JSON.stringify(orderQueue));
        }
    }

    function showReceipt(order) {
        const receiptBody = document.getElementById('receipt-body');
        
        const itemsHtml = order.items.map(item => `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.product.price)}</td>
                <td style="text-align: right;">${formatCurrency(item.product.price * item.quantity)}</td>
            </tr>
        `).join('');

        receiptBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <h2 style="margin: 0;">${config.restaurantName}</h2>
                <p style="margin: 0;">Point of Sale</p>
            </div>
            <hr style="border: 1px dashed var(--text-muted); margin: 1rem 0;">
            <p>Order ID: ${order.id}</p>
            <p>Date: ${order.timestamp}</p>
            <p>Customer: ${order.customer}</p>
            <p>Order Type: ${order.orderType}</p>
            ${order.table ? `<p>Table: ${order.table}</p>` : ''}
            <hr style="border: 1px dashed var(--text-muted); margin: 1rem 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr>
                        <th style="text-align: left;">Item</th>
                        <th style="text-align: left;">Qty</th>
                        <th style="text-align: left;">Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            <hr style="border: 1px dashed var(--text-muted); margin: 1rem 0;">
            <div style="text-align: right;">
                <p>Subtotal: ${formatCurrency(order.subtotal)}</p>
                <p>Discount: ${formatCurrency(order.discount)}</p>
                <p>Tax: ${formatCurrency(order.tax)}</p>
                <h3 style="margin-top: 0.5rem;">Total: ${formatCurrency(order.total)}</h3>
            </div>
            <hr style="border: 1px dashed var(--text-muted); margin: 1rem 0;">
            <p>Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
            <div style="text-align: center; margin-top: 2rem;">
                <p>Thank you for your order!</p>
            </div>
        `;

        receiptModal.classList.add('active');
    }

    function openSalesReportModal() {
        if (salesReportModal) {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30); // Default to last 30 days
            document.getElementById('report-start-date').valueAsDate = startDate;
            document.getElementById('report-end-date').valueAsDate = endDate;

            salesReportModal.classList.add('active');
            generateSalesReport();
        }
    }

    function closeSalesReportModal() {
        if (salesReportModal) {
            salesReportModal.classList.remove('active');
        }
    }

    function generateSalesReport() {
        const startDate = new Date(document.getElementById('report-start-date').value);
        const endDate = new Date(document.getElementById('report-end-date').value);
        endDate.setHours(23, 59, 59, 999); // Include the whole end day

        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate >= startDate && orderDate <= endDate;
        });

        const reportContentEl = document.getElementById('sales-report-content');
        if (filteredOrders.length === 0) {
            reportContentEl.innerHTML = '<p>No sales data for the selected period.</p>';
            return;
        }

        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const totalItemsSold = filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const avgOrderValue = totalRevenue / totalOrders;

        const topSellingItems = {};
        const paymentMethodCounts = {};
        filteredOrders.forEach(order => {
            paymentMethodCounts[order.paymentMethod] = (paymentMethodCounts[order.paymentMethod] || 0) + 1;
            order.items.forEach(item => {
                topSellingItems[item.product.name] = (topSellingItems[item.product.name] || 0) + item.quantity;
            });
        });

        const sortedTopItems = Object.entries(topSellingItems).sort((a, b) => b[1] - a[1]).slice(0, 5);

        reportContentEl.innerHTML = `
            <div class="report-section">
                <h4>Sales Summary</h4>
                <div class="report-stats-grid">
                    <div class="report-stat-item"><p>Total Revenue</p><strong>${formatCurrency(totalRevenue)}</strong></div>
                    <div class="report-stat-item"><p>Total Orders</p><strong>${totalOrders}</strong></div>
                    <div class="report-stat-item"><p>Items Sold</p><strong>${totalItemsSold}</strong></div>
                    <div class="report-stat-item"><p>Avg. Order Value</p><strong>${formatCurrency(avgOrderValue)}</strong></div>
                </div>
            </div>
            <div class="report-section">
                <h4>Top 5 Selling Products</h4>
                <div class="report-list">
                    ${sortedTopItems.map(([name, qty]) => `<p><strong>${name}:</strong> ${qty} sold</p>`).join('')}
                </div>
            </div>
            <div class="report-section">
                <h4>Payment Methods</h4>
                <div class="report-list">
                    ${Object.entries(paymentMethodCounts).map(([method, count]) => 
                        `<p><strong>${method.charAt(0).toUpperCase() + method.slice(1)}:</strong> ${count} orders</p>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });


    function applyPromoCode() {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            alert('Please enter a promo code.');
            return;
        }

        const validPromoCodes = JSON.parse(localStorage.getItem('posPromoCodes')) || [];
        const foundCode = validPromoCodes.find(p => p.code === promoCode);

        if (foundCode) {
            currentOrder.discount = foundCode.discount;
            currentOrder.promoCode = promoCode;
            discountRateInput.value = foundCode.discount * 100;
            updatePaymentSummary();
            alert(`Promo code ${promoCode} applied! ${Math.round(foundCode.discount * 100)}% discount.`);
        } else {
            alert('Invalid promo code.');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const activeCategory = document.querySelector('.category-tab.active').dataset.category;
            renderProducts(activeCategory, searchTerm);
        });
    }

    productGrid.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.dataset.productId || target.closest('[data-product-id]')?.dataset.productId;

        if (!productId) return;

        if (target.matches('.add-to-cart-btn') || target.closest('.add-to-cart-btn')) {
            addToCart(productId);
        } else if (target.matches('.increase-qty') || target.closest('.increase-qty')) {
            increaseQuantity(productId);
        } else if (target.matches('.decrease-qty') || target.closest('.decrease-qty')) {
            decreaseQuantity(productId);
        }
    });

    orderItemsContainer.addEventListener('change', (e) => {
        const target = e.target;
        const productId = target.dataset.productId;

        if (target.matches('.variant-select')) {
            updateVariant(productId, target.value);
        } else if (target.matches('.addition-select')) {
            updateAddition(productId, target.value);
        }
    });

    orderItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.dataset.productId || target.closest('[data-product-id]')?.dataset.productId;

        if (!productId) return;

        if (target.matches('.increase-qty') || target.closest('.increase-qty')) {
            increaseQuantity(productId);
        } else if (target.matches('.decrease-qty') || target.closest('.decrease-qty')) {
            decreaseQuantity(productId);
        } else if (target.matches('.remove-btn') || target.closest('.remove-btn')) {
            removeFromCart(productId);
        }
    });

    orderQueueCards.addEventListener('change', (e) => {
        if (e.target.matches('.status-select')) {
            changeOrderStatus(e.target.dataset.orderId, e.target.value);
        }
    });

    orderQueueCards.addEventListener('click', (e) => {
        if (e.target.matches('.close-order-btn') || e.target.closest('.close-order-btn')) {
            closeCanceledOrder(e.target.dataset.orderId || e.target.closest('[data-order-id]').dataset.orderId);
        }
        if (e.target.matches('.complete-order-btn') || e.target.closest('.complete-order-btn')) {
            completeOrder(e.target.dataset.orderId || e.target.closest('[data-order-id]').dataset.orderId);
        }
    });

    orderTypeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            orderTypeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentOrder.orderType = tab.dataset.type;
        });
    });

    paymentMethodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            paymentMethodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentOrder.paymentMethod = tab.dataset.method;
            console.log('Payment method selected:', currentOrder.paymentMethod);
        });
    });

    customerNameInput.addEventListener('input', (e) => {
        currentOrder.customerName = e.target.value;
    });

    tableSelect.addEventListener('change', (e) => {
        currentOrder.table = e.target.value;
    });

    clearAllBtn.addEventListener('click', clearCart);
    if (proceedPaymentBtn) proceedPaymentBtn.addEventListener('click', processPayment);
    applyBtn.addEventListener('click', applyPromoCode);

    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener('click', () => receiptModal.classList.remove('active'));
    }
    if (printReceiptBtn) {
        printReceiptBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (salesReportLinks) {
        salesReportLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openSalesReportModal();
            });
        });
    } 
    if (closeSalesReportBtn) {
        closeSalesReportBtn.addEventListener('click', closeSalesReportModal);
    }
    if (generateSalesReportBtn) {
        generateSalesReportBtn.addEventListener('click', generateSalesReport);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    const mainTabs = document.querySelectorAll('.main-tab-btn');
    const mainTabContents = document.querySelectorAll('.main-tab-content');

    if (mainTabs.length > 0) {
        mainTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                mainTabs.forEach(t => t.classList.remove('active'));
                mainTabContents.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                const contentId = `${tab.dataset.tab}-tab-content`;
                
                // If history tab is clicked, render the history
                if (tab.dataset.tab === 'history') {
                    renderOrderHistory();
                }
                // If dashboard tab is clicked, update the dashboard
                if (tab.dataset.tab === 'dashboard') {
                    updateDashboard();
                }

                document.getElementById(contentId).classList.add('active');
            });
        });
    }

    const orderQueueNav = document.getElementById('order-queue-nav');
    if (orderQueueNav) {
        orderQueueNav.addEventListener('click', (e) => {
            if (e.target.matches('.queue-nav-btn')) {
                orderQueueNav.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                currentOrderQueueFilter = e.target.dataset.status;
                renderOrderQueue();
            }
        });
    }

    function renderOrderHistory(searchTerm = '') {
        if (!orderHistoryTableBody) return;

        let filteredOrders = allOrders;

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filteredOrders = allOrders.filter(order => 
                order.id.toLowerCase().includes(lowerCaseSearch) ||
                order.customer.toLowerCase().includes(lowerCaseSearch)
            );
        }

        if (filteredOrders.length === 0) {
            orderHistoryTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No completed orders found.</td></tr>`;
            return;
        }

        orderHistoryTableBody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${new Date(order.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>${formatCurrency(order.total)}</td>
                <td><span class="order-status ${order.status}">${order.status}</span></td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                        <button class="btn-sm" onclick="viewOrderDetails('${order.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.viewOrderDetails = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) {
            alert('Order not found!');
            return;
        }

        const modalBody = document.getElementById('order-details-body');
        const itemsHtml = order.items.map(item => `
            <div class="order-item" style="margin-bottom: 1rem;">
                <div class="order-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
                </div>
                <div class="order-item-details">
                    <div class="order-item-title">${item.product.name}</div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">
                        Variant: ${item.variant} | Addition: ${item.addition}
                    </p>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">
                        ${item.quantity} x ${formatCurrency(item.product.price)}
                    </p>
                </div>
                <div style="margin-left: auto; text-align: right;">
                    <div class="order-item-price">${formatCurrency(item.product.price * item.quantity)}</div>
                </div>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="report-section" id="printable-order-details">
                <h4>Order Summary</h4>
                <div class="report-stats-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 1.5rem;">
                    <div class="report-stat-item"><p>Order ID</p><strong>${order.id}</strong></div>
                    <div class="report-stat-item"><p>Customer</p><strong>${order.customer}</strong></div>
                    <div class="report-stat-item"><p>Date</p><strong>${new Date(order.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</strong></div>
                    <div class="report-stat-item"><p>Status</p><strong><span class="order-status ${order.status}">${order.status}</span></strong></div>
                </div>

                <h4>Items Ordered</h4>
                <div class="order-items" style="max-height: none; margin-bottom: 1.5rem;">
                    ${itemsHtml}
                </div>

                <h4>Payment Details</h4>
                <div style="text-align: right; font-size: 0.9rem;">
                    <p>Subtotal: <strong>${formatCurrency(order.subtotal)}</strong></p>
                    <p>Discount: <strong>-${formatCurrency(order.discount)}</strong></p>
                    <p>Tax: <strong>${formatCurrency(order.tax)}</strong></p>
                    <h3 style="margin-top: 0.5rem;">Total: <strong>${formatCurrency(order.total)}</strong></h3>
                    <p style="margin-top: 1rem;">Payment Method: <strong>${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</strong></p>
                </div>
            </div>
        `;

        const modal = document.getElementById('order-details-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    const historySearchInput = document.getElementById('history-search');
    if (historySearchInput) {
        historySearchInput.addEventListener('input', (e) => {
            renderOrderHistory(e.target.value);
        });
    }

    // Add print styles for the new modal
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
        @media print {
            body > *:not(#order-details-modal) { visibility: hidden; }
            #order-details-modal, #order-details-modal * { visibility: visible; }
            #order-details-modal { position: absolute; left: 0; top: 0; width: 100%; }
            #order-details-modal .modal-header, #order-details-modal .modal-actions { display: none; }
            #order-details-modal .modal-content { box-shadow: none; border: none; }
        }
    `;
    document.head.appendChild(printStyle);

    // Centralized Modal Closing Logic
    function closeModal(modalElement) {
        if (modalElement) modalElement.classList.remove('active');
    }

    if (closeOrderDetailsBtn) {
        closeOrderDetailsBtn.addEventListener('click', () => closeModal(orderDetailsModal));
    }
    if (closeOrderDetailsSecondaryBtn) {
        closeOrderDetailsSecondaryBtn.addEventListener('click', () => closeModal(orderDetailsModal));
    }
    if (printOrderDetailsBtn) {
        printOrderDetailsBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // =================================================================
    // DASHBOARD FUNCTIONS
    // =================================================================
    function updateDashboard() {
        if (!dashboardTotalRevenueEl) return; // Exit if dashboard elements don't exist

        const today = new Date().toLocaleDateString();
        const todaysOrders = allOrders.filter(order => new Date(order.timestamp).toLocaleDateString() === today);

        // 1. Sales Summary
        const totalRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = todaysOrders.length;

        dashboardTotalRevenueEl.textContent = formatCurrency(totalRevenue);
        dashboardTotalOrdersEl.textContent = totalOrders;

        // 2. Inventory Alerts
        const inventory = getInventoryData();
        const lowStockCount = inventory.filter(item => item.status === 'low-stock').length;
        const outOfStockCount = inventory.filter(item => item.status === 'out-of-stock').length;

        dashboardLowStockEl.textContent = lowStockCount;
        dashboardOutOfStockEl.textContent = outOfStockCount;

        // 3. Top Selling Items
        const itemSales = {};
        todaysOrders.forEach(order => {
            order.items.forEach(item => {
                const itemName = item.product.name;
                itemSales[itemName] = (itemSales[itemName] || 0) + item.quantity;
            });
        });

        const sortedTopItems = Object.entries(itemSales)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, 5);

        if (sortedTopItems.length > 0) {
            dashboardTopItemsEl.innerHTML = sortedTopItems.map(([name, qty]) => `
                <div class="list-item">
                    <span>${name}</span>
                    <strong>${qty} sold</strong>
                </div>
            `).join('');
        } else {
            dashboardTopItemsEl.innerHTML = '<div class="empty-state"><p>No sales data for today yet.</p></div>';
        }

        // 4. Recent Activity Feed
        const recentActivities = [];
        const recentOrders = allOrders.slice(-5);
        const helpRequests = JSON.parse(localStorage.getItem('posHelpRequests')) || [];
        const recentHelpRequests = helpRequests.slice(-5);

        recentOrders.forEach(order => {
            recentActivities.push({
                type: 'order',
                timestamp: new Date(order.timestamp),
                text: `New order #${order.id.slice(-4)} from ${order.customer}`
            });
        });

        recentHelpRequests.forEach(request => {
            recentActivities.push({
                type: 'help',
                timestamp: new Date(request.timestamp),
                text: `Help request from Room ${request.location}`
            });
        });

        recentActivities.sort((a, b) => b.timestamp - a.timestamp);

        if (recentActivities.length > 0) {
            dashboardActivityFeedEl.innerHTML = recentActivities.slice(0, 5).map(activity => {
                const icon = activity.type === 'order' ? 'fa-receipt' : 'fa-headset';
                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="activity-content">
                            <p>${activity.text}</p>
                            <span class="activity-time">${getTimeAgo(activity.timestamp)}</span>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            dashboardActivityFeedEl.innerHTML = '<div class="empty-state"><p>No recent activities.</p></div>';
        }
    }

    function getTimeAgo(timestamp) {
        const diffInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }

    function init() {
        // If no products in localStorage, save the initial hardcoded list
        if (!localStorage.getItem('posProducts')) {
            localStorage.setItem('posProducts', JSON.stringify(initialProducts));
        }
        // Re-assign products from localStorage in case it was updated
        products = JSON.parse(localStorage.getItem('posProducts')) || initialProducts;
        renderCategoryTabs();
        renderTableOptions();

        // Apply general settings
        const restaurantNameElements = document.querySelectorAll('.sidebar .logo h1');
        restaurantNameElements.forEach(el => el.textContent = config.restaurantName);
        if (taxRateInput) {
            taxRateInput.value = (config.taxRate * 100).toFixed(1);
        }

        // Render products for the initially active category
        renderProducts(document.querySelector('#category-tabs-container .category-tab.active')?.dataset.category);
        renderOrderItems();
        renderOrderQueue();
        updatePaymentSummary();
        
        const dineInTab = document.querySelector('.order-type-tab[data-type="dine-in"]');
        if (dineInTab) {
            dineInTab.classList.add('active');
        }
        
        const cashPaymentTab = document.querySelector('.payment-method-tab[data-method="cash"]');
        if (cashPaymentTab) {
            cashPaymentTab.classList.add('active');
        }

        initializeDarkMode();
        initializeSidebar();
        closeSidebarOnBackdrop();
        updateDashboard(); // Initial call to populate dashboard
    }

    // Listen for new orders from the customer UI
    window.addEventListener('storage', (e) => {
        if (e.key === 'posOrderQueue') {
            const newQueue = JSON.parse(e.newValue) || [];
            const existingIds = new Set(orderQueue.map(o => o.id));
            const newOrders = newQueue.filter(o => !existingIds.has(o.id));
            
            if (newOrders.length > 0) {
                orderQueue.unshift(...newOrders);
                renderOrderQueue();
                // Also update allOrders if a new order is added
                const allOrderIds = new Set(allOrders.map(o => o.id));
                const newAllOrders = newQueue.filter(o => !allOrderIds.has(o.id));
                allOrders.push(...newAllOrders);
                localStorage.setItem('allOrders', JSON.stringify(allOrders));

                // Re-render history if it's the active tab
                const historyTab = document.querySelector('.main-tab-btn[data-tab="history"]');
                if (historyTab && historyTab.classList.contains('active')) renderOrderHistory();
                // Optional: Add a notification sound or visual cue
                updateDashboard(); // Update dashboard on new order
            }
        }
        if (e.key === 'posHelpRequests') {
            const newRequests = JSON.parse(e.newValue) || [];
            const oldRequests = JSON.parse(e.oldValue) || [];
            // Check if a new request was added
            if (newRequests.length > oldRequests.length) {
                const latestRequest = newRequests[0]; // The newest request is at the start of the array
                showHelpNotification(latestRequest);
                updateDashboard(); // Update dashboard on new help request
            }
        }
        // Add this block to listen for product changes
        if (e.key === 'posProducts') {
            // Reload products from localStorage
            products = JSON.parse(e.newValue) || [];
            // Re-render the product grid on the POS page
            const activeCategoryTab = document.querySelector('.category-tab.active');
            if (activeCategoryTab && searchInput) {
                renderProducts(activeCategoryTab.dataset.category, searchInput.value);
            }
        }
        if (e.key === 'posCategories') {
            renderCategoryTabs();
            renderProducts(document.querySelector('#category-tabs-container .category-tab.active')?.dataset.category);
        }
        // Add this block to listen for config changes
        if (e.key === 'posConfig') {
            config = JSON.parse(e.newValue) || { restaurantName: 'Solara Hotel', taxRate: 0.026 };
            // Update UI
            const restaurantNameElements = document.querySelectorAll('.sidebar .logo h1');
            restaurantNameElements.forEach(el => el.textContent = config.restaurantName);
            currentOrder.taxRate = config.taxRate;
            if (taxRateInput) {
                taxRateInput.value = (config.taxRate * 100).toFixed(1);
            }
            updatePaymentSummary();
        }
        // Add this block to listen for table changes
        if (e.key === 'posTables') {
            tables = JSON.parse(e.newValue) || [];
            renderTableOptions();
        }
    });

    function showHelpNotification(request) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <div class="icon"><i class="fas fa-headset"></i></div>
            <div class="content">
                <h4>Assistance Requested</h4>
                <p>
                    <strong>${request.customer}</strong> needs help
                    ${request.location !== 'N/A' ? `at <strong>Room ${request.location}</strong>` : ''}.
                </p>
            </div>
        `;

        container.appendChild(notification);

        // Automatically remove the notification after some time
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s, transform 0.5s';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(50px)';
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, 8000); // 8 seconds
    }

    init();
});
