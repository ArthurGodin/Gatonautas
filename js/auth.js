// Arquivo: arthurgodin/gatonautas/Gatonautas-a27283571993a547ec9b2d927d77a42b395c57a6/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const authMessage = document.getElementById('authMessage');

    // Defina a URL base do seu backend aqui.
    const BASE_API_URL = 'https://gatonautas-backend.onrender.com'; // CORRIGIDO

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessages();

            const name = registerForm.name.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;

            if (!name || !email || !password || !confirmPassword) {
                showMessage('Por favor, preencha todos os campos da sua ficha de Gatonauta!', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showMessage('Este e-mail parece um pouco... alienígena. Que tal um formato válido?', 'error');
                return;
            }
            if (password.length < 8) {
                showMessage('Sua senha espacial precisa ter pelo menos 8 caracteres para despistar os Krulls!', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('As senhas não conferem, recruta! Tente novamente.', 'error');
                return;
            }

            showMessage('Registrando suas coordenadas na nossa base de dados... Aguarde!', 'info');
            try {
                // A rota no backend para registro de usuário é /auth/register ou /auth/registro
                const response = await fetch(`${BASE_API_URL}/auth/register`, { // Verifique se a rota está correta ('/auth/register' ou '/auth/registro')
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Falha na comunicação com a nave-mãe. Tente novamente.');
                }
                
                showMessage(data.message || 'Cadastro realizado com sucesso! Bem-vindo à frota, Gatonauta!', 'success');
                registerForm.reset();
                // Redirecionar para a página de login após o sucesso do cadastro
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);

            } catch (err) {
                showMessage(err.message, 'error');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessages();

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value;

            if (!email || !password) {
                showMessage('Informe seu e-mail e senha espacial para acessar a nave!', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showMessage('Formato de e-mail inválido, Gatonauta.', 'error');
                return;
            }

            showMessage('Verificando suas credenciais de acesso... Aguarde!', 'info');
            try {
                 // A rota no backend para login de usuário é /auth/login
                const response = await fetch(`${BASE_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                     throw new Error(data.error || data.message || 'Credenciais inválidas ou falha na conexão com a central.');
                }
                
                showMessage(data.message || 'Login bem-sucedido! Redirecionando para o painel de controle...', 'success');
                loginForm.reset();
                
                // Opcional: Se o backend retornar um token para usuários comuns, você pode salvá-lo.
                // if(data.token) { // Supondo que o backend envie um token para usuários
                //     localStorage.setItem('gatonautaUserToken', data.token);
                // }

                // Redirecionar para uma página de perfil ou dashboard após o login
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);


            } catch (err) {
                showMessage(err.message, 'error');
            }
        });
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    function showMessage(message, type) {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = 'form-message'; // Reset classes
            authMessage.classList.add(type); // 'success', 'error', ou 'info'
            authMessage.style.display = 'block'; 
        }
    }
    
    function clearMessages() {
        if (authMessage) {
            authMessage.textContent = '';
            authMessage.style.display = 'none'; 
            authMessage.className = 'form-message'; 
        }
    }
});