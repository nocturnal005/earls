// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav__list');
    
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('.iconify');
            if(navList.classList.contains('active')) {
                icon.setAttribute('data-icon', 'lucide:x');
            } else {
                icon.setAttribute('data-icon', 'lucide:menu');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            if(mobileMenuBtn) {
                mobileMenuBtn.querySelector('.iconify').setAttribute('data-icon', 'lucide:menu');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Nav Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksMain = document.querySelectorAll('.nav__link');

    const navObserverOptions = {
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: "-100px 0px 0px 0px" // Offset for header
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksMain.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // --- Parallax Service Images ---
    const parallaxWrappers = document.querySelectorAll('.framing-rect-wrapper');
    const updateParallax = () => {
        parallaxWrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            if (rect.top <= viewHeight && rect.bottom >= 0) {
                const img = wrapper.querySelector('img');
                if (img) {
                    const scrollPercentage = (viewHeight - rect.top) / (viewHeight + rect.height);
                    const yPos = (scrollPercentage - 0.5) * 15; // -7.5% to 7.5%
                    img.style.setProperty('--parallax-y', `${yPos}%`);
                }
            }
        });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax), { passive: true });
    updateParallax(); // Initial call



    // --- Immersive Gallery & Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-immersive__item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            // Hover interaction
            item.addEventListener('mouseenter', () => {
                galleryItems.forEach(gItem => gItem.classList.remove('active'));
                item.classList.add('active');
            });

            // Click interaction (Lightbox)
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && lightbox && lightboxImg) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    // Prevent scrolling on body
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    // Close Lightbox
    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Shopping Cart System ---
    const cartBtn = document.getElementById('header-cart-btn');
    const cartCount = document.getElementById('header-cart-count');

    // On the configurator page (#root present) the React app owns the basket
    // and the header cart icon — so this lightweight header cart stays out of
    // the way to avoid two carts fighting over the same button/badge.
    const configuratorOwnsCart = !!document.getElementById('root');

    // Get cart from localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('earls_cart') || '[]');
        } catch { return []; }
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('earls_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    // Update the badge count
    function updateCartBadge() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (cartCount) {
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    // Build cart slide-out panel (injected once into the DOM)
    function createCartPanel() {
        if (document.getElementById('earls-cart-panel')) return;

        const overlay = document.createElement('div');
        overlay.id = 'earls-cart-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);z-index:9998;opacity:0;transition:opacity 0.3s;pointer-events:none;';
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        panel.id = 'earls-cart-panel';
        panel.style.cssText = 'position:fixed;top:0;right:-420px;width:400px;max-width:90vw;height:100vh;background:#fff;z-index:9999;box-shadow:-4px 0 20px rgba(0,0,0,0.15);transition:right 0.35s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column;font-family:Inter,Source Sans 3,system-ui,sans-serif;';
        document.body.appendChild(panel);

        overlay.addEventListener('click', closeCart);

        return { panel, overlay };
    }

    function openCart() {
        createCartPanel();
        const panel = document.getElementById('earls-cart-panel');
        const overlay = document.getElementById('earls-cart-overlay');
        renderCartContents(panel);
        requestAnimationFrame(() => {
            panel.style.right = '0';
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        const panel = document.getElementById('earls-cart-panel');
        const overlay = document.getElementById('earls-cart-overlay');
        if (panel) panel.style.right = '-420px';
        if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
        document.body.style.overflow = '';
    }

    function renderCartContents(panel) {
        const cart = getCart();
        const isEmpty = cart.length === 0;

        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 24px 20px;border-bottom:1px solid #eee;">
                <h2 style="margin:0;font-size:18px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:0.04em;">Shopping Cart</h2>
                <button id="cart-close-btn" style="border:none;background:none;cursor:pointer;padding:4px;color:#555;font-size:22px;line-height:1;">&times;</button>
            </div>
            ${isEmpty ? `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center;color:#888;">
                    <span class="iconify" data-icon="lucide:shopping-bag" style="font-size:56px;margin-bottom:16px;color:#ccc;"></span>
                    <p style="font-size:16px;margin:0 0 8px 0;color:#555;font-weight:500;">Your cart is empty</p>
                    <p style="font-size:14px;color:#999;margin:0;">Add items from the configurator to get started</p>
                </div>
            ` : `
                <div style="flex:1;overflow-y:auto;padding:16px 24px;">
                    ${cart.map((item, i) => `
                        <div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0;align-items:flex-start;">
                            ${item.image ? `<img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0;" />` : `<div style="width:60px;height:60px;background:#f5f5f5;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;"><span class="iconify" data-icon="lucide:frame" style="font-size:24px;color:#ccc;"></span></div>`}
                            <div style="flex:1;min-width:0;">
                                <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name || 'Framed Print'}</p>
                                <p style="margin:0 0 8px;font-size:12px;color:#888;">${item.details || ''}</p>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <button class="cart-qty-btn" data-idx="${i}" data-action="dec" style="width:26px;height:26px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">−</button>
                                    <span style="font-size:14px;min-width:18px;text-align:center;">${item.quantity || 1}</span>
                                    <button class="cart-qty-btn" data-idx="${i}" data-action="inc" style="width:26px;height:26px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">+</button>
                                </div>
                            </div>
                            <div style="text-align:right;flex-shrink:0;">
                                <p style="margin:0;font-size:14px;font-weight:700;color:#C41E1E;">£${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                <button class="cart-remove-btn" data-idx="${i}" style="border:none;background:none;color:#aaa;cursor:pointer;font-size:11px;margin-top:6px;text-decoration:underline;">Remove</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="padding:20px 24px;border-top:1px solid #eee;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
                        <span style="font-size:16px;font-weight:600;color:#111;">Total</span>
                        <span style="font-size:18px;font-weight:700;color:#C41E1E;">£${cart.reduce((s, item) => s + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}</span>
                    </div>
                    <button style="width:100%;padding:14px;background:#C41E1E;color:#fff;border:none;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;transition:background 0.2s;" onmouseover="this.style.background='#a31818'" onmouseout="this.style.background='#C41E1E'">CHECKOUT</button>
                </div>
            `}
        `;

        // Bind close button
        const closeBtn = panel.querySelector('#cart-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeCart);

        // Bind quantity buttons
        panel.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const action = btn.dataset.action;
                const cart = getCart();
                if (action === 'inc') cart[idx].quantity = (cart[idx].quantity || 1) + 1;
                if (action === 'dec') {
                    cart[idx].quantity = (cart[idx].quantity || 1) - 1;
                    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
                }
                saveCart(cart);
                renderCartContents(panel);
            });
        });

        // Bind remove buttons
        panel.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const cart = getCart();
                cart.splice(idx, 1);
                saveCart(cart);
                renderCartContents(panel);
            });
        });
    }

    // Cart button click
    if (cartBtn && !configuratorOwnsCart) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    // Listen for cart updates from other tabs/pages
    window.addEventListener('storage', (e) => {
        if (e.key === 'earls_cart' && !configuratorOwnsCart) updateCartBadge();
    });

    // Initial badge update
    if (!configuratorOwnsCart) updateCartBadge();

});
