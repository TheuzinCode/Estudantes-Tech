document.addEventListener('DOMContentLoaded', function() {
  const mainImg = document.getElementById('produto-main-img');
  const thumbs = Array.from(document.querySelectorAll('.thumbs .thumb'));

  function setActiveThumbById(imageId) {
    thumbs.forEach(t => t.classList.toggle('active', t.getAttribute('data-image-id') === String(imageId)));
  }

  if (mainImg) {
    const currentId = mainImg.getAttribute('data-image-id');
    if (currentId) setActiveThumbById(currentId);
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const id = thumb.getAttribute('data-image-id');
      if (!id || !mainImg) return;
      const newSrc = `/images/${encodeURIComponent(id)}`;
      mainImg.src = newSrc;
      mainImg.setAttribute('data-image-id', id);
      setActiveThumbById(id);
    });
  });

  // Drawer do carrinho (mesma experiência da loja)
  const btnOpen = document.getElementById('open-cart');
  const sidebar = document.getElementById('cart-sidebar');
  const backdrop = document.getElementById('cart-backdrop');
  const btnClose = document.getElementById('cart-close');

  if (btnOpen && sidebar && backdrop && btnClose) {
    function openCart() {
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-open');
      sidebar.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cart-open');
      btnClose.focus({ preventScroll: true });
    }
    function closeCart() {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      sidebar.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cart-open');
      btnOpen.focus({ preventScroll: true });
    }
    btnOpen.addEventListener('click', openCart);
    btnClose.addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeCart(); });
  }

  // Inicializa render do carrinho
  if (window.Cart && typeof window.Cart.init === 'function') {
    window.Cart.init();
  }

  // Botão Comprar nesta página
  const buyBtn = document.getElementById('product-buy');
  if (buyBtn) {
    buyBtn.addEventListener('click', function(){
      const id = buyBtn.getAttribute('data-id');
      const name = buyBtn.getAttribute('data-name');
      const price = buyBtn.getAttribute('data-price');
      const imageId = buyBtn.getAttribute('data-imageid');
      if (window.Cart) {
        window.Cart.addItem({ id, name, price, imageId, qty: 1 });
        // abre o carrinho
        const btnOpen = document.getElementById('open-cart');
        const sidebar = document.getElementById('cart-sidebar');
        const backdrop = document.getElementById('cart-backdrop');
        const btnClose = document.getElementById('cart-close');
        if (sidebar && backdrop && btnClose) {
          sidebar.classList.add('is-open');
          backdrop.classList.add('is-open');
          sidebar.setAttribute('aria-hidden', 'false');
          backdrop.setAttribute('aria-hidden', 'false');
          document.body.classList.add('cart-open');
          btnClose.focus({ preventScroll: true });
        }
      }
    });
  }
});
