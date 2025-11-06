document.addEventListener('DOMContentLoaded', function () {
    const auth = JSON.parse(localStorage.getItem('clientAuth'))

    if (!auth || auth.logged !== true || !auth.clientId) {
        window.location.href = '/entrar'
        return
    }

    // Helper: valida nome com 2 palavras e >= 3 letras em cada
    function isValidClientName(name){
        const clean = (name || '').trim().replace(/\s+/g, ' ')
        if (!clean) return false
        const words = clean.split(' ')
        if (words.length < 2) return false
        const letterRegex = /[A-Za-zÀ-ÖØ-öø-ÿ]/g
        return words.every(w => ((w.match(letterRegex) || []).length) >= 3)
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

    // Endereços
    const addressList = document.getElementById('address-list')
    const addressForm = document.getElementById('addressForm')
    const addrCep = document.getElementById('addr-cep')
    const addrStreet = document.getElementById('addr-street')
    const addrNeighborhood = document.getElementById('addr-neighborhood')
    const addrCity = document.getElementById('addr-city')
    const addrState = document.getElementById('addr-state')
    const addrNumber = document.getElementById('addr-number')
    const addrComplement = document.getElementById('addr-complement')

    //FORMATAR CEP
    function digitsOnly(v){
        return (v || '').replace(/\D+/g, '')
    }

    //FORMATAR CEP
    function maskCep(v){
        const d = digitsOnly(v).slice(0,8)
        const p1 = d.slice(0,5)
        const p2 = d.slice(5,8)
        return p2 ? `${p1}-${p2}` : p1
    }

    //PUXAR ENDERECO
    async function fetchAndFillAddress(rawCep){
        const cepDigits = digitsOnly(rawCep)

        if (cepDigits.length !== 8) return

        const resp = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
        const data = await resp.json()

        if (addrStreet) addrStreet.value = data.logradouro || ''
        if (addrNeighborhood) addrNeighborhood.value = data.bairro || ''
        if (addrCity) addrCity.value = data.localidade || ''
        if (addrState) addrState.value = data.uf || ''
    }

    if (addrCep) {
        addrCep.addEventListener('input', function(){
            const masked = maskCep(addrCep.value)
            addrCep.value = masked

            if (digitsOnly(masked).length === 8) {
                fetchAndFillAddress(masked)

            } else {
                if (addrStreet) addrStreet.value = ''
                if (addrNeighborhood) addrNeighborhood.value = ''
                if (addrCity) addrCity.value = ''
                if (addrState) addrState.value = ''
            }
        })

        addrCep.addEventListener('blur', function(){
            fetchAndFillAddress(addrCep.value)
        })
    }

    function renderAddressItem(a){
        const safe = (v) => (v || '').toString()

        // usa radio para selecionar endereço padrão; name igual garante apenas um selecionado
        return `
        <div class="address-item ${a.isDefault ? 'default' : ''}" data-id="${a.adressId}">
            <div class="address-radio">
                <input type="radio" name="defaultAddress" value="${a.adressId}" id="addr-radio-${a.adressId}" ${a.isDefault ? 'checked' : ''}>
                <label for="addr-radio-${a.adressId}">Padrão</label>
            </div>
            <div class="address-content">
                <div><strong>${safe(a.street)}${a.number ? ', ' + safe(a.number) : ''}</strong></div>
                <div>${safe(a.neighborhood)}${a.neighborhood ? ' - ' : ''}${safe(a.city)}${a.state ? '/' + safe(a.state) : ''}</div>
                <div>${safe(a.cep)}${a.complement ? ' • ' + safe(a.complement) : ''}</div>
            </div>
        </div>`
    }


    // <!-- DIV PARA ADICIONAR ENDERECO -->
    async function loadAddresses(){
        if (!addressList) return

        try {
            const resp = await fetch(`/api/clients/${auth.clientId}/addresses`)
            if (!resp.ok) { addressList.innerHTML = '<p>Não foi possível carregar endereços.</p>'; return }
            const list = await resp.json()
            if (!Array.isArray(list) || list.length === 0) {
                addressList.innerHTML = '<p>Nenhum endereço cadastrado.</p>'
            } else {
                addressList.innerHTML = list.map(renderAddressItem).join('')
            }

        } catch (e) {
            addressList.innerHTML = '<p>Falha ao carregar endereços.</p>'
        }
    }

    // listener delegação para mudanças nos radios de padrao
    if (addressList) {
        let isSettingDefault = false
        addressList.addEventListener('change', async function(ev){
            const target = ev.target
            if (!target) return
            if (target.name === 'defaultAddress') {
                if (isSettingDefault) {
                    // impede múltiplas requisições concorrentes; mantém seleção anterior
                    target.checked = false
                    return
                }
                isSettingDefault = true

                // desabilita todos os radios ate concluir
                const allRadios = addressList.querySelectorAll('input[name="defaultAddress"]')
                allRadios.forEach(r => r.disabled = true)

                const selectedId = target.value

                // guarda o anterior para possível rollback
                const prevDefault = addressList.querySelector('.address-item.default')
                const prevId = prevDefault ? prevDefault.getAttribute('data-id') : null

                try {
                    const resp = await fetch(`/api/clients/${auth.clientId}/addresses/${selectedId}/default`, {
                        method: 'PUT'
                    })

                    if (!resp.ok) {
                        alert('Não foi possível definir endereço padrão.')
                        // rollback: voltar o radio anterior
                        if (prevId && prevId !== selectedId) {
                            const prevRadio = addressList.querySelector(`input[name="defaultAddress"][value="${prevId}"]`)

                            if (prevRadio) prevRadio.checked = true
                        }
                        return
                    }

                    // sucesso - ajusta o destaque visual localmente, sem recarregar lista
                    addressList.querySelectorAll('.address-item.default').forEach(el => el.classList.remove('default'))
                    const selectedItem = target.closest('.address-item')
                    if (selectedItem) selectedItem.classList.add('default')

                } catch (e) {
                    alert('Erro de conexão ao definir endereço padrão.')

                    // rollback: voltar o radio anterior
                    if (prevId && prevId !== selectedId) {
                        const prevRadio = addressList.querySelector(`input[name="defaultAddress"][value="${prevId}"]`)
                        if (prevRadio) prevRadio.checked = true
                    }

                } finally {
                    // reabilita os rádios e libera o lock
                    allRadios.forEach(r => r.disabled = false)
                    isSettingDefault = false
                }
            }
        })
    }

    if (addressForm) {
        addressForm.addEventListener('submit', async function(e){
            e.preventDefault()
            const cep = (addrCep?.value || '').trim()
            const number = (addrNumber?.value || '').trim()

            if (digitsOnly(cep).length !== 8) { alert('Informe um CEP válido (8 dígitos).'); return }
            if (!number) { alert('Informe o número do endereço.') ; return }

            const payload = {
                cep,
                street: (addrStreet?.value || '').trim(),
                number,
                complement: (addrComplement?.value || '').trim(),
                neighborhood: (addrNeighborhood?.value || '').trim(),
                city: (addrCity?.value || '').trim(),
                state: (addrState?.value || '').trim()
            }

            try {
                const resp = await fetch(`/api/clients/${auth.clientId}/addresses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })

                if (!resp.ok) {
                    alert('Não foi possível adicionar o endereço.'); return
                }

                // limpar e recarregar
                if (addrCep) addrCep.value = ''
                if (addrStreet) addrStreet.value = ''
                if (addrNeighborhood) addrNeighborhood.value = ''
                if (addrCity) addrCity.value = ''
                if (addrState) addrState.value = ''
                if (addrNumber) addrNumber.value = ''
                if (addrComplement) addrComplement.value = ''

                await loadAddresses()
                alert('Endereço adicionado com sucesso!')

            } catch (e) { alert('Erro de conexão ao adicionar endereço.') }
        })
    }

    loadProfile()
    loadAddresses()

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const payload = {}
        const name = (inputName.value || '').trim()
        const birthDate = (inputBirth.value || '').trim() // yyyy-MM-dd
        const gender = (selectGender.value || '').trim()
        const password = (inputPassword.value || '').trim()

        if (name) {
            if (!isValidClientName(name)) {
                alert('O nome deve ter pelo menos duas palavras, com no mínimo 3 letras em cada uma.')
                return
            }
            payload.name = name
        }
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
