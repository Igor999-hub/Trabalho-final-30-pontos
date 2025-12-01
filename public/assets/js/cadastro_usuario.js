const API_URL_USERS = 'http://localhost:3000/usuarios';

document.getElementById('form-cadastro-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoUsuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        login: document.getElementById('login').value,
        senha: document.getElementById('senha').value,
        admin: false // Todo cadastro novo é usuário comum por segurança
    };

    try {
        // Verifica se o login já existe (opcional, mas recomendado)
        const check = await fetch(API_URL_USERS);
        const users = await check.json();
        const existe = users.find(u => u.login === novoUsuario.login);

        if (existe) {
            alert('Este login já está em uso. Escolha outro.');
            return;
        }

        // Salva o novo usuário
        const response = await fetch(API_URL_USERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            alert('Conta criada com sucesso! Faça login agora.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao criar conta.');
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro no servidor.');
    }
});