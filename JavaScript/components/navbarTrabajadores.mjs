import { html, render } from "lit-html";
import { authController } from "../controllers/authController.mjs";
import { menuAdmin, menuPersonal } from "./rutasUsers.mjs";

export async function renderNavbarTrabajadores(user) {
  const root = document.getElementById("main");

  let collapsed = sessionStorage.getItem("navbar-collapsed") === "true";

  const rol = user.rol?.nombre || user.rol;
  const menu = rol === "administrador" ? menuAdmin : menuPersonal;

  const getIniciales = (nombre) => {
    if (!nombre) return "U";
    const p = nombre.trim().split(" ");
    return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
  };

  const iniciales = getIniciales(user.nombre);

  const activarItem = (e) => {
    document.querySelectorAll(".menu-link").forEach((el) =>
      el.classList.remove("active")
    );
    e.currentTarget.classList.add("active");
  };

  const logout = async () => {
    const auth = new authController();
    await auth.logout();
  };

  const toggle = () => {
    collapsed = !collapsed;
    sessionStorage.setItem("navbar-collapsed", collapsed);
    renderView();
  };

  const renderView = () => {
    const template = html`
      <style>
        * {
          text-decoration: none !important;
          font-family: Inter, sans-serif;
        }

        :root {
          --nav-bg: #0f172a;
          --nav-hover: #1e293b;
          --nav-active: #334155;
          --text: #e2e8f0;
          --text-dim: #94a3b8;
          --accent: #4ade80;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${collapsed ? "78px" : "240px"};
          background: var(--nav-bg);
          border-right: 1px solid #1e293b;
          transition: width 0.25s ease;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0.8rem 1rem;
          z-index: 2000;
        }

        .toggle-btn {
          position: absolute;
          right: -20px;
          top: 10px;
          width: 45px;
          height: 45px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 6px 18px #4ade8060;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 5000;
        }

        .toggle-btn img {
          width: 22px;
          filter: invert(1);
        }

        #contenedor {
          margin-left: ${collapsed ? "78px" : "240px"};
          width: calc(100% - ${collapsed ? "78px" : "240px"});
          min-height: 100vh;
          background: #020617;
          color: white;
          transition: margin-left 0.25s ease;
        }

        .nav-user-box {
          margin-top: 4rem;
          text-align: center;
          margin-bottom: 1.8rem;
        }

        .nav-avatar {
          width: ${collapsed ? "40px" : "55px"};
          height: ${collapsed ? "40px" : "55px"};
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: ${collapsed ? "0.9rem" : "1.2rem"};
          font-weight: bold;
          margin: auto;
          transition: width 0.2s ease, height 0.2s ease, font-size 0.2s ease;
        }

        .nav-username {
          margin-top: 0.55rem;
          color: var(--text);
          font-size: 0.95rem;
          font-weight: 600;
          display: ${collapsed ? "none" : "block"};
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .menu-link {
          padding: ${collapsed ? "1rem 0" : "0.75rem 1rem"};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? "center" : "flex-start"};
          gap: ${collapsed ? "0" : "12px"};
          color: var(--text-dim);
          cursor: pointer;
        }

        .menu-link:hover {
          background: var(--nav-hover);
          color: var(--text);
        }

        .menu-link.active {
          background: var(--nav-active);
          color: var(--accent);
          border-left: ${collapsed ? "none" : "3px solid var(--accent)"};
        }

        .menu-icon {
          width: ${collapsed ? "28px" : "22px"};
          height: ${collapsed ? "28px" : "22px"};
          filter: brightness(0) invert(1);
        }

        .menu-text {
          display: ${collapsed ? "none" : "inline"};
        }

        .logout {
          margin-top: auto;
          padding: 0.9rem;
          background: #b91c1c;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.7rem;
          cursor: pointer;
        }

        .logout-text {
          color: white;
          font-family: "Anton", sans-serif;
          display: ${collapsed ? "none" : "inline"};
        }

        @media (max-width: 768px) {
          .sidebar {
            width: ${collapsed ? "78px" : "240px"};
            position: fixed;
            z-index: 5000;
          }

          #contenedor {
            margin-left: ${collapsed ? "78px" : "0"};
            width: ${collapsed ? "calc(100% - 78px)" : "100%"};
          }
        }
      </style>

      <aside class="sidebar">

        <div class="toggle-btn" @click=${toggle}>
          <img
            src="${
              collapsed
                ? "https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF"
                : "https://img.icons8.com/?size=100&id=113406&format=png&color=FFFFFF"
            }"
          />
        </div>

        <a class="nav-user-box" href="/${rol.toLowerCase()}/perfil" data-route>
          <div class="nav-avatar">${iniciales}</div>
          <div class="nav-username">${user.nombre}</div>
        </a>

        <nav class="menu">
          ${menu.map(
            (op) => html`
              <a class="menu-link" href="${op.ruta}" data-route @click=${activarItem}>
                <img class="menu-icon" src="${op.img}" />
                <span class="menu-text">${op.texto}</span>
              </a>
            `
          )}
        </nav>

        <div class="logout" @click=${logout}>
          <img
            class="menu-icon"
            src="https://img.icons8.com/?size=100&id=59817&format=png&color=FFFFFF"
          />
          <span class="logout-text">Cerrar sesión</span>
        </div>

      </aside>

      <div id="contenedor"></div>
    `;

    render(template, root);
  };

  renderView();
}
