function toggleStatus(button) {
    const id = button.getAttribute("data-id")

    // Pega os dados atuais do produto
    fetch(`/api/products/${id}`)
        .then(resp => resp.json())
        .then(produto => {

            // Inverte o campo active
            produto.active = !produto.active

            // Envia o update usando sua rota existente
            return fetch(`/api/products/atualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
                }
            ).then(() => {

                // Atualiza o texto do botão na tela
                button.innerText = produto.active ? "✅ Ativo" : "❌ Inativo"

                button.setAttribute("data-active", produto.active)})
                    .then(() => {
                        location.reload(); // 🔄 recarrega a página depois do PUT
                    })
        })

    .catch(err => console.error(err))
}