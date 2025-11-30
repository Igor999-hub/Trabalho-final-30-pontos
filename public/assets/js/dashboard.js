const API_URL = 'http://localhost:3000/games';

document.addEventListener('DOMContentLoaded', () => {
    configurarMenu(); // Adicionado para gerenciar o menu
    fetchGames();
});

// Função para configurar o menu (Igual ao app.js)
function configurarMenu() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const menuPrincipal = document.getElementById('menu-principal');
    const usuarioInfo = document.getElementById('usuario-info');
    const loginArea = document.getElementById('login-area');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (usuarioLogado) {
        loginArea.classList.add('d-none');
        usuarioInfo.classList.remove('d-none');
        nomeUsuario.textContent = `Olá, ${usuarioLogado.nome}`;

        if (usuarioLogado.admin === true) {
            const liCadastro = document.createElement('li');
            liCadastro.className = 'nav-item';
            liCadastro.innerHTML = '<a class="nav-link" href="cadastro_jogo.html">Cadastrar Jogo</a>';
            menuPrincipal.appendChild(liCadastro);
        }

        document.getElementById('btn-logout').addEventListener('click', () => {
            sessionStorage.removeItem('usuarioLogado');
            window.location.reload();
        });
    }
}

async function fetchGames() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha API');
        const games = await response.json();
        
        const genreData = processGenreData(games);
        createGenreChart(genreData.labels, genreData.data);
        
        const yearData = processYearData(games);
        createYearChart(yearData.labels, yearData.data);
    } catch (error) {
        console.error(error);
    }
}

function processGenreData(games) {
    const genreCounts = {};
    games.forEach(game => {
        const genre = game.genre || 'Outro';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    return { labels: Object.keys(genreCounts), data: Object.values(genreCounts) };
}

function processYearData(games) {
    const sortedGames = games.sort((a, b) => a.releaseYear - b.releaseYear);
    return {
        labels: sortedGames.map(game => game.title),
        data: sortedGames.map(game => game.releaseYear)
    };
}

function createGenreChart(labels, data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jogos por Gênero',
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
            }]
        }
    });
}

function createYearChart(labels, data) {
    const ctx = document.getElementById('yearChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ano de Lançamento',
                data: data,
                backgroundColor: '#36a2eb'
            }]
        },
        options: { indexAxis: 'y', scales: { x: { min: Math.min(...data) - 5 } } }
    });
}