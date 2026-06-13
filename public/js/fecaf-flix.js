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
console.log("catalogo =", catalogo); // teste
const searchInput = document.getElementById("search");

// ============================================================
// 1. VALIDAÇÃO DO LOGIN
// ============================================================
if (!token) {
  alert("Faça login para acessar o catálogo.");
  window.location.href = "login.html";
}
console.log(token);//teste
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
  console.log("renderizarCatalogo iniciou");
  catalogo.innerHTML = "";

  const generos = await buscarGeneros();

  for (const genero of generos) {
    const nomeGenero = genero.nome_genero;

    const filmes = await buscarFilmesPorGenero(nomeGenero);
    if (!filmes || filmes.length === 0) continue;

    const secao = document.createElement("section");
    secao.classList.add("secao");
    secao.innerHTML = `<h2>${nomeGenero}</h2>`;

    const lista = document.createElement("div");
    lista.classList.add("lista-filmes");

    filmes.forEach((filme) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-content">
          <img src="${filme.capa}" alt="${filme.nome_filme}">
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
function abrirPlayer(videoUrl) {
  const player = document.createElement("div");
  player.classList.add("player");

  const fileName = videoUrl.split("/").pop();
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
  const secao = document.createElement("section");
  secao.classList.add("secao");
  secao.innerHTML = `<h2>Resultados da busca</h2>`;

  const lista = document.createElement("div");
  lista.classList.add("lista-filmes");

  filmes.forEach((filme) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-content">
        <img src="${filme.capa}" alt="${filme.nome_filme}">
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

// ============================================================
// 9. CARREGAR CATÁLOGO AO ABRIR A PÁGINA
// ============================================================
renderizarCatalogo();
