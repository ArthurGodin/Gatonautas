// Arquivo: js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const authMessage = document.getElementById('authMessage');

    // URL base do seu backend no Render
    const BASE_API_URL = 'https://gatonautas-backend.onrender.com';

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
                showMessage('Sua senha espacial precisa ter pelo menos 8 caracteres!', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('As senhas não conferem, recruta! Tente novamente.', 'error');
                return;
            }

            showMessage('Registrando suas coordenadas... Aguarde!', 'info');
            try {
                const response = await fetch(`${BASE_API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Falha na comunicação com a nave-mãe.');
                }
                showMessage(data.message || 'Cadastro realizado com sucesso! Bem-vindo à frota!', 'success');
                registerForm.reset();
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            } catch (err) {
                showMessage(err.message || 'Erro desconhecido no registro.', 'error');
            }
        });
    }

    if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const identifier = loginForm.identifier.value.trim();
        const password = loginForm.password.value;
        const isAdminLogin = loginForm.isAdminLogin.checked;

        // ... (validações iniciais) ...
        
        let loginUrl = '';
        let requestBody = {};

        if (isAdminLogin) {
            loginUrl = `${BASE_API_URL}/login`;
            requestBody = { username: identifier, password };
            
            // ---- NOVO: Logs para Depuração ----
            console.log('--- TENTATIVA DE LOGIN ADMIN ---');
            console.log('URL de Destino:', loginUrl);
            console.log('Identificador (username) Enviado:', identifier);
            console.log('Senha Enviada:', password); // Cuidado ao logar senhas, remova após depurar
            console.log('Corpo da Requisição (requestBody):', JSON.stringify(requestBody));
            // ---- FIM DOS NOVOS Logs ----

        } else {
            loginUrl = `${BASE_API_URL}/auth/login`;
            requestBody = { email: identifier, password };
            // ---- NOVO: Logs para Depuração (Usuário Normal) ----
            console.log('--- TENTATIVA DE LOGIN USUÁRIO NORMAL ---');
            console.log('URL de Destino:', loginUrl);
            console.log('Identificador (email) Enviado:', identifier);
            console.log('Corpo da Requisição (requestBody):', JSON.stringify(requestBody));
            // ---- FIM DOS NOVOS Logs ----
        }

        showMessage('Verificando credenciais... Aguarde!', 'info');

            try {
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
                const data = await response.json();

                if (!response.ok) {
                     throw new Error(data.error || data.message || 'Credenciais inválidas ou falha na conexão.');
                }
                
                loginForm.reset();
                
                if (isAdminLogin && data.token) {
                    localStorage.setItem('token', data.token); // Salva o token de ADMIN
                    showMessage(data.message || 'Login de Administrador bem-sucedido! Redirecionando...', 'success');
                    setTimeout(() => { window.location.href = 'admin.html'; }, 1500);
                } else if (!isAdminLogin) {
                    showMessage(data.message || 'Login bem-sucedido! Redirecionando...', 'success');
                    setTimeout(() => { window.location.href = 'index2.html'; }, 1500);
                } else {
                    throw new Error(isAdminLogin ? 'Token de administrador não recebido.' : 'Resposta inesperada do servidor.');
                }

            } catch (err) {
                showMessage(err.message || 'Erro desconhecido durante o login.', 'error');
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
            authMessage.className = 'form-message'; // Reseta classes
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