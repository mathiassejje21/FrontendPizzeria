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

  const template = html`
    <style>
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 18%;
        height: 100vh;
        background: #ffffff;
        border-right: 1px solid #e5e5e5;
        padding: 2rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        font-family: "Inter", sans-serif;
        z-index: 1500;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
      }

      .sidebar-title {
        font-size: 1.45rem;
        font-weight: 700;
        color: #0a3a17;
        text-align: center;
      }

      .user-box {
        background: #f7f7f7;
        padding: 1rem;
        border-radius: 0.6rem;
        text-align: center;
        border: 1px solid #e2e2e2;
        font-size: 0.9rem;
      }
      .user-box strong {
        display: block;
        margin-top: 0.4rem;
        font-size: 1rem;
        color: #0a3a17;
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
        color: #333;
        text-decoration: none;
        display: block;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .menu-item:hover {
        background: #ececec;
        transform: translateX(4px);
      }

      .menu-item.active {
        background: #0a3a17;
        color: #ffffff;
        font-weight: 600;
      }

      .logout {
        margin-top: auto;
        padding: 0.85rem 1rem;
        border-radius: 0.45rem;
        background: #b30000;
        color: white;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
        transition: 0.25s;
      }

      .logout:hover {
        background: #8a0000;
      }

      #contenedor {
        margin-left: 18%;
        width: calc(100% - 18%);
        height: 100%;
      }
    </style>

    <aside class="sidebar">
      <h2 class="sidebar-title">Panel</h2>

      <div class="user-box">
        Usuario:
        <strong>${user.nombre}</strong>
        <span style="opacity: 0.7; font-size: 0.85rem;">${rol}</span>
      </div>

      <nav class="menu">
        ${menu.map(
          op => html`
            <a 
              href="${op.ruta}" 
              class="menu-item"
              data-route
            >
              ${op.texto}
            </a>
          `
        )}
      </nav>

      <div class="logout" @click=${hundleLogout}>
        Cerrar sesión
      </div>
    </aside>

    <div id="contenedor"></div>
  `;

  render(template, contenedor);
}
