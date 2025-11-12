import { html, render } from "lit-html";

export function renderNavbar() {
  const main = document.getElementById("main");

  const hundleLogin = () => {
    window.location.href = "/pizzeria/login";
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
        gap: 3rem;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
      }

      nav #menu ul li a {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
      }

      nav #menu ul li a:hover {
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
        font-weight: 600;
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
        bottom: 3rem ;
        right: 3rem;
        width: 50px;
        height: 50px;
        background-color: #ffd366;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #0a3a17;
        z-index: 9999;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      #carrito-flotante:hover{
        transform: scale(1.1);
        background-color: #0a3a17;
        color: white;
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

        <button class="contacto login-btn" @click="${hundleLogin}">
          <img src="/public/images/usuario.png" alt="" />
          <div>
            <p>Hola,</p>
            <p><strong>INICIAR SESIÓN</strong></p>
          </div>
        </button>
      </section>

      <section id="menu">
        <ul>
          <li><a href="/pizzeria" data-route>Inicio</a></li>
          <li><a href="/pizzeria/productos" data-route>Productos</a></li>
        </ul>
      </section>

      <section id="banner">
        <span>
          Delivery <strong>GRATIS</strong> de Lunes a Miércoles
          <strong>desde s/23.90.</strong> EXCLUSIVO POR WEB
        </span>
      </section>
    </nav>

    <section id="contenedor">
      <div id="carrito-flotante">🛒</div>
    </section>
  `;

  render(template, main);
  }

