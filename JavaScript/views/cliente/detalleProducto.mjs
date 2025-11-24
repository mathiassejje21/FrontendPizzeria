import { html, render } from "lit-html";
import { productoController } from "@controllers/productoController.mjs";
import { tamanioController } from "@controllers/tamanioController.mjs";
import { ingredienteController } from "@controllers/ingredienteController.mjs";
import { agregarAlCarrito } from "@/service/renderCarrito.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function mostrarDetalleProducto(idProducto) {
  const apiProducto = new productoController();
  const listaProductos = await apiProducto.getProductos();
  const producto = listaProductos.find(p => p.id == idProducto);

  const contenedor = document.getElementById("contenedor");

  if (!producto) {
    return render(html`
      <div class="container py-10">
        <h2>Producto no encontrado</h2>
        <button class="btn btn-secondary mt-3" @click=${() => window.history.back()}>
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

    tamanioSeleccionado = tamanios.find(t => t.nombre.toLowerCase() === "individual") || null;
  }

  const recalcularPrecio = () => {
    let precioBase = Number(producto.precio);

    const extraIng = ingredientesSeleccionados.reduce(
      (acc, ing) => acc + Number(ing.costo_extra),
      0
    );

    if( ingredientesSeleccionados ){
      precioBase = precioBase + extraIng;
    }

    if (tamanioSeleccionado) {
      precioBase = precioBase * Number(tamanioSeleccionado.factor_precio);
    }


    const total = (precioBase) * cantidadSeleccionada;

    const pfinal = document.getElementById("detalle-precio-final");
    if (pfinal) pfinal.innerHTML = `S/. ${total.toFixed(2)}`;
  };

  const template = html`
  <style>
  #contenedor {
    display: flex;
    justify-content: center;
  }

  .detalle-wrapper {
    margin: 6rem auto;
    padding: 2rem;
    border-radius: 1.5rem;
    background: #ffffff;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: 2rem;

    box-shadow: 0 10px 25px rgba(0,0,0,0.15);

    justify-content: center;
    align-items: start;
  }


  .detalle-img img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 1.2rem;
  }

  .precio-final {
    font-size: 25px;
    font-weight: bold;
    color: #b30000;
    margin-top: 15px;
  }

  .detalle-ingredientes {
    border-left: 2px solid #ddd;
    padding-left: 1rem;
  }

  .ingrediente-item {
    margin-bottom: 8px;
  }
</style>


  <section class="detalle-wrapper">

    <div class="detalle-img">
      <img src="${producto.imagen_url}" alt="${producto.nombre}">
    </div>

    <div class="detalle-info">
      <h2>${producto.nombre}</h2>
      <p>${producto.descripcion || ""}</p>
      <p><strong>Categoría:</strong> ${producto.categoria?.nombre}</p>

      ${producto.categoria?.id === 1 ? html`
        <div class="mb-3">
          <label>Tamaño</label>
          <select id="tamanio-detalle" class="form-select"
            @change=${e => {
              tamanioSeleccionado = JSON.parse(e.target.value || "null");
              recalcularPrecio();
            }}>
            ${tamanios.map(t => html`
              <option 
                value='${JSON.stringify(t)}'
                ?selected=${t.nombre.toLowerCase() === "individual"}
              >
                ${t.nombre} (x ${t.factor_precio})
              </option>
            `)}
          </select>
        </div>
      ` : ""}

      <div class="mb-3">
        <label>Cantidad</label>
        <input
          id="cantidad-detalle"
          type="number"
          min="1"
          value="1"
          class="form-control"
          @input=${e => {
            cantidadSeleccionada = Number(e.target.value || 1);
            recalcularPrecio();
          }}
        >
      </div>

      <div class="precio-final" id="detalle-precio-final">
        S/. ${Number(producto.precio).toFixed(2)}
      </div>

      <div class="actions mt-3">
        <button class="btn btn-danger" @click=${() => agregar()}>
          Agregar al carrito
        </button>

        <button class="btn btn-secondary" @click=${() => window.history.back()}>
          Volver
        </button>
      </div>
    </div>

    ${producto.categoria?.id === 1 ? html`
      <div class="detalle-ingredientes">
        <h4>Ingredientes</h4>

        ${ingredientes.map(i => {
          
          const yaIncluido = producto.ingredientes?.some(pIng => pIng.id === i.id);

          if (yaIncluido && !ingredientesSeleccionados.some(x => x.id === i.id)) {
            ingredientesSeleccionados.push(i);
          }

          return html`
            <div class="ingrediente-item">
              <label>
                <input
                  type="checkbox"
                  value='${JSON.stringify(i)}'
                  ?checked=${yaIncluido}
                  @change=${e => {
                    const ing = JSON.parse(e.target.value);
                    if (e.target.checked) {
                      ingredientesSeleccionados.push(ing);
                    } else {
                      ingredientesSeleccionados = ingredientesSeleccionados.filter(x => x.id !== ing.id);
                    }
                    recalcularPrecio();
                  }}
                >
                ${i.nombre} (+ S/.${Number(i.costo_extra).toFixed(2)})
              </label>
            </div>
          `;
        })}
      </div>
    ` : ""}
  </section>
  `;

  const agregar = () => {
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
    
    const cantidad = Number(cantidadSeleccionada);

    if (cantidad <= 0) {
      return mensajeAlert({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad debe ser mayor a cero.",
        showConfirmButton: true
      });
    }

    if (producto.categoria?.id === 1 && !tamanioSeleccionado) {
      return mensajeAlert({
        icon: "warning",
        title: "Tamaño requerido",
        text: "Selecciona un tamaño.",
        showConfirmButton: true
      });
    }

    agregarAlCarrito(
      producto,
      cantidadSeleccionada,
      tamanioSeleccionado,
      ingredientesSeleccionados
    );

    mensajeAlert({
      icon: "success",
      title: "Producto agregado",
      text: "El producto se agregó al carrito correctamente.",
      timer: 1200
    });
  };

  render(template, contenedor);
  recalcularPrecio();
}
