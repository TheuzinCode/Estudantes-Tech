document.addEventListener('DOMContentLoaded', function () {
    let auth = null

    auth = JSON.parse(localStorage.getItem('clientAuth'))

    if (!auth || auth.logged !== true) {
        window.location.href = '/entrar'
        return
    }

    // Proximas funções para puxar dados do perfil
})

