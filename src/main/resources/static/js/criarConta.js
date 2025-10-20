document.addEventListener('DOMContentLoaded', function(){
    const birthInput = document.getElementById('birthDate')
    if (!birthInput) return

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

    const form = document.getElementById('loginForm')

    if (form) {
        form.addEventListener('submit', function(e){
            e.preventDefault()
            birthInput.reportValidity()
        })
    }
})
