import { html, render } from 'lit-html';
import { productoController } from '@controllers/productoController.mjs';
import { categoriaController } from '@controllers/categoriaController.mjs';
import { tamanioController } from '@/controllers/tamanioController.mjs';
import { agregarAlCarrito, renderCarrito } from '@/service/renderCarrito.mjs';
import { updateTotal } from '@/service/carrito.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';
import { router } from '@/router.mjs';

export async function mostrarProductos() {
  const apiProducto = new productoController();
  const apiCategoria = new categoriaController();
  const categorias = await apiCategoria.getCategorias();
  const productos = await apiProducto.getProductos();
  if (!productos || productos.length === 0) return;

  const viewProductos = async (idCategoria = '') => {
    const res = await apiProducto.getProductosporCategoria(idCategoria);
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
        }
        .product-card:hover {
          transform: scale(1.03);
          background-color: #f5f5f5;
        }
        .add-btn {
          background:#b30000;
          color:white;
          width:35px;
          height:35px;
          border:none;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:22px;
          cursor:pointer;
          transition:0.2s;
        }
        .add-btn:hover {
          background:#8d0000;
        }
      </style>

      <div class="row g-4 mt-3">
        ${filtrados.map(p => html`
          <div class="col-md-4 col-sm-6 col-lg-3">
            <div class="card h-100 shadow-sm product-card p-3" data-id="${p.id}">
              
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h5>${p.nombre}</h5>
                ${p.categoria.id === 1 ? html`<span style="font-size:14px; color:#0a3a17;"><b>Mediano</b></span>` : ""}
              </div>

              <p style="min-height:45px;">${p.descripcion}</p>
              <p class="fw-bold" style="font-size:18px;">S/.${p.precioReal}</p>

              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:1rem;">
                <input 
                  id="cantidad-${p.id}"
                  type="number" 
                  min="1" 
                  value="1"
                  style="width:50%; text-align:center;"
                  class="form-control mb-2"
                >

                <button 
                  class="add-btn"
                  @click=${async () => {
                    const pendingUrl = sessionStorage.getItem("last_payment_url");

                    if (pendingUrl) {
                      return mensajeAlert({
                        icon: "warning",
                        title: "Pago pendiente",
                        text: "Tienes un pago pendiente.",
                        showConfirmButton: true
                      }).then(() => {
                        location.href = "/pizzeria/pedidos";
                      });
                    }

                    const cantidad = Number(document.getElementById(`cantidad-${p.id}`).value);

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
                      const apiTamanio = new tamanioController();
                      const tamanios = await apiTamanio.getTamanios();
                      tamanio = tamanios.find(t => t.id === 2) || null;

                      if (!tamanio) {
                        return mensajeAlert({
                          icon: "error",
                          title: "Error",
                          text: "No se encontró el tamaño Mediano.",
                          showConfirmButton: true
                        });
                      }
                    }

                    const ingredientes = Array.isArray(p.ingredientes) ? p.ingredientes : [];
                    
                    agregarAlCarrito(p, cantidad, tamanio, ingredientes);

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
  };

  const mainTemplate = html`
    <style>
      #contenedor { padding:2rem; background:#f8f9fa; min-height:80vh; }
      .top-bar { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:1rem; }
      .categorias-buttons { display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; flex:1; }
      .categorias-buttons button { padding:0.5rem 1rem; border:none; border-radius:8px; background:#e9ecef; cursor:pointer; font-weight:600; transition:0.2s; }
      .categorias-buttons button.active { background:#0a3a17; color:white; }
      #searchInput { width:250px; padding:0.5rem 1rem; border-radius:8px; border:1px solid #ced4da; }
      @media (max-width:768px) { .top-bar { flex-direction:column; gap:0.5rem; } #searchInput { width:100%; } }
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
        if (["BUTTON", "INPUT", "SELECT"].includes(e.target.tagName)) return;
        const id = card.getAttribute("data-id");
        router.navigate(`/pizzeria/productos/${id}`);
      });
    });
  }, 50);
}
