(function(){
    const STORAGE_KEY = 'cart_v1'

    function load (){
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [] }
        }
        catch {
            return {
                items: []
            }
        }
    }

    function save (state){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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

    function subtotal (state){
        return state.items.reduce((sum, it) => sum + toNumber(it.price) * it.qty, 0)
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

        if (!state.items.length){
            body.innerHTML = '<p>Seu carrinho está vazio.</p>'
            sub.textContent = '0,00';
            return
        }

        body.innerHTML = state.items.map(renderItem).join('')
        sub.textContent = formatBRL(subtotal(state))
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
