// ============================================================
// Fecaf Flix - Página do Usuário
// ============================================================
// Responsável por exibir o catálogo de filmes agrupados por gênero,
// permitir busca, mostrar sinopse ao passar o mouse e assistir vídeos
// em tela cheia com controles padrão.
// ============================================================

// Recupera o token salvo no login
const token = localStorage.getItem('token');

// Elementos principais da página
const catalogo = document.getElementById('catalogo');
const searchInput = document.getElementById('search');

// ============================================================
// 1. VALIDAÇÃO DE LOGIN
// ============================================================
// Se o usuário não estiver logado, redireciona para a página de login.
if (!token) {
  alert('Faça login para acessar o catálogo.');
  window.location.href = 'login.html';
}

// ============================================================
// 2. BUSCAR FILMES NA API
// ============================================================
// Faz requisição à API para buscar filmes.
// Se o parâmetro "query" estiver vazio, retorna todos os filmes.
// Caso contrário, filtra pelo termo de busca.
async function buscarFilmes(query = '') {
  const response = await fetch(
    `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/filmes?search=${query}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return await response.json();
}

// ============================================================
// 3. RENDERIZAR FILMES AGRUPADOS POR GÊNERO
// ============================================================
// Cria seções horizontais (carrosséis) para cada gênero.
// Dentro de cada seção, exibe os cards dos filmes com capa, sinopse e botão "Assistir".
function renderizarPorGenero(filmes) {
  catalogo.innerHTML = '';

  // Extrai os gêneros únicos do array de filmes
  const generos = [...new Set(filmes.map(f => f.genero))];

  generos.forEach(genero => {
    const secao = document.createElement('section');
    secao.classList.add('secao');
    secao.innerHTML = `<h2>${genero}</h2>`;

    const lista = document.createElement('div');
    lista.classList.add('lista-filmes');

    // Cria os cards de cada filme dentro do gênero
    filmes
      .filter(f => f.genero === genero)
      .forEach(filme => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Estrutura do card com overlay e botão de assistir
        card.innerHTML = `
          <div class="card-content">
            <img src="${filme.capa}" alt="${filme.nome_filme}">
            <div class="overlay">
              <p>${filme.sinopse}</p>
              <button class="play-btn" data-video="${filme.video}">▶ Assistir</button>
            </div>
            <h3>${filme.nome_filme}</h3>
          </div>
        `;

        lista.appendChild(card);
      });

    secao.appendChild(lista);
    catalogo.appendChild(secao);
  });

  // Após renderizar, adiciona eventos aos botões "Assistir"
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const videoUrl = e.target.getAttribute('data-video');
      abrirPlayer(videoUrl);
    });
  });
}

// ============================================================
// 4. ABRIR PLAYER DE VÍDEO EM TELA CHEIA
// ============================================================
// Cria um elemento overlay com o vídeo e botão de fechar.
// O vídeo é exibido com controles padrão (play, pause, avançar, etc.).
function abrirPlayer(videoUrl) {
  const player = document.createElement('div');
  player.classList.add('player');
  player.innerHTML = `
    <video src="${videoUrl}" controls autoplay></video>
    <button class="fechar-player">✖</button>
  `;
  document.body.appendChild(player);

  // Fecha o player ao clicar no botão "✖"
  const fechar = player.querySelector('.fechar-player');
  fechar.addEventListener('click', () => player.remove());
}

// ============================================================
// 5. BUSCA DE FILMES (INPUT COM DEBOUNCE)
// ============================================================
// Espera o usuário parar de digitar por 300ms antes de buscar,
// evitando sobrecarregar a API com requisições consecutivas.
let debounceTimer;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const filmes = await buscarFilmes(e.target.value);
    renderizarPorGenero(filmes);
  }, 300);
});

// ============================================================
// 6. CARREGAR CATÁLOGO INICIAL
// ============================================================
// Ao abrir a página, carrega todos os filmes disponíveis.
(async () => {
  const filmes = await buscarFilmes();
  renderizarPorGenero(filmes);
})();
