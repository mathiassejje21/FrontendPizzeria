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

  const getProductosFilter = () => filterBasic(productos, ["nombre", "descripcion"], searchQuery);

  const renderProductosFiltrados = () => html`
    ${getProductosFilter().map(p => html`
      <div class="product-card">
        <div class="image-box">
          <img 
            @click=${() => router.navigate(`${detalleRouteBase}/${p.id}`)}
            src="${p.imagen_url}"
            class="product-img"
          >
        </div>

        <div class="product-info">
          <div>
            <h5>${p.nombre}</h5>
            <p>${p.descripcion}</p>
          </div>

          <div class="price-btn-row">
            <span class="price-tag">S/. ${p.precioReal}</span>

            <button class="add-btn"
              @click=${async (e) => {
                e.stopPropagation();
                const pendingUrl = sessionStorage.getItem("last_payment_url");
                if (pendingUrl)
                  return mensajeAlert({
                    icon:"warning",
                    title:"Pago pendiente",
                    text:"Tienes un pago pendiente.",
                    showConfirmButton:true
                  }).then(() => location.href="/pizzeria/pedidos");

                if (p.personalizable) {
                  const apiTamanio = new tamanioController();
                  const tamanios = await apiTamanio.getTamanios();
                  tamanio = tamanios.find(t => t.id === 2) || null;
                }

                agregarAlCarrito(p, 1, tamanio, p.ingredientes || []);
                mensajeAlert({
                  icon:"success",
                  title:"Producto agregado",
                  text:"Se agregó correctamente.",
                  timer:1000
                });
              }}
            >+</button>
          </div>
        </div>
      </div>
    `)}
  `;

  const renderView = () => {
    const mainTemplate = html`

<style>
  #contenedor{
    width:100%;
    min-height:100vh;
  }

  .productos-wrapper {
    padding: 8rem 2rem;
    min-height: 100vh;
  }

  .categorias-buttons { 
    display:flex;
    gap:1rem;
    justify-content:center;
    align-items:center;
    width:100%;
    padding:1rem 0;
    overflow:hidden;
  }

  .categorias-buttons button {
    flex-shrink:0;
    min-width:150px;
    padding:1.5rem 0.3rem 0.3rem 0.3rem;
    border-top-left-radius:12px;
    border-top-right-radius:12px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    transition:0.2s;
    border:none;
    background:none;
    position:relative;
  }

  .categorias-buttons button img{
    width:120px;
    height:80px;
    object-fit:cover;
    border-radius:10px;
  }

  .categorias-buttons button p{
    background:#e6d9d2ff;
    padding:0.3rem 2rem;
    border-radius:20px;
    font-family:"Anton";
    position:absolute;
    top:-1rem;
    left:50%;
    transform:translateX(-50%);
  }

  .categorias-buttons button.active {
    border:2px solid #1fff0f;
    transform:scale(1.05);
  }

  .categorias-buttons button p.active {
    background:#2d5d2a;
    color:white;
  }

  #s{
    padding:.6rem 2.7rem;
    border-radius:30px;
    border:1px solid rgba(255,255,255,0.3);
    background:rgba(255,255,255,0.15)
      url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNqslI0RgyAMhdENWIEVWMEVXIGO0BW6Ah2hHcGOoCPYEewINFzBe9IA9id37w4kfEZesHHOCSYUqSPJML+RJlELDwN1pMHxMZNMkr8RTgyz2YPH5LmtwXpIHkOFmKhIlxowDmYAycKnHAHYcTCsSpXOJCie6YWDnXKLGeHLN2stGaqDsXXrX3GFcYcLrfhjtKEhffQ792gYT2nT6pJDjCw4z7ZGdGipOIqNbXIwFUARmCbKpMfYxsWJBmCEDoW7+gYUTAU2s3HJrK3AJvMLkqGHFLgWXTckm+SfSQexs+tLRqwVfgvjgMsvMAT689S5M/sk/I14kO5PAQYAuk6L1q+EdHMAAAAASUVORK5CYII=")
      no-repeat 14px center;
    background-size:18px;
    color:white;
    width:300px;
    margin:0 auto 2rem auto;
    display:block;
    backdrop-filter:blur(6px);
    transition:.25s;
  }

  #s::placeholder { color:#000; }
  #s:hover, #s:focus {
    background-color:white;
    color:black;
  }

  #productosContainer{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:1.5rem;
  }

  .product-card{
    width:260px;
    height:420px;
    border-radius:14px;
    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.15);
    box-shadow:0 8px 20px rgba(0,0,0,0.35);
    overflow:hidden;
    display:flex;
    flex-direction:column;
  }

  .image-box{
    width:100%;
    height:230px;
    overflow:hidden;
  }

  .product-img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.35s ease;
    cursor:pointer;
  }
  .product-img:hover{
    transform:scale(1.17);
  }

  .product-info{
    padding:.9rem .8rem;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:190px;
  }

  .product-info h5{
    margin:0;
    font-family:"Anton";
    font-size:1.25rem;
    color:#FFD65A;
  }

  .product-info p{
    margin:0;
    color:white;
    font-size:.9rem;
  }

  .price-btn-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
  }

  .price-tag{
    font-size:1.5rem;
    font-weight:800;
    font-family:"Anton";
    color:#FFD65A;
  }

  .add-btn{
    background: #52e53fff;
    color: #000;
    width:45px;
    height:45px;
    border-radius:50%;
    border:none;
    font-size:23px;
    cursor:pointer;
    transition:.25s;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .add-btn:hover{
    background:#24b24fff;
    color:white;
    transform:translateY(-2px);
  }

  @media(max-width:768px){

    .categorias-buttons {
      justify-content:flex-start;
      overflow-x:auto;
      overflow-y:hidden;
      white-space:nowrap;
      scroll-snap-type:x mandatory;
      padding-left:1rem;
      scrollbar-width:none;
    }

    .categorias-buttons button {
      scroll-snap-align:start;
    }

    #s{ width:80%; }
  }
</style>

<div class="productos-wrapper">

  <div class="top-bar">
    <div class="categorias-buttons">
      <button
        class="${idCategoria === null ? 'active' : ''}"
        @click=${() => { idCategoria = null; reloadProductos(); }}
      >
        <p class="${idCategoria === null ? 'active' : ''}">Todas</p>
        <img src="https://cdn.pixabay.com/photo/2018/08/12/16/39/volkswagen-3601162_1280.png">
      </button>

      ${categorias.map(c => html`
        <button
          class="${c.id === idCategoria ? 'active' : ''}"
          @click=${() => { idCategoria = c.id; reloadProductos(); }}
        >
          <p class="${c.id === idCategoria ? 'active' : ''}">${c.nombre}</p>
          <img src="${c.imagen_url}">
        </button>
      `)}
    </div>
  </div>

  <input id="s" type="search" placeholder="Buscar productos..."
    @input=${(e) => { searchQuery = e.target.value; renderView(); }}>

  <div id="productosContainer">${renderProductosFiltrados()}</div>

</div>
    `;

    render(mainTemplate, contenedor);
    renderCarrito(contenedor);
    updateTotal();
  };

  renderView();
}
