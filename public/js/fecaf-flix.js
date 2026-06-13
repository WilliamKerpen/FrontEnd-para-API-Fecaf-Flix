// ============================================================
// Fecaf Flix - Página do Usuário
// ============================================================
// Exibe catálogo estilo Netflix, com carrosséis por gênero,
// sinopse ao passar o mouse e player em tela cheia.
// ============================================================

// Recupera token salvo no login
const token = localStorage.getItem("token");

// Elementos principais
const catalogo = document.getElementById("catalogo");
const searchInput = document.getElementById("search");

// ============================================================
// 1. VALIDAÇÃO DO LOGIN
// ============================================================
if (!token) {
  alert("Faça login para acessar o catálogo.");
  window.location.href = "login.html";
}

console.log("Script Fecaf Flix carregado");

// ============================================================
// 2. BUSCAR TODOS OS GÊNEROS
// ============================================================
// GET /generos
async function buscarGeneros() {
  const response = await fetch(
    "https://api.fecaf-flix-api.xyz/v1/fecaf-flix/generos",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return await response.json();
  }

// ============================================================
// 3. BUSCAR FILMES POR GÊNERO
// ============================================================
// GET /filmes/genero?genero=Ação
async function buscarFilmesPorGenero(genero) {
  const response = await fetch(
    `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/filmes/genero?genero=${genero}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) return [];
  return await response.json();
}

// ============================================================
// 4. BUSCAR FILMES POR NOME OU SINOPSE
// ============================================================
// GET /videos/filmes?nome=matrix
async function buscarFilmesPorNome(nome) {
  const response = await fetch(
    `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/videos/filmes?nome=${nome}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) return [];
  return await response.json();
}

// ============================================================
// 5. RENDERIZAR CARROSSEIS POR GÊNERO
// ============================================================
async function renderizarCatalogo() {
  catalogo.innerHTML = "";

  const generos = await buscarGeneros();
  console.log("Gêneros recebidos:", generos);

  for (const genero of generos) {
    const nomeGenero = genero.nome_genero;

    const filmes = await buscarFilmesPorGenero(nomeGenero);
    console.log("Filmes do gênero:", nomeGenero, filmes);

    const secao = document.createElement("section");
    secao.classList.add("secao");
    secao.innerHTML = `<h2>${nomeGenero}</h2>`;

    const lista = document.createElement("div");
    lista.classList.add("lista-filmes");

    // Se não houver filmes, mostra mensagem
    if (!filmes || filmes.length === 0) {
      lista.innerHTML = `
        <p style="padding:1rem; opacity:0.7;">
          Ainda não temos filmes nesse gênero.
        </p>
      `;
      secao.appendChild(lista);
      catalogo.appendChild(secao);
      continue;
    }

    // Renderiza os filmes normalmente
    filmes.forEach((filme) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const urlCapa = `https://api.fecaf-flix-api.xyz${filme.capa}`;

      card.innerHTML = `
        <div class="card-content">
          <img src="${urlCapa}" alt="${filme.nome_filme}">
          <div class="overlay">
            <p>${filme.sinopse}</p>
            <button class="play-btn" data-video="${filme.url_video}">▶ Assistir</button>
          </div>
          <h3>${filme.nome_filme}</h3>
        </div>
      `;

      lista.appendChild(card);
    });

    secao.appendChild(lista);
    catalogo.appendChild(secao);
  }

  // Ativa botões de assistir
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const videoUrl = e.target.getAttribute("data-video");
      abrirPlayer(videoUrl);
    });
  });
}


// ============================================================
// 6. PLAYER DE VÍDEO EM TELA CHEIA
// ============================================================
// Abre o player de vídeo em tela cheia e garante compatibilidade com iOS e desktop
function abrirPlayer(urlVideo) {
  // Cria o container do player
  const player = document.createElement("div");
  player.classList.add("player");

  // Extrai o nome do arquivo do vídeo
  const fileName = urlVideo.split("/").pop();
  const streamUrl = `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/stream/${fileName}`;

  // Estrutura do player
  player.innerHTML = `
    <video 
      id="player-video"
      src="${streamUrl}"
      controls
      playsinline
      webkit-playsinline
      preload="metadata"
      style="max-height: 90vh; width: 90vw; border-radius: 8px;"
    ></video>
    <button class="fechar-player">✖</button>
  `;

  document.body.appendChild(player);

  const video = player.querySelector("#player-video");
  const btnFechar = player.querySelector(".fechar-player");

  // Função para iniciar o vídeo manualmente
  function tentarPlay() {
    video.play().catch((err) => {
      console.warn("Reprodução bloqueada:", err);
    });
  }

  // Inicia o vídeo apenas após interação do usuário
  video.addEventListener("click", tentarPlay);
  player.addEventListener("click", (e) => {
    if (e.target === player) {
      tentarPlay();
    }
  });

  // Corrige o bug do primeiro clique no desktop
  video.addEventListener("loadeddata", () => {
    // Se o vídeo estiver visível e o usuário já clicou, tenta tocar
    if (document.activeElement === video) {
      tentarPlay();
    }
  });

  // Botão de fechar
  btnFechar.addEventListener("click", () => {
    video.pause();
    player.remove();
  });
}


// ============================================================
// 7. BUSCA COM DEBOUNCE
// ============================================================
let debounceTimer;

searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const nome = e.target.value.trim();

    if (nome === "") {
      renderizarCatalogo();
      return;
    }

    const filmes = await buscarFilmesPorNome(nome);

    catalogo.innerHTML = "";
    renderizarResultadoBusca(filmes);
  }, 300);
});

// ============================================================
// 8. RENDERIZAR RESULTADO DA BUSCA
// ============================================================
function renderizarResultadoBusca(filmes) {
  catalogo.innerHTML = "";

  const secao = document.createElement("section");
  secao.classList.add("secao");
  secao.innerHTML = `<h2>Resultados da busca</h2>`;

  const lista = document.createElement("div");
  lista.classList.add("lista-filmes");

  filmes.forEach((filme) => {

    // NORMALIZAÇÃO DA CAPA
    let urlCapa = filme.capa;
    if (!urlCapa.startsWith("http")) {
      urlCapa = `https://api.fecaf-flix-api.xyz${urlCapa}`;
    }

    // NORMALIZAÇÃO DO VÍDEO
    let fileName = filme.url_video;
    fileName = fileName.replace("/public/videos/", "");

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-content">
        <img src="${urlCapa}" alt="${filme.nome_filme}">
        <div class="overlay">
          <p>${filme.sinopse}</p>
          <button class="play-btn" data-video="${fileName}">▶ Assistir</button>
        </div>
        <h3>${filme.nome_filme}</h3>
      </div>
    `;

    lista.appendChild(card);
  });

  secao.appendChild(lista);
  catalogo.appendChild(secao);

  // Ativa o player
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const videoUrl = e.target.getAttribute("data-video");
      abrirPlayer(videoUrl);
    });
  });
}

// ============================================================
// 9. CARREGAR CATÁLOGO AO ABRIR A PÁGINA
// ============================================================
renderizarCatalogo();