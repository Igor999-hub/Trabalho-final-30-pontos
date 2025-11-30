// PROTEÇÃO: Verifica se é admin antes de carregar qualquer coisa
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
if (!usuarioLogado || !usuarioLogado.admin) {
    alert('Acesso negado! Apenas administradores podem acessar esta página.');
    window.location.href = 'index.html';
}

const API_URL = 'http://localhost:3000/games';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    form.addEventListener('submit', cadastrarJogo);
});

async function cadastrarJogo(event) {
    event.preventDefault(); 

    const novoJogo = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        longDescription: document.getElementById('longDescription').value,
        image: document.getElementById('image').value,
        releaseYear: parseInt(document.getElementById('releaseYear').value),
        developer: document.getElementById('developer').value,
        genre: document.getElementById('genre').value,
        emDestaque: document.getElementById('emDestaque').checked,
        gallery: [] 
    };

    if (!novoJogo.title || !novoJogo.description || !novoJogo.image) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoJogo)
        });

        if (!response.ok) throw new Error('Erro ao cadastrar.');

        alert('Jogo cadastrado com sucesso!');
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Falha no cadastro:', error);
        alert('Falha no cadastro: ' + error.message);
    }
}