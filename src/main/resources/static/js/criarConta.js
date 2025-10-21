document.addEventListener('DOMContentLoaded', function(){
    const birthInput = document.getElementById('birthDate')
    if (birthInput) {
        function onlyDigits(s){
            return s.replace(/\D+/g, '')
        }

        function formatDateDigits(digits){
            // (DDMMYYYY)
            const v = digits.slice(0, 8)
            const d = v.slice(0, 2)
            const m = v.slice(2, 4)
            const y = v.slice(4, 8)

            let out = ''

            if (d) out += d
            if (m) out += (out ? '/' : '') + m
            if (y) out += (out.length ? '/' : '') + y

            return out
        }

        function applyMask(value){
            const digits = onlyDigits(value)
            return formatDateDigits(digits)
        }

        birthInput.addEventListener('input', function(){
            const masked = applyMask(birthInput.value)
            birthInput.value = masked

            if (document.activeElement === birthInput) {
                const newLen = masked.length
                birthInput.setSelectionRange(newLen, newLen)
            }

            birthInput.setCustomValidity('')
        })
    }

    // viaCEP
    const cepInput = document.getElementById('cep')
    const streetInput = document.getElementById('street')
    const neighborhoodInput = document.getElementById('neighborhood')
    const cityInput = document.getElementById('city')
    const stateInput = document.getElementById('state')
    const numberInput = document.getElementById('number')
    const complementInput = document.getElementById('complement')

    // reforça o readOnly, só o atributo no html não era suficiente
    const addressFields = [streetInput, neighborhoodInput, cityInput, stateInput]
    for (const element of addressFields) {
        if (element) element.readOnly = true
    }

    function digitsOnly(v){ return (v || '').replace(/\D+/g, '') }

    function maskCep(v){
        const d = digitsOnly(v).slice(0, 8)
        const p1 = d.slice(0,5)
        const p2 = d.slice(5,8)
        return p2 ? `${p1}-${p2}` : p1
    }

    function clearAddressFields(){
        if (streetInput) streetInput.value = ''
        if (neighborhoodInput) neighborhoodInput.value = ''
        if (cityInput) cityInput.value = ''
        if (stateInput) stateInput.value = ''
        if (numberInput) numberInput.value = ''
        if (complementInput) complementInput.value = ''
    }

    let lastCepQueried = ''
    let pendingController = null

    async function fetchAndFillAddress(rawCep){
        const cepDigits = digitsOnly(rawCep)

        lastCepQueried = cepDigits

        pendingController = new AbortController()
        const resp = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, { signal: pendingController.signal })
        const data = await resp.json()

        if (streetInput) streetInput.value = data.logradouro || ''
        if (neighborhoodInput) neighborhoodInput.value = data.bairro || ''
        if (cityInput) cityInput.value = data.localidade || ''
        if (stateInput) stateInput.value = data.uf || ''
    }

    if (cepInput) {
        cepInput.addEventListener('input', function(){
            const masked = maskCep(cepInput.value)
            cepInput.value = masked

            // consulta quando completar 8 dígitos
            if (digitsOnly(masked).length === 8) {
                fetchAndFillAddress(masked)

            } else {
                clearAddressFields()
                lastCepQueried = ''
            }
        })

        cepInput.addEventListener('blur', function(){
            fetchAndFillAddress(cepInput.value)
        })
    }
    
    const form = document.getElementById('loginForm')
    if (form) {
        form.addEventListener('submit', async function(e){
            e.preventDefault()

            const name = (document.getElementById('nome')?.value || '').trim()
            const email = (document.getElementById('email')?.value || '').trim()
            const cpf = (document.getElementById('cpf')?.value || '').trim()
            const gender = (document.getElementById('gender')?.value || '').trim()
            const birthDate = (document.getElementById('birthDate')?.value || '').trim() // expects DD/MM/AAAA
            const cep = (document.getElementById('cep')?.value || '').trim()
            const street = (document.getElementById('street')?.value || '').trim()
            const neighborhood = (document.getElementById('neighborhood')?.value || '').trim()
            const city = (document.getElementById('city')?.value || '').trim()
            const state = (document.getElementById('state')?.value || '').trim()
            const number = (document.getElementById('number')?.value || '').trim()
            const complement = (document.getElementById('complement')?.value || '').trim()
            const password = (document.getElementById('password')?.value || '').trim()

            // quick validations
            if (!name || !email || !cpf || !birthDate || !gender || !password) {
                alert('Preencha os campos obrigatórios: nome, email, CPF, data de nascimento, gênero e senha.')
                return
            }
            if (!/.+@.+\..+/.test(email)) {
                alert('Email inválido')
                return
            }
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
                alert('Data de nascimento no formato DD/MM/AAAA')
                return
            }

            const payload = {
                name,
                cpf,
                email,
                birthDate, // dd/MM/yyyy - backend parses via @JsonFormat
                gender,
                password,
                cep,
                street,
                neighborhood,
                city,
                state,
                number,
                complement
            }

            try {
                const resp = await fetch('/api/clients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })

                if (resp.ok || resp.status === 201) {
                    alert('Conta criada com sucesso!')
                    window.location.href = '/entrar'
                } else {
                    const text = await resp.text()
                    alert('Não foi possível criar a conta. Tente novamente.\n' + (text || ''))
                }
            } catch (err) {
                alert('Erro ao conectar com o servidor: ' + (err?.message || err))
            }
        })
    }
})
