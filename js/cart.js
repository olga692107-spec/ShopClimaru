// Управление корзиной на странице cart.html
(function() {
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalItems = document.getElementById('cart-total-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtnPage = document.getElementById('checkout-btn-page');

    // Проверяем, что мы на странице корзины
    if (!cartItemsList) return;

    // Получаем корзину из localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    // Сохраняем корзину в localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Обновляем счетчик в header
        updateHeaderCartCount();
    }

    // Обновляем счетчик корзины в header
    function updateHeaderCartCount() {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totalCount;
        });
    }

    // Форматируем цену
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }

    // Отображаем корзину
    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('d-none');
            cartItemsContainer.classList.add('d-none');
            return;
        }

        emptyCartMessage.classList.add('d-none');
        cartItemsContainer.classList.remove('d-none');

        // Отображаем товары
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item-page mb-3 pb-3 border-bottom" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center mb-3 mb-md-0">
                        <img src="${item.image}" alt="${item.name || item.title}" class="img-fluid" style="max-height: 50px; object-fit: contain;">
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <h6 class="fw-semibold mb-1">${item.name || item.title}</h6>
                        <small class="text-muted">${item.category || 'Кондиционеры'}</small>
                    </div>
                    <div class="col-md-2 mb-2 mb-md-0">
                        <div class="d-flex align-items-center justify-content-center">
                            <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-3 fw-semibold">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 mb-3 mb-md-0 text-center">
                        <div class="fw-bold text-primary">${formatPrice(item.price * item.quantity)}</div>
                        <small class="text-muted">${formatPrice(item.price)} / шт</small>
                    </div>
                    <div class="col-md-1 text-center">
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Подсчитываем итоги
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartTotalItems.textContent = totalItems;
        cartSubtotal.textContent = formatPrice(totalPrice);
        cartTotalPrice.textContent = formatPrice(totalPrice);

        // Добавляем обработчики событий
        attachEventListeners();
    }

    // Добавляем обработчики событий
    function attachEventListeners() {
        // Увеличить количество
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                updateQuantity(id, 1);
            });
        });

        // Уменьшить количество
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                updateQuantity(id, -1);
            });
        });

        // Удалить товар
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                removeItem(id);
            });
        });
    }

    // Обновляем количество товара
    function updateQuantity(id, change) {
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            saveCart(cart);
            renderCart();
        }
    }

    // Удаляем товар из корзины
    function removeItem(id) {
        let cart = getCart();
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        renderCart();
    }

    // Оформление заказа
    if (checkoutBtnPage) {
        checkoutBtnPage.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            // Показываем модальное окно с формой заказа
            const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
            contactModal.show();
        });
    }

    // Очистка корзины
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить корзину?')) {
                saveCart([]);
                renderCart();
            }
        });
    }

    // Инициализация
    renderCart();
    updateHeaderCartCount();
})();
