import { html, render } from 'lit-html';
import { productoController } from '@controllers/productoController.mjs';
import { categoriaController } from '@controllers/categoriaController.mjs';
import { tamanioController } from '../../controllers/tamanioController.mjs';
import { agregarAlCarrito, renderCarrito } from './carrito.mjs';
import { updateTotal } from '@/service/carrito.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';
import { router } from '@/router.mjs';

export async function mostrarProductos() {
  const apiProducto = new productoController();
  const apiCategoria = new categoriaController();
  const categorias = await apiCategoria.getCategorias();

  const viewProductos = async (idCategoria = '') => {
    const res = await apiProducto.getProductosporCategoria(idCategoria);
    return Array.from(res);
  };

  const productos = await apiProducto.getProductos();
  if (!productos || productos.length === 0) return;

  const renderProductosFiltrados = async (idCategoria = '', searchQuery = '') => {
    let filtrados;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      );
    } else if (idCategoria) {
      filtrados = await viewProductos(idCategoria);
    } else {
      filtrados = productos;
    }

    const apiTamanio = new tamanioController();
    const tamanios = await apiTamanio.getTamanios();

    return html`
      <style>
        .product-card {
          cursor: pointer;
          transition: all 0.3s ease;

        }
        .product-card:hover {
          transform: scale(1.03);
          background-color: #f5f5f5;
        }
      </style>
      <div class="row g-4 mt-3">
        ${filtrados.map(p => html`
          <div class="col-md-4 col-sm-6 col-lg-3">
            <div class="card h-100 shadow-sm product-card p-3" data-id="${p.id}">
              <h5>${p.nombre}</h5>
              <p>${p.descripcion}</p>
              <p class="fw-bold">S/.${p.precioReal}</p>
              <div style="display: flex; flex-direction: row; gap:.5rem;">
                ${p.categoria.id === 1 ? html`
                  <select id="tamanio-${p.id}" class="form-select mb-2">
                    <option value="">Tamaño</option>
                    ${tamanios.map(t => html`
                      <option value='${JSON.stringify(t)}'>${t.nombre}</option>
                    `)}
                  </select>
                ` : ""}

                <input 
                  type="number" 
                  min="1" 
                  value="1" 
                  id="cantidad-${p.id}" 
                  class="form-control mb-2"
                >
              </div>
              <button 
                class="btn w-100"
                style="background:#b30000; color:white;"
                @click=${() => {
                  const cantidad = document.getElementById(`cantidad-${p.id}`).value;
                  if (isNaN(cantidad) || cantidad <= 0) {
                    return mensajeAlert({
                      icon: "warning",
                      title: "Cantidad inválida",
                      text: "Ingresa una cantidad válida.",
                      showConfirmButton: true
                    });
                  }

                  let tamanio = null;

                  if (p.categoria?.id === 1) {
                    const select = document.getElementById(`tamanio-${p.id}`);
                    const value = select.value;

                    if (!value) {
                      return mensajeAlert({
                        icon: "warning",
                        title: "Tamaño requerido",
                        text: "Selecciona un tamaño para la pizza.",
                        showConfirmButton: true
                      });
                    }

                    tamanio = JSON.parse(value);
                  }

                  agregarAlCarrito(p, cantidad, tamanio);

                  mensajeAlert({
                    icon: "success",
                    title: "Producto agregado",
                    text: "El producto se agregó al carrito correctamente.",
                    timer: 1200
                  });                  
                }}
              >Agregar al carrito</button>
            </div>
          </div>
        `)}
      </div>
    `
    ;
    
  };

  const mainTemplate = html`
    <style>
      #contenedor { padding: 2rem; background-color: #f8f9fa; min-height: 80vh; }
      .top-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
      .categorias-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; flex: 1; }
      .categorias-buttons button { padding: 0.5rem 1rem; border: none; border-radius: 8px; background-color: #e9ecef; cursor: pointer; font-weight: 600; transition: 0.2s; }
      .categorias-buttons button.active { background-color: #0a3a17; color: white; }
      #searchInput { width: 250px; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #ced4da; }
      .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
      @media (max-width: 768px) { .top-bar { flex-direction: column; gap: 0.5rem; } #searchInput { width: 100%; } }
    </style>

    <div class="top-bar">
      <input id="searchInput" type="search" placeholder="Buscar productos...">
      <div class="categorias-buttons">
        <button data-value="" class="active">Todas</button>
        ${categorias.map(c => html`<button data-value="${c.id}">${c.nombre}</button>`)}
      </div>
    </div>
    <div id="productosContainer"></div>
  `;

  const contenedor = document.getElementById('contenedor');
  render(mainTemplate, contenedor);

  const botones = contenedor.querySelectorAll('.categorias-buttons button');
  const productosContainer = contenedor.querySelector('#productosContainer');
  const searchInput = contenedor.querySelector('#searchInput');

  render(await renderProductosFiltrados(''), productosContainer);
  renderCarrito();
  updateTotal();

  botones.forEach(btn => {
    btn.addEventListener('click', async () => {
      botones.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.getAttribute('data-value');
      render(await renderProductosFiltrados(id, ''), productosContainer);
      renderCarrito();
      updateTotal();
    });
  });

  searchInput.addEventListener('input', async () => {
    render(await renderProductosFiltrados('', searchInput.value), productosContainer);
    renderCarrito();
    updateTotal();
  });

  setTimeout(() => {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        if (e.target.tagName === "INPUT") return;
        if (e.target.tagName === "SELECT") return;

        const id = card.getAttribute("data-id");
        router.navigate(`/pizzeria/productos/${id}`);
      });
    });
  }, 50);
}
