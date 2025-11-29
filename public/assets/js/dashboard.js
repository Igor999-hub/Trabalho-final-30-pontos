// Define a URL base da nossa API (porta 3000)
const API_URL = 'http://localhost:3000/games';

document.addEventListener('DOMContentLoaded', () => {
    fetchGames();
});

// 1. Função principal para buscar dados
async function fetchGames() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha ao buscar dados da API');
        const games = await response.json();
        
        // 2. Processar e criar os gráficos
        const genreData = processGenreData(games);
        createGenreChart(genreData.labels, genreData.data);
        
        const yearData = processYearData(games);
        createYearChart(yearData.labels, yearData.data);

    } catch (error) {
        console.error('Erro ao carregar o dashboard:', error);
    }
}

// 3. Processa dados para o gráfico de Gênero (Pizza)
function processGenreData(games) {
    const genreCounts = {};

    // Conta a ocorrência de cada gênero
    games.forEach(game => {
        const genre = game.genre || 'Não categorizado';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    return {
        labels: Object.keys(genreCounts), // Ex: ["Plataforma 3D", "RPG", "Luta"]
        data: Object.values(genreCounts)  // Ex: [2, 1, 1]
    };
}

// 4. Processa dados para o gráfico de Ano (Barras)
function processYearData(games) {
    // Ordena os jogos por ano para o gráfico ficar mais bonito
    const sortedGames = games.sort((a, b) => a.releaseYear - b.releaseYear);

    return {
        labels: sortedGames.map(game => game.title),       // Nomes dos jogos
        data: sortedGames.map(game => game.releaseYear)  // Anos de lançamento
    };
}

// 5. Cria o Gráfico de Pizza (Gênero)
function createGenreChart(labels, data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jogos por Gênero',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                hoverOffset: 4
            }]
        }
    });
}

// 6. Cria o Gráfico de Barras (Ano)
function createYearChart(labels, data) {
    const ctx = document.getElementById('yearChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ano de Lançamento',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Faz o gráfico ser de barras horizontais
            scales: {
                x: {
                    // Começa a contagem do ano mais antigo - 10
                    min: Math.min(...data) - 10 
                }
            }
        }
    });
}