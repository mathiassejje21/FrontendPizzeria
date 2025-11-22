  import { html, render } from "lit-html";
  import { authController } from "../controllers/authController.mjs";
  import { mensajeAlert } from "./mensajeAlert.mjs";

  export function renderNavbar() {
    const main = document.getElementById("main");

    const hundleLogin = () => {
      window.location.href = "/pizzeria/login";
    };

    const hundleSiguiente = () => {
      const carrito = JSON.parse(sessionStorage.getItem("carrito") || "[]");
      if (carrito.length === 0) return
      if (carrito.length > 0) return window.location.href="/pizzeria/carrito";
    };

    const template = html`
      <style>
        a {
          text-decoration: none;
          color: inherit;
        }

        html {
          scroll-behavior: smooth;
        }

        nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(6px);
          background-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25),
            0 2px 4px rgba(255, 255, 255, 0.3);
        }

        nav #header {
          background-color: white;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0.2rem 4rem;
          flex-wrap: wrap;
          border-bottom: 1px solid #e7e6e6;
        }

        nav #menu {
          background: linear-gradient(to right, #15271bff, #1b5218ff, #15271bff);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.4rem 0;
        }

        nav #banner {
          background: linear-gradient(to right, #7a6a2a, #ffd366, #7a6a2a);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.3rem 0;
          color: #2d5d2a;
          font-size: 19px;
          font-family: "Trebuchet MS";
        }

        nav #menu ul {
          display: flex;
          justify-content: center;
          align-items: center;
          list-style: none;
          flex-wrap: wrap;
          margin: 0;
          padding: 0;
        }

        nav #menu ul li {
          width: 100px;
          transition: all 0.3s ease;
          border-radius: 3px;
        }

        nav #menu ul li a {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.2rem 0.5rem;
          text-align: center;
          display: block;
        }

        nav #menu ul li:hover {
          background-color: #ffffff20;
        }

        .contactos {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-self: start;
        }

        .contacto {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contacto img,
        .login-btn img {
          width: 30px;
          height: 30px;
        }

        .contacto p {
          margin: 0;
          line-height: 1;
          font-size: 0.9rem;
          text-align: left;
          padding: 0.1rem 0;
        }

        .logo {
          justify-self: center;
        }

        .logo img {
          width: 200px;
        }

        .login-btn {
          justify-self: end;
          border: none;
          background-color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.2rem 0.5rem;
        }

        .login-btn:hover {
          transform: scale(1.05);
          border-bottom: 2px solid #0a3a17;
          border-radius: 0.4rem;
        }

        strong {
          color: #0a3a17;
        }

        nav #menu ul li a.active {
          border-bottom: 2px solid #ffd366;
        }

        #carrito-flotante {
          position: fixed;
          bottom: 3rem;
          right: 3rem;
          width: 55px;
          height: 55px;
          background-color: #ffd366;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #0a3a17;
          z-index: 9999;
          cursor: pointer;
          transition: all 0.3s ease;
          position: fixed;
        }

        #carrito-contador {
          position: absolute;
          top: -8px;
          left: -8px;
          background: red;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-weight: 700;
        }

        #carrito-flotante:hover {
          transform: scale(1.1);
          background-color: #0a3a17;
          color: white;
        }

        #panel-carrito {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100%;
          background-color: white;
          box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
          transition: right 0.4s ease;
          z-index: 10000;
          display: flex;
          flex-direction: column;
        }

        #panel-carrito.active {
          right: 0;
        }

        #panel-carrito header {
          background-color: #0a3a17;
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #panel-carrito header h2 {
          margin: 0;
          font-size: 1.3rem;
        }

        #panel-carrito header button {
          background: none;
          border: none;
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
        }

        #panel-carrito .contenido {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        #panel-carrito footer {
          padding: 1rem;
          border-top: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #panel-carrito footer button {
          background-color: #ffd366;
          color: #0a3a17;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        #panel-carrito footer button:hover {
          background-color: #a98b40ff;
          color: #fff;
        }

        #caja-btn {
          justify-self: end;
          border: none;
          background-color: white;
          display: flex;
          align-items: center;
          gap:1rem
        }
          }
      </style>

      <nav>
        <section id="header">

          <section class="contactos">
            <div class="contacto">
              <img src="/public/images/whatsapp.png" alt="" />
              <div>
                <p>Pide por</p>
                <p><strong>WHATSAPP</strong></p>
              </div>
            </div>

            <div class="contacto">
              <img src="/public/images/llamar.png" alt="" />
              <div>
                <p>Llámanos</p>
                <p><strong>000-333-44</strong></p>
              </div>
            </div>

            <div class="contacto">
              <img src="/public/images/facebook.png" alt="" />
              <div>
                <p>Encuéntranos</p>
                <p><strong style="color: #415de7;">Facebook</strong></p>
              </div>
            </div>
          </section>

          <section class="logo">
            <a href="/pizzeria">
              <img src="/public/images/pizzeria.png" alt="Logo de la Pizzería" />
            </a>
          </section>

          ${sessionStorage.getItem("user")
            ? (() => {
                const u = JSON.parse(sessionStorage.getItem("user"));
                if (u.rol !== 'cliente') {
                  mensajeAlert({
                    icon: 'warning',
                    title: 'Acceso denegado',
                    text: 'No tienes permiso para acceder a esta vista.',
                    showConfirmButton: true
                  }).then(async () => {
                    await sessionStorage.removeItem('user');
                    return location.href = '/trabajadores/login';
                  });  
                }
                const authApi = new authController();
                return html`
                  <div class="contacto" id="caja-btn">
                    <button class="btn btn-danger" @click=${() => authApi.logout()}>
                      Cerrar Sesión
                    </button>
                    <button class="contacto login-btn" id="user-info-btn">
                      <img src="/public/images/usuario.png" alt="" />
                      <div>
                        <p>Bienvenido,</p>
                        <p><strong>${u.nombre}</strong></p>
                      </div>
                    </button>
                </div>
                `;
              })()
            : html`
                <button class="contacto login-btn" id="login-btn">
                  <img src="/public/images/usuario.png" alt="" />
                  <div>
                    <p>Hola,</p>
                    <p><strong>INICIAR SESIÓN</strong></p>
                  </div>
                </button>
              `}
        </section>

        <section id="menu">
          <ul>
            <li><a href="/pizzeria" data-route>Inicio</a></li>
            <li><a href="/pizzeria/productos" data-route>Productos</a></li>
            <li><a href="/pizzeria/carrito" data-route>Carrito</a></li>
            ${sessionStorage.getItem("user")
              ? (() => {
                  const u = JSON.parse(sessionStorage.getItem("user"));
                  if (u.rol === 'cliente') {
                    return html`
                      <li>
                        <a href="/pizzeria/pedidos" data-route>Mis Pedidos</a>
                      </li>
                    `;
                  }
                })()
              : ''}
          </ul>
        </section>

        <section id="banner">
          <span>
            Delivery <strong>GRATIS</strong> de Lunes a Miércoles
            <strong>desde s/23.90.</strong> EXCLUSIVO POR WEB
          </span>
        </section>
      </nav>
      <section id="main">
        <div id="contenedor">
        </div>
        <div id="carrito-flotante">
          🛒
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
    if (loginBtn) loginBtn.addEventListener("click", hundleLogin);

    const userInfoBtn = document.getElementById("user-info-btn");
    if (userInfoBtn) {
      userInfoBtn.addEventListener("click", () => {
        window.location.href = "/pizzeria/dashboard";
      });
    }
}
