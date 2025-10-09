document.addEventListener('DOMContentLoaded', () => {
    const cookingQueueEl = document.getElementById('cooking-queue');
    const readyQueueEl = document.getElementById('ready-queue');
    const deliveringQueueEl = document.getElementById('delivering-queue');

    function renderLiveQueue() {
        if (!cookingQueueEl || !readyQueueEl || !deliveringQueueEl) return;

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

    function init() {
        renderLiveQueue();
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'posOrderQueue') {
            renderLiveQueue();
        }
    });

    init();
});