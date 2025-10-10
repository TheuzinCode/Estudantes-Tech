function openVisualizarModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.name
    document.getElementById('modal-produto-desc').textContent = produto.description
    document.getElementById('modal-produto-preco').textContent = produto.price
    document.getElementById('modal-produto-quantidade').textContent = produto.quantity
    document.getElementById('modal-produto-status').textContent = produto.active ? 'Ativo' : 'Inativo'

    setCarouselImages(produto.imageIds)

    document.getElementById('modal-visualizar').style.display = 'flex'
}

function closeVisualizarModal() {
    document.getElementById('modal-visualizar').style.display = 'none';
}

document.getElementById('close-modal-visualizar').onclick = closeVisualizarModal
document.getElementById('btn-fechar-modal').onclick = closeVisualizarModal

window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-visualizar').forEach(function(btn) {
        btn.onclick = async function() {
            const tr = btn.closest('tr')
            const productId = tr.getAttribute('data-productid')
            let imageIds = []
            const imageIdsAttr = tr.getAttribute('data-imageids')

            if (imageIdsAttr) {
                imageIds = imageIdsAttr.split(',').map(s => s.trim()).filter(Boolean)
            }

            if ((!imageIds || imageIds.length === 0) && productId) {
                try {
                    const resp = await fetch(`/api/products/${productId}/images/ids`)
                    if (resp.ok) {
                        imageIds = await resp.json()
                    }

                } catch (e) {
                    console.error('Erro ao buscar imagens via API', e)
                }
            }

            const produto = {
                name: tr.children[1].textContent,
                quantity: tr.children[2].textContent,
                price: tr.children[3].textContent,
                active: tr.children[4].textContent.trim() === 'true',
                description: tr.getAttribute('data-description') || '',
                imageIds: imageIds
            }

            openVisualizarModal(produto)
        }
    })

    let carouselIndex = 0
    let carouselImageIds = []
    const modalImg = document.getElementById('modal-produto-img')
    const btnPrev = document.getElementById('carousel-prev')
    const btnNext = document.getElementById('carousel-next')

    window.setCarouselImages = function(imageIds) {
        carouselImageIds = Array.isArray(imageIds) ? imageIds : []
        carouselIndex = 0
        updateCarouselImage()
    }

    function currentImageUrl() {
        if (carouselImageIds.length === 0) return '';
        const id = encodeURIComponent(String(carouselImageIds[carouselIndex]).trim());
        return '/images/' + id;
    }

    function updateCarouselImage() {
        if (carouselImageIds.length > 0) {
            const url = currentImageUrl()
            modalImg.src = url
            modalImg.style.display = 'block'

            if (btnPrev) btnPrev.style.visibility = carouselImageIds.length > 1 ? 'visible' : 'hidden'
            if (btnNext) btnNext.style.visibility = carouselImageIds.length > 1 ? 'visible' : 'hidden'

        } else {
            modalImg.removeAttribute('src')
            modalImg.style.display = 'none'

            if (btnPrev) btnPrev.style.visibility = 'hidden'
            if (btnNext) btnNext.style.visibility = 'hidden'
        }
    }

    if (btnPrev && btnNext) {
        btnPrev.onclick = function() {
            if (carouselImageIds.length > 0) {
                carouselIndex = (carouselIndex - 1 + carouselImageIds.length) % carouselImageIds.length
                updateCarouselImage()
            }
        }

        btnNext.onclick = function() {
            if (carouselImageIds.length > 0) {
                carouselIndex = (carouselIndex + 1) % carouselImageIds.length
                updateCarouselImage()
            }
        }
    }

    // Exponha para o modal
    window.openVisualizarModal = function(produto) {
        document.getElementById('modal-produto-nome').textContent = produto.name
        document.getElementById('modal-produto-desc').textContent = produto.description
        document.getElementById('modal-produto-preco').textContent = produto.price
        document.getElementById('modal-produto-quantidade').textContent = produto.quantity
        document.getElementById('modal-produto-status').textContent = produto.active ? 'Ativo' : 'Inativo'
        setCarouselImages(produto.imageIds)
        document.getElementById('modal-visualizar').style.display = 'flex'
    }
})