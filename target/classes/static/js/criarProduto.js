
// Função que verifica o length do nome/descrição do produto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form')

    if (form) {
        form.addEventListener('submit', function(e) {
            const nome = document.getElementById('nome').value
            const descricao = document.getElementById('descricao').value
            const avaliacao = document.getElementById('avaliacao').value

            const regexAvaliacao = /^(?:[0-4](?:\.5)?|5)$/

            if (nome.length > 200) {
                alert('O nome do produto não pode ter mais de 5 caracteres.')
                e.preventDefault()
            }

            if (descricao.length > 2000) {
                alert('A descrição do produto não pode ter mais de 5 caracteres.')
                e.preventDefault()
            }

            if (!regexAvaliacao.test(avaliacao)) {
                alert('A avaliação do produto deve ser um número entre 0 e 5, podendo ter uma casa decimal (ex: 4.5).')
                e.preventDefault()
            }
        })
    }
})