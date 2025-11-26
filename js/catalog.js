// Загрузка и отображение товаров каталога
(function() {
    'use strict';

    // Функция для форматирования цены
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    }

    // Функция для создания HTML карточки товара
function createProductCard(product) {
    const featuresHTML = product.features.map(feature => 
        `<li style="font-size: 13px; margin-bottom: 6px; line-height: 1.3;">${feature}</li>`
    ).join('');
    
    return `
        <div style="height:400px; border:2px solid #e0e0e0; border-radius:10px; display:flex; flex-direction:column; background:white; overflow:hidden; position:relative;">
    
    <!-- Кнопка избранного в правом верхнем углу -->
    <button class="favorite-inline favorite-toggle" aria-label="Добавить в избранное" data-id="${product.id}">
        <i class="far fa-bookmark"></i>
    </button>
    
    <div style="height:100px; background:#f8f9fa; display:flex; align-items:center; justify-content:center;">
        <img src="${product.image}" alt="${product.name}" style="max-height:50px; max-width:80%; object-fit:contain;">
    </div>
    
    <div style="flex:1; padding:5px; display:flex; flex-direction:column; min-height:0;">
        <div style="font-size:16px; font-weight:bold; margin-bottom:3px; line-height:1.3;">${product.name}</div>
        <div style="font-size:14px; color:#666; margin-bottom:8px;">Бренд: ${product.brand}</div>
        
        <ul style="flex:1; list-style:none; padding:0; margin:0 0 5px 0; overflow:auto; font-size:25px;">
            ${featuresHTML}
        </ul>
        
        <div style="font-size:14px; color:#666; margin-bottom:8px;">Габариты блока(ШхВхГ) ${product.dimensions}</div>

        <div style="margin-top:auto;">
            <div style="font-size:20px; font-weight:bold; color:#0d6efd; margin-bottom:8px;">${formatPrice(product.price)}</div>
            
            <!-- Контейнер для кнопок (без избранного) -->
            <div class="initial-buttons" style="display:flex; gap:8px; align-items:center;">
                <!-- Кнопка "В корзину" -->
                <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}"
                        style="flex:1; background:#0d6efd; color:white; border:none; border-radius:4px; padding:8px 6px; font-size:15px; cursor:pointer;">
                    В корзину
                </button>
            </div>
            
            <!-- Контролы количества (скрыты по умолчанию) -->
            <div class="quantity-controls" style="display:none; gap:8px; align-items:center;">
                <!-- Кнопка минус -->
                <button class="decrease-btn" data-id="${product.id}"
                        style="width:40px; height:40px; background:#f8f9fa; border:1px solid #ddd; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; font-weight:bold;">
                    −
                </button>
                
                <!-- Количество -->
                <div class="quantity-display" data-id="${product.id}"
                     style="flex:1; text-align:center; font-size:16px; font-weight:bold; background:#f8f9fa; border:1px solid #ddd; border-radius:4px; padding:8px; min-height:40px; display:flex; align-items:center; justify-content:center;">
                    1
                </div>
                
                <!-- Кнопка плюс -->
                <button class="increase-btn" data-id="${product.id}"
                        style="width:40px; height:40px; background:#0d6efd; color:white; border:none; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; font-weight:bold;">
                    +
                </button>
            </div>
        </div>
    </div>
</div>
    `;
}

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 8;

    // Отображение товаров из массива данных
    function renderProducts(products, page = 1) {
        const container = document.getElementById('products-container');
        const paginationContainer = document.getElementById('pagination-container');
        
        if (container && products && products.length > 0) {
            // Вычисляем индексы для текущей страницы
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProducts = products.slice(startIndex, endIndex);
            
            container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
            
            // Создаем пагинацию
            const totalPages = Math.ceil(products.length / itemsPerPage);
            if (paginationContainer && totalPages > 1) {
                renderPagination(totalPages, page, products);
            }
            
            // Инициализация обработчиков после загрузки товаров
            initializeProductHandlers();
            
            // Инициализация кнопок избранного
            if (typeof window.initFavoriteButtons === 'function') {
                window.initFavoriteButtons();
            }
        } else if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Товары не найдены</p></div>';
        }
    }

    // Функция для создания пагинации
    function renderPagination(totalPages, currentPage, products) {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        let paginationHTML = '<nav aria-label="Навигация по страницам"><ul class="pagination justify-content-center">';
        
        // Кнопка "Предыдущая"
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>
            </li>
        `;
        
        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Кнопка "Следующая"
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>
            </li>
        `;
        
        paginationHTML += '</ul></nav>';
        paginationContainer.innerHTML = paginationHTML;
        
        // Добавляем обработчики для кнопок пагинации
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderProducts(products, page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Функции для работы с корзиной
    function getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalCount;
        }
    }

    function addToCart(productId, productName, productPrice, productImage) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
        }
        
        saveCart(cart);
        console.log('Товар добавлен в корзину:', productName);
    }

    function updateCartQuantity(productId, newQuantity) {
        const cart = getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (newQuantity <= 0) {
                // Удалить товар из корзины
                const index = cart.indexOf(item);
                cart.splice(index, 1);
            } else {
                item.quantity = newQuantity;
            }
            saveCart(cart);
        }
    }

    // Инициализация обработчиков для кнопок товаров
    function initializeProductHandlers() {
        // Обработчики для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                const productPrice = this.dataset.price;
                const card = this.closest('[style*="height:400px"]');
                const productImage = card.querySelector('img').src;
                const initialButtons = card.querySelector('.initial-buttons');
                const quantityControls = card.querySelector('.quantity-controls');
                
                // Добавить товар в корзину
                addToCart(productId, productName, productPrice, productImage);
                
                // Скрыть начальные кнопки и показать контролы количества
                initialButtons.style.display = 'none';
                quantityControls.style.display = 'flex';
            });
        });

        // Обработчики для увеличения количества
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const card = this.closest('[style*="height:400px"]');
                const quantityDisplay = card.querySelector('.quantity-display[data-id="' + productId + '"]');
                let currentQuantity = parseInt(quantityDisplay.textContent);
                currentQuantity++;
                quantityDisplay.textContent = currentQuantity;
                
                // Обновить количество в корзине
                updateCartQuantity(productId, currentQuantity);
                console.log('Количество увеличено:', productId, currentQuantity);
            });
        });

        // Обработчики для уменьшения количества
        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const card = this.closest('[style*="height:400px"]');
                const quantityDisplay = card.querySelector('.quantity-display[data-id="' + productId + '"]');
                const initialButtons = card.querySelector('.initial-buttons');
                const quantityControls = card.querySelector('.quantity-controls');
                let currentQuantity = parseInt(quantityDisplay.textContent);
                
                if (currentQuantity > 1) {
                    currentQuantity--;
                    quantityDisplay.textContent = currentQuantity;
                    
                    // Обновить количество в корзине
                    updateCartQuantity(productId, currentQuantity);
                    console.log('Количество уменьшено:', productId, currentQuantity);
                } else {
                    // Если количество = 1, убрать товар из корзины и вернуть кнопку
                    updateCartQuantity(productId, 0);
                    quantityControls.style.display = 'none';
                    initialButtons.style.display = 'flex';
                    quantityDisplay.textContent = '1';
                    console.log('Товар удален из корзины:', productId);
                }
            });
        });
    }

    // Автоматическая загрузка при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM загружен');
        console.log('wallSplitProducts:', typeof wallSplitProducts !== 'undefined' ? wallSplitProducts.length : 'не определен');
        
        // Проверяем наличие глобального массива товаров
        if (typeof wallSplitProducts !== 'undefined') {
            console.log('Загружаем товары:', wallSplitProducts.length);
            renderProducts(wallSplitProducts);
        } else {
            console.error('wallSplitProducts не найден!');
        }
    });

    // Экспорт функции для использования извне
    window.renderCatalogProducts = renderProducts;

})();
