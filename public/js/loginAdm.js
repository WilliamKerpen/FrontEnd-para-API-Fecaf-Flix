const form = document.getElementById('formLogin');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('https://https://api.fecaf-flix-api.xyz/v1/fecaf-flix/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            erro.textContent = data.erro || 'Erro ao fazer login';
            return;
        }

        localStorage.setItem('token', data.token);
        window.location.href = "admin.html";

    } catch (error) {
        erro.textContent = 'Erro de conexão com o servidor';
    }
});
