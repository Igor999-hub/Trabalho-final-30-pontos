const API_URL_USERS = 'http://localhost:3000/usuarios';

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginInput = document.getElementById('login').value;
    const senhaInput = document.getElementById('senha').value;
    const msgError = document.getElementById('msgError');

    try {
        const response = await fetch(API_URL_USERS);
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(u => u.login === loginInput && u.senha === senhaInput);

        if (usuarioEncontrado) {
            // Salva o usuário na sessão
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
            window.location.href = 'index.html';
        } else {
            msgError.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro no servidor.');
    }
});