// Simple client-side validation for /entrar while client auth is not implemented yet.
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    if (!form) return;

    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');

    function isValidEmail(value) {
        // basic email validation
        return /.+@.+\..+/.test(value);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var email = (emailInput && emailInput.value || '').trim();
        var password = (passwordInput && passwordInput.value || '').trim();

        // Basic checks
        if (!email || !password || !isValidEmail(email)) {
            alert('credenciais erradas');
            return;
        }

        // Since we do not have client users in the DB yet, treat any credentials as invalid for now
        alert('credenciais erradas');
        // Do NOT redirect; keep the user on the same page.
    });
});
