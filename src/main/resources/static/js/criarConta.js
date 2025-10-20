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

        if (numberInput) numberInput.value = ''
        if (complementInput) complementInput.value = ''
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
})
