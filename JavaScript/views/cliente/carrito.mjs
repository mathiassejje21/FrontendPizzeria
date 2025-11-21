import { getCarrito, setCarrito, guardarTotal, updateTotal, updateCarritoCount } from "@/service/carrito.mjs";
import { mostrarDetalleCarrito } from "@views/cliente/detalleCarrito.mjs";

const refrescarVistaCarrito = () => {
  if (window.location.pathname === "/pizzeria/carrito") {
    mostrarDetalleCarrito();
  }
};

export const eliminarTodo = (id, tamanio = null, ingredientes = []) => {
  let carrito = getCarrito();
  carrito = carrito.filter(p =>
    !(p.id === id &&
      (p.tamanio?.id ?? null) === (tamanio?.id ?? null) &&
      JSON.stringify(p.ingredientes || []) === JSON.stringify(ingredientes || []))
  );
  setCarrito(carrito);
  guardarTotal();
  renderCarrito();
  updateTotal();
  refrescarVistaCarrito();
};

export const alterarCantidad = (id, tipo, tamanio = null, ingredientes = []) => {
  let carrito = getCarrito();
  const idx = carrito.findIndex(
    p =>
      p.id === id &&
      (p.tamanio?.id ?? null) === (tamanio?.id ?? null) &&
      JSON.stringify(p.ingredientes || []) === JSON.stringify(ingredientes || [])
  );

  if (idx === -1) return;
  if (tipo === '+') carrito[idx].cantidad += 1;
  if (tipo === '-') carrito[idx].cantidad -= 1;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);

  setCarrito(carrito);
  guardarTotal();
  renderCarrito();
  updateTotal();
  refrescarVistaCarrito();
};

export const agregarAlCarrito = (producto, cantidad, tamanio = null, ingredientes = []) => {
  let carrito = getCarrito();
  cantidad = parseInt(cantidad);
  if (isNaN(cantidad) || cantidad <= 0) return;

  const esPizza = producto.categoria?.id === 1;

  let index = carrito.findIndex(p =>
    esPizza
      ? (
        p.id == producto.id &&
        (p.tamanio?.id ?? null) == (tamanio?.id ?? null) &&
        JSON.stringify(p.ingredientes || []) == JSON.stringify(ingredientes || [])
      )
      : p.id == producto.id
  );

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({
      ...producto,
      cantidad,
      tamanio,
      ingredientes
    });
  }

  setCarrito(carrito);
  guardarTotal();
  renderCarrito();
  updateTotal();
  refrescarVistaCarrito();
};

export const renderCarrito = () => {
  const panel = document.querySelector('#panel-carrito .contenido');
  if (!panel) return;

  const carrito = getCarrito();
  panel.innerHTML = "";

  if (carrito.length === 0) {
    panel.innerHTML = "<p style='padding: 10px;'>No hay productos en el carrito</p>";
    updateCarritoCount();
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement('div');

    div.style.padding = "5px";
    div.style.borderBottom = "1px solid #ccc";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "flex-start";
    div.style.width = "100%";

    const totalIngredientesExtra = (item.ingredientes || [])
      .reduce((acc, ing) => acc + Number(ing.costo_extra), 0);

    const precioUnitario =
      (Number(item.precio) + totalIngredientesExtra) * (item.tamanio?.factor_precio ?? 1); 

    div.innerHTML = `
      <div style="width:100%;">
        
        <section style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          
          <div style="display:block;">
            <strong>${item.nombre}</strong>
            <br>ID: ${item.id}
            ${item.tamanio ? `<br>Tamaño: <strong>${item.tamanio.nombre}</strong>` : ""}
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <span>Cantidad: ${item.cantidad}</span>

            <div 
              data-op="+" 
              data-id="${item.id}" 
              data-tamanio='${JSON.stringify(item.tamanio)}'
              data-ingredientes='${JSON.stringify(item.ingredientes)}'
              style="cursor:pointer; font-size:20px;"
            >+</div>

            <div 
              data-op="-" 
              data-id="${item.id}" 
              data-tamanio='${JSON.stringify(item.tamanio)}'
              data-ingredientes='${JSON.stringify(item.ingredientes)}'
              style="cursor:pointer; font-size:20px;"
            >−</div>

            <div 
              data-op="x"
              data-id="${item.id}"
              data-tamanio='${JSON.stringify(item.tamanio)}'
              data-ingredientes='${JSON.stringify(item.ingredientes)}'
              style="width:25px; height:25px; background:#b30000; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:50%;"
            >×</div>
          </div>

        </section>

        ${(item.ingredientes?.length ?? 0) > 0 ?
          `<div style="margin-top:4px;">
              <div>Ingredientes:</div>
              <ul style="margin:4px 0; padding-left:1.2rem;">
                ${item.ingredientes.map(i => `<li>${i.nombre}</li>`).join("")}
              </ul>
          </div>`
          : ""}

        <div style="margin-top:4px; display:flex; flex-direction:row; align-items:center; justify-content:space-between;">
          <div>Precio unit: S/. ${precioUnitario.toFixed(2)}</div>
          ${item.cantidad > 1 
            ? `<div><strong style="font-size:16px">Precio total: S/. ${(item.cantidad * precioUnitario).toFixed(2)} </strong></div>`
            : ""
          }
        </div>
      </div>
    `;

    panel.appendChild(div);
  });

  panel.querySelectorAll("[data-op]").forEach(btn => {
    const id = parseInt(btn.getAttribute("data-id"));
    const op = btn.getAttribute("data-op");
    const tamanio = JSON.parse(btn.getAttribute("data-tamanio"));
    const ingredientes = JSON.parse(btn.getAttribute("data-ingredientes"));

    btn.addEventListener("click", () => {
      if (op === '+') alterarCantidad(id, '+', tamanio, ingredientes);
      if (op === '-') alterarCantidad(id, '-', tamanio, ingredientes);
      if (op === 'x') eliminarTodo(id, tamanio, ingredientes);
    });
  });

  updateCarritoCount();
};
