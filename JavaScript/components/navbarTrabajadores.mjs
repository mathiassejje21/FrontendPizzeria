import { html, render } from "lit-html";
import { authController } from "../controllers/authController.mjs";
import { menuAdmin, menuPersonal } from "./rutasUsers.mjs";

export async function renderNavbarTrabajadores(user) {
  const root = document.getElementById("main");
  let collapsed = sessionStorage.getItem("navbar-collapsed") === "true";

  const rol = user.rol?.nombre || user.rol;
  const menu = rol === "administrador" ? menuAdmin : menuPersonal;

  const getIniciales = (nombre) => {
    const p = nombre.trim().split(" ");
    return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
  };

  const iniciales = getIniciales(user.nombre);

  const logout = async () => {
    const auth = new authController();
    await auth.logout();
  };

  const toggle = () => {
    collapsed = !collapsed;
    sessionStorage.setItem("navbar-collapsed", collapsed);
    renderView();
  };

  const activarItem = (e) => {
    document.querySelectorAll(".menu-item, .submenu-link").forEach(el => el.classList.remove("active"));
    e.currentTarget.classList.add("active");
  };

  const toggleInventario = (e) => {
    e.preventDefault();
    document.getElementById("submenuinventario").classList.toggle("active");
  };

  const toggleReportes = (e) => {
    e.preventDefault();
    document.getElementById("submenureportes").classList.toggle("active");
  };

  const renderView = () => {
    const template = html`

      <style>
        * {
          font-family: Inter, sans-serif;
          color: inherit;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        :root {
          --bg: #0f172a;
          --hover: #1e293b;
          --active: #334155;
          --accent: #38bdf8;
          --text: #e2e8f0;
          --text-dim: #94a3b8;
        }

        .active {
          background: var(--active) !important;
          color: var(--accent) !important;
          border-left: 3px solid var(--accent);
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: ${collapsed ? "80px" : "250px"};
          height: 100vh;
          background: var(--bg);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid #1e293b;
          transition: .25s ease;
          z-index: 3000;
        }

        .toggle-btn {
          position: absolute;
          right: -18px;
          top: 20px;
          width: 40px;
          height: 40px;
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 12px #38bdf890;
        }

        .toggle-btn img {
          width: 20px;
          filter: invert(1);
        }

        .avatar-box {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          cursor: pointer;
        }

        .avatar {
          width: ${collapsed ? "48px" : "68px"};
          height: ${collapsed ? "48px" : "68px"};
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 700;
          font-size: ${collapsed ? "1rem" : "1.4rem"};
          transition: .25s ease;
        }

        .username {
          margin-top: .6rem;
          display: ${collapsed ? "none" : "block"};
          font-weight: 600;
          font-size: .95rem;
          text-align: center;
          color: var(--text);
        }

        nav {
          width: 100%;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: .4rem;
        }

        .menu-item {
          padding: .8rem 1rem;
          display: flex;
          align-items: center;
          gap: ${collapsed ? "0" : "12px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          cursor: pointer;
          border-radius: 8px;
          color: var(--text-dim);
          transition: .25s ease;
          width: 100%;
        }

        .menu-item:hover {
          background: var(--hover);
          color: var(--text);
        }

        .menu-icon {
          width: 22px;
          filter: brightness(0) invert(1);
        }

        .menu-text {
          display: ${collapsed ? "none" : "inline"};
        }

        .submenu {
          display: none;
          flex-direction: column;
          gap: .4rem;
          width: 100%;
          padding-left: ${collapsed ? "0" : "1.6rem"};
        }

        .submenu.active {
          display: flex;
        }

        .submenu-link {
          padding: .6rem .9rem;
          background: #111827;
          border-radius: 8px;
          cursor: pointer;
          color: #cbd5e1;
        }

        .submenu-link:hover {
          background: #1e293b;
          color: var(--accent);
        }

        .submenu-link.active {
          background: var(--active);
          color: var(--accent);
          border-left: 3px solid var(--accent);
        }

        .logout {
          margin-top: auto;
          padding: .9rem 1rem;
          width: 100%;
          background: #b91c1c;
          border-radius: 8px;
          text-align: center;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? "center" : "flex-start"};
          gap: ${collapsed ? "0" : "10px"};
        }

        .logout:hover {
          background: #991b1b;
        }

        .logout-text {
          display: ${collapsed ? "none" : "inline"};
          color: white;
        }

        .logout-icon {
          width: 22px;
          filter: brightness(0) invert(1);
        }

        #contenedor {
          margin-left: ${collapsed ? "80px" : "250px"};
          width: calc(100% - ${collapsed ? "80px" : "250px"});
          min-height: 100vh;
          background: #020617;
          transition: .25s ease;
        }
      </style>

      <aside class="sidebar">

        <div class="toggle-btn" @click=${toggle}>
          <img src="${collapsed
            ? "https://img.icons8.com/?id=3220&format=png&color=FFFFFF"
            : "https://img.icons8.com/?id=113406&format=png&color=FFFFFF"}"/>
        </div>

        <a href="/${rol.toLowerCase()}/perfil" data-route class="avatar-box">
          <div class="avatar">${iniciales}</div>
          <div class="username">${user.nombre}</div>
        </a>

        <nav>
          ${menu.map(op =>
            op.texto === "Inventario" && rol.toLowerCase() === "administrador"
              ? html`
                  <div class="menu-item" @click=${toggleInventario}>
                    <img class="menu-icon" src="${op.img}">
                    <span class="menu-text">Inventario ▾</span>
                  </div>

                  <div id="submenuinventario" class="submenu">
                    <a class="submenu-link" href="/administrador/inventario/productos" data-route @click=${activarItem}>Productos</a>
                    <a class="submenu-link" href="/administrador/inventario/categorias" data-route @click=${activarItem}>Categorías</a>
                    <a class="submenu-link" href="/administrador/inventario/ingredientes" data-route @click=${activarItem}>Ingredientes</a>
                  </div>
                `
              : op.texto === "Reportes" && rol.toLowerCase() === "administrador"
              ? html`
                  <div class="menu-item" @click=${toggleReportes}>
                    <img class="menu-icon" src="${op.img}">
                    <span class="menu-text">Reportes ▾</span>
                  </div>

                  <div id="submenureportes" class="submenu">
                    <a class="submenu-link" href="/administrador/reportes/pedidos" data-route @click=${activarItem}>Pedidos</a>
                    <a class="submenu-link" href="/administrador/reportes/ventas" data-route @click=${activarItem}>Ventas</a>
                    <a class="submenu-link" href="/administrador/reportes/productos" data-route @click=${activarItem}>Productos</a>
                    <a class="submenu-link" href="/administrador/reportes/inventario-categorias" data-route @click=${activarItem}>Inventario</a>
                    <a class="submenu-link" href="/administrador/reportes/clientes" data-route @click=${activarItem}>Clientes</a>
                  </div>
                `
              : html`
                  <a class="menu-item" href="${op.ruta}" data-route @click=${activarItem}>
                    <img class="menu-icon" src="${op.img}">
                    <span class="menu-text">${op.texto}</span>
                  </a>
                `
          )}
        </nav>

        <div class="logout" @click=${logout}>
          <img 
            class="logout-icon" 
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
