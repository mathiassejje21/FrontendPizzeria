import { html, render } from "lit-html";
import { authController } from "../controllers/authController.mjs";
import { menuClienteNoLogeado, menuClienteLogeado } from "./rutasUsers.mjs";

export function renderNavbarClientes(user) {
  const main = document.getElementById("main");
  const menu = user ? menuClienteLogeado : menuClienteNoLogeado;

  const hundleSiguiente = () => {
    const carrito = JSON.parse(sessionStorage.getItem("carrito") || "[]");
    if (carrito.length === 0) return;
    return window.location.href = "/pizzeria/carrito";
  };

  const getIniciales = (nombre) => {
    if (!nombre) return "U";
    const partes = nombre.trim().split(" ");
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  };

  const getnameUser = (nombre) => {
    if (!nombre) return "User";
    return nombre.trim().split(" ")[0];
  };

  const template = html`
    <nav id="nav-container">
      <section id="nav-logo">
        <a href="/pizzeria">
          <img src="https://cdn.pixabay.com/photo/2025/08/01/13/52/ai-generated-9748675_1280.png" />
          <div>
            <p><span style="color: #fff">Pizz</span><span style="color: #3FAF52">er</span><span style="color: #B3231F">ia</p>
            <h6>DON MARIO</h6>
          </div>
        </a>
      </section>

      <section id="nav-menu">
        <ul>
          ${menu.map(op => html`
            <section>
              <li>
                <img src="${op.img}" width="15px" height="15px" />
                <a class="active" href="${op.ruta}" data-route>${op.texto}</a>
              </li>
              <div class="active"></div>
            </section>
          `)}
        </ul>
      </section> 

      <section id="nav-user">
        ${user ?
          (() => {
            const u = user;
            const authApi = new authController();
            const iniciales = getIniciales(u.nombre);
            const nameUser = getnameUser(u.nombre);

            return html`
              <div class="btn-user" style="display:flex; align-items:center; gap:.8rem;">
                <button id="logout-btn"
                  @click=${() => authApi.logout()}
                >
                  <img src="https://img.icons8.com/?size=100&id=59781&format=png&color=FFFFFF" style="width:20px; height:20px; object-fit:cover" />
                </button>
                <a href="/pizzeria/perfil" data-route">
                  <div 
                    style="
                      width:38px; 
                      height:38px; 
                      border-radius:50%;
                      background:#0a3a17;
                      color:white;
                      font-weight:700;
                      display:flex;
                      justify-content:center;
                      align-items:center;
                      font-size:1rem;
                    "
                  >
                    ${iniciales}
                  </div>
                  <div class="user-name">
                    <p style="margin:0; padding: 0; font-size:.8rem;">Usuario</p>                
                    <p style="margin:0; padding: 0; font-weight:600;">${nameUser}</p>
                  </div>
                </a>
              </div>
            `;
          })()
          :
          html`
            <div 
              id="login-btn"
            >
              <img src="https://img.icons8.com/?size=100&id=85750&format=png&color=FFFFFF" width="26" height="26" />
              <p>Iniciar sesión</p>
            </div>
          `
        }
      </section>
    </nav>

    <section id="main-content">
      <div id="contenedor"></div>

      <div id="carrito-flotante">
        <img src="https://img.icons8.com/?size=100&id=85080&format=png&color=FA5252" />
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
    </section>
  `;

  render(template, main);

  const carritoBtn = document.getElementById("carrito-flotante");
  const panel = document.getElementById("panel-carrito");
  const cerrarBtn = document.getElementById("cerrar-carrito");
  const content = document.getElementById("contenedor");

  carritoBtn.addEventListener("click", () => panel.classList.add("active"));
  cerrarBtn.addEventListener("click", () => panel.classList.remove("active"));
  content.addEventListener("click", () => panel.classList.remove("active"));

  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) loginBtn.addEventListener("click", () => (
    window.location.href = "/pizzeria/login"));

  window.addEventListener("scroll", () => {
    const nav = document.getElementById("nav-container");
    if (window.scrollY > 25) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
}
