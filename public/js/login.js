const formLogin = document.getElementById('form-login');
const btnCadastrar = document.getElementById('btn-cadastrar');

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value.trim();

  try {
    const response = await fetch('https://api.fecaf-flix-api.xyz/v1/fecaf-flix/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha })
    });

    if (!response.ok) {
      alert('Usuário ou senha inválidos');
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    window.location.href = 'index.html';
  } catch (error) {
    alert('Erro ao conectar com o servidor');
    console.error(error);
  }
});

btnCadastrar.addEventListener('click', async () => {
  const nome = prompt('Digite seu nome:');
  const senha = prompt('Digite sua senha:');

  if (!nome || !senha) return;

  try {
    const response = await fetch('https://api.fecaf-flix-api.xyz/v1/fecaf-flix/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha })
    });

    if (response.ok) {
      alert('Usuário cadastrado com sucesso!');
    } else {
      alert('Erro ao cadastrar usuário.');
    }
  } catch (error) {
    console.error(error);
  }
});
