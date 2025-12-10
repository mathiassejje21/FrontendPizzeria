import { html, render } from "lit-html";
import { productoController } from "@controllers/productoController.mjs";
import { tamanioController } from "@controllers/tamanioController.mjs";
import { ingredienteController } from "@controllers/ingredienteController.mjs";
import { agregarAlCarrito } from "@/service/renderCarrito.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderDetalleProductoView(idProducto) {
  const apiProducto = new productoController();
  const producto = await apiProducto.getProductoById(idProducto);

  const contenedor = document.getElementById("contenedor");

  if (!producto) {
    return render(html`
      <div style="padding-top:7rem; text-align:center; color:white;">
        <h2>Producto no encontrado</h2>
        <button @click=${() => window.history.back()}
          style="margin-top:1rem; padding:.8rem 1.5rem; border-radius:10px; background:#ff7b4a; color:white; border:none;">
          Volver
        </button>
      </div>
    `, contenedor);
  }

  let tamanios = [];
  let ingredientes = [];
  let tamanioSeleccionado = null;
  let ingredientesSeleccionados = [];
  let cantidadSeleccionada = 1;

  if (producto.categoria?.id === 1) {
    const apiTamanio = new tamanioController();
    const apiIngrediente = new ingredienteController();
    tamanios = await apiTamanio.getTamanios();
    ingredientes = await apiIngrediente.getIngredientes();
    tamanioSeleccionado =
      tamanios.find(t => t.nombre.toLowerCase() === "individual") || null;
  }

  const recalcularPrecio = () => {
    let precioBase = Number(producto.precio);
    const extraIng = ingredientesSeleccionados.reduce((acc, ing) => acc + Number(ing.costo_extra), 0);
    precioBase += extraIng;
    if (tamanioSeleccionado) precioBase *= Number(tamanioSeleccionado.factor_precio);
    const total = precioBase * cantidadSeleccionada;
    const el = document.getElementById("detalle-precio-final");
    if (el) el.innerHTML = `S/. ${total.toFixed(2)}`;
  };

  const template = html`
<style>
  #contenedor {
    padding-top: 5rem;
    width:100%;
    min-height:100vh;
    display:flex;
    justify-content:center;
    color:white;
  }

  .layout {
    display:flex;
    width:100%;
    max-width:1400px;
    margin:auto;
    padding:2rem 1rem;
    gap:3rem;
    align-items:center;
    justify-content:center;
  }

  .img-box {
    width:420px;
    height:420px;
    border-radius:24px;
    overflow:hidden;
    background:#000;
    box-shadow:0 10px 30px rgba(0,0,0,0.4);
  }

  .img-box img {
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.35s ease;
  }

  .img-box img:hover { transform: scale(1.06); }

  .info {
    width:100%;
    max-width:430px;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:1rem;
  }

  .titulo {
    font-size:2.2rem;
    font-weight:800;
    line-height:1.2;
  }

  .desc {
    font-size:1rem;
    opacity:.75;
    margin-top:.2rem;
  }

  .sub {
    margin-top:.8rem;
    font-size:1rem;
    font-weight:700;
    opacity:.85;
  }

  .chips {
    display:flex;
    gap:.6rem;
    margin-top:.5rem;
    flex-wrap:wrap;
  }

  .chip {
    padding:.45rem .9rem;
    border-radius:12px;
    background:#2b2b2b;
    border:1px solid #3b3b3b;
    cursor:pointer;
    font-size:.85rem;
    transition:.2s;
  }

  .chip.active {
    background:#ff7b4a;
    border-color:#ff7b4a;
    color:white;
  }

  input[type="number"] {
    margin-top:.6rem;
    width:45%;
    padding:.7rem 1rem;
    border-radius:12px;
    border:none;
    background:#262626;
    color:white;
    font-size:.95rem;
  }

  .precio-final {
    font-size:1.9rem;
    font-weight:900;
    color:#ff7b4a;
    margin-top:.8rem;
  }

  .btn-container {
    display:flex;
    gap:1rem;
    margin-top:1rem;
    width:100%;
  }

  .btn-main {
    flex:1;
    padding:.9rem;
    font-size:1.05rem;
    border-radius:12px;
    border:none;
    background:#ff7b4a;
    color:white;
    font-weight:700;
  }

  .btn-back {
    flex:1;
    padding:.9rem;
    border-radius:12px;
    border:none;
    background:#333;
    color:white;
    font-weight:600;
  }

  .ingred-box {
    width:250px;
    padding-left:1rem;
    border-left:1px solid #333;
    display:flex;
    flex-direction:column;
    gap:.4rem;
  }

  .ingred-item {
    display:flex;
    align-items:center;
    gap:.5rem;
    padding:.3rem 0;
    font-size:.95rem;
  }

  .ingred-item input {
    width:18px; height:18px;
    accent-color:#ff7b4a;
  }

  @media(max-width:768px){
    .layout {
      flex-direction:column;
      padding:1rem;
      text-align:center;
      gap:2rem;
    }

    .img-box {
      width:85vw;
      max-width:360px;
      aspect-ratio:1/1;
      height:auto;
    }

    .info {
      width:100%;
      max-width:380px;
      text-align:center;
      align-items:center;
    }

    .ingred-box {
      width:100%;
      max-width:380px;
      border-left:none;
      padding-left:0;
      margin-top:1rem;
      text-align:left;
    }

    .btn-container {
      justify-content:center;
    }
  }
</style>

<div class="layout">

  <div class="img-box">
    <img src="${producto.imagen_url}">
  </div>

  <div class="info">
    <div class="titulo">${producto.nombre}</div>
    <div class="desc">${producto.descripcion || ""}</div>

    ${producto.categoria?.id === 1 ? html`
      <div class="sub">Tamaño</div>
      <div class="chips">
        ${tamanios.map(t => html`
          <div class="chip ${t.nombre.toLowerCase() === "individual" ? "active" : ""}"
            @click=${() => {
              tamanioSeleccionado = t;
              document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
              event.target.classList.add('active');
              recalcularPrecio();
            }}>
            ${t.nombre}
          </div>
        `)}
      </div>
    ` : ""}

    <div class="sub">Cantidad</div>
    <input type="number" min="1" value="1"
      @input=${e => { cantidadSeleccionada = Number(e.target.value || 1); recalcularPrecio(); }}>

    <div class="precio-final" id="detalle-precio-final">
      S/. ${Number(producto.precio).toFixed(2)}
    </div>

    <div class="btn-container">
      <button class="btn-main" @click=${() => agregar()}>
        Agregar al carrito
      </button>
      <button class="btn-back" @click=${() => window.history.back()}>
        Volver
      </button>
    </div>
  </div>

  ${producto.categoria?.id === 1 ? html`
    <div class="ingred-box">
      <div class="sub">Ingredientes</div>
      ${ingredientes.map(i => {
        const ya = producto.ingredientes?.some(pIng => pIng.id === i.id);
        if (ya && !ingredientesSeleccionados.some(x => x.id === i.id)) ingredientesSeleccionados.push(i);
        return html`
          <label class="ingred-item">
            <input type="checkbox"
              value='${JSON.stringify(i)}'
              ?checked=${ya}
              @change=${e => {
                const ing = JSON.parse(e.target.value);
                if (e.target.checked) ingredientesSeleccionados.push(ing);
                else ingredientesSeleccionados = ingredientesSeleccionados.filter(x => x.id !== ing.id);
                recalcularPrecio();
              }}>
            ${i.nombre} (+S/.${Number(i.costo_extra).toFixed(2)})
          </label>
        `;
      })}
    </div>
  ` : ""}

</div>
`;

  const agregar = () => {
    const pendingUrl = sessionStorage.getItem("last_payment_url");
    if (pendingUrl) {
      return mensajeAlert({
        icon:"warning",
        title:"Pago pendiente",
        text:"Tienes un pago pendiente.",
        showConfirmButton:true
      }).then(() => { location.href="/pizzeria/pedidos"; });
    }

    if (cantidadSeleccionada <= 0) {
      return mensajeAlert({
        icon:"warning",
        title:"Cantidad inválida",
        text:"La cantidad debe ser mayor a cero."
      });
    }

    if (producto.categoria?.id === 1 && !tamanioSeleccionado) {
      return mensajeAlert({
        icon:"warning",
        title:"Tamaño requerido",
        text:"Selecciona un tamaño."
      });
    }

    agregarAlCarrito(producto, cantidadSeleccionada, tamanioSeleccionado, ingredientesSeleccionados);

    mensajeAlert({
      icon:"success",
      title:"Producto agregado",
      text:"Se agregó correctamente.",
      timer:1200
    });
  };

  render(template, contenedor);
  recalcularPrecio();
}
