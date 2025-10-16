document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements & Functions ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const mainContainer = document.querySelector('.main-container');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkMode', isDarkMode);
    }

    function initializeDarkMode() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContainer.classList.toggle('sidebar-collapsed');
        if (window.innerWidth <= 1024) {
            sidebarBackdrop.classList.toggle('active');
        }
    }

    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', toggleSidebar);

    // --- Settings Specific ---
    const restaurantNameInput = document.getElementById('setting-restaurant-name');
    const taxRateInput = document.getElementById('setting-tax-rate');
    const saveGeneralBtn = document.getElementById('save-general-settings');

    const addTableForm = document.getElementById('add-table-form');
    const newTableNameInput = document.getElementById('new-table-name');
    const tableListUl = document.getElementById('table-list');

    const addPromoForm = document.getElementById('add-promo-form');
    const newPromoCodeInput = document.getElementById('new-promo-code');
    const newPromoValueInput = document.getElementById('new-promo-value');
    const promoListUl = document.getElementById('promo-list');

    const clearOrderHistoryBtn = document.getElementById('clear-order-history-btn');
    const clearProductsBtn = document.getElementById('clear-products-btn');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');

    let tables = [];
    let promoCodes = [];

    function loadSettings() {
        // General Settings
        const config = JSON.parse(localStorage.getItem('posConfig')) || {};
        restaurantNameInput.value = config.restaurantName || 'Solara Hotel';
        taxRateInput.value = (config.taxRate || 0.026) * 100;

        // Table Settings
        tables = JSON.parse(localStorage.getItem('posTables')) || [
            '1A', '1B', '1C', '1D', '1E', '2A', '2B', '2C', '2D', '2E', '2F', 'O1', 'O2', 'O3'
        ];
        renderTables();

        // Promo Code Settings
        promoCodes = JSON.parse(localStorage.getItem('posPromoCodes')) || [
            { code: 'SAVE10', discount: 0.10 }, { code: 'WELCOME', discount: 0.15 }
        ];
        renderPromoCodes();
    }

    function saveGeneralSettings() {
        const newName = restaurantNameInput.value.trim();
        const newTaxRate = parseFloat(taxRateInput.value) / 100;

        if (!newName || isNaN(newTaxRate)) {
            alert('Please enter valid values for all fields.');
            return;
        }

        const config = {
            restaurantName: newName,
            taxRate: newTaxRate
        };

        localStorage.setItem('posConfig', JSON.stringify(config));
        alert('General settings saved successfully!');
    }

    function renderTables() {
        tableListUl.innerHTML = '';
        tables.forEach(table => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${table}</span>
                <button class="delete-btn" data-table="${table}"><i class="fas fa-trash"></i></button>
            `;
            tableListUl.appendChild(li);
        });
    }

    function addTable(e) {
        e.preventDefault();
        const newTable = newTableNameInput.value.trim().toUpperCase();
        if (newTable && !tables.includes(newTable)) {
            tables.push(newTable);
            tables.sort();
            localStorage.setItem('posTables', JSON.stringify(tables));
            renderTables();
        }
        newTableNameInput.value = '';
    }

    function deleteTable(tableName) {
        if (confirm(`Are you sure you want to delete table "${tableName}"?`)) {
            tables = tables.filter(t => t !== tableName);
            localStorage.setItem('posTables', JSON.stringify(tables));
            renderTables();
        }
    }

    function renderPromoCodes() {
        promoListUl.innerHTML = '';
        promoCodes.forEach(promo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${promo.code}</strong> - ${promo.discount * 100}% Off</span>
                <button class="delete-btn" data-code="${promo.code}"><i class="fas fa-trash"></i></button>
            `;
            promoListUl.appendChild(li);
        });
    }

    function addPromoCode(e) {
        e.preventDefault();
        const code = newPromoCodeInput.value.trim().toUpperCase();
        const value = parseFloat(newPromoValueInput.value);

        if (!code || isNaN(value) || value <= 0 || value > 100) {
            alert('Please enter a valid code and discount percentage (1-100).');
            return;
        }

        if (promoCodes.some(p => p.code === code)) {
            alert('This promo code already exists.');
            return;
        }

        promoCodes.push({ code: code, discount: value / 100 });
        localStorage.setItem('posPromoCodes', JSON.stringify(promoCodes));
        renderPromoCodes();
        addPromoForm.reset();
    }

    function deletePromoCode(code) {
        if (confirm(`Are you sure you want to delete the promo code "${code}"?`)) {
            promoCodes = promoCodes.filter(p => p.code !== code);
            localStorage.setItem('posPromoCodes', JSON.stringify(promoCodes));
            renderPromoCodes();
        }
    }

    // Event Listeners
    saveGeneralBtn.addEventListener('click', saveGeneralSettings);
    addTableForm.addEventListener('submit', addTable);
    tableListUl.addEventListener('click', (e) => {
        const target = e.target.closest('.delete-btn');
        if (target) {
            deleteTable(target.dataset.table);
        }
    });

    addPromoForm.addEventListener('submit', addPromoCode);
    promoListUl.addEventListener('click', (e) => {
        const target = e.target.closest('.delete-btn');
        if (target) {
            deletePromoCode(target.dataset.code);
        }
    });

    clearOrderHistoryBtn.addEventListener('click', () => {
        if (confirm('DANGER: This will delete all order history. Continue?')) {
            localStorage.removeItem('allOrders');
            alert('Order history has been cleared.');
        }
    });

    clearProductsBtn.addEventListener('click', () => {
        if (confirm('DANGER: This will reset all products and categories to their default state. Continue?')) {
            localStorage.removeItem('posProducts');
            localStorage.removeItem('posCategories');
            alert('Products and categories have been reset.');
        }
    });

    clearAllDataBtn.addEventListener('click', () => {
        if (confirm('DANGER: This will clear ALL POS data including orders, products, and settings. This cannot be undone. Continue?')) {
            localStorage.clear();
            alert('All local POS data has been cleared. The application will now reload.');
            window.location.reload();
        }
    });

    // --- Initialization ---
    function init() {
        initializeDarkMode();
        loadSettings();
    }

    init();
});