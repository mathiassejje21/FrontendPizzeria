import { html, render } from "lit-html"
import { categoriaController } from "@controllers/categoriaController.mjs"
import { productoController } from "@controllers/productoController.mjs"
import { ingredienteController } from "@controllers/ingredienteController.mjs"

export async function renderInventarioView() {
  const categoriaApi = new categoriaController()
  const productoApi = new productoController()
  const ingredienteApi = new ingredienteController()

  const ingredientes = await ingredienteApi.getIngredientes()
  const categorias = await categoriaApi.getCategorias()

  const data = []
  for (const categoria of categorias) {
    const productosRes = await productoApi.getProductosporCategoria(categoria.id)
    data.push({
      categoria,
      productos: Array.from(productosRes)
    })
  }

  const content = html`
    <style>
      #contenedor-inventario {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding: 2rem;
        font-family: "Inter", sans-serif;
        background: #020617;
        color: white;
      }

      .categoria-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #4ade80;
        margin-bottom: 1rem;
        padding-left: 12px;
        border-left: 4px solid #22c55e;
      }

      .categorias-wrapper {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: .5rem;
      }

      .categorias-wrapper::-webkit-scrollbar { display: none; }

      .categoria-chip {
        min-width: 190px;
        padding: 1rem;
        border-radius: 16px;
        background: linear-gradient(145deg, #0f172a, #1e293b);
        border: 1px solid rgba(74, 222, 128, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .45rem;
        cursor: pointer;
        transition: 0.3s ease;
        color: white;
      }

      .categoria-chip:hover {
        transform: translateY(-6px);
        box-shadow: 0 0 18px rgba(34, 197, 94, 0.35);
      }

      .categoria-chip img {
        width: 72px;
        height: 72px;
        border-radius: 14px;
        object-fit: cover;
        border: 2px solid rgba(74,222,128,.4);
      }

      .categoria-chip h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: #4ade80;
        text-align: center;
      }

      .categoria-chip p {
        margin: 0;
        font-size: .8rem;
        opacity: .7;
        text-align: center;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.4rem;
      }

      .item-card {
        background: #0f172a;
        border-radius: 14px;
        padding: 1rem;
        border: 1px solid rgba(148,163,184,0.25);
        box-shadow: 0 0 18px rgba(15,23,42,0.45);
        transition: .25s ease;
        display: flex;
        flex-direction: column;
        gap: .7rem;
      }

      .item-card:hover {
        transform: translateY(-4px);
        border-color: rgba(74,222,128,.5);
        box-shadow: 0 0 20px rgba(34,197,94,0.25);
      }

      .item-card img {
        width: 100%;
        height: 170px;
        object-fit: cover;
        border-radius: 12px;
        border: 1px solid rgba(148,163,184,0.3);
      }

      .item-info h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #4ade80;
      }

      .item-info p {
        margin: 0;
        font-size: .9rem;
        opacity: .85;
      }

      .estado-activo {
        color: #22c55e;
        font-weight: 700;
      }

      .estado-inactivo {
        color: #ef4444;
        font-weight: 700;
      }

      .precio-tag {
        font-size: 1rem;
        color: #facc15;
        font-weight: 700;
        margin-top: 4px;
      }

      @media (max-width: 768px) {
        #contenedor-inventario { padding: 1rem; gap: 2rem; }

        .categoria-chip {
          min-width: 150px;
          padding: .8rem;
        }

        .grid-3 {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .item-card img {
          height: 140px;
        }
      }
    </style>

    <section id="contenedor-inventario">

      <section>
        <p class="categoria-title" align="center">Categorías Disponibles</p>
        <div class="categorias-wrapper">
          ${categorias.map(cat => html`
            <div class="categoria-chip">
              <img src="${cat.imagen_url}">
              <h4>${cat.nombre}</h4>
              <p>${cat.descripcion}</p>
              <p class="${cat.activo ? 'estado-activo' : 'estado-inactivo'}">
                ${cat.activo ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          `)}
        </div>
      </section>

      ${data.map(item => html`
        <section class="categoria-box">
          <h2 class="categoria-title">${item.categoria.nombre}</h2>

          <div class="grid-3">
            ${item.productos.length > 0
              ? item.productos.map(producto => html`
                  <div class="item-card">
                    <img src="${producto.imagen_url}">
                    <div class="item-info">
                      <h3>${producto.nombre}</h3>
                      <p>${producto.descripcion}</p>
                      <p class="${producto.activo ? 'estado-activo' : 'estado-inactivo'}">
                        ${producto.activo ? 'Activo' : 'Inactivo'}
                      </p>
                      <p class="precio-tag">S/. ${producto.precio}</p>
                      <p style="opacity:.7;">Categoría: ${producto.categoria.nombre}</p>
                    </div>
                  </div>
                `)
              : html`<p style="opacity:0.7;">No hay productos registrados.</p>`
            }
          </div>
        </section>
      `)}

      <section class="categoria-box">
        <h2 class="categoria-title">Ingredientes</h2>

        <div class="grid-3">
          ${ingredientes.map(ing => html`
            <div class="item-card">
              <div class="item-info">
                <h3>${ing.nombre}</h3>
                <p>Costo extra: S/. ${ing.costo_extra}</p>
                <p>Stock: ${ing.stock}</p>
                <p class="${ing.activo ? 'estado-activo' : 'estado-inactivo'}">
                  ${ing.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>
          `)}
        </div>
      </section>

    </section>
  `

  render(content, document.getElementById("contenedor"))
}
