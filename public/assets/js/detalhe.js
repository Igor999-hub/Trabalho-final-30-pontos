const API_URL = 'http://localhost:3000/games';
const API_FAVORITOS = 'http://localhost:3000/favoritos';
const gameDetailContainer = document.getElementById('game-detail-container');

document.addEventListener('DOMContentLoaded', () => {
    configurarMenuDetalhe();
    const id = new URLSearchParams(window.location.search).get('id');
    if(id) fetchDetalhes(id);
    else gameDetailContainer.innerHTML = '<p class="text-center">Jogo não encontrado. <a href="index.html">Voltar</a>.</p>';
});

function configurarMenuDetalhe() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const menuPrincipal = document.getElementById('menu-principal');
    const usuarioInfo = document.getElementById('usuario-info');
    const loginArea = document.getElementById('login-area');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (usuarioLogado) {
        loginArea.classList.add('d-none');
        usuarioInfo.classList.remove('d-none');
        nomeUsuario.textContent = `Olá, ${usuarioLogado.nome}`;

        // Link Favoritos: PARA TODOS LOGADOS
        const liFavoritos = document.createElement('li');
        liFavoritos.className = 'nav-item';
        liFavoritos.innerHTML = '<a class="nav-link" href="index.html">Meus Favoritos</a>';
        menuPrincipal.appendChild(liFavoritos);

        // Link Admin
        if (usuarioLogado.admin === true) {
            const liCadastro = document.createElement('li');
            liCadastro.className = 'nav-item';
            liCadastro.innerHTML = '<a class="nav-link" href="cadastro_jogo.html">Cadastrar Jogo</a>';
            menuPrincipal.appendChild(liCadastro);
        }

        document.getElementById('btn-logout').addEventListener('click', () => {
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html';
        });
    }
}

async function fetchDetalhes(id) {
    try {
        const resGame = await fetch(`${API_URL}/${id}`);
        if(!resGame.ok) throw new Error('Jogo não encontrado');
        const game = await resGame.json();
        
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        let isFav = false;
        
        if(usuarioLogado) {
            const resFav = await fetch(`${API_FAVORITOS}?userId=${usuarioLogado.id}&gameId=${id}`);
            const favs = await resFav.json();
            isFav = favs.length > 0;
        }

        renderGameDetails(game, isFav);
    } catch (error) {
        gameDetailContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
    }
}

function renderGameDetails(game, isFav) {
    document.title = `${game.title} - StartPlay`;
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    let favBtn = '';
    // BOTÃO DE FAVORITO: PARA QUALQUER USUÁRIO LOGADO
    if(usuarioLogado) {
        const iconClass = isFav ? 'bi-heart-fill text-danger' : 'bi-heart';
        const btnText = isFav ? 'Remover Favorito' : 'Adicionar aos Favoritos';
        favBtn = `<button id="btn-fav-detalhe" class="btn btn-outline-dark ms-3" onclick="toggleFavDetalhe('${game.id}')">
                    <i class="bi ${iconClass}"></i> ${btnText}
                  </button>`;
    }

    let galleryHTML = '';
    if (game.gallery) {
        game.gallery.forEach(img => {
            galleryHTML += `<div class="col-md-4 mb-3"><img src="${img}" class="img-fluid rounded shadow-sm"></div>`;
        });
    }

    const html = `
        <div class="row">
            <div class="col-md-5">
                <img src="${game.image}" class="img-fluid rounded shadow" alt="${game.title}">
            </div>
            <div class="col-md-7">
                <div class="d-flex align-items-center mb-3">
                    <h1 class="display-5 fw-bold mb-0">${game.title}</h1>
                    ${favBtn}
                </div>
                <p class="lead">${game.longDescription}</p>
                <hr>
                <p><strong>Ano:</strong> ${game.releaseYear}</p>
                <p><strong>Dev:</strong> ${game.developer}</p>
                <p><strong>Gênero:</strong> ${game.genre}</p>
            </div>
        </div>
        <div class="mt-5">
            <h3 class="text-center mb-4">Galeria de Imagens</h3>
            <div class="row">${galleryHTML}</div>
        </div>
    `;
    gameDetailContainer.innerHTML = html;
}

async function toggleFavDetalhe(gameId) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    try {
        const res = await fetch(`${API_FAVORITOS}?userId=${usuarioLogado.id}&gameId=${gameId}`);
        const existentes = await res.json();
        const btn = document.getElementById('btn-fav-detalhe');

        if (existentes.length > 0) {
            await fetch(`${API_FAVORITOS}/${existentes[0].id}`, { method: 'DELETE' });
            btn.innerHTML = '<i class="bi bi-heart"></i> Adicionar aos Favoritos';
        } else {
            await fetch(API_FAVORITOS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: usuarioLogado.id, gameId: gameId })
            });
            btn.innerHTML = '<i class="bi bi-heart-fill text-danger"></i> Remover Favorito';
        }
    } catch (error) {
        console.error(error);
    }
}