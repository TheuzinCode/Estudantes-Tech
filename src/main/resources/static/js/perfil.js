document.addEventListener('DOMContentLoaded', function () {
    const auth = JSON.parse(localStorage.getItem('clientAuth'))

    if (!auth || auth.logged !== true || !auth.clientId) {
        window.location.href = '/entrar'
        return
    }

    const form = document.getElementById('perfilForm')
    const inputId = document.getElementById('clientId')
    const inputName = document.getElementById('name')
    const inputEmail = document.getElementById('email')
    const inputCpf = document.getElementById('cpf')
    const inputBirth = document.getElementById('birthDate')
    const selectGender = document.getElementById('gender')
    const inputPassword = document.getElementById('password')

    inputId.value = auth.clientId

    function toInputDateString(value) {
        // aceita tudo
        if (!value) return ''

        if (typeof value === 'number') {
            const d = new Date(value)
            return d.toISOString().slice(0, 10)
        }

        if (typeof value === 'string') {
            // dd/MM/yyyy
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                const [dd, mm, yyyy] = value.split('/')
                return `${yyyy}-${mm}-${dd}`
            }

            // iso 2024-05-12T00:00:00Z
            const d = new Date(value)
            if (!isNaN(d.getTime())) {
                return d.toISOString().slice(0, 10)
            }
        }

        return ''
    }

    async function loadProfile() {
        const resp = await fetch(`/api/clients/${auth.clientId}`)

        if (!resp.ok) {
            alert('Não foi possível carregar os dados do perfil.')
            return
        }

        const c = await resp.json()

        inputName.value = c.name || ''
        inputEmail.value = c.email || ''
        inputCpf.value = c.cpf || ''
        inputBirth.value = toInputDateString(c.birthDate)
        selectGender.value = c.gender || ''
    }

    loadProfile()

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const payload = {}
        const name = (inputName.value || '').trim()
        const birthDate = (inputBirth.value || '').trim() // yyyy-MM-dd
        const gender = (selectGender.value || '').trim()
        const password = (inputPassword.value || '').trim()

        if (name) payload.name = name
        if (birthDate) payload.birthDate = birthDate
        if (gender) payload.gender = gender
        if (password) payload.password = password

        const resp = await fetch(`/api/clients/${auth.clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!resp.ok) {
            alert('Não foi possível salvar as alterações. Tente novamente.')
            return
        }

        const updated = await resp.json()

        // atualiza o localStorage
        const newAuth = {
            ...auth,
            name: updated.name || auth.name
        }
        localStorage.setItem('clientAuth', JSON.stringify(newAuth))

        // limpa campo de senha
        inputPassword.value = ''

        alert('Perfil atualizado com sucesso!')
    })
})
