const formLogin = document.getElementById('form-login');
const btnCadastrar = document.getElementById('btn-cadastrar');


//
formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  try {
    const response = await fetch('https://api.fecaf-flix-api.xyz/v1/fecaf-flix/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      alert('Usuário ou senha inválidos');
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    window.location.href = 'fecaf-flix.html';
  } catch (error) {
    alert('Erro ao conectar com o servidor');
    console.error(error);
  }
});

const btnCadastrar = document.getElementById('btnCadastrar');
const cadastroContainer = document.getElementById('cadastroContainer');
const formCadastro = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');

// Abre o formulário
btnCadastrar.addEventListener('click', () => {
    cadastroContainer.style.display = 'block';
});

// Envia os dados
formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const data_nascimento = document.getElementById('dataNascimento').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(
            'https://api.fecaf-flix-api.xyz/v1/fecaf-flix/user',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    senha,
                    email,
                    sobrenome,
                    data_nascimento
                })
            }
        );

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            formCadastro.reset();
            cadastroContainer.style.display = 'none';
        } else {
            mensagem.textContent = 'Erro ao cadastrar usuário.';
        }
    } catch (error) {
        console.error(error);
        mensagem.textContent = 'Erro ao conectar com a API.';
    }
});