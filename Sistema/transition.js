document.addEventListener('DOMContentLoaded', () => {
    var formSignin = document.querySelector('#signin');
    var formSignup = document.querySelector('#signup');
    var btnColor = document.querySelector('.btnColor');
    var signinError = document.querySelector('#signinError');
    var signupError = document.querySelector('#signupError');

    signinError.style.color = 'red';
    signupError.style.color = 'red';

    document.querySelector('#btnSignin').addEventListener('click', () => {
        formSignin.style.left = "30px";
        formSignup.style.left = "400px";
        btnColor.style.left = "-1px";
        signinError.innerHTML = ''; 
    });

    document.querySelector('#btnSignup').addEventListener('click', () => {
        formSignup.style.left = "20px";
        formSignin.style.left = "-400px";
        btnColor.style.left = "110px";
        signupError.innerHTML = ''; 
    });

    // Processar o formulário de login
    document.querySelector('#signin').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => formObject[key] = value);

        signinError.innerHTML = 'Processando...';
        signinError.style.display = 'block';
        signinError.style.color = 'black';

        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Erro na resposta do servidor.');
                });
            }
        })
        .then(data => {
            if (data.success) {
                signinError.innerHTML = 'Login bem-sucedido!';
                signinError.style.color = 'green';
                window.location.href = data.redirectUrl; 
            } else {
                signinError.innerHTML = data.message || 'Erro desconhecido.';
                signinError.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            signinError.innerHTML = error.message || 'Erro ao realizar login.';
            signinError.style.color = 'red';
        });
    });
    
    // Processar o formulário de registro
    document.querySelector('#signup').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => formObject[key] = value);

        signupError.innerHTML = 'Processando...';
        signupError.style.display = 'block';
        signupError.style.color = 'black';

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Erro na resposta do servidor.');
                });
            }
        })
        .then(data => {
            if (data.success) {
                signupError.innerHTML = 'Usuário registrado com sucesso!';
                signupError.style.color = 'green';
                formSignup.reset();
            } else {
                signupError.innerHTML = data.message || 'Erro desconhecido.';
                signupError.style.color = 'red';
            }
        })
    });
});
