const token = localStorage.getItem('token');
const catalogo = document.getElementById('catalogo');
const searchInput = document.getElementById('search');

if (!token) {
  alert('Faça login para acessar o catálogo.');
  window.location.href = 'login.html';
}

async function buscarFilmes(query = '') {
  const response = await fetch(
    `https://api.fecaf-flix-api.xyz/v1/fecaf-flix/filmes?search=${query}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  return await response.json();
}

function renderizarPorGenero(filmes) {
  catalogo.innerHTML = '';

  const generos = [...new Set(filmes.map(f => f.genero))];

  generos.forEach(genero => {
    const secao = document.createElement('section');
    secao.classList.add('secao');

    secao.innerHTML = `<h2>${genero}</h2>`;

    const lista = document.createElement('div');
    lista.classList.add('lista-filmes');

    filmes
      .filter(f => f.genero === genero)
      .forEach(filme => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <img src="${filme.poster}" alt="${filme.nome}">
          <h3>${filme.nome}</h3>
        `;

        lista.appendChild(card);
      });

    secao.appendChild(lista);
    catalogo.appendChild(secao);
  });
}

let debounceTimer;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  //para nao sobrecarregar a api esperar 300ms o usuario parar de digitar para realizar a requisicao.
  debounceTimer = setTimeout(async () => {
    const filmes = await buscarFilmes(e.target.value);
    renderizarPorGenero(filmes);
  }, 300);
});
