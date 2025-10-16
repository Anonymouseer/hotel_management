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

    // --- Dashboard Specific ---
    const dashboardTotalRevenueEl = document.getElementById('dashboard-total-revenue');
    const dashboardTotalOrdersEl = document.getElementById('dashboard-total-orders');
    const dashboardLowStockEl = document.getElementById('dashboard-low-stock');
    const dashboardOutOfStockEl = document.getElementById('dashboard-out-of-stock');
    const dashboardTopItemsEl = document.getElementById('dashboard-top-items');
    const dashboardActivityFeedEl = document.getElementById('dashboard-activity-feed');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    }

    function getInventoryData() {
        return JSON.parse(localStorage.getItem('inventory')) || [];
    }

    function getAllOrders() {
        return JSON.parse(localStorage.getItem('allOrders')) || [];
    }

    function updateDashboard() {
        if (!dashboardTotalRevenueEl) return;

        const allOrders = getAllOrders();
        const today = new Date().toLocaleDateString();
        const todaysOrders = allOrders.filter(order => new Date(order.timestamp).toLocaleDateString() === today);

        // 1. Sales Summary
        const totalRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        dashboardTotalRevenueEl.textContent = formatCurrency(totalRevenue);
        dashboardTotalOrdersEl.textContent = todaysOrders.length;

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

        const sortedTopItems = Object.entries(itemSales).sort(([, qtyA], [, qtyB]) => qtyB - qtyA).slice(0, 5);

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
            recentActivities.push({ type: 'order', timestamp: new Date(order.timestamp), text: `New order #${order.id.slice(-4)} from ${order.customer}` });
        });
        recentHelpRequests.forEach(request => {
            recentActivities.push({ type: 'help', timestamp: new Date(request.timestamp), text: `Help request from Room ${request.location}` });
        });

        recentActivities.sort((a, b) => b.timestamp - a.timestamp);

        if (recentActivities.length > 0) {
            dashboardActivityFeedEl.innerHTML = recentActivities.slice(0, 5).map(activity => {
                const icon = activity.type === 'order' ? 'fa-receipt' : 'fa-headset';
                return `
                    <div class="activity-item">
                        <div class="activity-icon"><i class="fas ${icon}"></i></div>
                        <div class="activity-content">
                            <p>${activity.text}</p>
                            <span class="activity-time">${getTimeAgo(activity.timestamp)}</span>
                        </div>
                    </div>`;
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

    // --- Initialization ---
    function init() {
        initializeDarkMode();
        updateDashboard();
        // Listen for storage changes to auto-update the dashboard
        window.addEventListener('storage', updateDashboard);
    }

    init();
});