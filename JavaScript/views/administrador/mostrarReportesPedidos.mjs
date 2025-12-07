import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";
import { pedidoController } from "../../controllers/pedidoController.mjs";

export function renderReportesPedidosView() {
  const api = new reporteController();
  const apiPedido = new pedidoController();

  let data = null;
  let filteredUltimos = [];
  let searchTerm = "";
  let startDate = "";
  let endDate = "";
  let limit = 10;
  let pedidoSeleccionado = null;
  const charts = {};

  const colores = {
    Pendiente: "#fbbf24",
    Pagado: "#22c55e",
    Preparando: "#3b82f6",
    "En camino": "#a855f7",
    Rechazado: "#ef4444"
  };

  async function loadReport() {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (limit) params.limit = limit;

      const res = await api.pedidos(params);
      data = res;
      filteredUltimos = [...(data?.ultimos || [])];
      aplicarFiltroSearch();
      actualizarVista();
    } catch (e) {
      console.error(e);
    }
  }

  function aplicarFiltroSearch() {
    if (!data?.ultimos) return;

    const term = searchTerm.toLowerCase().trim();

    if (term === "") {
      filteredUltimos = [...data.ultimos];
    } else {
      filteredUltimos = data.ultimos.filter(p =>
        p.cliente.toLowerCase().includes(term)
      );
    }
  }

  async function loadPedidoSeleccionado(id_pedido) {
    try {
      const res = await apiPedido.getPedidoById(id_pedido);
      pedidoSeleccionado = res;
      actualizarVista();
    } catch (e) {
      console.error(e);
    }
  }

  function closeModal() {
    pedidoSeleccionado = null;
    actualizarVista();
  }

  const onFilter = (e) => {
    e.preventDefault();
    const startInput = document.getElementById("f_start");
    const endInput = document.getElementById("f_end");
    const limitInput = document.getElementById("f_limit");

    startDate = startInput ? startInput.value : "";
    endDate = endInput ? endInput.value : "";
    const val = limitInput ? parseInt(limitInput.value, 10) : 10;
    limit = Number.isNaN(val) ? 10 : val;

    loadReport();
  };

  function renderGraficos() {
    if (!data || !data.porEstado) return;
    data.porEstado.forEach((item, index) => {
      const id = `graf_${index}`;
      const porcentaje = item.porcentaje || 0;
      const estado = item.estado;
      crearGrafico(id, porcentaje, estado);
    });
  }

  function crearGrafico(id, porcentaje, estado) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (charts[id]) charts[id].destroy();

    charts[id] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Porcentaje", "Restante"],
        datasets: [
          {
            data: [porcentaje, 100 - porcentaje],
            backgroundColor: [
              colores[estado] || "#4ade80",
              "rgba(255,255,255,0.08)"
            ],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: { legend: { display: false } }
      }
    });
  }

  const actualizarVista = () => {
    const template = html`
    ${pedidoSeleccionado ? html`
      <section id="pedidoDetalle"
        style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);display:flex;justify-content:center;align-items:flex-start;padding-top:3rem;z-index:9999;">
        <div style="width:520px;background:linear-gradient(145deg,#0f172a,#020617);border:1px solid rgba(148,163,184,0.18);border-radius:1rem;padding:1.5rem 1.8rem;color:white;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h2 style="margin:0;font-size:1.4rem;font-weight:700;color:#4ade80;">Pedido #${pedidoSeleccionado.id}</h2>
            <button @click=${closeModal} style="background:rgba(239,68,68,.15);color:#ef4444;border:1px solid rgba(239,68,68,.4);width:36px;height:36px;border-radius:10px;font-size:1.2rem;cursor:pointer;">✕</button>
          </div>

          <div style="background:#0b1220;padding:1rem;border-radius:.7rem;border:1px solid rgba(148,163,184,0.15);margin-bottom:1rem;">
            <p style="margin:.2rem 0;opacity:.7;">Cliente:</p>
            <h3 style="margin:0;">${pedidoSeleccionado.cliente?.nombre}</h3>

            <p style="margin:.6rem 0 .2rem;opacity:.7;">Repartidor:</p>
            <h3 style="margin:0;">${pedidoSeleccionado.repartidor?.nombre}</h3>

            <p style="margin:.6rem 0 .2rem;opacity:.7;">Estado:</p>
            <span style="padding:.3rem .7rem;border-radius:999px;background:#22c55e33;border:1px solid #22c55e55;color:#22c55e;">
              ${pedidoSeleccionado.estadoPedido?.nombre}
            </span>

            <p style="margin:.8rem 0 .2rem;opacity:.7;">Fecha:</p>
            <p style="margin:0;">${pedidoSeleccionado.fecha_pedido.split("T")[0]}</p>
          </div>

          <h3 style="margin:.2rem 0 .8rem;">Detalles del pedido</h3>

          <div style="max-height:230px;overflow-y:auto;padding-right:.4rem;">
          ${pedidoSeleccionado.detalles.map(det => html`
            <div style="background:#0f172a;padding:.7rem 1rem;border-radius:.6rem;border:1px solid rgba(148,163,184,0.18);margin-bottom:.6rem;display:flex;justify-content:space-between;">
              <div>
                <p style="margin:0;font-weight:600;">${det.producto?.nombre}</p>
                ${det.personalizaciones?.length ? html`
                  <p style="margin:.3rem 0 0;opacity:.7;">${det.personalizaciones.map(p => p.ingrediente?.nombre).join(", ")}</p>
                ` : ""}
              </div>
              <strong style="color:#4ade80;">S/. ${det.subtotal}</strong>
            </div>
          `)}
          </div>

          <div style="margin-top:1rem;display:flex;justify-content:space-between;padding:1rem;background:#0b1220;border-radius:.7rem;border:1px solid rgba(148,163,184,0.2);font-size:1.2rem;color:#4ade80;">
            <span>Total</span><span>S/. ${pedidoSeleccionado.total}</span>
          </div>
        </div>
      </section>
    ` : ""}

    <main style="display:grid;grid-template-columns:1fr 1.5fr;gap:1rem;padding:1rem;min-height:100vh;background:#020617;">
      
      <section style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;">
          ${data?.porEstado?.map((e, i) => html`
            <div style="background:linear-gradient(145deg,#1f2937,#020617);padding:1rem 1.2rem;border-radius:.9rem;color:white;border:1px solid rgba(148,163,184,0.18);">
              <div style="display:flex;justify-content:space-between;">
                <h3 style="margin:0;font-size:1rem;display:flex;align-items:center;gap:.4rem;">
                  <span style="width:.65rem;height:.65rem;border-radius:999px;background:${colores[e.estado]}"></span>${e.estado}
                </h3>
                <span style="opacity:.8;">${e.cantidad} pedidos</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:.3rem;">
                <span style="font-size:1.5rem;color:${colores[e.estado]}">${e.porcentaje.toFixed(2)}%</span>
              </div>
              <div style="margin-top:.5rem;height:155px;"><canvas id=${`graf_${i}`}></canvas></div>
            </div>
          `)}
        </div>
      </section>

      <section style="background:linear-gradient(145deg,#020617,#020617);padding:1rem 1.2rem;border-radius:1rem;color:white;border:1px solid rgba(148,163,184,0.25);display:flex;flex-direction:column;gap:1rem;">
        
        <div>
          <h2 style="margin:0 0 .5rem;font-size:1.2rem;">Filtros</h2>
          <p style="margin:0 0 .8rem;font-size:.8rem;opacity:.7;">Ajusta el rango de fechas y el límite de registros para actualizar los gráficos y la tabla.</p>
        </div>

        <form style="display:flex;flex-direction:column;gap:.6rem;background:#020617;border-radius:.7rem;padding:.8rem;border:1px solid rgba(148,163,184,0.28);">
          <label style="font-size:.85rem;display:flex;flex-direction:column;gap:.25rem;">
            Fecha inicio
            <input id="f_start" type="date" style="width:100%;padding:.4rem .5rem;border-radius:.4rem;border:1px solid rgba(148,163,184,0.4);background:#020617;color:#e5e7eb;">
          </label>

          <label style="font-size:.85rem;display:flex;flex-direction:column;gap:.25rem;">
            Fecha fin
            <input id="f_end" type="date" style="width:100%;padding:.4rem .5rem;border-radius:.4rem;border:1px solid rgba(148,163,184,0.4);background:#020617;color:#e5e7eb;">
          </label>

          <label style="font-size:.85rem;display:flex;flex-direction:column;gap:.25rem;">
            Límite de pedidos
            <input id="f_limit" type="number" value="10" min="1" style="width:100%;padding:.4rem .5rem;border-radius:.4rem;border:1px solid rgba(148,163,184,0.4);background:#020617;color:#e5e7eb;">
          </label>

          <button @click=${onFilter} style="margin-top:.4rem;padding:.55rem;background:linear-gradient(135deg,#22c55e,#16a34a);color:#020617;border:none;border-radius:.5rem;cursor:pointer;font-weight:600;">
            Aplicar filtros
          </button>
        </form>

        <div>
          <h3 style="margin:0 0 .4rem;">Últimos pedidos</h3>
          <p style="margin:0 0 .5rem;font-size:.78rem;opacity:.65;">Vista de los pedidos más recientes según los filtros aplicados.</p>
        </div>

        <input 
          id="f_search"
          placeholder="Buscar cliente..."
          value=${searchTerm}
          @input=${(e)=>{ searchTerm = e.target.value; aplicarFiltroSearch(); actualizarVista(); }}
          style="padding:.5rem;margin-bottom:.5rem;border-radius:.4rem;border:1px solid rgba(148,163,184,0.35);background:#0f172a;color:white;"
        >

        <div style="border-radius:.7rem;background:#020617;padding:.4rem;border:1px solid rgba(148,163,184,0.2); overflow-y:auto;height:255px;">
        ${filteredUltimos.length > 0 ? html`
          <table style="width:100%;color:white;border-collapse:collapse;font-size:.85rem;">
            <thead>
              <tr>
                <th style="padding:.55rem .45rem;border-bottom:1px solid rgba(148,163,184,0.35);">ID</th>
                <th style="padding:.55rem .45rem;border-bottom:1px solid rgba(148,163,184,0.35);">Cliente</th>
                <th style="padding:.55rem .45rem;border-bottom:1px solid rgba(148,163,184,0.35);text-align:right;">Total</th>
                <th style="padding:.55rem .45rem;border-bottom:1px solid rgba(148,163,184,0.35);text-align:center;">Estado</th>
                <th style="padding:.55rem .45rem;border-bottom:1px solid rgba(148,163,184,0.35);text-align:center;">Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUltimos.map((p,index)=>html`
                <tr @click=${()=>loadPedidoSeleccionado(p.id)}
                  style="cursor:pointer;background:${index%2==0?'rgba(15,23,42,0.85)':'rgba(15,23,42,0.65)'};border-bottom:1px solid rgba(30,41,59,0.9);">
                  <td style="padding:.5rem .45rem;">${p.id}</td>
                  <td style="padding:.5rem .45rem;">${p.cliente}</td>
                  <td style="padding:.5rem .45rem;text-align:right;color:#4ade80;font-weight:600;">S/. ${p.total}</td>
                  <td style="padding:.5rem .45rem;text-align:center;">
                    <span style="background:${colores[p.estado]};padding:.2rem .6rem;border-radius:999px;font-size:.75rem;">${p.estado}</span>
                  </td>
                  <td style="padding:.5rem .45rem;text-align:center;opacity:.85;">${p.fecha_pedido.split("T")[0]}</td>
                </tr>
              `)}
            </tbody>
          </table>
        ` : html`<p style="font-size:.85rem;opacity:.75;">No se encontraron resultados.</p>`}
        </div>
      </section>

    </main>
    `;

    render(template, document.getElementById("contenedor"));
    if (data?.porEstado) renderGraficos();
  };

  actualizarVista();
  loadReport();
}
