import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";

export async function renderDetallePedidosView(id) {
  const apiPedido = new pedidoController();
  let pedido = await apiPedido.getPedidoById(id);

  const actualizarEstado = async nuevoEstado => {
    await apiPedido.updateEstadoPedido(id, nuevoEstado);
    pedido = await apiPedido.getPedidoById(id);
    renderDetallePedidosView(id);
  };

  let estadoColor = "#dcdcdc";
  if (pedido.id_estado === 2) estadoColor = "#ffe1e1";
  else if (pedido.id_estado === 3) estadoColor = "#faefbd";
  else if (pedido.id_estado === 4) estadoColor = "#2e2e2ea8";
  else if (pedido.id_estado === 5) estadoColor = "#b1ffbaff";
  else if (pedido.id_estado === 6) estadoColor = "#d9d9d9";

  const fecha = new Date(pedido.fecha_pedido).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short"
  });

  const template = html`
    <style>
      .pedido-card {
        border-radius: 14px;
        padding: 1.5rem;
        background: #ffffff;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }

      .btn-aceptar {
        background: linear-gradient(135deg, #ff5858, #ff2e2e);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 0.95rem;
        cursor: pointer;
        letter-spacing: 0.5px;
        font-weight: bold;
        transition: 0.25s;
      }

      .btn-aceptar:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0px 6px 16px rgba(255, 80, 80, 0.5);
      }

      .btn-volver {
        background: #4b4b4b;
        color: white;
        border: none;
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: 0.2s;
      }

      .btn-volver:hover {
        background: #2f2f2f;
        transform: scale(1.05);
      }

      .estado-box {
        border-radius: 12px;
        color: #333;
        font-weight: bold;
      }

      .detalle-table {
        border-radius: 12px;
        overflow: hidden;
      }

      .detalle-table thead {
        background: #000;
        color: #fff;
      }
    </style>

    <div class="container py-3">

      <button class="btn-volver mb-3" @click=${() => window.history.back()}>
        ← Volver
      </button>

      <div class="pedido-card mb-4">
        <h2 style="font-weight:900; margin-bottom:0.8rem;">Pedido #${pedido.id}</h2>

        <div class="row mb-2">
          <div class="col"><strong>Cliente:</strong> ${pedido.cliente?.nombre}</div>
          <div class="col"><strong>Repartidor:</strong> ${pedido.repartidor?.nombre || "Sin asignar"}</div>
        </div>

        <div class="row mb-2">
          <div class="col"><strong>Método de pago:</strong> ${pedido.metodoPago?.tipo}</div>
          <div class="col"><strong>Fecha:</strong> ${fecha}</div>
        </div>

        <div class="row mb-4">
          <div class="col"><strong>Total:</strong> S/. ${pedido.total}</div>

          ${
            pedido.id_estado === 2
              ? html`
                  <div class="col ">
                    <button class="btn-aceptar" @click=${() => actualizarEstado(3)}>
                      ✔ Aceptar Pedido
                    </button>
                  </div>
                `
              : ""
          }
        </div>
      </div>

      <div class="estado-box"
        style="background-color: ${estadoColor};
        padding: 0.7rem;
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        border-radius: 10px;
        font-family: 'Anton', sans-serif;">
        Estado: ${pedido.estadoPedido?.nombre}
      </div>

      <h4 style="font-weight: 800;">Detalles del Pedido</h4>

      <table class="table detalle-table table-hover mt-3">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio U.</th>
            <th>Personalizaciones</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.detalles.map(det => html`
            <tr>
              <td>${det.producto.nombre}</td>
              <td>${det.cantidad}</td>
              <td>S/. ${det.precio_unitario}</td>
              <td>
                ${det.personalizaciones.length === 0
                  ? html`<span class="text-muted">Ninguna</span>`
                  : html`
                      <ul class="mb-0 ps-3">
                        ${det.personalizaciones.map(p => html`
                          <li>
                            ${p.tamano ? `Tamaño: ${p.tamano.nombre}` : ""}
                            ${p.ingrediente ? `Ingrediente: ${p.ingrediente.nombre} (${p.cantidad} × S/. ${p.ingrediente.costo_extra})` : ""}
                          </li>
                        `)}
                      </ul>
                    `}
              </td>
              <td>S/. ${det.subtotal}</td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `;

  render(template, document.getElementById("contenedor"));
}
