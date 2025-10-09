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

    // --- Menu Management Specific ---
    const productsTableBody = document.getElementById('products-table-body');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-product-modal-btn');
    const productForm = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    const productIdInput = document.getElementById('product-id');
    const searchInput = document.getElementById('product-search');
    const categoryForm = document.getElementById('category-form');
    const categoryNameInput = document.getElementById('category-name-input');
    const categoryListUl = document.getElementById('category-list-ul');
    const productsTableHeader = document.querySelector('.data-table thead');
    const paginationControls = document.getElementById('pagination-controls');

    let products = JSON.parse(localStorage.getItem('posProducts')) || [];
    let categories = JSON.parse(localStorage.getItem('posCategories')) || [...new Set(products.map(p => p.category))];
    
    // Sorting state
    let currentSortColumn = 'name';
    let currentSortDirection = 'asc';

    // Pagination state
    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;


    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    }

    function getInventoryData() {
        return JSON.parse(localStorage.getItem('inventory')) || [];
    }

    function renderProducts(searchTerm = '') {
        // 1. Filter
        productsTableBody.innerHTML = '';
        let processedProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

        // 2. Sort
        const inventory = getInventoryData();
        processedProducts.sort((a, b) => {
            let valA, valB;

            switch (currentSortColumn) {
                case 'name':
                case 'category':
                    valA = a[currentSortColumn].toLowerCase();
                    valB = b[currentSortColumn].toLowerCase();
                    break;
                case 'price':
                    valA = a.price;
                    valB = b.price;
                    break;
                case 'stock':
                    const invA = inventory.find(i => i.name.toLowerCase() === a.name.toLowerCase());
                    const invB = inventory.find(i => i.name.toLowerCase() === b.name.toLowerCase());
                    valA = invA ? invA.currentStock : -1;
                    valB = invB ? invB.currentStock : -1;
                    break;
                case 'status':
                    // A simple way to give order to statuses
                    const statusOrder = { 'in-stock': 3, 'low-stock': 2, 'out-of-stock': 1 };
                    const invStatusA = inventory.find(i => i.name.toLowerCase() === a.name.toLowerCase())?.status || 'in-stock';
                    const invStatusB = inventory.find(i => i.name.toLowerCase() === b.name.toLowerCase())?.status || 'in-stock';
                    valA = statusOrder[invStatusA] || 0;
                    valB = statusOrder[invStatusB] || 0;
                    break;
                default:
                    return 0;
            }

            return (valA < valB ? -1 : valA > valB ? 1 : 0) * (currentSortDirection === 'asc' ? 1 : -1);
        });

        const totalItems = processedProducts.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const paginatedProducts = processedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

        if (processedProducts.length === 0) {
            productsTableBody.innerHTML = `<tr><td colspan="6" class="empty-state">No products found.</td></tr>`;
            renderPaginationControls(0, 0);
            return;
        }

        paginatedProducts.forEach(product => {
            const inventoryItem = inventory.find(i => i.name.toLowerCase() === product.name.toLowerCase());
            const stock = inventoryItem ? inventoryItem.currentStock : 'N/A';
            let status = 'in-stock';
            if (inventoryItem) {
                if (inventoryItem.currentStock <= 0) status = 'out-of-stock';
                else if (inventoryItem.currentStock <= inventoryItem.minStock) status = 'low-stock';
            }
            const statusText = status.replace('-', ' ');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="product-image-cell">
                    <img src="${product.image || 'https://via.placeholder.com/60'}" alt="${product.name}">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${stock}</td>
                <td><span class="order-status ${status}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm edit" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-sm delete" data-id="${product.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            productsTableBody.appendChild(row);
        });

        renderPaginationControls(totalItems, totalPages);
    }

    function renderPaginationControls(totalItems, totalPages) {
        if (totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        let buttonsHtml = `
            <button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            buttonsHtml += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
            `;
        }

        buttonsHtml += `
            <button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        paginationControls.innerHTML = buttonsHtml;
    }

    function openModal(product = null) {
        productForm.reset();
        const inventory = getInventoryData();

        if (product) {
            modalTitle.textContent = 'Edit Product';
            productIdInput.value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-image').value = product.image || '';
            document.getElementById('product-prep-time').value = product.prepTime || '';
            document.getElementById('product-variants').value = (product.variants || []).join(',');
            document.getElementById('product-additions').value = (product.additions || []).join(',');
            document.getElementById('product-popularity').value = product.popularity || '';

            const inventoryItem = inventory.find(i => i.name.toLowerCase() === product.name.toLowerCase());
            if (inventoryItem) {
                document.getElementById('product-stock').value = inventoryItem.currentStock;
                document.getElementById('product-min-stock').value = inventoryItem.minStock;
            }

        } else {
            modalTitle.textContent = 'Add New Product';
            productIdInput.value = '';
        }
        productModal.classList.add('active');
    }

    function closeModal() {
        productModal.classList.remove('active');
    }

    function saveProduct(e) {
        e.preventDefault();
        const id = productIdInput.value;
        const productData = {
            id: id || `prod-${Date.now()}`,
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value,
            prepTime: document.getElementById('product-prep-time').value,
            variants: document.getElementById('product-variants').value.split(',').map(v => v.trim()).filter(Boolean),
            additions: document.getElementById('product-additions').value.split(',').map(a => a.trim()).filter(Boolean),
            popularity: document.getElementById('product-popularity').value,
        };

        if (id) { // Editing existing product
            const index = products.findIndex(p => p.id === id);
            if (index > -1) products[index] = productData;
        } else { // Adding new product
            products.push(productData);
        }

        // Automatically add new category if it doesn't exist
        if (!categories.includes(productData.category)) {
            categories.push(productData.category);
            saveAndRenderCategories();
        }

        // Update Inventory
        const inventory = getInventoryData();
        const inventoryItemIndex = inventory.findIndex(i => i.name.toLowerCase() === productData.name.toLowerCase());
        const currentStock = parseInt(document.getElementById('product-stock').value, 10);
        const minStock = parseInt(document.getElementById('product-min-stock').value, 10);

        let status = 'in-stock';
        if (currentStock <= 0) status = 'out-of-stock';
        else if (currentStock <= minStock) status = 'low-stock';

        if (inventoryItemIndex > -1) {
            inventory[inventoryItemIndex].currentStock = currentStock;
            inventory[inventoryItemIndex].minStock = minStock;
            inventory[inventoryItemIndex].status = status;
            inventory[inventoryItemIndex].lastUpdated = new Date().toISOString();
        } else {
            inventory.push({
                id: 'inv-' + Date.now(),
                name: productData.name,
                category: productData.category,
                currentStock: currentStock,
                minStock: minStock,
                unit: 'pcs',
                unitPrice: productData.price, // Or a separate cost price
                status: status,
                lastUpdated: new Date().toISOString()
            });
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('posProducts', JSON.stringify(products));
        renderProducts();
        closeModal();
    }

    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('posProducts', JSON.stringify(products));
            renderProducts();
        }
    }

    function populateCategoryDatalist() {
        const datalist = document.getElementById('category-list');
        if (!datalist) return;
        datalist.innerHTML = categories.map(c => `<option value="${c}"></option>`).join('');
    }

    function renderCategories() {
        categoryListUl.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'category-list-item';
            li.innerHTML = `
                <span>${category}</span>
                <button class="delete-category-btn" data-category="${category}" title="Delete Category"><i class="fas fa-trash"></i></button>
            `;
            categoryListUl.appendChild(li);
        });
        populateCategoryDatalist();
    }

    function saveAndRenderCategories() {
        localStorage.setItem('posCategories', JSON.stringify(categories));
        renderCategories();
    }

    function addCategory(e) {
        e.preventDefault();
        const newCategory = categoryNameInput.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            saveAndRenderCategories();
        }
        categoryForm.reset();
    }

    // Event Listeners
    addProductBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    productForm.addEventListener('submit', saveProduct);
    searchInput.addEventListener('input', (e) => renderProducts(e.target.value));
    categoryForm.addEventListener('submit', addCategory);

    paginationControls.addEventListener('click', (e) => {
        const target = e.target.closest('.pagination-btn');
        if (!target || target.disabled) return;

        const page = target.dataset.page;
        if (page === 'prev') {
            currentPage--;
        } else if (page === 'next') {
            currentPage++;
        } else {
            currentPage = parseInt(page, 10);
        }

        renderProducts(searchInput.value);
    });


    productsTableHeader.addEventListener('click', (e) => {
        const headerCell = e.target.closest('th.sortable');
        if (!headerCell) return;

        const sortKey = headerCell.dataset.sort;
        if (currentSortColumn === sortKey) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = sortKey;
            currentSortDirection = 'asc';
        }

        productsTableHeader.querySelectorAll('th.sortable').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc'));
        headerCell.classList.add(currentSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');

        renderProducts(searchInput.value);
    });

    productsTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('edit')) {
            const productToEdit = products.find(p => p.id === id);
            if (productToEdit) openModal(productToEdit);
        } else if (target.classList.contains('delete')) {
            deleteProduct(id);
        }
    });

    categoryListUl.addEventListener('click', (e) => {
        const target = e.target.closest('.delete-category-btn');
        if (target) {
            const categoryToDelete = target.dataset.category;
            if (confirm(`Are you sure you want to delete the "${categoryToDelete}" category?`)) {
                categories = categories.filter(c => c !== categoryToDelete);
                saveAndRenderCategories();
            }
        }
    });

    // --- Initialization ---
    function init() {
        initializeDarkMode();
        renderProducts();
        renderCategories();
    }

    init();
});