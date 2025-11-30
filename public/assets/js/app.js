const API_URL = 'http://localhost:3000/games';
const API_FAVORITOS = 'http://localhost:3000/favoritos';

let allGames = [];

document.addEventListener('DOMContentLoaded', () => {
    configurarPagina();
    fetchGames();

    // Pesquisa
    document.getElementById('input-pesquisa').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        filtrarJogos(termo);
    });

    // Clique no botão Favoritos (que agora é fixo no HTML)
    document.getElementById('link-favoritos').addEventListener('click', (e) => {
        e.preventDefault();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        
        if (usuarioLogado) {
            mostrarFavoritos();
        } else {
            alert('Você precisa fazer login para ver seus favoritos!');
            window.location.href = 'login.html';
        }
    });
});

function configurarPagina() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (usuarioLogado) {
        // Ajusta cabeçalho
        document.getElementById('login-area').classList.add('d-none');
        document.getElementById('usuario-info').classList.remove('d-none');
        document.getElementById('nome-usuario').textContent = `Olá, ${usuarioLogado.nome}`;

        // SÓ ADICIONA CADASTRO SE FOR ADMIN
        if (usuarioLogado.admin === true) {
            const menu = document.getElementById('menu-principal');
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = '<a class="nav-link" href="cadastro_jogo.html" style="color: #ffc107;">Cadastrar Jogo</a>';
            menu.appendChild(li);
        }

        // Logout
        document.getElementById('btn-logout').addEventListener('click', () => {
            sessionStorage.removeItem('usuarioLogado');
            window.location.reload();
        });
    }
}

// --- Mostrar Favoritos ---
async function mostrarFavoritos() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    // Esconde Destaques
    document.getElementById('destaques').style.display = 'none';
    // Muda Título
    document.getElementById('titulo-secao').innerHTML = 'Meus Favoritos <button class="btn btn-sm btn-outline-primary ms-3" onclick="location.reload()">Ver Todos</button>';

    try {
        const resFav = await fetch(API_FAVORITOS);
        const todosFavoritos = await resFav.json();
        
        const meusFavoritos = todosFavoritos.filter(f => f.userId === usuarioLogado.id);
        const ids = meusFavoritos.map(f => f.gameId);
        
        const jogosExibir = allGames.filter(g => ids.includes(g.id));
        
        renderCards(jogosExibir, todosFavoritos);
        
        if(jogosExibir.length === 0) {
            document.getElementById('cards-container').innerHTML = '<p class="text-center w-100">Nenhum favorito encontrado.</p>';
        }
    } catch (error) { console.error(error); }
}

async function fetchGames() {
    try {
        const [resGames, resFavs] = await Promise.all([fetch(API_URL), fetch(API_FAVORITOS)]);
        allGames = await resGames.json();
        const favoritos = await resFavs.json();
        
        renderCarousel(allGames);
        renderCards(allGames, favoritos);
    } catch (error) { console.error(error); }
}

function filtrarJogos(termo) {
    const filtrados = allGames.filter(g => g.title.toLowerCase().includes(termo) || g.description.toLowerCase().includes(termo));
    fetch(API_FAVORITOS).then(r => r.json()).then(favs => renderCards(filtrados, favs));
}

function renderCards(games, favoritos = []) {
    const container = document.getElementById('cards-container');
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!container) return;
    container.innerHTML = '';

    games.forEach(game => {
        let favIcon = '';
        if (usuarioLogado) {
            const isFav = favoritos.some(f => f.gameId === game.id && f.userId === usuarioLogado.id);
            const classe = isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-white';
            favIcon = `<i class="bi ${classe} position-absolute top-0 end-0 m-3 fs-4" style="cursor: pointer; z-index: 10;" onclick="toggleFav(event, '${game.id}')"></i>`;
        }

        container.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm card-com-fundo" style="background-image: url('${game.image}'); position: relative;">
                    ${favIcon}
                    <a href="detalhe.html?id=${game.id}" class="text-decoration-none h-100 d-flex flex-column">
                        <div class="card-body d-flex flex-column justify-content-end mt-auto">
                            <h5 class="card-title text-white" style="text-shadow: 2px 2px 4px #000;">${game.title}</h5>
                            <p class="card-text text-white" style="text-shadow: 1px 1px 2px #000;">${game.description}</p>
                        </div>
                    </a>
                </div>
            </div>`;
    });
}

async function toggleFav(e, gameId) {
    e.preventDefault();
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    // Verifica favorito existente
    const res = await fetch(`${API_FAVORITOS}?userId=${usuarioLogado.id}&gameId=${gameId}`);
    const existe = await res.json();

    if (existe.length > 0) {
        await fetch(`${API_FAVORITOS}/${existe[0].id}`, { method: 'DELETE' });
        e.target.className = 'bi bi-heart text-white position-absolute top-0 end-0 m-3 fs-4';
    } else {
        await fetch(API_FAVORITOS, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userId: usuarioLogado.id, gameId }) });
        e.target.className = 'bi bi-heart-fill text-danger position-absolute top-0 end-0 m-3 fs-4';
    }
}

const renderCarousel = (games) => {
    const container = document.getElementById('carousel-inner-container');
    if (!container) return;
    container.innerHTML = '';
    const destaques = games.filter(g => g.emDestaque);
    if(destaques.length === 0) return;

    destaques.forEach((game, index) => {
        const active = index === 0 ? 'active' : '';
        container.innerHTML += `
            <div class="carousel-item ${active}">
                <a href="detalhe.html?id=${game.id}">
                    <img src="${game.image}" class="d-block w-100" style="height: 500px; object-fit: cover; filter: brightness(0.6);">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${game.title}</h5><p>${game.description}</p>
                    </div>
                </a>
            </div>`;
    });
};