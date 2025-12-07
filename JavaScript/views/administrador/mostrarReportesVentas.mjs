import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";

export function renderReportesVentasView() {
  const api = new reporteController();
  let data = null;
  let startDate = "";
  let endDate = "";
  let granularity = "day";
  let metodo = "";
  const charts = {};

  const loadReport = async () => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (granularity) params.granularity = granularity;
    if (metodo) params.metodo_pago = metodo;

    data = await api.ventas(params);
    actualizarVista();
  };

  const onFilter = (e) => {
    e.preventDefault();
    startDate = document.getElementById("v_start").value;
    endDate = document.getElementById("v_end").value;
    granularity = document.getElementById("v_granularity").value;
    metodo = document.getElementById("v_metodo").value;

    loadReport();
  };

  const renderGraficos = () => {
    if (!data) return;

    const serie = data.serie || [];
    const labels = serie.map(s => s.periodo);
    const valores = serie.map(s => Number(s.total));

    if (charts.linea) charts.linea.destroy();
    const ctxLinea = document.getElementById("g_linea").getContext("2d");

    charts.linea = new Chart(ctxLinea, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Ventas",
          data: valores,
          borderColor: "#4ade80",
          backgroundColor: "rgba(74,222,128,0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });

    const top3 = [...serie]
      .sort((a, b) => Number(b.total) - Number(a.total))
      .slice(0, 3);

    const labelsTop = top3.map(t => t.periodo);
    const valoresTop = top3.map(t => Number(t.total));

    if (charts.top3) charts.top3.destroy();
    const ctxTop = document.getElementById("g_top3").getContext("2d");

    charts.top3 = new Chart(ctxTop, {
      type: "bar",
      data: {
        labels: labelsTop,
        datasets: [{
          label: "Ventas",
          data: valoresTop,
          backgroundColor: ["#4ade80", "#3b82f6", "#a855f7"],
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#cbd5e1" }, grid: { display: false } },
          y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });

    const metodos = data.ventasPorMetodo || [];
    const labelsMetodo = metodos.map(m => m.metodo);
    const valoresMetodo = metodos.map(m => Number(m.total));

    if (charts.metodos) charts.metodos.destroy();
    const ctxCircular = document.getElementById("g_circular_metodos").getContext("2d");

    charts.metodos = new Chart(ctxCircular, {
      type: "doughnut",
      data: {
        labels: labelsMetodo,
        datasets: [{
          data: valoresMetodo,
          backgroundColor: ["#4ade80", "#3b82f6"],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            labels: { color: "#e5e7eb" },
            position: "bottom"
          }
        }
      }
    });
  };

  const actualizarVista = () => {
    const template = html`
      <main style="
        display:grid;
        grid-template-columns:1fr 1.4fr;
        gap:1rem;
        padding:1rem;
        min-height:100vh;
        background:#020617;
      ">
        <section style="display:flex; flex-direction:column; gap:1rem;">
          
          <div style="
            background:linear-gradient(145deg,#1e293b,#020617);
            padding:1.2rem;
            border-radius:1rem;
            color:white;
            border:1px solid rgba(148,163,184,0.2);
            box-shadow:0 4px 20px rgba(0,0,0,0.35);
          ">
            <p style="margin:0; opacity:.8;">Ingresos totales</p>
            <h1 style="margin:.3rem 0; font-size:2.6rem; color:#4ade80;">
              S/. ${data ? data.ingresosTotales.toFixed(2) : "0.00"}
            </h1>
            <p style="margin:0; opacity:.7; font-size:.9rem;">
              Promedio por pedido: S/. ${data ? data.promedioPorPedido.toFixed(2) : "0.00"}
            </p>
          </div>

          <div style="
            background:linear-gradient(145deg,#1f2937,#020617);
            padding:1rem;
            border-radius:.9rem;
            border:1px solid rgba(148,163,184,0.18);
            color:white;
            display:flex;
            flex-direction:column;
            gap:.5rem;
          ">
            <h3 style="margin:0; font-size:1rem;">Ventas por método</h3>

            ${
              data && data.ventasPorMetodo
                ? data.ventasPorMetodo.map(
                    v => html`
                      <div style="
                        display:flex;
                        justify-content:space-between;
                        background:#0f172a;
                        padding:.6rem;
                        border-radius:.5rem;
                        border:1px solid rgba(148,163,184,0.2);
                      ">
                        <span>${v.metodo}</span>
                        <strong style="color:#4ade80;">S/. ${v.total}</strong>
                      </div>
                    `
                  )
                : ""
            }
          </div>

          <div style="margin-top:6rem; width:100%; height:260px;">
            <canvas id="g_circular_metodos"></canvas>
          </div>

        </section>

        <section style="
          background:linear-gradient(145deg,#020617,#020617);
          padding:1rem;
          border-radius:1rem;
          color:white;
          border:1px solid rgba(148,163,184,0.25);
          box-shadow:0 4px 20px rgba(0,0,0,0.35);
          display:flex;
          flex-direction:column;
          gap:1rem;
        ">
          
          <form style="display:flex; gap:.6rem;">
            <input id="v_start" type="date" style="padding:.5rem; background:#0f172a; border:1px solid #334155; color:white; border-radius:.4rem;">
            <input id="v_end" type="date" style="padding:.5rem; background:#0f172a; border:1px solid #334155; color:white; border-radius:.4rem;">
            <select id="v_granularity" style="padding:.5rem; background:#0f172a; border:1px solid #334155; color:white; border-radius:.4rem;">
              <option value="day">Día</option>
              <option value="month">Mes</option>
            </select>
            <select id="v_metodo" style="padding:.5rem; background:#0f172a; border:1px solid #334155; color:white; border-radius:.4rem;">
              <option value="">Todos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Pasarela">Pasarela</option>
            </select>
            <button @click=${onFilter} style="
              padding:.6rem 1rem;
              background:#22c55e;
              color:#020617;
              border:none;
              border-radius:.5rem;
              font-weight:600;
              cursor:pointer;
            ">Aplicar</button>
          </form>

          <div style="height:270px;">
            <canvas id="g_linea"></canvas>
          </div>

          <div style="
            margin-top:1rem;
            height:400px;
            background:#0f172a;
            padding:1rem;
            border-radius:.7rem;
            border:1px solid rgba(148,163,184,0.2);
          ">
            <h3 style="margin:0 0 .6rem;">Top 3 días con mayores ventas</h3>
            <canvas id="g_top3"></canvas>
          </div>

        </section>
      </main>
    `;

    render(template, document.getElementById("contenedor"));
    renderGraficos();
  };

  loadReport();
}
