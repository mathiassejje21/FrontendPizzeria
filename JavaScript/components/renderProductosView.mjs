import { html, render } from 'lit-html';
import { productoController } from '@controllers/productoController.mjs';
import { categoriaController } from '@controllers/categoriaController.mjs';
import { tamanioController } from '@controllers/tamanioController.mjs';
import { agregarAlCarrito, renderCarrito } from '@/service/renderCarrito.mjs';
import { filterBasic } from '@/service/listTools.mjs';
import { updateTotal } from '@/service/carrito.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';
import { router } from '@/router.mjs';

export async function renderProductosView(
  { detalleRouteBase = "/pizzeria/productos" },
  contenedor = document.getElementById("contenedor")
) {
  const apiProducto = new productoController();
  const apiCategoria = new categoriaController();

  const categorias = await apiCategoria.getCategoriasActivo();
  let productos = await apiProducto.getProductoActivo();

  let searchQuery = "";
  let idCategoria = null;
  let tamanio = null;

  const reloadProductos = async () => {
    productos = idCategoria
      ? await apiProducto.getProductosporCategoriaActivo(idCategoria)
      : await apiProducto.getProductoActivo();
    renderView();
  };

  const getProductosFilter = () => {
    return filterBasic(productos, ["nombre", "descripcion"], searchQuery);
  };

  const renderProductosFiltrados = () => html`
    <div class="row g-4 mt-4 px-2">
      ${getProductosFilter().map(p => html`
        <div class="col-md-4 col-sm-6 col-lg-3 p-2">
          <div class="card product-card" 
            @click=${() => router.navigate(`${detalleRouteBase}/${p.id}`)}>
            
            <img src="${p.imagen_url}" class="product-img">

            <div class="p-3">
              <h5>${p.nombre}</h5>
              <p>${p.descripcion}</p>
              <p class="price-tag">S/. ${p.precioReal}</p>

              <button class="add-btn"
                @click=${async (e) => {
                  e.stopPropagation();
                  const pendingUrl = sessionStorage.getItem("last_payment_url");
                  if (pendingUrl) {
                    return mensajeAlert({
                      icon: "warning",
                      title: "Pago pendiente",
                      text: "Tienes un pago pendiente.",
                      showConfirmButton: true
                    }).then(() => location.href = "/pizzeria/pedidos");
                  }

                  if (p.personalizable) {
                    const apiTamanio = new tamanioController();
                    const tamanios = await apiTamanio.getTamanios();
                    tamanio = tamanios.find(t => t.id === 2) || null;
                  }

                  agregarAlCarrito(p, 1, tamanio, p.ingredientes || []);
                  mensajeAlert({
                    icon: "success",
                    title: "Producto agregado",
                    text: "Se agregó correctamente.",
                    timer: 1000
                  });
                }}
              >+</button>
            </div>
          </div>
        </div>
      `)}
    </div>
  `;

  const renderView = () => {
    const mainTemplate = html`
      <style>
        .productos-wrapper {
          padding: 2rem;
          margin: 2rem 2.5rem;
          background:#f8f9fa;
          min-height: 85vh;
          border-radius: 1rem;
        }
        .top-bar {
          display:flex; justify-content:space-between;
          align-items:center; flex-wrap:wrap;
          margin-bottom:1.8rem;
          padding: 0 .3rem;
        }
        #searchInput {
          width:280px; padding:0.6rem 1rem;
          border-radius:10px; border:1px solid #ced4da;
        }
        .categorias-buttons { 
          display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; align-items:center; width:100%; 
        }
        .categorias-buttons button {
          padding:0.6rem 1.2rem;
          border:none;
          border-radius:10px;
          background:#e9ecef;
          cursor:pointer;
          font-weight:600;
          transition:0.2s;
        }
        .categorias-buttons button.active {
          background:#0a3a17;
          color:white;
          box-shadow:0 0 10px rgba(0,0,0,0.2);
          transform:scale(1.05);
        }
        .product-card {
          cursor:pointer;
          transition:0.25s ease;
          border-radius:1rem;
          background:#fff;
          overflow:hidden;
          box-shadow:0 6px 20px rgba(0,0,0,0.1);
        }
        .product-card:hover { transform:translateY(-5px); }
        .product-img { width:100%; height:190px; object-fit:cover; }
        .add-btn {
          background:#b30000; color:white;
          width:45px; height:45px;
          border:none; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:22px; cursor:pointer; transition:.2s;
        }
        .add-btn:hover { background:#8d0000; }
        .price-tag { font-size:20px; font-weight:700; color:#b30000; }
      </style>

      <div class="productos-wrapper">
        <div class="top-bar">

          <div class="categorias-buttons">
            <button
              class="${idCategoria === null ? 'active' : ''}"
              @click=${() => { idCategoria = null; reloadProductos(); }}
            >Todas</button>

            ${categorias.map(c => html`
              <button
                class="${c.id === idCategoria ? 'active' : ''}"
                @click=${() => { idCategoria = c.id; reloadProductos(); }}
              >${c.nombre}</button>
            `)}
          </div>
        </div>
        <input
            id="searchInput"
            type="search"
            placeholder="Buscar productos..."
            @input=${(e) => { searchQuery = e.target.value; renderView(); }}
        >
        <div id="productosContainer">${renderProductosFiltrados()}</div>
      </div>
    `;

    render(mainTemplate, contenedor);
    renderCarrito(contenedor);
    updateTotal();
  };

  renderView();
}
