import { html, render } from "lit-html"
import { renderProductosView } from "@components/renderProductosView.mjs"
import { renderCarritoView } from "@/components/renderCarritoView.mjs"
import { renderCarrito } from "@/service/renderCarrito.mjs"
import { updateTotal } from "@/service/carrito.mjs"

export async function renderProductos(user) {
  const contenedor = document.getElementById("contenedor")

  const template = html`
    <style>
      #nav {
        width: 100%;
        display: flex;
        justify-content: center;
        background: #ffffff;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e5e5;
      }

      #nav .tab-buttons {
        display: flex;
        gap: 1.5rem;
        background: #f7f7f7;
        padding: 0.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }

      #nav .tab-btn {
        font-size: 1.05rem;
        font-weight: 600;
        text-decoration: none;
        color: #555;
        padding: 0.6rem 1.5rem;
        border-radius: 10px;
        transition: all 0.25s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 120px;
        text-align: center;
      }

      #nav .tab-btn:hover {
        background: #eaeaea;
      }

      #nav .tab-btn.active {
        background: #2ecc71;
        color: white;
        box-shadow: 0 3px 8px rgba(46, 204, 113, 0.35);
      }

    </style>
    <div class="nav" id="nav">
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
  const detalleBtn = document.getElementById("btn-detalle")
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
