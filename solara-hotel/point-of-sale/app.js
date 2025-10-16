document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const cookingQueueEl = document.getElementById('cooking-queue');
    const readyQueueEl = document.getElementById('ready-queue');
    const deliveringQueueEl = document.getElementById('delivering-queue');
    const findOrdersBtn = document.getElementById('find-orders-btn');
    const customerNameSearch = document.getElementById('customer-name-search');
    const myOrdersList = document.getElementById('my-orders-list');
    const productGrid = document.getElementById('product-grid');
    const menuCategoryTabs = document.getElementById('menu-category-tabs');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const orderItemsContainer = document.getElementById('order-items');
    const totalEl = document.getElementById('total');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const customerNameInput = document.getElementById('customer-name');
    const tableNumberInput = document.getElementById('table-number');
    const cartItemCount = document.getElementById('cart-item-count');

    // Modals
    const itemModal = document.getElementById('item-modal');
    const successModal = document.getElementById('success-modal');
    const receiptModal = document.getElementById('receipt-modal');

    // State
    let cart = new Map();
    let currentCustomizingItem = null;
    let lastPlacedOrder = null;
    const TAX_RATE = 0.026;

    // --- Utility ---
    const generateOrderId = () => 'CUST-' + Math.random().toString(36).substr(2, 7).toUpperCase();
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };
    const formatCurrency = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(amount);

    // --- Tab Navigation ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active'); 
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });

    // --- Live Queue Logic ---
    function renderLiveQueue() {
        const orderQueue = JSON.parse(localStorage.getItem('posOrderQueue')) || [];
        
        cookingQueueEl.innerHTML = '';
        readyQueueEl.innerHTML = '';
        deliveringQueueEl.innerHTML = '';

        const cookingOrders = orderQueue.filter(o => o.status === 'cooking' || o.status === 'pending');
        const readyOrders = orderQueue.filter(o => o.status === 'ready');
        const deliveringOrders = orderQueue.filter(o => o.status === 'delivering');

        const renderQueueCard = (queueEl, order, extraClass = '') => {
            const orderIdPart = order.id.slice(-4);
            const card = document.createElement('div');
            card.className = `queue-card ${extraClass}`;
            card.textContent = orderIdPart;
            queueEl.appendChild(card);
        };

        cookingOrders.forEach(order => renderQueueCard(cookingQueueEl, order));
        deliveringOrders.forEach(order => renderQueueCard(deliveringQueueEl, order, 'delivering-card'));
        readyOrders.forEach(order => renderQueueCard(readyQueueEl, order, 'ready-card'));
    }

    // --- My Orders Logic ---
    function findMyOrders() {
        const customerName = customerNameSearch.value.trim().toLowerCase();
        if (!customerName) {
            myOrdersList.innerHTML = '<div class="empty-state"><p>Please enter your name.</p></div>';
            return;
        }

        const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
        const myOrders = allOrders.filter(order => order.customer.toLowerCase() === customerName);

        if (myOrders.length === 0) {
            myOrdersList.innerHTML = '<div class="empty-state"><p>No orders found for that name.</p></div>';
            return;
        }

        myOrdersList.innerHTML = myOrders.map(order => `
            <div class="order-details-card">
                <div class="order-details-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="status-badge ${order.status}">${order.status}</span>
                </div>
                <div class="order-item-list">
                    ${order.items.map(item => `<p>${item.quantity}x ${item.product.name}</p>`).join('')}
                </div>
            </div>
        `).join('');
    }

    findOrdersBtn.addEventListener('click', findMyOrders);
    customerNameSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            findMyOrders();
        }
    });

    // --- Menu Logic ---
    function renderMenu() {
        const products = JSON.parse(localStorage.getItem('posProducts')) || [];
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="empty-state"><p>Menu is currently unavailable.</p></div>';
            return;
        }

        const categories = ['all', ...new Set(products.map(p => p.category))];
        menuCategoryTabs.innerHTML = categories.map(cat => `
            <button class="menu-category-tab ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');

        renderProducts(products, 'all');

        menuCategoryTabs.addEventListener('click', (e) => {
            if (e.target.matches('.menu-category-tab')) {
                menuCategoryTabs.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                renderProducts(products, e.target.dataset.category);
            }
        });

        productGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = products.find(p => p.id === card.dataset.productId);
            if (product) {
                const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
                const inventoryItem = inventory.find(i => i.name.toLowerCase() === product.name.toLowerCase());
                if (!inventoryItem || inventoryItem.currentStock > 0) {
                    openItemModal(product);
                }
            }
        });
    }

    function renderProducts(products, category) {
        let filteredProducts = products;
        if (category !== 'all') {
            filteredProducts = products.filter(p => p.category === category);
        }

        productGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card ${
                (() => {
                    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
                    const item = inventory.find(i => i.name.toLowerCase() === product.name.toLowerCase());
                    return item && item.currentStock <= 0 ? 'disabled' : '';
                })()
            }" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
            </div>
        `).join('');
    }

    // --- Cart & Ordering Logic ---
    function renderCart() {
        orderItemsContainer.innerHTML = '';
        if (cart.size === 0) {
            orderItemsContainer.innerHTML = `<div class="empty-cart-message"><i class="fas fa-shopping-basket"></i><p>Your cart is empty</p></div>`;
        } else {
            cart.forEach((item, cartKey) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'order-item';
                itemEl.innerHTML = `
                    <div class="order-item-info">
                        <h4>${item.quantity}x ${item.product.name}</h4>
                        <p>${formatCurrency(item.product.price)}</p>
                    </div>
                    <div class="order-item-controls">
                        <button class="qty-btn decrease-qty" data-key="${cartKey}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase-qty" data-key="${cartKey}">+</button>
                    </div>
                `;
                orderItemsContainer.appendChild(itemEl);
            });
        }
        updateSummary();
    }

    function updateSummary() {
        let subtotal = 0;
        let totalItems = 0;
        cart.forEach(item => {
            subtotal += item.product.price * item.quantity;
            totalItems += item.quantity;
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        subtotalEl.textContent = formatCurrency(subtotal);
        taxEl.textContent = formatCurrency(tax);
        totalEl.textContent = formatCurrency(total);
        cartItemCount.textContent = totalItems;
        cartItemCount.style.display = totalItems > 0 ? 'flex' : 'none';
        placeOrderBtn.disabled = cart.size === 0;
    }

    function openItemModal(product) {
        currentCustomizingItem = { product, quantity: 1, variant: product.variants[0], additions: [], notes: '' };
        document.getElementById('modal-item-name').textContent = product.name;
        document.getElementById('modal-item-image').style.backgroundImage = `url(${product.image})`;
        
        const variantsGroup = document.getElementById('modal-variants-group');
        if (product.variants && product.variants.length > 0) {
            variantsGroup.innerHTML = `<label>Variants</label><div class="options-group">${product.variants.map((v, i) => `<button class="option-btn ${i === 0 ? 'selected' : ''}" data-type="variant" data-value="${v}">${v}</button>`).join('')}</div>`;
        } else {
            variantsGroup.innerHTML = '';
        }

        itemModal.classList.add('active');
    }

    function addToCart(item) {
        const cartKey = `${item.product.id}-${item.variant}-${item.additions.sort().join('-')}-${item.notes}`;
        if (cart.has(cartKey)) {
            cart.get(cartKey).quantity += item.quantity;
        } else {
            cart.set(cartKey, item);
        }
        renderCart();
    }

    function updateCartQuantity(key, change) {
        if (cart.has(key)) {
            const item = cart.get(key);
            item.quantity += change;
            if (item.quantity <= 0) {
                cart.delete(key);
            }
            renderCart();
        }
    }

    function placeOrder() {
        const customerName = customerNameInput.value.trim();
        const orderType = document.querySelector('.order-type-btn.active').dataset.type;
        let locationInfo, locationValue;

        if (orderType === 'dine-in') {
            locationInfo = 'Table Number';
            locationValue = document.getElementById('table-number').value.trim();
        } else {
            locationInfo = 'Address';
            locationValue = document.getElementById('delivery-address').value.trim();
        }

        if (!customerName || !locationValue) {
            alert(`Please enter your name and ${locationInfo}.`);
            return;
        }

        let subtotal = 0;
        const orderItems = Array.from(cart.values()).map(item => {
            subtotal += item.product.price * item.quantity;
            return { ...item, product: { id: item.product.id, name: item.product.name, price: item.product.price, image: item.product.image } };
        });

        const paymentMethod = document.querySelector('.payment-method-tab.active').dataset.method;
        const newOrder = {
            id: generateOrderId(),
            customer: customerName,
            table: orderType === 'dine-in' ? locationValue : '',
            address: orderType === 'delivery' ? locationValue : '',
            orderType: orderType,
            items: orderItems,
            timestamp: new Date().toLocaleString('en-PH'),
            status: paymentMethod === 'cash' ? 'pending' : 'paid', // Assume non-cash is paid
            paymentMethod: paymentMethod,
            subtotal: subtotal,
            discount: 0,
            tax: subtotal * TAX_RATE,
            total: subtotal * (1 + TAX_RATE)
        };

        const orderQueue = JSON.parse(localStorage.getItem('posOrderQueue')) || [];
        orderQueue.unshift(newOrder);
        localStorage.setItem('posOrderQueue', JSON.stringify(orderQueue));

        cart.clear();
        renderCart();
        cartSidebar.classList.remove('active');
        successModal.classList.add('active');
        lastPlacedOrder = newOrder;
    }

    function showReceipt(order) {
        const receiptBody = document.getElementById('receipt-body');
        receiptBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <h2 style="margin: 0;">Solara Hotel</h2>
            </div>
            <hr>
            <p>Order ID: ${order.id}</p>
            <p>Date: ${order.timestamp}</p>
            <p>Customer: ${order.customer}</p>
            ${order.table ? `<p>Table: ${order.table}</p>` : ''}
            ${order.address ? `<p>Address: ${order.address}</p>` : ''}
            <hr>
            <table>
                <thead><tr><th>Item</th><th>Qty</th><th style="text-align:right">Total</th></tr></thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td style="text-align:right">${formatCurrency(item.product.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <hr>
            <div style="text-align: right;">
                <p>Subtotal: ${formatCurrency(order.subtotal)}</p>
                <p>Tax: ${formatCurrency(order.tax)}</p>
                <h3>Total: ${formatCurrency(order.total)}</h3>
            </div>
            <hr>
            <p>Payment: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
            <div style="text-align: center; margin-top: 1rem;"><p>Thank you!</p></div>
        `;
        receiptModal.classList.add('active');
    }

    // --- Event Listeners ---
    cartToggleBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
    placeOrderBtn.addEventListener('click', placeOrder);
    document.querySelectorAll('.payment-method-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.payment-method-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    itemModal.addEventListener('click', (e) => {
        if (e.target.matches('.close-modal-btn') || e.target.closest('.close-modal-btn')) {
            closeModal('item-modal');
        }
        if (e.target.matches('.option-btn')) {
            const type = e.target.dataset.type;
            const value = e.target.dataset.value;
            if (type === 'variant') {
                currentCustomizingItem.variant = value;
                itemModal.querySelectorAll('[data-type="variant"]').forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        }
    });

    document.getElementById('add-to-cart-modal-btn').addEventListener('click', () => {
        currentCustomizingItem.notes = document.getElementById('modal-notes').value.trim();
        addToCart(currentCustomizingItem);
        closeModal('item-modal');
    });

    orderItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.increase-qty')) {
            updateCartQuantity(target.dataset.key, 1);
        } else if (target.matches('.decrease-qty')) {
            updateCartQuantity(target.dataset.key, -1);
        }
    });

    successModal.addEventListener('click', (e) => {
        if (e.target.matches('.close-modal-btn') || e.target.closest('.close-modal-btn')) {
            closeModal('success-modal');
        }
        if (e.target.id === 'view-receipt-btn') {
            if (lastPlacedOrder) showReceipt(lastPlacedOrder);
            closeModal('success-modal');
        }
    });
    receiptModal.addEventListener('click', (e) => {
        if (e.target.matches('.close-modal-btn') || e.target.closest('.close-modal-btn')) closeModal('receipt-modal');
    });

    document.querySelectorAll('.order-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('table-number-group').style.display = btn.dataset.type === 'dine-in' ? 'flex' : 'none';
            document.getElementById('address-group').style.display = btn.dataset.type === 'delivery' ? 'flex' : 'none';
        });
    });

    // --- Initialization and Live Update ---
    function init() {
        renderLiveQueue();
        renderMenu();
        renderCart();

        // Set default tab based on URL hash or default to 'queue'
        const initialTab = window.location.hash.replace('#', '') || 'queue';
        const validTabs = ['queue', 'my-orders', 'menu'];
        const tabToOpen = validTabs.includes(initialTab) ? initialTab : 'queue';

        navButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const activeNavButton = document.querySelector(`.nav-btn[data-tab="${tabToOpen}"]`);
        const activeTabContent = document.getElementById(`${tabToOpen}-tab`);

        if (activeNavButton) activeNavButton.classList.add('active');
        if (activeTabContent) activeTabContent.classList.add('active');
    }

    // Listen for changes from the POS
    window.addEventListener('storage', (e) => {
        if (e.key === 'posOrderQueue' || e.key === 'allOrders') {
            renderLiveQueue();
            // If user has searched, refresh their order list
            if (customerNameSearch.value) {
                findMyOrders();
            }
        }
        if (e.key === 'posProducts') {
            renderMenu();
        }
    });

    init();
});