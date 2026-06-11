document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('token');
    const mensagem = document.getElementById('mensagem');

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "loginAdm.html";
    });

    async function carregarGeneros() {
        try {
            const response = await fetch("https://api.fecaf-flix-api.xyz/v1/fecaf-flix/generos", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const generos = await response.json();
            const select = document.getElementById('genero');

            generos.forEach(g => {
                const option = document.createElement('option');
                option.value = g.id_genero;
                option.textContent = g.nome_genero;
                select.appendChild(option);
            });

        } catch (error) {
            mensagem.textContent = "Erro ao carregar gêneros";
        }
    }

    carregarGeneros();

    // Preview capa
    document.getElementById('capa').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('previewCapa');
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        }
    });

    // Preview vídeo
    document.getElementById('video').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('previewVideo');
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        }
    });

    // Enviar vídeo
    document.getElementById('formVideo').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nome_filme", document.getElementById('nome_filme').value);
        formData.append("sinopse", document.getElementById('sinopse').value);
        formData.append("id_genero", document.getElementById('genero').value);
        formData.append("capa", document.getElementById('capa').files[0]);
        formData.append("video", document.getElementById('video').files[0]);

        try {
            const response = await fetch("https://api.fecaf-flix-api.xyz/v1/fecaf-flix/video/filme", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                mensagem.textContent = data.erro || "Erro ao cadastrar vídeo";
                mensagem.style.color = "#ff4d4d";
                return;
            }

            mensagem.textContent = "Vídeo cadastrado com sucesso!";
            mensagem.style.color = "#00ff66";

            document.getElementById('formVideo').reset();
            document.getElementById('previewCapa').style.display = "none";
            document.getElementById('previewVideo').style.display = "none";

        } catch (error) {
            mensagem.textContent = "Erro de conexão com o servidor";
            mensagem.style.color = "#ff4d4d";
        }
    });

    // Abrir modal
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            document.getElementById(modalId).style.display = "flex";
        });
    });

    // Fechar modal
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.parentElement.parentElement.style.display = "none";
        });
    });

    // Fechar clicando fora
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    });

});
