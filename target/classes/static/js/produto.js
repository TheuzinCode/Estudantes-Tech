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