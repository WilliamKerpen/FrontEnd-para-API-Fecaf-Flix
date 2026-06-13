// ============================================================
// Fecaf Flix - Página do Usuário
// ============================================================
// Lista todos os filmes, permite busca, mostra sinopse no hover
// e abre player em tela cheia com streaming.
// ============================================================

const token = localStorage.getItem("token");
const catalogo = document.getElementById("catalogo");
const searchInput = document.getElementById("search");

// 1. Validação de login
if (!token) {
  alert("Faça login para acessar o catálogo.");
  window.location.href = "login.html";
}

console.log("Script Fecaf Flix carregado");

// 2. Buscar TODOS os filmes - GET /videos
async function buscarTodosFilmes() {
  const response = await fetch(
    "https://api.fecaf-flix-api.xyz/v1/fecaf-flix/videos",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    console.error("Erro ao buscar todos os filmes:", response.status);
    return [];
  }

  return await response.json();
}

// 3. Buscar filmes por nome/sinopse - GET /videos/filmes?nome=
async function buscarFilmesPorNome(nome) {
  const response = await fetch(
    `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/videos/filmes?nome=${encodeURIComponent(
      nome
    )}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    console.warn("Nenhum filme encontrado para o filtro:", nome);
    return [];
  }

  return await response.json();
}

// 4. Renderizar lista de filmes (uma seção única por enquanto)
function renderizarFilmes(filmes, titulo = "Catálogo") {
  catalogo.innerHTML = "";

  if (!filmes || filmes.length === 0) {
    catalogo.innerHTML = "<p style='padding:2rem;'>Nenhum filme encontrado.</p>";
    return;
  }

  const secao = document.createElement("section");
  secao.classList.add("secao");
  secao.innerHTML = `<h2>${titulo}</h2>`;

  const lista = document.createElement("div");
  lista.classList.add("lista-filmes");

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

  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const videoUrl = e.target.getAttribute("data-video");
      abrirPlayer(videoUrl);
    });
  });
}

// 5. Player em tela cheia usando /stream/:video
function abrirPlayer(urlVideo) {
  const player = document.createElement("div");
  player.classList.add("player");

  const fileName = urlVideo.split("/").pop();
  const streamUrl = `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/stream/${fileName}`;

  player.innerHTML = `
    <video src="${streamUrl}" controls autoplay></video>
    <button class="fechar-player">✖</button>
  `;

  document.body.appendChild(player);

  player.querySelector(".fechar-player").addEventListener("click", () => {
    player.remove();
  });
}

// 6. Busca com debounce
let debounceTimer;

searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const nome = e.target.value.trim();

    if (nome === "") {
      const filmes = await buscarTodosFilmes();
      renderizarFilmes(filmes, "Catálogo");
      return;
    }

    const filmes = await buscarFilmesPorNome(nome);
    renderizarFilmes(filmes, `Resultados para: "${nome}"`);
  }, 300);
});

// 7. Carregar catálogo inicial
(async () => {
  const filmes = await buscarTodosFilmes();
  console.log("Filmes carregados:", filmes);
  renderizarFilmes(filmes, "Catálogo");
})();
