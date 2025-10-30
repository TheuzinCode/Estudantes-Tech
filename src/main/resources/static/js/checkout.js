const botaoFinalizar = document.getElementById('botaoFinalizarCompra')


function verificarLogado(botaoFinalizar) {
    const auth = JSON.parse(localStorage.getItem('clientAuth'))

    if (!auth || auth.logged !== true || !auth.clientId) {
               event.preventDefault();
               window.alert("você precisar estar logado para finalizar a compra")
               window.location.href = '/entrar'
    }

}

if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", verificarLogado);
}




