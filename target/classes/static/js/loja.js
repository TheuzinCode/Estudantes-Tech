document.addEventListener('DOMContentLoaded', function () {
    const btnOpen = document.getElementById('open-cart');
    const sidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('cart-backdrop');
    const btnClose = document.getElementById('cart-close');

    if (!btnOpen || !sidebar || !backdrop || !btnClose) return;

    function openCart() {
        sidebar.classList.add('is-open');
        backdrop.classList.add('is-open');
        sidebar.setAttribute('aria-hidden', 'false');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.classList.add('cart-open');
        // move focus para o close por acessibilidade
        btnClose.focus({ preventScroll: true });
    }

    function closeCart() {
        sidebar.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        sidebar.setAttribute('aria-hidden', 'true');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cart-open');
        // retorna foco para o botão de abrir
        btnOpen.focus({ preventScroll: true });
    }

    btnOpen.addEventListener('click', openCart);
    btnClose.addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCart();
        }
    });

    // Inicializa render do carrinho
    if (window.Cart && typeof window.Cart.init === 'function') {
        window.Cart.init();
    }

    // Botões "Comprar" dentro da vitrine
    const grid = document.querySelector('.product-grid');
    if (grid) {
        grid.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-buy');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            const imageId = btn.getAttribute('data-imageid');
            if (window.Cart) {
                window.Cart.addItem({ id, name, price, imageId, qty: 1 });
                openCart();
            }
        });
    }
});
