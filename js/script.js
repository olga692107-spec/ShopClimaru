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
    // Сохраним оригинальный HTML для кнопок "В корзину", чтобы восстановить при удалении
    addToCartButtons.forEach(btn => {
        if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML.trim();
    });

    function updateAddToCartButtons() {
        addToCartButtons.forEach(button => {
            const id = button.getAttribute('data-id');
            if (!id) return;
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 0) {
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');
                button.innerHTML = `<i class="fas fa-shopping-cart me-2"></i>В корзине ${item.quantity} шт`;
            } else {
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
                button.innerHTML = button.dataset.originalHtml || `<i class="fas fa-shopping-cart me-2"></i>В корзину`;
            }
        });
    }
    
    // Открытие/закрытие корзины (с проверками наличия элементов)
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
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
            updateAddToCartButtons();
            if (cartSidebar) cartSidebar.classList.add('active');
        });
    });
    
    // Обновление корзины
    function updateCart() {
        if (cartItems) cartItems.innerHTML = '';
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
                        <div class="cart-item-price text-primary">${item.price} ₽</div>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="input-group input-group-sm" style="width:110px;">
                        <button class="btn btn-outline-secondary cart-item-decrease" data-id="${item.id}" type="button">−</button>
                        <div class="form-control text-center cart-item-qty" style="width:42px;">${item.quantity}</div>
                        <button class="btn btn-outline-secondary cart-item-increase" data-id="${item.id}" type="button">+</button>
                    </div>
                    <button class="cart-item-remove btn btn-sm btn-outline-danger" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            if (cartItems) cartItems.appendChild(cartItemElement);
        });
        
        if (cartTotal) cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
        if (cartCount) cartCount.textContent = count;
        
        // Обработчики для кнопок удаления, увеличения и уменьшения количества
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
                updateAddToCartButtons();
            });
        });

        document.querySelectorAll('.cart-item-increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const it = cart.find(i => i.id === id);
                if (it) {
                    it.quantity += 1;
                    updateCart();
                    updateAddToCartButtons();
                }
            });
        });

        document.querySelectorAll('.cart-item-decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const it = cart.find(i => i.id === id);
                if (it) {
                    it.quantity -= 1;
                    if (it.quantity <= 0) {
                        cart = cart.filter(x => x.id !== id);
                    }
                    updateCart();
                    updateAddToCartButtons();
                }
            });
        });
    }
    
    // Оформление заказа
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.');
            cart = [];
            updateCart();
            updateAddToCartButtons();
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // Закрытие корзины при клике вне ее
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartIcon && !cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Проверяем, что href не пустой и не просто "#"
        if (!href || href === '#' || href.length <= 1) return;
        
        e.preventDefault();
        try {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } catch(err) {
            // Игнорируем невалидные селекторы
            console.warn('Invalid selector:', href);
        }
    });
});

// Устанавливаем CSS-переменную --header-height равной фактической высоте header
function updateHeaderHeightVar() {
    const header = document.querySelector('header');
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    // Записываем в :root переменную, чтобы .main-content могла использовать её
    document.documentElement.style.setProperty('--header-height', Math.ceil(h) + 'px');
}

window.addEventListener('load', updateHeaderHeightVar);
window.addEventListener('resize', updateHeaderHeightVar);
// также обновим при DOMContentLoaded на случай быстрого рендера
document.addEventListener('DOMContentLoaded', updateHeaderHeightVar);

// Следим за раскрытием/сворачиванием секций каталога.
// Если все секции внутри `#catalogAccordion` открыты — добавляем класс на body,
// чтобы CSS мог добавить дополнительный отступ перед футером.
function checkAllFiltersOpen() {
    const all = document.querySelectorAll('#catalogAccordion .accordion-collapse');
    if (!all || all.length === 0) {
        document.body.classList.remove('all-filters-open');
        return;
    }
    const opened = Array.from(all).filter(el => el.classList.contains('show')).length;
    // Если открыта хотя бы одна секция — показываем отступ перед футером
    if (opened >= 1) {
        document.body.classList.add('all-filters-open');
    } else {
        document.body.classList.remove('all-filters-open');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAllFiltersOpen();
    const catalog = document.getElementById('catalogAccordion');
    if (catalog) {
        catalog.addEventListener('shown.bs.collapse', checkAllFiltersOpen);
        catalog.addEventListener('hidden.bs.collapse', checkAllFiltersOpen);
    }
});

window.addEventListener('load', checkAllFiltersOpen);
window.addEventListener('resize', checkAllFiltersOpen);

    // Popular products carousel: circular scrolling with arrows (index-based snapping)
    (function initPopularCarousel(){
        const wrapper = document.querySelector('.popular-track-wrapper');
        const track = document.querySelector('.popular-track');
        const prev = document.querySelector('.popular-prev');
        const next = document.querySelector('.popular-next');
        if(!wrapper || !track || !prev || !next) return;

        const items = Array.from(track.querySelectorAll('[class*="col-"]'));
        if (items.length === 0) return;

        function getGapPx(el) {
            const gap = getComputedStyle(el).gap || getComputedStyle(el).columnGap || '0px';
            if (gap.endsWith('px')) return parseFloat(gap);
            const tmp = document.createElement('div'); tmp.style.width = gap; document.body.appendChild(tmp);
            const val = tmp.getBoundingClientRect().width; document.body.removeChild(tmp); return val;
        }

        function getStep() {
            const first = items[0];
            const w = first.getBoundingClientRect().width;
            const gap = getGapPx(track) || 0;
            return Math.round(w + gap);
        }

        function getCurrentIndex() {
            const step = getStep();
            // guard against division by zero
            if (step <= 0) return 0;
            // Round to nearest index
            return Math.round(wrapper.scrollLeft / step);
        }

        function scrollToIndex(idx) {
            const step = getStep();
            const maxIndex = Math.max(0, items.length - Math.floor(wrapper.clientWidth / (step || 1)));
            // clamp idx into [0, items.length-1]
            if (idx < 0) idx = (items.length + (idx % items.length)) % items.length;
            if (idx >= items.length) idx = idx % items.length;
            const left = idx * step;
            wrapper.scrollTo({ left: left, behavior: 'smooth' });
        }

        next.addEventListener('click', () => {
            const cur = getCurrentIndex();
            const nextIdx = (cur + 1) % items.length;
            scrollToIndex(nextIdx);
        });

        prev.addEventListener('click', () => {
            const cur = getCurrentIndex();
            const prevIdx = (cur - 1 + items.length) % items.length;
            scrollToIndex(prevIdx);
        });

        function updateArrows() {
            if (track.scrollWidth <= wrapper.clientWidth + 2) {
                prev.style.display = 'none'; next.style.display = 'none';
            } else { prev.style.display='inline-flex'; next.style.display='inline-flex'; }
        }

        // Keep arrows updated and recompute items on resize
        updateArrows();
        window.addEventListener('resize', () => {
            // recompute items sizes (in case responsive breakpoints changed visible count)
            updateArrows();
        });
    })();

// Выравнивание верхней границы баннера по верхней границе каталога
function alignHeroWithCatalog() {
    const catalog = document.querySelector('.catalog');
    const hero = document.querySelector('.hero-banner');
    if (!catalog || !hero) return;
    const catalogRect = catalog.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    // Ограничим выравнивание только для десктопа (чтобы не ломать мобильную верстку)
    if (window.innerWidth < 992) {
        hero.style.marginTop = '';
        return;
    }

    // вычисляем смещение в документных координатах и учитываем текущий margin-top
    const catalogY = window.scrollY + catalogRect.top;
    const heroY = window.scrollY + heroRect.top;
    const diff = catalogY - heroY;

    const computed = window.getComputedStyle(hero);
    const currentMargin = parseFloat(computed.marginTop) || 0;
    // Добавляем вычисленное смещение к текущему margin-top (позволяет корректно учитывать уже заданные отступы)
    const newMargin = currentMargin + diff;
    hero.style.marginTop = Math.round(newMargin) + 'px';
}

window.addEventListener('load', alignHeroWithCatalog);
window.addEventListener('resize', alignHeroWithCatalog);
document.addEventListener('DOMContentLoaded', alignHeroWithCatalog);

// Contact form handling (validation + simulated submit)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const cfSuccess = document.getElementById('cf-success');
    const phoneInput = document.getElementById('cf-phone');
    if (!contactForm) return;

    // Initialize phone mask (Inputmask if available, otherwise fallback formatter)
    if (phoneInput) {
        if (window.Inputmask) {
            try {
                Inputmask({ mask: "+7 (999) 999-99-99", showMaskOnHover: false, clearIncomplete: true }).mask(phoneInput);
            } catch (e) {
                // ignore mask init errors
            }
        } else {
            // fallback: simple formatter forcing digits into +7 (xxx) xxx-xx-xx
            phoneInput.addEventListener('input', function () {
                let v = this.value.replace(/\D/g, '');
                if (v.startsWith('8')) v = '7' + v.slice(1);
                if (!v.startsWith('7')) v = '7' + v;
                v = v.slice(0, 11);
                let out = '+' + (v.charAt(0) || '7');
                if (v.length > 1) {
                    out += ' (' + v.slice(1, Math.min(4, v.length));
                }
                if (v.length >= 4) {
                    out += ') ' + v.slice(4, Math.min(7, v.length));
                }
                if (v.length >= 7) {
                    out += '-' + v.slice(7, Math.min(9, v.length));
                }
                if (v.length >= 9) {
                    out += '-' + v.slice(9, 11);
                }
                this.value = out;
            });
        }
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Use native constraint validation
        if (!contactForm.checkValidity()) {
            contactForm.classList.add('was-validated');
            return;
        }

        // Simulate sending
        const submitBtn = contactForm.querySelector('#cf-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Отправка...';
        }

        setTimeout(() => {
            // Show success message
            if (cfSuccess) cfSuccess.classList.remove('d-none');
            contactForm.classList.remove('was-validated');
            contactForm.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Отправить';
            }

            // Close modal after short delay
            const modalEl = document.getElementById('contactModal');
            if (modalEl && window.bootstrap) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                setTimeout(() => {
                    modalInstance.hide();
                    if (cfSuccess) cfSuccess.classList.add('d-none');
                }, 1400);
            }
        }, 900);
    });
});