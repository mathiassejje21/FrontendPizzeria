import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";
import { filterBasic, sortBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function mostrarPedidos() {
  const apiPedido = new pedidoController();
  const res = await apiPedido.getPedidos();
  const pedidos = res.filter(p => p.activo === true);

  let currentPage = 1;
  const rowsPerPage = 6;
  let selectedPedido = null;
  let sortDirection = "desc";
  let fechaFiltro = "";

  const getFilterPedidos = () => filterBasic(pedidos, [], "", "fecha_pedido", fechaFiltro);
  const getSortedPedidos = () => sortBasic(getFilterPedidos(), "fecha_pedido", sortDirection);
  const getPaginatedPedidos = () => paginateBasic(getSortedPedidos(), currentPage, rowsPerPage);
  const totalPages = () => totalPagesBasic(getSortedPedidos(), rowsPerPage);

  const prevPage = () => { if (currentPage > 1) { currentPage--; renderView(); }};
  const nextPage = () => { if (currentPage < totalPages()) { currentPage++; renderView(); }};

  function pagarPedido() {
    const raw = sessionStorage.getItem("last_payment_url");
    if (!raw) return;
    const data = JSON.parse(raw);
    location.href = data.url_pago;
  }

  const getEstadoBadgeClass = (id) => {
    if (id === 1) return "estado-amarillo";
    if (id === 2) return "estado-rojo";
    if (id === 3 || id === 4) return "estado-azul";
    if (id === 5) return "estado-verde";
    return "";
  };

  function convertirHoraPeru(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString("es-PE", { hour12: false });
  }

  function renderView() {
    const template = html`
    <style>
      #contenedor {
        padding-top: 7rem;
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        background: #3b3b3b !important;
        color: #fff !important;
      }
      .layout {
        width: 100%;
        max-width: 1200px;
        padding: 1.5rem;
        color: #fff !important;
      }
      .card-main {
        background: rgba(0,0,0,0.45) !important;
        border-radius: 1.3rem;
        padding: 1.8rem;
        backdrop-filter: blur(12px);
        box-shadow: 0 18px 40px rgba(0,0,0,0.55);
        color: #fff !important;
      }
      .title {
        font-size: 1.9rem;
        font-weight: 800;
        color: #fff !important;
      }
      .title span {
        font-size: 0.85rem;
        opacity: 0.8;
        color: #fff !important;
      }
      .filters {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .filter-input {
        padding: .55rem .8rem;
        border-radius: .6rem;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff !important;
      }
      .sort-btn {
        padding: .6rem 1rem;
        border-radius: .6rem;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.25);
        color: #fff !important;
      }
      .table-wrapper {
        width: 100%;
        margin-top: 1rem;
        overflow-x: auto;
        border-radius: 0.9rem;
        background: rgba(255,255,255,0.05) !important;
      }
      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 6px;
        color: #fff !important;
        font-size: 0.9rem;
      }
      thead th {
        padding: .7rem;
        text-align: left;
        background: rgba(0,0,0,0.4) !important;
        color: #fff !important;
      }
      tbody tr {
        background: rgba(0,0,0,0.35) !important;
      }
      tbody tr:hover {
        background: rgba(255,255,255,0.05) !important;
      }
      tbody td {
        padding: .65rem .7rem;
        color: #fff !important;
      }
      .col-id,
      .col-total {
        font-weight: 700;
        color: #ff7b4a !important;
      }
      .estado-badge {
        padding: .25rem .9rem;
        border-radius: 20px;
        font-size: .78rem;
        font-weight: bold;
        display: inline-block;
      }
      .estado-amarillo {
        background: rgba(250,204,21,0.15);
        color: #FACC15 !important;
        border: 2px solid #FACC15;
      }
      .estado-rojo {
        background: rgba(239,68,68,0.15);
        color: #ef4444 !important;
        border: 2px solid #ef4444;
      }
      .estado-azul {
        background: rgba(59,130,246,0.15);
        color: #3b82f6 !important;
        border: 2px solid #3b82f6;
      }
      .estado-verde {
        background: rgba(34,197,94,0.15);
        color: #22c55e !important;
        border: 2px solid #22c55e;
      }

      .acciones {
        display: flex;
        justify-content: center;
        gap: .5rem;
      }
      .btn-ver, .btn-eliminar {
        padding: .45rem .9rem;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.8rem;
      }
      .btn-ver {
        background: #ff7b4a !important;
        color: #fff !important;
      }
      .btn-eliminar {
        background: rgba(239,68,68,0.2);
        color: #ef4444 !important;
      }

      .paginate {
        margin-top: 1.2rem;
        display: flex;
        justify-content: center;
        gap: 1rem;
        color: #fff !important;
      }
      .paginate button {
        padding: .45rem 1rem;
        border-radius: 20px;
        border: none;
        color: #fff !important;
        cursor: pointer;
      }
      .paginate button:not(:disabled) {
        background: #ff7b4a !important;
      }
      .paginate button:disabled {
        background: #b3b3b3 !important;
        color: #666 !important;
        cursor: not-allowed;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(6px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }
      .modal-box {
        width: 90%;
        max-width: 480px;
        background: #3b3b3b !important;
        border-radius: 1rem;
        padding: 1.6rem;
        color: #fff !important;
      }
      .modal-close {
        border: none;
        background: rgba(255,255,255,0.15);
        color: #fff !important;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
      }
      .btn-pagar {
        padding: .7rem 1.3rem;
        background: #ff7b4a !important;
        border-radius: 20px;
        border: none;
        color: #fff !important;
        font-weight: bold;
        cursor: pointer;
        margin-top: 1rem;
        width: 100%;
      }
    </style>

    <main class="layout">
      <section class="card-main">
        <div class="title">
          Mis pedidos
          <span>Consulta el historial de pedidos</span>
        </div>

        <div class="filters">
          <input type="date" class="filter-input"
            @input=${e => { fechaFiltro = e.target.value; currentPage = 1; renderView(); }}>
          <button class="sort-btn"
            @click=${() => { sortDirection = sortDirection === "asc" ? "desc" : "asc"; renderView(); }}>
            ${sortDirection === "asc" ? "↑ Más antiguos" : "↓ Más recientes"}
          </button>
        </div>

        ${getSortedPedidos().length === 0 ? html`
          <p style="opacity:.7;margin-top:1rem;">No hay pedidos encontrados.</p>
        ` : html`
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pago</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th style="text-align:center;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${getPaginatedPedidos().map(p => html`
                  <tr>
                    <td class="col-id">#${p.id}</td>
                    <td>${p.metodoPago.tipo}</td>
                    <td>${p.fecha_pedido.split("T")[0]}</td>
                    <td>${convertirHoraPeru(p.fecha_pedido)}</td>
                    <td>
                      <span class="estado-badge ${getEstadoBadgeClass(p.estadoPedido.id)}">
                        ${p.estadoPedido.nombre}
                      </span>
                    </td>
                    <td class="col-total">S/ ${p.total}</td>
                    <td>
                      <div class="acciones">
                        <button class="btn-ver" @click=${() => { selectedPedido = p; renderView(); }}>Ver</button>
                        ${(p.estadoPedido.id === 1 || p.estadoPedido.id === 2) ? html`
                          <button class="btn-eliminar"
                            @click=${async () => {
                              const r = await mensajeAlert({
                                icon: "warning",
                                title: "Eliminar pedido",
                                text: "¿Deseas eliminarlo?",
                                showCancelButton: true,
                                confirmButtonText: "Eliminar"
                              });
                              if (!r.isConfirmed) return;
                              const del = await apiPedido.deletePedido(p.id);
                              if (del?.status !== 200) return;
                              await mensajeAlert({ icon: "success", title: "Eliminado", timer: 1500 });
                              location.reload();
                            }}>
                            Eliminar
                          </button>
                        ` : ""}
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>

          <div class="paginate">
            <button @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
            <span>Página ${currentPage} / ${totalPages()}</span>
            <button @click=${nextPage} ?disabled=${currentPage >= totalPages()}>Siguiente</button>
          </div>
        `}
      </section>

      ${selectedPedido ? html`
        <section class="overlay">
          <div class="modal-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3>Pedido #${selectedPedido.id}</h3>
              <button class="modal-close" @click=${() => { selectedPedido = null; renderView(); }}>✕</button>
            </div>

            <p><strong>Método:</strong> ${selectedPedido.metodoPago.tipo}</p>
            <p><strong>Fecha:</strong> ${selectedPedido.fecha_pedido.split("T")[0]}</p>
            <p><strong>Hora:</strong> ${convertirHoraPeru(selectedPedido.fecha_pedido)}</p>
            <p><strong>Total:</strong> S/ ${selectedPedido.total}</p>

            <div style="margin-top:.8rem;">
              <h4>Productos</h4>
              <ul>
                ${selectedPedido.detalles?.map(d => html`
                  <li>${d.producto.nombre} x${d.cantidad} — S/ ${d.subtotal}</li>
                `)}
              </ul>
            </div>

            ${(() => {
              if (selectedPedido.estadoPedido.id !== 1) return "";
              const raw = sessionStorage.getItem("last_payment_url");
              if (!raw) return "";
              const data = JSON.parse(raw);
              return data.id_pedido === selectedPedido.id
                ? html`<button class="btn-pagar" @click=${pagarPedido}>Pagar ahora</button>`
                : "";
            })()}
          </div>
        </section>
      ` : ""}
    </main>
    `;

    render(template, document.getElementById("contenedor"));
  }

  renderView();
}
