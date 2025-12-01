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
      }

      .categoria-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #0a3a17;
        margin-bottom: 1rem;
        border-left: 6px solid #2ecc71;
        padding-left: 10px;
      }

      .categorias-wrapper {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
      }
      .categorias-wrapper::-webkit-scrollbar { display: none; }

      .categoria-chip {
        min-width: 180px;
        padding: 1rem;
        background: #ffffff;
        border-radius: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .categoria-chip:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      }

      .categoria-chip img {
        width: 70px;
        height: 70px;
        border-radius: 12px;
        object-fit: cover;
        margin-bottom: 0.6rem;
      }

      .categoria-chip h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: #0a3a17;
        margin-bottom: 0.3rem;
      }

      .categoria-chip p {
        margin: 0;
        font-size: 0.85rem;
        opacity: 0.7;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.4rem;
      }

      .item-card {
        background: #ffffff;
        border-radius: 14px;
        padding: 1rem;
        box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        border: 1px solid #e5e5e5;
        transition: 0.25s ease;
        display: flex;
        flex-direction: column;
        gap: .6rem;
      }

      .item-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
      }

      .item-card img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 12px;
      }

      .item-info h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #0a3a17;
      }

      .item-info p {
        margin: 0;
        font-size: .95rem;
        color: #444;
      }

      .estado-activo { color: #27ae60; font-weight: 700; }
      .estado-inactivo { color: #e74c3c; font-weight: 700; }

      .precio-tag {
        font-size: 1rem;
        font-weight: 700;
        margin-top: 4px;
      }
    </style>

    <section id="contenedor-inventario">

      <section>
        <p class="categoria-title" align="center">Categorias Disponibles</p>
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
