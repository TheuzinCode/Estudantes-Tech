document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm')
    if (!form) return

    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')

    async function doLogin(email, password) {
        const resp = await fetch('/api/clients/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })

        if (!resp.ok) {
            alert('Email e/ou Senha incorreto(s).')
            return
        }

        const data = await resp.json()

        // local storage para login de cliente
        localStorage.setItem('clientAuth', JSON.stringify({
            logged: true,
            clientId: data.clientId,
            name: data.name,
            email: data.email
        }))

        // /loja dps de login success
        window.location.href = '/loja'
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const email = (emailInput && emailInput.value || '').trim()
        const password = (passwordInput && passwordInput.value || '').trim()

        doLogin(email, password)
    })
})
