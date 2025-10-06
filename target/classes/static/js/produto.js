async function toggleStatus(button) {
    const id = button.getAttribute("data-id");
    const isActive = button.getAttribute("data-active") === "true";

    const action = isActive ? "inativar" : "ativar";
    if (!window.confirm(`Tem certeza que deseja ${action} este produto?`)) {
        return;
    }

    try {
        const resp = await fetch(`/api/products/${id}`);
        const produto = await resp.json();

        produto.active = !produto.active;

        await fetch(`/api/products/atualizar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        button.innerText = produto.active ? "✅ Ativo" : "❌ Inativo";
        button.setAttribute("data-active", produto.active);
        location.reload();

    } catch (err) {
        console.error(err);
    }
}

// Abre modal popup
function openVisualizarModal(produto) {
    document.getElementById('modal-produto-nome').textContent = produto.name;
    document.getElementById('modal-produto-desc').textContent = produto.description;
    document.getElementById('modal-produto-preco').textContent = produto.price;
    document.getElementById('modal-produto-quantidade').textContent = produto.quantity;
    document.getElementById('modal-produto-status').textContent = produto.active ? 'Ativo' : 'Inativo';

    if(produto.imageId) {
        document.getElementById('modal-produto-img').src = '/images/' + produto.imageId;
        document.getElementById('modal-produto-img').style.display = 'block';
    } else {
        document.getElementById('modal-produto-img').style.display = 'none';
    }

    document.getElementById('modal-visualizar').style.display = 'flex';
}
// Fecha o modal popup
function closeVisualizarModal() {
    document.getElementById('modal-visualizar').style.display = 'none';
}
document.getElementById('close-modal-visualizar').onclick = closeVisualizarModal;
document.getElementById('btn-fechar-modal').onclick = closeVisualizarModal;

window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-visualizar').forEach(function(btn) {
        btn.onclick = function() {
            var tr = btn.closest('tr');
            var produto = {
                name: tr.children[1].textContent,
                quantity: tr.children[2].textContent,
                price: tr.children[3].textContent,
                active: tr.children[4].textContent.trim() === 'true',
                // Para description e imageId, pode ser necessário AJAX se não estiverem na tabela
                description: tr.getAttribute('data-description') || '',
                imageId: tr.getAttribute('data-imageid') || ''
            };
            // Se não tiver description/imageId no tr, pode buscar via AJAX aqui
            openVisualizarModal(produto);
        }
    });
});