import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";

export function renderDashboardView() {
  const api = new reporteController();
  const charts = {};

  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth();
  const inicioMes = new Date(year, month, 1);
  const finMes = new Date(year, month + 1, 0);
  const formatDate = (d) => d.toISOString().split("T")[0];
  const startDate = formatDate(inicioMes);
  const endDate = formatDate(finMes);
  const mesLabel = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(hoy);

  let dataPedidos = null;
  let dataProductos = null;
  let dataCategorias = null;
  let dataIngredientes = null;

  const coloresEstados = {
    Pendiente: "#fbbf24",
    Pagado: "#22c55e",
    Preparando: "#3b82f6",
    "En camino": "#a855f7",
    Rechazado: "#ef4444"
  };

  async function loadData() {
    try {
      const paramsPedidos = { start_date: startDate, end_date: endDate, limit: 10 };
      const paramsProductos = { id_categoria: 1, top: 5, start_date: startDate, end_date: endDate };
      const paramsCategorias = { start_date: startDate, end_date: endDate, top: 5 };
      const paramsIngredientes = { solo_criticos: false, umbral: 10, start_date: startDate, end_date: endDate };

      const [resPed, resProd, resCat, resIng] = await Promise.all([
        api.pedidos(paramsPedidos),
        api.productos(paramsProductos),
        api.categorias(paramsCategorias),
        api.ingredientes(paramsIngredientes)
      ]);

      dataPedidos = resPed || null;
      dataProductos = resProd || null;
      dataCategorias = resCat || null;
      dataIngredientes = resIng || null;

      renderView();
      renderCharts();
    } catch (e) {
      console.error(e);
    }
  }

  function buildPedidosPorDia() {
    const conteo = {};
    if (!dataPedidos || !dataPedidos.ultimos) return { labels: [], valores: [] };
    for (const p of dataPedidos.ultimos) {
      const dia = p.fecha_pedido.split("T")[0];
      conteo[dia] = (conteo[dia] || 0) + 1;
    }
    const labels = Object.keys(conteo).sort();
    const valores = labels.map((l) => conteo[l]);
    return { labels, valores };
  }

  function renderCharts() {
    const destroyIf = (key) => {
      if (charts[key]) {
        charts[key].destroy();
        delete charts[key];
      }
    };

    const canvasEstados = document.getElementById("g_estados_barra");
    if (canvasEstados && dataPedidos && dataPedidos.porEstado && dataPedidos.porEstado.length) {
      destroyIf("estados");
      const labels = dataPedidos.porEstado.map((e) => e.estado);
      const valores = dataPedidos.porEstado.map((e) => e.cantidad);
      charts.estados = new Chart(canvasEstados.getContext("2d"), {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: "Pedidos", data: valores, backgroundColor: labels.map((l) => coloresEstados[l] || "#4ade80"), borderRadius: 10 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#cbd5e1" }, grid: { display: false } },
            y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.18)" } }
          }
        }
      });
    }

    const canvasPedidosDia = document.getElementById("g_pedidos_dia");
    const serie = buildPedidosPorDia();
    if (canvasPedidosDia && serie.labels.length > 0) {
      destroyIf("pedidosDia");
      charts.pedidosDia = new Chart(canvasPedidosDia.getContext("2d"), {
        type: "line",
        data: {
          labels: serie.labels,
          datasets: [
            {
              label: "Pedidos",
              data: serie.valores,
              borderColor: "#4ade80",
              backgroundColor: "rgba(74,222,128,0.25)",
              borderWidth: 2,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: "#22c55e"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#cbd5e1" }, grid: { display: false } },
            y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.2)" } }
          }
        }
      });
    }

    const canvasCat = document.getElementById("g_categorias");
    if (canvasCat && dataCategorias && dataCategorias.categorias && dataCategorias.categorias.length) {
      destroyIf("categorias");
      const labels = dataCategorias.categorias.map((c) => c.nombre);
      const valores = dataCategorias.categorias.map((c) => c.ingresos);
      charts.categorias = new Chart(canvasCat.getContext("2d"), {
        type: "doughnut",
        data: { labels, datasets: [{ data: valores, backgroundColor: ["#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ef4444"], hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { display: false } } }
      });
    }

    const canvasIng = document.getElementById("g_ingredientes");
    if (canvasIng && dataIngredientes && dataIngredientes.ingredientes && dataIngredientes.ingredientes.length) {
      destroyIf("ingredientes");
      const labels = dataIngredientes.ingredientes.map((i) => i.nombre);
      const valores = dataIngredientes.ingredientes.map((i) => i.stock);
      charts.ingredientes = new Chart(canvasIng.getContext("2d"), {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: "Stock", data: valores, backgroundColor: labels.map((_, idx) => (idx % 2 === 0 ? "rgba(248, 113, 113, 0.9)" : "rgba(239, 68, 68, 0.9)")), borderRadius: 8 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#fecaca", font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: "#fecaca" }, grid: { color: "rgba(248, 113, 113, 0.35)" } }
          }
        }
      });
    }
  }

  const renderView = () => {
    const totalPedidos = dataPedidos?.total || 0;
    const estadosActivos = dataPedidos?.porEstado?.length || 0;
    const totalProductos = dataProductos?.mas_vendidos?.length || 0;
    const criticos = dataIngredientes?.ingredientes?.filter((i) => i.critico)?.length || 0;

    const template = html`
      <div style="width:100%; min-height:100vh; background:#020617; padding:1.5rem; box-sizing:border-box; color:white;">
        <div style="max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:1rem;">
          <header style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <div>
              <h1 style="margin:0; font-size:1.6rem; font-weight:700;">Panel de Personal</h1>
              <p style="margin:.2rem 0 0; font-size:.85rem; opacity:.7;">Resumen operativo de pedidos y productos · ${mesLabel}</p>
            </div>
            <div style="padding:.55rem 1rem; border-radius:999px; background:rgba(15,23,42,0.85); border:1px solid rgba(148,163,184,0.5); font-size:.8rem;">
              Rango: ${startDate} — ${endDate}
            </div>
          </header>

          <section style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.9rem;">
            <div style="background:linear-gradient(145deg,#1e293b,#020617); padding:1rem; border-radius:.9rem; border:1px solid rgba(74,222,128,0.4); box-shadow:0 0 18px rgba(34,197,94,0.35);">
              <p style="margin:0; font-size:.8rem; opacity:.8; text-align:center">Pedidos gestionados</p>
              <h2 style="margin:1rem 0 0; font-size:2rem; color:#4ade80; text-align:center">${totalPedidos}</h2>
            </div>

            <div style="background:linear-gradient(145deg,#1e293b,#020617); padding:1rem; border-radius:.9rem; border:1px solid rgba(59,130,246,0.5); box-shadow:0 0 18px rgba(59,130,246,0.35);">
              <p style="margin:0; font-size:.8rem; opacity:.8; text-align:center">Estados activos</p>
              <h2 style="margin:1rem 0 0; font-size:2rem; color:#60a5fa; text-align:center">${estadosActivos}</h2>
            </div>

            <div style="background:linear-gradient(145deg,#1e293b,#020617); padding:1rem; border-radius:.9rem; border:1px solid rgba(244,114,182,0.5); box-shadow:0 0 18px rgba(244,114,182,0.35);">
              <p style="margin:0; font-size:.8rem; opacity:.8; text-align:center">Productos en foco</p>
              <h2 style="margin:1rem 0 0; font-size:2rem; color:#f472b6; text-align:center">${totalProductos}</h2>
            </div>

            <div style="background:linear-gradient(145deg,#1e293b,#020617); padding:1rem; border-radius:.9rem; border:1px solid rgba(248,113,113,0.6); box-shadow:0 0 18px rgba(248,113,113,0.4);">
              <p style="margin:0; font-size:.8rem; opacity:.8; text-align:center">Ingredientes críticos</p>
              <h2 style="margin:1rem 0 0; font-size:2rem; color:#f97373; text-align:center">${criticos}</h2>
            </div>
          </section>

          <section style="display:grid; grid-template-columns:1.4fr 1fr; gap:1rem;">
            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(148,163,184,0.35); padding:1rem; display:flex; flex-direction:column; gap:.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h2 style="margin:0; font-size:1.05rem;">Pedidos por estado</h2>
                  <p style="margin:.25rem 0 0; font-size:.8rem; opacity:.7;">Distribución de pedidos según su estado actual</p>
                </div>
              </div>
              <div style="height:260px;"><canvas id="g_estados_barra"></canvas></div>
            </div>

            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(148,163,184,0.35); padding:1rem; display:flex; flex-direction:column; gap:.5rem;">
              <h2 style="margin:0; font-size:1.05rem;">Últimos pedidos</h2>
              <p style="margin:.2rem 0 .5rem; font-size:.8rem; opacity:.7;">Pedidos más recientes dentro del rango mostrado</p>

              <div style="border-radius:.7rem; background:#020617; padding:.4rem; border:1px solid rgba(148,163,184,0.2); max-height:260px; overflow-y:auto;">
                ${
                  dataPedidos &&
                  dataPedidos.ultimos &&
                  dataPedidos.ultimos.length
                    ? html`
                        <table style="width:100%; color:white; border-collapse:collapse; font-size:.8rem;">
                          <thead>
                            <tr style="background:#020617;">
                              <th style="padding:.55rem .45rem; text-align:left; border-bottom:1px solid rgba(148,163,184,0.35); position:sticky; top:0; background:#020617; z-index:1;">ID</th>
                              <th style="padding:.55rem .45rem; text-align:left; border-bottom:1px solid rgba(148,163,184,0.35); position:sticky; top:0; background:#020617; z-index:1;">Cliente</th>
                              <th style="padding:.55rem .45rem; text-align:right; border-bottom:1px solid rgba(148,163,184,0.35); position:sticky; top:0; background:#020617; z-index:1;">Total</th>
                              <th style="padding:.55rem .45rem; text-align:center; border-bottom:1px solid rgba(148,163,184,0.35); position:sticky; top:0; background:#020617; z-index:1;">Estado</th>
                              <th style="padding:.55rem .45rem; text-align:center; border-bottom:1px solid rgba(148,163,184,0.35); position:sticky; top:0; background:#020617; z-index:1;">Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${dataPedidos.ultimos.map((p, index) => html`
                              <tr style="border-bottom:1px solid rgba(30,41,59,0.9); background:${index % 2 === 0 ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.65)"};">
                                <td style="padding:.5rem .45rem;">${p.id}</td>
                                <td style="padding:.5rem .45rem;">${p.cliente}</td>
                                <td style="padding:.5rem .45rem; text-align:right; color:#4ade80; font-weight:600;">S/. ${p.total}</td>
                                <td style="padding:.5rem .45rem; text-align:center;">
                                  <span style="background:${coloresEstados[p.estado] || "#64748b"}; padding:.2rem .6rem; border-radius:999px; font-size:.75rem; display:inline-block;">${p.estado}</span>
                                </td>
                                <td style="padding:.5rem .45rem; text-align:center; opacity:.85;">${p.fecha_pedido.split("T")[0]}</td>
                              </tr>
                            `)}
                          </tbody>
                        </table>
                      `
                    : html`<p style="font-size:.8rem; opacity:.75; padding:.4rem;">No hay pedidos recientes.</p>`
                }
              </div>
            </div>
          </section>

          <section style="display:grid; grid-template-columns:1.2fr 1fr; gap:1rem;">
            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(148,163,184,0.35); padding:1rem; display:flex; flex-direction:column; gap:.5rem;">
              <h2 style="margin:0; font-size:1.05rem;">Pedidos del mes (tendencia diaria)</h2>
              <p style="margin:.2rem 0 .5rem; font-size:.8rem; opacity:.7;">Cantidad de pedidos realizados cada día</p>
              <div style="height:260px;"><canvas id="g_pedidos_dia"></canvas></div>
            </div>

            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(148,163,184,0.35); padding:1rem; display:flex; flex-direction:column; gap:.5rem;">
              <h2 style="margin:0; font-size:1.05rem;">Categorías más activas</h2>
              <p style="margin:.2rem 0 .5rem; font-size:.8rem; opacity:.7;">Participación de categorías en ingresos</p>
              <div style="height:220px;"><canvas id="g_categorias"></canvas></div>
            </div>
          </section>

          <section style="display:grid; grid-template-columns:1fr 1.1fr; gap:1rem; margin-bottom:1rem;">
            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(148,163,184,0.35); padding:1rem; display:flex; flex-direction:column; gap:.5rem;">
              <h2 style="margin:0; font-size:1.05rem;">Ingredientes y stock</h2>
              <p style="margin:.2rem 0 .5rem; font-size:.8rem; opacity:.7;">Visión rápida del nivel de stock actual por ingrediente</p>
              <div style="height:240px;"><canvas id="g_ingredientes"></canvas></div>
            </div>

            <div style="background:#020617; border-radius:1rem; border:1px solid rgba(248,113,113,0.6); padding:1rem; display:flex; flex-direction:column; gap:.4rem;">
              <h2 style="margin:0; font-size:1.05rem; color:#fecaca;">Ingredientes en nivel crítico</h2>
              <p style="margin:.2rem 0 .5rem; font-size:.8rem; opacity:.7; color:#fecaca;">Revisa estos ingredientes para coordinar reabastecimiento</p>

              <div style="max-height:230px; overflow-y:auto; border-radius:.7rem; border:1px solid rgba(248,113,113,0.6); padding:.5rem; background:radial-gradient(circle at top,#7f1d1d,#020617);">
                ${
                  dataIngredientes &&
                  dataIngredientes.ingredientes &&
                  dataIngredientes.ingredientes.filter((i) => i.critico).length
                    ? dataIngredientes.ingredientes
                        .filter((i) => i.critico)
                        .map(
                          (i) => html`
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:.45rem .55rem; margin-bottom:.3rem; border-radius:.5rem; background:rgba(127,29,29,0.7); border:1px solid rgba(248,113,113,0.8); font-size:.8rem; color:#fee2e2;">
                              <span>${i.nombre}</span>
                              <span>Stock: <b>${i.stock}</b></span>
                            </div>
                          `
                        )
                    : html`<p style="margin:0; font-size:.8rem; opacity:.8; color:#fee2e2;">No hay ingredientes en nivel crítico.</p>`
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    render(template, document.getElementById("contenedor"));
  };

  renderView();
  loadData();
}
