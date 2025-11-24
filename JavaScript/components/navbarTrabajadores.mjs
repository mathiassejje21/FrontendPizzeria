import { html, render } from "lit-html";
import { authController } from "../controllers/authController.mjs";
import { menuAdmin, menuPersonal } from "./rutasUsers.mjs";

export async function renderNavbarTrabajadores(user) {
  const contenedor = document.getElementById("main");
  const rol = user.rol?.nombre || user.rol;
  const esAdmin = rol === "administrador";
  const esPersonal = rol === "personal";

  const menu = esAdmin ? menuAdmin : menuPersonal;

  async function hundleLogout() {
    const auth = new authController();
    await auth.logout();
  }
  const template = html`
    <style>
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 240px;
        height: 100vh;
        background: #ffffff;
        border-right: 1px solid #e5e5e5;
        padding: 2rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        font-family: "Inter", sans-serif;
        z-index: 1500;
      }
      .sidebar-title {
        font-size: 1.4rem;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: #0a3a17;
        text-align: center;
      }
      .user-box {
        background: #f7f7f7;
        padding: 1rem;
        border-radius: 0.6rem;
        text-align: center;
        font-size: 0.9rem;
        color: #333;
        border: 1px solid #e2e2e2;
      }
      .user-box strong {
        display: block;
        margin-top: 0.3rem;
        font-size: 1rem;
        color: #0a3a17;
      }
      .menu {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .menu-item {
        padding: 0.75rem 1rem;
        border-radius: 0.4rem;
        font-weight: 500;
        font-size: 0.95rem;
        color: #333;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .menu-item:hover {
        background: #ededed;
      }
      .logout {
        margin-top: auto;
        padding: 0.75rem 1rem;
        border-radius: 0.4rem;
        background: #b30000;
        color: white;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      }
      .logout:hover {
        background: #8c0000;
      }
      #main {
        margin-left: 260px !important;
        padding: 2rem;
      }
    </style>

    <aside class="sidebar">
      <h2 class="sidebar-title">Panel</h2>

      <div class="user-box">
        Usuario:
        <strong>${user.nombre}</strong>
        <span style="font-size: 0.85rem; opacity: 0.7;">
          ${rol}
        </span>
      </div>

      <div class="menu">
        ${menu.map(
          op => html`
            <div class="menu-item" @click=${() => (location.href = op.ruta)}>
              ${op.texto}
            </div>
          `
        )}
      </div>

      <div class="logout" @click=${() => hundleLogout()}>
        Cerrar sesión
      </div>
    </aside>
  `;

  render(template, contenedor);
}
