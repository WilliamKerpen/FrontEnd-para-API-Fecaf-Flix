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

btnCadastrar.addEventListener('click', async () => {
    const email = prompt('Digite seu E-Mail');
  const nome = prompt('Digite seu nome:');
  const sobrenome = prompt('Digite seu nome:');
  const data_nascimento = ('Digite sua Data de Nascimento')
  const senha = prompt('Digite sua senha:');
  
  

  if (!nome || !senha || !email || !data_nascimento || !sobrenome) return;

  try {
    const response = await fetch('https://api.fecaf-flix-api.xyz/v1/fecaf-flix/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha, email, sobrenome, data_nascimento })
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
