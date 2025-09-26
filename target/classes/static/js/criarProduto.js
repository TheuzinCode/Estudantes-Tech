
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

// Função para pré-visualizar a imagem selecionada antes do upload
document.getElementById('imageFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview-img');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});