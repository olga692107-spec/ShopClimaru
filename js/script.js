// Функционал корзины
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [];
    
    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Добавление товара в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            cartSidebar.classList.add('active');
            
            // Анимация кнопки
            const originalText = button.textContent;
            button.textContent = 'Добавлено!';
            button.classList.add('btn-success');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('btn-success');
            }, 1500);
        });
    });
    
    // Обновление корзины
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let count = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3', 'pb-3', 'border-bottom');
            cartItemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="cart-item-image bg-light rounded me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                        <i class="fas fa-snowflake text-primary"></i>
                    </div>
                    <div>
                        <div class="cart-item-title fw-bold">${item.name}</div>
                        <div class="cart-item-price text-primary">${item.price} ₽ × ${item.quantity}</div>
                    </div>
                </div>
                <button class="cart-item-remove btn btn-sm btn-outline-danger" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
        cartCount.textContent = count;
        
        // Обработчики для кнопок удаления
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Оформление заказа
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.');
        cart = [];
        updateCart();
        cartSidebar.classList.remove('active');
    });
    
    // Закрытие корзины при клике вне ее
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});