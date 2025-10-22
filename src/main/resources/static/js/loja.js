document.addEventListener('DOMContentLoaded', function () {
    const btnOpen = document.getElementById('open-cart')
    const sidebar = document.getElementById('cart-sidebar')
    const backdrop = document.getElementById('cart-backdrop')
    const btnClose = document.getElementById('cart-close')

    const profileLink = document.getElementById('profile-link')
    const btnLogout = document.getElementById('btn-logout')

    // localStorage
    function isClientLogged() {
        const raw = localStorage.getItem('clientAuth')
        if (!raw) return false

        const data = JSON.parse(raw)

        return data ? data.logged === true : false
    }

    function updateAuthUI() {
        const logged = isClientLogged()

        if (profileLink) {
            profileLink.setAttribute('href', logged ? '/perfil' : '/entrar')
        }

        if (btnLogout) {
            btnLogout.style.display = logged ? 'inline-block' : 'none'
        }
    }

    function logoutClient() {
        localStorage.removeItem('clientAuth')
        updateAuthUI()

        // forçar pra /loja
        window.location.href = '/loja'
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logoutClient)
    }

    // garantindo o estado
    if (profileLink) {
        profileLink.addEventListener('click', function (e) {
            const target = isClientLogged() ? '/perfil' : '/entrar'

            if (profileLink.getAttribute('href') !== target) {
                e.preventDefault()
                window.location.href = target
            }
        })
    }

    updateAuthUI()

    if (!btnOpen || !sidebar || !backdrop || !btnClose) return

    function openCart() {
        sidebar.classList.add('is-open')
        backdrop.classList.add('is-open')
        sidebar.setAttribute('aria-hidden', 'false')
        backdrop.setAttribute('aria-hidden', 'false')
        document.body.classList.add('cart-open')
        btnClose.focus({ preventScroll: true })
    }

    function closeCart() {
        sidebar.classList.remove('is-open')
        backdrop.classList.remove('is-open')
        sidebar.setAttribute('aria-hidden', 'true')
        backdrop.setAttribute('aria-hidden', 'true')
        document.body.classList.remove('cart-open')
        btnOpen.focus({ preventScroll: true })
    }

    btnOpen.addEventListener('click', openCart)
    btnClose.addEventListener('click', closeCart)
    backdrop.addEventListener('click', closeCart)

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCart()
        }
    })

    // inicializa o render do carrinho
    if (window.Cart && typeof window.Cart.init === 'function') {
        window.Cart.init()
    }

    const grid = document.querySelector('.product-grid')

    if (grid) {
        grid.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-buy')
            if (!btn) return

            const id = btn.getAttribute('data-id')
            const name = btn.getAttribute('data-name')
            const price = btn.getAttribute('data-price')
            const imageId = btn.getAttribute('data-imageid')

            if (window.Cart) {
                window.Cart.addItem({
                    id,
                    name,
                    price,
                    imageId,
                    qty: 1
                })
                openCart()
            }
        })
    }
})
