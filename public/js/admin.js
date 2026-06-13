document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // CONFIGURAÇÃO BÁSICA
  // ============================================================
  const API_BASE = "https://api.fecaf-flix-api.xyz/v1/fecaf-flix";
  const token = localStorage.getItem("token");
  const mensagem = document.getElementById("mensagem");

  // ============================================================
  // 1. VALIDAÇÃO DO TOKEN
  // ============================================================
  if (!token) {
    window.location.href = "loginAdm.html";
    return;
  }

  // ============================================================
  // 2. LOGOUT
  // ============================================================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "loginAdm.html";
    });
  }

  // ============================================================
  // 3. FUNÇÃO AUXILIAR: EXIBIR MENSAGEM GLOBAL
  // ============================================================
  function setMensagem(texto, cor = "#ccc") {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.style.color = cor;
  }

  // ============================================================
  // 4. CARREGAR GÊNEROS (para o select do vídeo)
  // ============================================================
  async function carregarGeneros() {
    try {
      const response = await fetch(`${API_BASE}/generos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const generos = await response.json();
      const select = document.getElementById("genero");
      if (!select) return;

      select.innerHTML = "";
      generos.forEach((g) => {
        const option = document.createElement("option");
        option.value = g.id_genero;
        option.textContent = g.nome_genero;
        select.appendChild(option);
      });
    } catch (error) {
      setMensagem("Erro ao carregar gêneros", "#ff4d4d");
      console.error(error);
    }
  }

  carregarGeneros();

  // ============================================================
  // 5. PREVIEW DA CAPA
  // ============================================================
  const capaInput = document.getElementById("capa");
  if (capaInput) {
    capaInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const preview = document.getElementById("previewCapa");
      if (file && preview) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    });
  }

  // ============================================================
  // 6. PREVIEW DO VÍDEO
  // ============================================================
  const videoInput = document.getElementById("video");
  if (videoInput) {
    videoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const preview = document.getElementById("previewVideo");
      if (file && preview) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    });
  }

  // ============================================================
  // 7. ENVIO DO FORMULÁRIO DE VÍDEO
  // ============================================================
// Responsabilidade: enviar todos os dados do filme para a API,
// incluindo nome, ano, sinopse, gênero, capa e vídeo.
const formVideo = document.getElementById("formVideo");

if (formVideo) {
  formVideo.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta dos dados do formulário
    const formData = new FormData();
    formData.append("nome_filme", document.getElementById("nome_filme").value);
    formData.append("ano", document.getElementById("ano").value); // <-- ANO ADICIONADO
    formData.append("sinopse", document.getElementById("sinopse").value);
    formData.append("id_genero", document.getElementById("genero").value);
    formData.append("capa", document.getElementById("capa").files[0]);
    formData.append("video", document.getElementById("video").files[0]);

    try {
      // Envio para a API
      const response = await fetch(`${API_BASE}/videos/filme`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.erro || "Erro ao cadastrar vídeo", "#ff4d4d");
        return;
      }

      // Sucesso
      setMensagem("Vídeo cadastrado com sucesso!", "#00ff66");

      // Reset do formulário e previews
      formVideo.reset();
      document.getElementById("previewCapa").style.display = "none";
      document.getElementById("previewVideo").style.display = "none";

    } catch (error) {
      setMensagem("Erro de conexão com o servidor", "#ff4d4d");
      console.error(error);
    }
  });
}

  // ============================================================
  // 8. CARREGAR LISTA DE USUÁRIOS  Padrao
  // ============================================================
  async function carregarUsuarios() {
    const container = document.getElementById("listaUsuarios");
    if (!container) return;

    container.innerHTML = "Carregando usuários...";

    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usuarios = await response.json();
      console.log("usuarios:" + usuarios)

      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        container.innerHTML = "<p>Nenhum usuário encontrado.</p>";
        return;
      }

      const ul = document.createElement("ul");
      usuarios.forEach((u) => {
        const li = document.createElement("li");
        li.textContent = `${u.id_user} - ${u.nome} (${u.email})`;
        ul.appendChild(li);
      });

      container.innerHTML = "";
      container.appendChild(ul);
    } catch (error) {
      container.innerHTML = "<p>Erro ao carregar usuários.</p>";
      console.error(error);
    }
  }

  

  // ============================================================
  // 9. CARREGAR LISTA DE FILMES
  // ============================================================
  async function carregarFilmes() {
    const container = document.getElementById("listaFilmes");
    if (!container) return;

    container.innerHTML = "Carregando filmes...";

    try {
      const response = await fetch(`${API_BASE}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filmes = await response.json();

      if (!Array.isArray(filmes) || filmes.length === 0) {
        container.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
      }

      const ul = document.createElement("ul");
      filmes.forEach((f) => {
        const li = document.createElement("li");
        li.textContent = `${f.id_filme} - ${f.nome_filme}`;
        ul.appendChild(li);
      });

      container.innerHTML = "";
      container.appendChild(ul);
    } catch (error) {
      container.innerHTML = "<p>Erro ao carregar filmes.</p>";
      console.error(error);
    }
  }

  // ============================================================
  // 10. CRIAR NOVO ADMIN
  // ============================================================
  const formAdmin = document.getElementById("formAdmin");
  if (formAdmin) {
    formAdmin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("adminNome").value;
      const cargo = document.getElementById("adminCargo").value;
      const senha = document.getElementById("adminSenha").value;

      try {
        const response = await fetch(`${API_BASE}/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, cargo, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMensagem(data.erro || "Erro ao criar admin", "#ff4d4d");
          return;
        }

        setMensagem("Admin criado com sucesso!", "#00ff66");
        formAdmin.reset();
      } catch (error) {
        setMensagem("Erro de conexão ao criar admin", "#ff4d4d");
        console.error(error);
      }
    });
  }

  // ============================================================
  // 11. ADICIONAR NOVO GÊNERO
  // ============================================================
  const formGenero = document.getElementById("formGenero");
  if (formGenero) {
    formGenero.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nomeGenero = document.getElementById("nomeGenero").value;

      try {
        const response = await fetch(`${API_BASE}/generos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome_genero: nomeGenero }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMensagem(data.erro || "Erro ao adicionar gênero", "#ff4d4d");
          return;
        }

        setMensagem("Gênero adicionado com sucesso!", "#00ff66");
        formGenero.reset();
        carregarGeneros(); // atualiza o select do vídeo
      } catch (error) {
        setMensagem("Erro de conexão ao adicionar gênero", "#ff4d4d");
        console.error(error);
      }
    });
  }

  // ============================================================
  // 12. ABRIR MODAIS + DISPARAR CARREGAMENTO QUANDO PRECISO
  // ============================================================
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Quando abrir cada modal, dispara a função correspondente
      if (modalId === "modalUsers") carregarUsuarios();
      if (modalId === "modalFilmes") carregarFilmes();

      modal.style.display = "flex";
    });
  });

  // ============================================================
  // 13. FECHAR MODAIS
  // ============================================================
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  // ============================================================
  // 14. FECHAR MODAL AO CLICAR FORA
  // ============================================================
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });
});
