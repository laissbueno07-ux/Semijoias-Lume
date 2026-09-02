// ============================================================
// AUTH-UI - MOSTRA O NOME DO USUÁRIO OU LINK PARA LOGIN
// ============================================================

async function renderAuthArea() {
  const el = document.getElementById("authArea");

  if (!el) return;

  try {
    const response = await fetch("/api/me");
    const data = await response.json();

    if (data.user) {
      const firstName = data.user.name.split(" ")[0];

      el.innerHTML = `
        <a href="perfil.html">Olá, ${firstName}</a>
        <button id="logoutBtn" class="link-btn" style="background:none;border:none;color:var(--gold);cursor:pointer;font-family:inherit;font-size:inherit;padding:0;margin-left:8px;">Sair</button>
      `;

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
          } catch (err) {
            console.error("Erro ao sair:", err);
          }
        });
      }

    } else {
      el.innerHTML = `<a href="login.html">Entrar</a>`;
    }

  } catch (err) {
    console.error("Erro ao verificar sessão:", err);
    el.innerHTML = `<a href="login.html">Entrar</a>`;
  }
}

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", renderAuthArea);