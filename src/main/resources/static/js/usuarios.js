    function validarCPF(cpf) {
        return /^\d{11}$/.test(cpf);
    }

    function validarSenhasEdicao(form) {
        let senha1 = form.querySelector('input[name="password"]').value;
        let senha2 = form.querySelector('input[name="passwordConfirm"]').value;
        if (senha1 !== senha2) {
            alert('As senhas não coincidem!');
            return false;
        }
        let cpf = form.querySelector('input[name="cpf"]').value;
        if (!validarCPF(cpf)) {
            alert('O CPF deve conter exatamente 11 dígitos numéricos!');
            return false;
        }
        return true;
    }

    function validarCPFeSenhas() {
        let senha1 = document.getElementById('senha1').value;
        let senha2 = document.getElementById('senha2').value;
        if (senha1 !== senha2) {
            alert('As senhas não coincidem!');
            return false;
        }
        let cpf = document.querySelector('#formCriarUsuario input[name="cpf"]').value;
        if (!validarCPF(cpf)) {
            alert('O CPF deve conter exatamente 11 dígitos numéricos!');
            return false;
        }
        return true;
    }