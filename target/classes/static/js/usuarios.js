    function validarCPF(cpf) {
        return /^\d{11}$/.test(cpf);
    }

    function validarSenhasEdicao(form) {
        var senha1 = form.querySelector('input[name="password"]').value;
        var senha2 = form.querySelector('input[name="passwordConfirm"]').value;
        if (senha1 !== senha2) {
            alert('As senhas não coincidem!');
            return false;
        }
        var cpf = form.querySelector('input[name="cpf"]').value;
        if (!validarCPF(cpf)) {
            alert('O CPF deve conter exatamente 11 dígitos numéricos!');
            return false;
        }
        return true;
    }

    function validarCPFeSenhas() {
        var senha1 = document.getElementById('senha1').value;
        var senha2 = document.getElementById('senha2').value;
        if (senha1 !== senha2) {
            alert('As senhas não coincidem!');
            return false;
        }
        var cpf = document.querySelector('#formCriarUsuario input[name="cpf"]').value;
        if (!validarCPF(cpf)) {
            alert('O CPF deve conter exatamente 11 dígitos numéricos!');
            return false;
        }
        return true;
    }