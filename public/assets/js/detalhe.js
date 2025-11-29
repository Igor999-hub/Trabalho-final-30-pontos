// Define a URL base da nossa API na porta 3000
const API_URL = 'http://localhost:3000/games';

// Pega o container principal no HTML
const gameDetailContainer = document.getElementById('game-detail-container');

document.addEventListener('DOMContentLoaded', () => {
    // Lê a URL da página para encontrar o ID do jogo.
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id'); // Pega o valor do 'id'

    // Se não tiver ID, mostra erro
    if (!gameId) {
        gameDetailContainer.innerHTML = '<p class="text-center">Jogo não encontrado. <a href="index.html">Voltar para a Home</a>.</p>';
        return;
    }

    // Se tiver ID, busca esse jogo específico na API
    fetchGameDetails(gameId);
});

// Função para buscar o JOGO ÚNICO
async function fetchGameDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Jogo não encontrado na API.');
        }
        const game = await response.json();
        
        // Se encontrou, chama a função para renderizar
        renderGameDetails(game);

    } catch (error) {
        console.error('Erro ao buscar detalhes do jogo:', error);
        gameDetailContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
    }
}

// Função para RENDERIZAR A PÁGINA (este é o seu código antigo, adaptado)
function renderGameDetails(game) {
    // Altera o título da aba do navegador
    document.title = `${game.title} - StartPlay`;

    // ---- INÍCIO DA MONTAGEM DA GALERIA DE IMAGENS ----
    let galleryHTML = ''; 
    if (game.gallery && game.gallery.length > 0) {
        game.gallery.forEach(imageUrl => {
            galleryHTML += `
                <div class="col-md-4 mb-3">
                    <img src="${imageUrl}" class="img-fluid rounded shadow-sm gallery-image" alt="Imagem da galeria de ${game.title}">
                </div>
            `;
        });
    }
    // ---- FIM DA MONTAGEM DA GALERIA DE IMAGENS ----

    // ---- INÍCIO DA MONTAGEM DO HTML PRINCIPAL (Descrição + Galeria) ----
    const detailHTML = `
        <div class="row">
            <div class="col-md-5">
                <img src="${game.image}" class="img-fluid rounded shadow" alt="Capa do jogo ${game.title}">
            </div>

            <div class="col-md-7">
                <h1 class="display-5 fw-bold">${game.title}</h1>
                <p class="lead">${game.longDescription}</p>
                <hr>
                <p><strong>Ano de Lançamento:</strong> ${game.releaseYear}</p>
                <p><strong>Desenvolvedora:</strong> ${game.developer}</p>
                <p><strong>Gênero:</strong> ${game.genre}</p>
            </div>
        </div>

        <div class="mt-5">
            <h2 class="text-center mb-4">Galeria de Imagens</h2>
            <div class="row">
                ${galleryHTML}
            </div>
        </div>
    `;
    // ---- FIM DA MONTAGEM DO HTML PRINCIPAL ----

    // Finalmente, coloca todo o HTML na página
    gameDetailContainer.innerHTML = detailHTML;
}