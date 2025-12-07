import { html, render } from "lit-html";
import { authController } from "../controllers/authController.mjs";
import { menuAdmin, menuPersonal } from "./rutasUsers.mjs";

export async function renderNavbarTrabajadores(user) {
  const contenedor = document.getElementById("main");
  const rol = user.rol?.nombre || user.rol;
  const menu = rol === "administrador" ? menuAdmin : menuPersonal;

  const hundleLogout = async () => {
    const auth = new authController();
    await auth.logout();
  };

  const hundleInventario = (e) => {
    e.preventDefault();
    document.querySelectorAll(".menu-item").forEach(el => {
      el.classList.remove("active");
    });
    const cont = document.getElementById("submenuinventario");
    cont.classList.toggle("active");
  };

  const hundleReportes = (e) => {
    e.preventDefault();
    document.querySelectorAll(".menu-item").forEach(el => {
      el.classList.remove("active");
    });
    const cont = document.getElementById("submenureportes");
    cont.classList.toggle("active");
  };

  const template = html`
    <style>
      .sidebar {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 18%;
        height: 100vh;
        background: #020617;
        padding: 2rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        font-family: "Inter", sans-serif;
        z-index: 1500;
        box-shadow: 4px 0 20px rgba(0,0,0,0.5);
        color: #e5e7eb;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      .sidebar-title {
        font-size: 1.45rem;
        font-weight: 700;
        color: #4ade80;
        text-align: center;
      }

      .user-box {
        background: #0f172a;
        padding: 1rem;
        border-radius: 0.6rem;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.08);
        font-size: 0.9rem;
        color: #94a3b8;
      }
      .user-box strong {
        display: block;
        margin-top: 0.4rem;
        font-size: 1rem;
        color: #e2e8f0;
      }

      .menu {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .menu-item {
        padding: 0.75rem 1rem;
        border-radius: 0.45rem;
        font-weight: 500;
        font-size: 0.98rem;
        color: #cbd5e1;
        cursor: pointer;
        transition: 0.25s ease;
        display: block;
      }

      .menu-item:hover {
        background: #111827;
        transform: translateX(4px);
        color: #f8fafc;
      }

      .menu-item.active,
      #btnInventario.active,
      #btnReportes.active {
        background: #1e293b;
        color: #4ade80;
        font-weight: 600;
        border-left: 3px solid #4ade80;
      }

      .logout {
        margin-top: auto;
        padding: 0.85rem 1rem;
        border-radius: 0.45rem;
        background: #7f1d1d;
        color: white;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
        transition: 0.25s;
      }

      .logout:hover {
        background: #991b1b;
      }

      #contenedor {
        margin-left: 18%;
        width: calc(100% - 18%);
        height: 100%;
        background: #020617;
      }

      .submenuinventario,
      .submenureportes {
        display: none;
        flex-direction: column;
        gap: 0.4rem;
        margin-left: 1rem;
        padding-left: 0.5rem;
      }

      .submenuinventario.active,
      .submenureportes.active {
        display: flex;
      }

      .menu-inventario.active,
      .menu-reporte.active {
        background: #1e293b;
        color: #4ade80;
        font-weight: 600;
      }

      .menu-inventario:hover,
      .menu-reporte:hover {
        background: #111827;
        color: #4ade80;
      }
    </style>

    <aside class="sidebar">
      <h2 class="sidebar-title">Panel</h2>

      <a href="/${rol.toLowerCase()}/perfil" data-route class="user-box">
        Usuario:
        <strong>${user.nombre}</strong>
        <span style="opacity: 0.7; font-size: 0.85rem;">${rol}</span>
      </a>

      <nav class="menu">
        ${menu.map(op =>
          op.texto === "Inventario" && rol.toLowerCase() === "administrador"
            ? html`
                <div class="menu-item" id="btnInventario" @click=${hundleInventario}>
                  Inventario ▾
                </div>

                <div id="submenuinventario" class="submenuinventario">
                  <a href="/administrador/inventario/productos" data-route class="menu-item menu-inventario">Productos</a>
                  <a href="/administrador/inventario/categorias" data-route class="menu-item menu-inventario">Categorías</a>
                  <a href="/administrador/inventario/ingredientes" data-route class="menu-item menu-inventario">Ingredientes</a>
                </div>
              `
            : op.texto === "Reportes" && rol.toLowerCase() === "administrador"
            ? html`
                <div class="menu-item" id="btnReportes" @click=${hundleReportes}>
                  Reportes ▾
                </div>

                <div id="submenureportes" class="submenureportes">
                  <a href="/administrador/reportes/pedidos" data-route class="menu-item menu-reporte">Pedidos</a>
                  <a href="/administrador/reportes/ventas" data-route class="menu-item menu-reporte">Ventas</a>
                  <a href="/administrador/reportes/productos" data-route class="menu-item menu-reporte">Productos</a>
                  <a href="/administrador/reportes/inventario-categorias" data-route class="menu-item menu-reporte">Inventario </a>
                  <a href="/administrador/reportes/clientes" data-route class="menu-item menu-reporte">Clientes</a>
                </div>
              `
            : html`
                <a href="${op.ruta}" class="menu-item" data-route>${op.texto}</a>
              `
        )}
      </nav>

      <div class="logout" @click=${hundleLogout}>Cerrar sesión</div>
    </aside>

    <div id="contenedor"></div>
  `;

  render(template, contenedor);
}
