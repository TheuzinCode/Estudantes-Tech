(function(){
    const STORAGE_KEY = 'cart_v1'
    const SHIPPING_KEY = 'cart_shipping_v1'

    const SHIPPING_PRICES = {
        economico: 5,
        expresso: 10,
        premium: 15
    }

    function load (){
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [] }
            if (!parsed.items) parsed.items = []
            return parsed
        }
        catch {
            return { items: [] }
        }
    }

    function save (state){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }

    function loadShipping(){
        try {
            const m = localStorage.getItem(SHIPPING_KEY)
            return m && (m in SHIPPING_PRICES) ? m : 'economico'
        } catch { return 'economico' }
    }

    function saveShipping(method){
        if (!(method in SHIPPING_PRICES)) return
        localStorage.setItem(SHIPPING_KEY, method)
    }

    function toNumber (v){
        if (typeof v === 'number') return v
        if (typeof v === 'string') return parseFloat(v.replace(',', '.')) || 0
        return 0;
    }

    function formatBRL (n){
        try {
            return (new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            })).format(n)
        }
        catch {
            return (Math.round(n*100)/100).toFixed(2).replace('.', ',')
        }
    }

    function itemsSubtotal (state){
        return state.items.reduce((sum, it) => sum + toNumber(it.price) * it.qty, 0)
    }

    function shippingValue(method){
        return SHIPPING_PRICES[method] || 0
    }

    function cartTotal(state, method){
        return itemsSubtotal(state) + shippingValue(method)
    }

    function findIndex (items, id){
        return items.findIndex(it => String(it.id) === String(id));
    }

    function addItem (product){
        const state = load()
        const idx = findIndex(state.items, product.id)

        if (idx >= 0){
            state.items[idx].qty += product.qty || 1

        } else {
            state.items.push({
                id: String(product.id),
                name: product.name || 'Produto',
                price: toNumber(product.price),
                imageId: product.imageId || null,
                qty: product.qty || 1
          })
        }

        save(state)
        render()
    }

    function inc (id){
        const s = load()
        const i = findIndex(s.items, id)

        if (i>=0){
            s.items[i].qty++;
            save(s)
            render()
        }
    }

    function dec (id){
        const s = load()
        const i = findIndex(s.items, id)

        if (i>=0){
            s.items[i].qty = Math.max(1, s.items[i].qty-1)
            save(s)
            render()
        }
    }

    function remove (id){
        const s = load()
        const i = findIndex(s.items, id)

        if (i>=0){
            s.items.splice(i,1)
            save(s)
            render()
        }
    }

    function ensureShippingControls(){
        // Sync select with saved method and attach change handler once
        const sel = document.getElementById('cart-shipping')
        if (!sel) return

        const current = loadShipping()
        if (sel.value !== current) sel.value = current

        if (!sel.dataset.bound){
            sel.addEventListener('change', function(){
                const method = sel.value
                saveShipping(method)
                render()
            })
            sel.dataset.bound = '1'
        }
    }

    function renderItem (it){
        const imgSrc = it.imageId ? `/images/${encodeURIComponent(it.imageId)}` : '/img/logo.png'
        const line = toNumber(it.price) * it.qty

        return `
            <div class="cart-item" data-id="${String(it.id).replace(/"/g,'&quot;')}">
            <img src="${imgSrc}" alt="${String(it.name).replace(/</g,'&lt;').replace(/>/g,'&gt;')}">
            <div class="ci-info">
              <div class="ci-name">${String(it.name).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
              <div class="ci-price">R$ ${formatBRL(line)}</div>
              <div class="ci-unit">Unit.: R$ ${formatBRL(toNumber(it.price))}</div>
            </div>
            <div class="ci-actions">
              <button class="ci-btn" data-action="dec" aria-label="Diminuir">-</button>
              <span class="ci-qty">${it.qty}</span>
              <button class="ci-btn" data-action="inc" aria-label="Aumentar">+</button>
              <button class="ci-remove" data-action="remove" aria-label="Remover">&times;</button>
            </div>
            </div>
            `
    }

    function render (){
        const body = document.getElementById('cart-body')
        const sub = document.getElementById('cart-subtotal')

        if (!body || !sub) return

        const state = load()
        const method = loadShipping()

        if (!state.items.length){
            body.innerHTML = '<p>Seu carrinho está vazio.</p>'
            sub.textContent = '0,00';
            // still sync select visual state
            ensureShippingControls()
            return
        }

        body.innerHTML = state.items.map(renderItem).join('')
        sub.textContent = formatBRL(cartTotal(state, method))
        ensureShippingControls()
    }

    function attach (){
        const body = document.getElementById('cart-body')

        if (!body) return

        body.addEventListener('click', function(e) {
            const btn = e.target.closest('[data-action]')
            if (!btn) return

            const action = btn.getAttribute('data-action')
            const row = btn.closest('.cart-item')
            if (!row) return

            const id = row.getAttribute('data-id')

            if (action === 'inc') inc(id)
            else if (action === 'dec') dec(id)
            else if (action === 'remove') remove(id);
        })
    }

    function init (){
        // initialize shipping controls if present
        ensureShippingControls()
        render()
        attach()
    }

    window.Cart = {
        addItem,
        inc,
        dec,
        remove,
        init,
        render
    }
})()
