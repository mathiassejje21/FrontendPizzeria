import { html, render } from 'lit-html';
import { productoController } from '@controllers/productoController.mjs';

export async function mostrarProductos() {

  const viewProductos = async ($id_categoria = '') => {
    const api = new productoController();
    const res = await api.searchProductosClientes($id_categoria);
    return Array.from(res);
  }

  const productos = await viewProductos('');
  if (!productos || productos.length === 0) return;

  const categorias = [];
  productos.forEach(p => {
    const cat = p.categoria;
    if (!categorias.some(c => c.id === cat.id)) {
      categorias.push({ id: cat.id, nombre: cat.nombre });
    }
  });

  const renderProductosFiltrados = async (idCategoria = '', searchQuery = '') => {
    let filtrados;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    } else if (idCategoria) {
      filtrados = await viewProductos(idCategoria);
    } else {
      filtrados = productos;
    }

    return html`
      <div class="row g-4 mt-3">
        ${filtrados.map(p => html`
          <div class="col-md-4 col-sm-6">
            <div class="card h-100 shadow-sm product-card" style="transition: transform 0.2s;">
              <div class="card-body">
                <h5 class="card-title">${p.nombre}</h5>
                <p class="card-text">${p.descripcion}</p>
                <p class="card-text fw-bold">$${p.precio}</p>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  };

  const mainTemplate = html`
    <style>
      #contenedor {
        padding: 2rem;
        background-color: #f8f9fa;
        min-height: 80vh;
      }

      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .categorias-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        flex: 1;
      }

      .categorias-buttons button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        background-color: #e9ecef;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .categorias-buttons button.active {
        background-color: #0a3a17;
        color: #fff;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      .categorias-buttons button:hover:not(.active) {
        background-color: #d1e7dd;
      }

      #searchInput {
        width: 250px;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 1px solid #ced4da;
      }

      #productosContainer .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }

      @media (max-width: 768px) {
        .top-bar {
          flex-direction: column;
          gap: 0.5rem;
        }

        #searchInput {
          width: 100%;
        }
      }
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

  botones.forEach(btn => {
    btn.addEventListener('click', async () => {
      botones.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const id = btn.getAttribute('data-value');
      render(await renderProductosFiltrados(id, searchInput.value), productosContainer);
    });
  });

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    render(await renderProductosFiltrados('', query), productosContainer);
  });
}
