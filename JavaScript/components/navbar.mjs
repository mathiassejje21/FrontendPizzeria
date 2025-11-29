  import { html, render } from "lit-html";
  import { authController } from "../controllers/authController.mjs";
  import { menuClienteNoLogeado, menuClienteLogeado } from "./rutasUsers.mjs";

  export function renderNavbarClientes(user) {
    const main = document.getElementById("main");

    const menu = user ? menuClienteLogeado : menuClienteNoLogeado;

    const hundleSiguiente = () => {
      const carrito = JSON.parse(sessionStorage.getItem("carrito") || "[]");
      if (carrito.length === 0) return
      if (carrito.length > 0) return window.location.href="/pizzeria/carrito";
    };

    const template = html`
      <nav id="nav-container">
        <section id="nav-logo">
          <a href="/pizzeria">
            <img src="https://cdn-icons-png.flaticon.com/512/15850/15850195.png" alt="Logo de la Pizzería" />
              <p>PIZZERIA DON MARIO</p>
            </div>
          </a>
        </section>
        <section id="nav-menu">
          <ul>
            ${menu.map(op => html`
              <li><a href="${op.ruta}" data-route>${op.texto}</a></li>
            `)}
          </ul>
        </section> 
        <section id="nav-user">
          ${user?
          (() => {
            const u = user;
            const authApi = new authController();
            return html`
              <button  @click=${() => authApi.logout()} id="logout-btn">
                Cerrar Sesión
              </button>
              <a style="cursor: pointer; text-decoration: none; color: inherit;" class="btn-user" href="/pizzeria/perfil" data-route id="user-info-btn">
                <img src="https://cdn-icons-png.flaticon.com/512/18851/18851106.png" alt="icono de usuario" />
                <div style="text-align: left; margin:0; display: flex; flex-direction: column; line-height: 1; padding:0">
                  <h6 style="margin:0; padding:0; font-size: 0.7rem; font-family: 'Libre Franklin', sans-serif">Bienvenido,</h6>
                  <p style="margin:0; padding:0"; font-size: 1rem>${u.nombre}</p>
                </div>
              </a>
            `;
            })()
          : html`
              <div class="btn-user" id="login-btn">
                <img src="https://cdn-icons-png.flaticon.com/512/18851/18851106.png" alt="" />
                <p>INICIAR SESIÓN</p>
              </div>
            `}
        </section>
      </nav>

      <section id="main-content">
        <div id="contenedor">
        </div>
        <div id="carrito-flotante">
          <img src="https://cdn-icons-png.flaticon.com/512/1170/1170627.png" alt="Icono de carrito de compras" />
          <span id="carrito-contador">0</span>
        </div>

        <div id="panel-carrito">
          <header>
            <h2>Tu carrito</h2>
            <button id="cerrar-carrito">✖</button>
          </header>
          <div class="contenido"></div>
            <footer>
              <span id="carrito-total">Total: S/ 0.00</span>
              <button @click="${hundleSiguiente}">Detalle Carrito</button>
            </footer>
          </div>
        </div>
      </section>
    `;

    render(template, main);

    const carritoBtn = document.getElementById("carrito-flotante");
    const panel = document.getElementById("panel-carrito");
    const cerrarBtn = document.getElementById("cerrar-carrito");
    const content = document.getElementById("contenedor");

    carritoBtn.addEventListener("click", () => {
      panel.classList.add("active");
    });

    cerrarBtn.addEventListener("click", () => {
      panel.classList.remove("active");
    });

    content.addEventListener("click", () => {
      panel.classList.remove("active");
    });

    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) loginBtn.addEventListener("click", () => (
      window.location.href = "/pizzeria/login"));
}
