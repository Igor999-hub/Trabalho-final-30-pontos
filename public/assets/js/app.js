const API_URL = 'http://localhost:3000/games';
const API_FAVORITOS = 'http://localhost:3000/favoritos';

let allGames = [];

document.addEventListener('DOMContentLoaded', () => {
    verificarLogin(); // Configura o menu
    fetchGames();     // Busca os jogos

    document.getElementById('input-pesquisa').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        filtrarJogos(termo);
    });
});

// --- Lógica do Menu e Login ---
function verificarLogin() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const menuPrincipal = document.getElementById('menu-principal');
    const usuarioInfo = document.getElementById('usuario-info');
    const loginArea = document.getElementById('login-area');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (usuarioLogado) {
        // Usuário Logado
        loginArea.classList.add('d-none');
        usuarioInfo.classList.remove('d-none');
        nomeUsuario.textContent = `Olá, ${usuarioLogado.nome}`;

        // VERIFICAÇÃO DE ADMIN: Só adiciona o link se for admin
        if (usuarioLogado.admin === true) {
            const liCadastro = document.createElement('li');
            liCadastro.className = 'nav-item';
            liCadastro.innerHTML = '<a class="nav-link" href="cadastro_jogo.html">Cadastrar Jogo</a>';
            menuPrincipal.appendChild(liCadastro);
        }

        // Link de Favoritos (para qualquer usuário logado)
        const liFavoritos = document.createElement('li');
        liFavoritos.className = 'nav-item';
        liFavoritos.innerHTML = '<a class="nav-link" href="#" onclick="alert(\'Seus favoritos estão marcados com o coração vermelho na lista!\')">Meus Favoritos</a>';
        menuPrincipal.appendChild(liFavoritos);

        // Logout
        document.getElementById('btn-logout').addEventListener('click', () => {
            sessionStorage.removeItem('usuarioLogado');
            window.location.reload();
        });
    }
}

// --- Funções de Dados e Cards (Sem alterações) ---
async function fetchGames() {
    try {
        const [resGames, resFavs] = await Promise.all([
            fetch(API_URL),
            fetch(API_FAVORITOS)
        ]);
        
        allGames = await resGames.json();
        const favoritos = await resFavs.json();
        
        renderCarousel(allGames);
        renderCards(allGames, favoritos);
    } catch (error) {
        console.error('Erro:', error);
    }
}

function filtrarJogos(termo) {
    const jogosFiltrados = allGames.filter(game => 
        game.title.toLowerCase().includes(termo) || 
        game.description.toLowerCase().includes(termo)
    );
    fetch(API_FAVORITOS)
        .then(res => res.json())
        .then(favoritos => renderCards(jogosFiltrados, favoritos));
}

const renderCards = (games, favoritos = []) => {
    const cardsContainer = document.getElementById('cards-container');
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    
    games.forEach(game => {
        let favIcon = '';
        if (usuarioLogado) {
            const isFav = favoritos.some(f => f.gameId === game.id && f.userId === usuarioLogado.id);
            const classeIcone = isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-white';
            favIcon = `<i class="bi ${classeIcone} position-absolute top-0 end-0 m-3 fs-4" 
                          style="cursor: pointer; z-index: 10;" 
                          onclick="toggleFavorito(event, '${game.id}')"></i>`;
        }

        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm card-com-fundo" style="background-image: url('${game.gallery[0] || game.image}'); position: relative;">
                    ${favIcon}
                    <a href="detalhe.html?id=${game.id}" class="text-decoration-none h-100 d-flex flex-column">
                        <div class="card-body d-flex flex-column justify-content-end mt-auto">
                            <h5 class="card-title text-white" style="text-shadow: 2px 2px 4px #000;">${game.title}</h5>
                            <p class="card-text text-white" style="text-shadow: 1px 1px 2px #000;">${game.description}</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
    });
};

async function toggleFavorito(event, gameId) {
    event.preventDefault();
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    try {
        const res = await fetch(`${API_FAVORITOS}?userId=${usuarioLogado.id}&gameId=${gameId}`);
        const existentes = await res.json();

        if (existentes.length > 0) {
            await fetch(`${API_FAVORITOS}/${existentes[0].id}`, { method: 'DELETE' });
            event.target.classList.replace('bi-heart-fill', 'bi-heart');
            event.target.classList.remove('text-danger');
            event.target.classList.add('text-white');
        } else {
            await fetch(API_FAVORITOS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: usuarioLogado.id, gameId: gameId })
            });
            event.target.classList.replace('bi-heart', 'bi-heart-fill');
            event.target.classList.remove('text-white');
            event.target.classList.add('text-danger');
        }
    } catch (error) {
        console.error(error);
    }
}

const renderCarousel = (games) => {
    const carouselContainer = document.getElementById('carousel-inner-container');
    if (!carouselContainer) return;
    carouselContainer.innerHTML = '';

    const featuredGames = games.filter(game => game.emDestaque);
    if (featuredGames.length === 0) return;

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