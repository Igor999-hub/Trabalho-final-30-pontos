// Define a URL base da nossa API
const API_URL = 'http://localhost:3000/games';

document.addEventListener('DOMContentLoaded', () => {
    // A função principal agora é buscar os jogos da API
    fetchGames();
});

// Nova função assíncrona para buscar os dados da API
async function fetchGames() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Falha ao buscar dados da API');
        }
        const games = await response.json();
        
        // Somente depois que os dados chegam, renderizamos a página
        renderCarousel(games);
        renderCards(games);

    } catch (error) { 
        // ERRO 1 ESTAVA AQUI: Faltava o '{' e este código:
        console.error('Erro na requisição:', error);
        document.getElementById('cards-container').innerHTML = '<p class="text-center text-danger">Falha ao carregar jogos. Verifique se o servidor `npm start` está rodando.</p>';
    }
}

// Função para renderizar os cards
const renderCards = (games) => {
    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    
    games.forEach(game => {
        const cardHTML = `
            <div class="col">
                <a href="detalhe.html?id=${game.id}">
                    <div class="card h-100 shadow-sm card-com-fundo" style="background-image: url('${game.gallery[0] || game.image}');">
                        <div class="card-body d-flex flex-column justify-content-end">
                            <h5 class="card-title">${game.title}</h5>
                            <p class="card-text">${game.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
    });
};

// Função para renderizar o carrossel
const renderCarousel = (games) => {
    const carouselContainer = document.getElementById('carousel-inner-container');
    if (!carouselContainer) return;
    carouselContainer.innerHTML = '';

    const featuredGames = games.filter(game => game.emDestaque);
    
    // ERRO 2 ESTAVA AQUI: Faltava este bloco 'if'
    if (featuredGames.length === 0) {
        carouselContainer.innerHTML = `
            <div class="carousel-item active">
                <img src="https://via.placeholder.com/1200x500.png?text=Sem+destaques+no+momento" class="d-block w-100" alt="Sem destaques">
            </div>`;
        return;
    }
    
    featuredGames.forEach((game, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const carouselItemHTML = `
            <div class="carousel-item ${activeClass}">
                <a href="detalhe.html?id=${game.id}">
                    <img src="${game.image}" class="d-block w-100" alt="${game.title}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${game.title}</h5>
                        <p>${game.description}</p>
                    </div>
                </a>
            </div>
        `;
        carouselContainer.innerHTML += carouselItemHTML;
    });
};