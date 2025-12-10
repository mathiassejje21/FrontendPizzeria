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

  let estadoColor = "#e2e8f0";
  if (pedido.id_estado === 2) estadoColor = "#fee2e2";
  else if (pedido.id_estado === 3) estadoColor = "#fef9c3";
  else if (pedido.id_estado === 4) estadoColor = "#e2e8f0";
  else if (pedido.id_estado === 5) estadoColor = "#dcfce7";
  else if (pedido.id_estado === 6) estadoColor = "#f1f5f9";

  const fecha = new Date(pedido.fecha_pedido).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short"
  });

  const template = html`
    <style>
      body {
        background: #f8fafc;
        font-family: "Inter", sans-serif;
      }

      .container-section {
        max-width: 1050px;
        margin: auto;
        padding: 1rem;
      }

      .card {
        background: white;
        border-radius: 14px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        border: 1px solid #e5e7eb;
        margin-bottom: 2rem;
      }

      .btn-back {
        background: #1e293b;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: .2s ease;
      }

      .btn-back:hover {
        background: #334155;
        transform: translateY(-2px);
      }

      .btn-primary {
        background: #4f46e5;
        color: white;
        padding: 12px 22px;
        border-radius: 10px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: .25s;
      }

      .btn-primary:hover {
        background: #4338ca;
        transform: translateY(-1px);
      }

      .estado-pill {
        background: ${estadoColor};
        padding: .9rem;
        border-radius: 12px;
        text-align:center;
        font-weight: 700;
        color:#1e293b;
        margin-bottom: 2rem;
        border: 1px solid #cbd5e1;
        font-size: 1.1rem;
      }

      h2 {
        color: #1e293b;
        font-size: 1.7rem;
        font-weight: 800;
        margin-bottom: 1rem;
      }

      h4 {
        color: #1e293b;
        font-weight: 700;
        margin-top: 1.5rem;
      }

      strong {
        color: #1e293b;
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 10px;
        margin-top: 1rem;
      }

      thead {
        background: #1e293b;
        color: white;
      }

      thead th {
        padding: 1rem;
        font-size: .9rem;
        text-transform: uppercase;
        letter-spacing: .5px;
      }

      tbody tr {
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        transition: .2s;
      }

      tbody tr:hover {
        background: #f1f5f9;
      }

      tbody td {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        font-weight: 500;
        color: #334155;
      }

      ul {
        padding-left: 18px;
      }

      .text-muted {
        color: #94a3b8 !important;
      }
    </style>

    <div class="container-section">

      <button class="btn-back mb-3" @click=${() => window.history.back()}>
        ← Volver
      </button>

      <div class="card">
        <h2>Pedido #${pedido.id}</h2>

        <div class="row mb-3">
          <div class="col"><strong>Cliente:</strong> ${pedido.cliente?.nombre}</div>
          <div class="col"><strong>Repartidor:</strong> ${pedido.repartidor?.nombre || "Sin asignar"}</div>
        </div>

        <div class="row mb-3">
          <div class="col"><strong>Método de pago:</strong> ${pedido.metodoPago?.tipo}</div>
          <div class="col"><strong>Fecha:</strong> ${fecha}</div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <strong>Total:</strong> S/. ${pedido.total}
          </div>

          ${
            pedido.id_estado === 2
              ? html`
                  <div class="col">
                    <button class="btn-primary" @click=${() => actualizarEstado(3)}>
                      ✔ Aceptar Pedido
                    </button>
                  </div>
                `
              : ""
          }
        </div>
      </div>

      <div class="estado-pill">
        Estado: ${pedido.estadoPedido?.nombre}
      </div>

      <h4 style="margin-top: 2rem; color: #fff;">Detalles del Pedido</h4>

      <table>
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
                      <ul>
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
