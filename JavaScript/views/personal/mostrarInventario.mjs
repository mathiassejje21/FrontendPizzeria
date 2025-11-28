import { html, render } from "lit-html";
import { categoriaController } from "@controllers/categoriaController.mjs";
import { productoController } from "@controllers/productoController.mjs";

export async function renderInventarioView() {
  const categoriaApi = new categoriaController();
  const productoApi = new productoController();

  const categorias = await categoriaApi.getCategorias();

  const data = [];
  for (const categoria of categorias) {
    const productosRes = await productoApi.getProductosporCategoria(categoria.id);
    data.push({
      categoria,
      productos: Array.from(productosRes)
    });
  }

  const content = html`
    <style>
      #contenedor-inventario {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        padding: 2rem;
        font-family: "Inter", sans-serif;
      }

      .categorias-wrapper {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scroll-behavior: none;
      }

      .categorias-wrapper::-webkit-scrollbar {
        display: none;
      }

      .categoria-chip {
        min-width: 150px;
        padding: 0.8rem 1rem;
        background: #f3f3f3;
        border-radius: 10px;
        box-shadow: 0 0 10px #0001;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .categoria-chip:hover {
        background: #e7e7e7;
        transform: translateY(-4px);
      }

      .categoria-chip img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 0.4rem;
      }

      .categoria-chip h4 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #0a3a17;
      }

      .categoria-box {
        width: 100%;
      }

      .categoria-title {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #0a3a17;
        border-bottom: 2px solid #c9c9c9;
        padding-bottom: 0.4rem;
      }

      .cards-inventario {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .card-item {
        background: #fff;
        padding: 1rem;
        width: 180px;
        border-radius: 10px;
        box-shadow: 0 0 10px #0001;
        text-align: center;
      }

      .card-item img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
      }

      .card-item h3 {
        font-size: 1rem;
        margin: 0.3rem 0;
        color: #0a3a17;
      }

      .card-item p {
        font-size: 0.85rem;
        opacity: 0.8;
      }
    </style>

    <section id="contenedor-inventario">
      <section>
        <p class="categoria-title" align="center">Categorias Disponibles</p>
        <div class="categorias-wrapper">
          ${categorias.map(cat => html`
            <div class="categoria-chip">
              <img src="${cat.imagen_url}" />
              <h4>${cat.nombre}</h4>
            </div>
          `)}
        </div>
      </section>

      ${data.map(item => html`
        <div class="categoria-box">
          <h2 class="categoria-title">${item.categoria.nombre}</h2>

          <div class="cards-inventario">
            ${item.productos.length > 0
              ? item.productos.map(producto => html`
                  <div class="card-item">
                    <img src="${producto.imagen_url}" alt="${producto.nombre}" />
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                  </div>
                `)
              : html`<p style="opacity:0.7;">No hay productos registrados.</p>`
            }
          </div>
        </div>
      `)}
    </section>
  `;

  render(content, document.getElementById("contenedor"));
}
