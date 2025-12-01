import { html, render } from 'lit-html';
import { productoController } from '@controllers/productoController.mjs';
import { categoriaController } from '@controllers/categoriaController.mjs';
import { tamanioController } from '@controllers/tamanioController.mjs';
import { agregarAlCarrito, renderCarrito } from '@/service/renderCarrito.mjs';
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
  const productos = await apiProducto.getProductoActivo();
  if (!productos || productos.length === 0) return;

  const viewProductos = async (idCategoria = '') => {
    const res = await apiProducto.getProductosporCategoriaActivo(idCategoria);
    return Array.from(res);
  };

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

    return html`
      <style>
        .product-card {
          cursor: pointer;
          transition: 0.25s ease;
          border-radius: 1rem;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          padding-bottom: 1rem;
        }
        .product-card:hover { transform: translateY(-5px); }
        .product-img { width: 100%; height: 190px; object-fit: cover; }
        .add-btn {
          background:#b30000; color:white; width:45px; height:45px;
          border:none; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:22px; cursor:pointer; transition:0.2s;
        }
        .add-btn:hover { background:#8d0000; }
        .price-tag { font-size:20px; font-weight:700; color:#b30000; }
      </style>

      <div class="row g-4 mt-4 px-2">
        ${filtrados.map(p => html`
          <div class="col-md-4 col-sm-6 col-lg-3 p-2">
            <div class="card product-card" @click=${() => router.navigate(`${detalleRouteBase}/${p.id}`)} style="cursor:pointer;">
              <img src="${p.imagen_url}" class="product-img" alt="${p.nombre}">
              <div class="p-3">
                <h5 style="font-weight:700;">${p.nombre}</h5>
                <p style="min-height:50px; color:#555;">${p.descripcion}</p>
                <p class="price-tag">S/. ${p.precioReal}</p>

                <div style="display:flex; justify-content:flex-end; padding-top:.5rem;">
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
                        }).then(() => { location.href = "/pizzeria/pedidos"; });
                      }
                      let tamanio = null;
                      if (p.categoria?.id === 1) {
                        const apiTamanio = new tamanioController();
                        const tamanios = await apiTamanio.getTamanios();
                        tamanio = tamanios.find(t => t.id === 2) || null;
                      }
                      const ingredientes = Array.isArray(p.ingredientes) ? p.ingredientes : [];
                      agregarAlCarrito(p, 1, tamanio, ingredientes);
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
          </div>
        `)}
      </div>
    `;
  };

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
      .categorias-buttons {
        display:flex; flex-wrap:wrap;
        gap:0.6rem;
        justify-content:center;
        flex:1;
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
      .categorias-buttons button.active { background:#0a3a17; color:white; }
      #searchInput {
        width:280px; padding:0.6rem 1rem;
        border-radius:10px; border:1px solid #ced4da;
      }
      @media (max-width:768px) {
        #searchInput { width:100%; margin-bottom:.8rem; }
        .top-bar { flex-direction:column; gap:1rem; }
      }
    </style>

    <div class="productos-wrapper">
      <div class="top-bar">
        <input id="searchInput" type="search" placeholder="Buscar productos...">
        <div class="categorias-buttons">
          <button data-value="" class="active">Todas</button>
          ${categorias.map(c => html`<button data-value="${c.id}">${c.nombre}</button>`)}
        </div>
      </div>

      <div id="productosContainer"></div>
    </div>
  `;

  render(mainTemplate, contenedor);

  const botones = contenedor.querySelectorAll('.categorias-buttons button');
  const productosContainer = contenedor.querySelector('#productosContainer');
  const searchInput = contenedor.querySelector('#searchInput');

  render(await renderProductosFiltrados(''), productosContainer);
  renderCarrito(contenedor);
  updateTotal();

  botones.forEach(btn => {
    btn.addEventListener('click', async () => {
      botones.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.getAttribute('data-value');
      render(await renderProductosFiltrados(id, ''), productosContainer);
      renderCarrito(contenedor);
      updateTotal();
    });
  });

  searchInput.addEventListener('input', async () => {
    render(await renderProductosFiltrados('', searchInput.value), productosContainer);
    renderCarrito(contenedor);
    updateTotal();
  });
}
