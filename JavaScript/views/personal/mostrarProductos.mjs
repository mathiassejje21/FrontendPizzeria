import { html, render } from "lit-html"
import { renderProductosView } from "@components/renderProductosView.mjs"
import { renderCarritoView } from "@/components/renderCarritoView.mjs"
import { renderCarrito } from "@/service/renderCarrito.mjs"
import { updateTotal } from "@/service/carrito.mjs"

export async function renderProductos(user) {
  const contenedor = document.getElementById("contenedor")

  const template = html`
    <style>
      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background: #020617;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      #contenedor {
        width: 100%;
        min-height: 100vh;
        background: #020617;
        color: #f9fafb;
      }

      #nav {
        width: 100%;
        display: flex;
        justify-content: center;
        background: #020617;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(148,163,184,0.35);
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      }

      #nav .tab-buttons {
        display: flex;
        gap: 0.75rem;
        background: #0b1220;
        padding: 0.4rem;
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.5);
      }

      #nav .tab-btn {
        font-size: 0.95rem;
        font-weight: 600;
        text-decoration: none;
        color: #e5e7eb;
        padding: 0.55rem 1.4rem;
        border-radius: 999px;
        transition: 0.25s ease;
        min-width: 110px;
        text-align: center;
        cursor: pointer;
        background: transparent;
      }

      #nav .tab-btn:hover {
        background: #1f2937;
      }

      #nav .tab-btn.active {
        background: #22c55e;
        color: #020617;
        box-shadow: 0 0 18px rgba(34,197,94,0.65);
      }

      #main-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 1.5rem 3rem;
      }

      #vista-dinamica {
        width: 100%;
        max-width: 1320px;
        margin: 2.5rem auto 0 auto;
      }

      @media (max-width: 768px) {
        #main-content {
          padding: 0 1rem 3rem;
        }

        #vista-dinamica {
          margin-top: 2rem;
        }
      }
    </style>
    <section >
    <div id="nav">
      <div class="tab-buttons">
        <a id="btn-productos" data-route class="tab-btn active" href="#productos">Productos</a>
        <a id="btn-carrito" data-route class="tab-btn" href="#carrito">Carrito</a>
      </div>
    </div>

    <section id="main-content">
      <div id="vista-dinamica"></div>

      <div id="carrito-flotante">
        <img src="https://cdn-icons-png.flaticon.com/512/1170/1170627.png">
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
        </footer>
      </div>
    </section>
  `

  render(template, contenedor)

  const btnProductos = document.getElementById("btn-productos")
  const btnCarrito = document.getElementById("btn-carrito")
  const vista = document.getElementById("vista-dinamica")
  const carritoBtn = document.getElementById("carrito-flotante")
  const panel = document.getElementById("panel-carrito")
  const cerrarBtn = document.getElementById("cerrar-carrito")
  const content = document.getElementById("main-content")

  function activarProductos() {
    btnProductos.classList.add("active")
    btnCarrito.classList.remove("active")
  }

  function activarCarrito() {
    btnCarrito.classList.add("active")
    btnProductos.classList.remove("active")
  }

  async function mostrarProductos() {
    activarProductos()
    await renderProductosView({ detalleRouteBase: "/personal/productos" }, vista)
  }

  async function mostrarCarrito() {
    activarCarrito()
    await renderCarritoView(user, vista)
  }

  function cargarSegunHash() {
    if (location.hash === "#carrito") {
      mostrarCarrito()
    } else {
      mostrarProductos()
    }
  }

  btnProductos.onclick = e => {
    e.preventDefault()
    if (location.hash !== "#productos") {
      history.replaceState(null, "", "#productos")
    }
    mostrarProductos()
  }

  btnCarrito.onclick = e => {
    e.preventDefault()
    if (location.hash !== "#carrito") {
      history.replaceState(null, "", "#carrito")
    }
    mostrarCarrito()
  }

  window.addEventListener("hashchange", cargarSegunHash)

  carritoBtn.onclick = e => {
    e.stopPropagation()
    panel.classList.add("active")
  }

  cerrarBtn.onclick = e => {
    e.stopPropagation()
    panel.classList.remove("active")
  }

  panel.onclick = e => e.stopPropagation()
  content.onclick = () => panel.classList.remove("active")

  cargarSegunHash()
  updateTotal()
  renderCarrito()
}
