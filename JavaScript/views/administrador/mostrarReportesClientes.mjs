import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";

export function renderReportesClientesView() {
  const api = new reporteController();

  let data = null;
  let startDate = "";
  let endDate = "";
  let top = 3;
  const charts = {};

  function getInitials(nombre = "") {
    const parts = nombre.trim().split(" ").filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const onFilter = (e) => {
    e.preventDefault();
    const s = document.getElementById("c_start");
    const f = document.getElementById("c_end");
    const t = document.getElementById("c_top");
    startDate = s ? s.value : "";
    endDate = f ? f.value : "";
    top = t ? Number(t.value || 3) : 3;
    loadReport();
  };

  async function loadReport() {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (top) params.top = top;

    data = await api.clientes(params);
    actualizarVista();
    renderGraficos();
  }

  function renderGraficos() {
    if (!data || !data.nuevos_por_mes) return;

    const serie = data.nuevos_por_mes;
    if (!serie.length) return;

    const labels = serie.map((m) => m.mes);
    const valores = serie.map((m) => Number(m.nuevos));

    const canvas = document.getElementById("g_clientes_nuevos");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (charts.linea) charts.linea.destroy();

    charts.linea = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Nuevos clientes",
            data: valores,
            borderColor: "#4ade80",
            backgroundColor: "rgba(74,222,128,0.12)",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "rgba(148,163,184,0.15)" }
          },
          y: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "rgba(148,163,184,0.12)" }
          }
        }
      }
    });
  }

  const actualizarVista = () => {
    const topClientes = data?.top_clientes || [];
    const first = topClientes[0] || null;
    const second = topClientes[1] || null;
    const third = topClientes[2] || null;
    const maxGasto =
      topClientes.length > 0
        ? Math.max(...topClientes.map((c) => Number(c.gasto_total)))
        : 0;
    const totalNuevos = data?.nuevos_por_mes
      ? data.nuevos_por_mes.reduce((acc, m) => acc + Number(m.nuevos), 0)
      : 0;

    const template = html`
      <main
        style="
          display:grid;
          grid-template-columns:1.1fr 1.4fr;
          gap:1rem;
          padding:1rem;
          min-height:100vh;
          background:#020617;
          color:#e5e7eb;
          font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        "
      >
        <header
          style="
            grid-column:1 / -1;
            display:flex;
            align-items:center;
            gap:.7rem;
            padding:.9rem 1rem;
            background:linear-gradient(145deg,#020617,#020617);
            border-radius:.9rem;
            border:1px solid rgba(148,163,184,0.4);
            box-shadow:0 8px 24px rgba(15,23,42,0.7);
          "
        >
          <div style="flex:1; display:flex; flex-direction:column; gap:.1rem;">
            <span style="font-size:.8rem; opacity:.6;">Reporte de clientes</span>
            <h1
              style="
                margin:0;
                font-size:1.15rem;
                font-weight:600;
                display:flex;
                align-items:center;
                gap:.5rem;
              "
            >
              Comportamiento de clientes y lealtad
            </h1>
          </div>

          <div style="display:flex; gap:.5rem; align-items:center;">
            <input
              id="c_start"
              type="date"
              style="
                padding:.4rem .6rem;
                background:#020617;
                border-radius:.5rem;
                border:1px solid #334155;
                color:#e5e7eb;
                font-size:.8rem;
              "
            />
            <input
              id="c_end"
              type="date"
              style="
                padding:.4rem .6rem;
                background:#020617;
                border-radius:.5rem;
                border:1px solid #334155;
                color:#e5e7eb;
                font-size:.8rem;
              "
            />
            <input
              id="c_top"
              type="number"
              value="3"
              min="1"
              style="
                width:70px;
                padding:.4rem .4rem;
                background:#020617;
                border-radius:.5rem;
                border:1px solid #334155;
                color:#e5e7eb;
                font-size:.8rem;
                text-align:center;
              "
            />
            <button
              @click=${onFilter}
              style="
                padding:.45rem 1rem;
                background:linear-gradient(135deg,#22c55e,#16a34a);
                border:none;
                border-radius:.5rem;
                font-weight:600;
                font-size:.85rem;
                color:#020617;
                cursor:pointer;
                display:flex;
                align-items:center;
                gap:.35rem;
                box-shadow:0 8px 18px rgba(34,197,94,0.45);
              "
            >
              Aplicar
            </button>
          </div>
        </header>

        <section
          style="
            display:flex;
            flex-direction:column;
            gap:1rem;
            height:100%;
          "
        >
          <div
            style="
              background:radial-gradient(circle at top,#1e293b 0%,#020617 55%);
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.5);
              padding:1rem 1.1rem;
              box-shadow:0 18px 35px rgba(15,23,42,0.85);
              display:flex;
              flex-direction:column;
              gap:.8rem;
            "
          >
            <div
              style="
                display:flex;
                align-items:flex-start;
                justify-content:space-between;
                gap:.8rem;
              "
            >
              <div>
                <p style="margin:0; font-size:.78rem; opacity:.7;">
                  Top clientes por gasto
                </p>
                <h2
                  style="
                    margin:.2rem 0 0;
                    font-size:1.1rem;
                    font-weight:600;
                  "
                >
                  Podio de clientes
                </h2>
              </div>
              <div
                style="
                  padding:.3rem .7rem;
                  border-radius:999px;
                  background:rgba(15,23,42,0.9);
                  border:1px solid rgba(148,163,184,0.5);
                  font-size:.75rem;
                "
              >
                Total nuevos: <b>${totalNuevos}</b>
              </div>
            </div>

            <div
              style="
                display:grid;
                grid-template-columns:1.1fr .9fr;
                gap:.7rem;
                align-items:stretch;
              "
            >
              <div
                style="
                  background:linear-gradient(145deg,#0f172a,#020617);
                  border-radius:.9rem;
                  border:1px solid rgba(74,222,128,0.8);
                  padding:.9rem;
                  display:flex;
                  flex-direction:column;
                  gap:.5rem;
                  box-shadow:0 14px 24px rgba(22,163,74,0.5);
                  min-height:150px;
                "
              >
                <span style="font-size:.75rem; opacity:.7;">1er lugar</span>
                ${first
                  ? html`
                      <div
                        style="
                          display:flex;
                          align-items:center;
                          gap:.7rem;
                          margin-top:.1rem;
                        "
                      >
                        <div
                          style="
                            width:40px;
                            height:40px;
                            border-radius:999px;
                            background:radial-gradient(circle,#4ade80 0%,#16a34a 60%,#166534 100%);
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-weight:700;
                            color:#022c22;
                            font-size:.9rem;
                          "
                        >
                          ${getInitials(first.nombre)}
                        </div>
                        <div style="display:flex; flex-direction:column;">
                          <strong style="font-size:.95rem;">${first.nombre}</strong>
                          <span style="font-size:.78rem; opacity:.7;">
                            Pedidos: ${first.pedidos}
                          </span>
                        </div>
                      </div>
                      <div
                        style="
                          display:flex;
                          justify-content:space-between;
                          align-items:flex-end;
                          margin-top:.4rem;
                        "
                      >
                        <div style="display:flex; flex-direction:column;">
                          <span style="font-size:.75rem; opacity:.7;">Gasto total</span>
                          <span
                            style="
                              font-size:1.25rem;
                              font-weight:700;
                              color:#bbf7d0;
                            "
                          >
                            S/. ${Number(first.gasto_total).toFixed(2)}
                          </span>
                        </div>
                        <span
                          style="
                            font-size:.75rem;
                            padding:.25rem .6rem;
                            border-radius:999px;
                            background:rgba(22,163,74,0.18);
                            border:1px solid rgba(74,222,128,0.9);
                            color:#bbf7d0;
                          "
                        >
                          Cliente estrella
                        </span>
                      </div>
                    `
                  : html`<p style="font-size:.8rem; opacity:.7;">
                      No hay datos de clientes.
                    </p>`}
              </div>

              <div
                style="
                  display:flex;
                  flex-direction:column;
                  gap:.6rem;
                "
              >
                <div
                  style="
                    flex:1;
                    background:linear-gradient(145deg,#0b1120,#020617);
                    border-radius:.9rem;
                    border:1px solid rgba(148,163,184,0.7);
                    padding:.7rem .75rem;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                  "
                >
                  <span style="font-size:.75rem; opacity:.7;">2do lugar</span>
                  ${second
                    ? html`
                        <div
                          style="
                            display:flex;
                            align-items:center;
                            gap:.6rem;
                            margin-top:.2rem;
                          "
                        >
                          <div
                            style="
                              width:34px;
                              height:34px;
                              border-radius:999px;
                              background:radial-gradient(circle,#3b82f6 0%,#1d4ed8 65%,#0b1120 100%);
                              display:flex;
                              align-items:center;
                              justify-content:center;
                              font-weight:600;
                              font-size:.8rem;
                            "
                          >
                            ${getInitials(second.nombre)}
                          </div>
                          <div style="display:flex; flex-direction:column;">
                            <strong style="font-size:.9rem;">${second.nombre}</strong>
                            <span style="font-size:.75rem; opacity:.7;">
                              S/. ${Number(second.gasto_total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      `
                    : html`<span style="font-size:.78rem; opacity:.7;">—</span>`}
                </div>

                <div
                  style="
                    flex:1;
                    background:linear-gradient(145deg,#0b1120,#020617);
                    border-radius:.9rem;
                    border:1px solid rgba(148,163,184,0.7);
                    padding:.7rem .75rem;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                  "
                >
                  <span style="font-size:.75rem; opacity:.7;">3er lugar</span>
                  ${third
                    ? html`
                        <div
                          style="
                            display:flex;
                            align-items:center;
                            gap:.6rem;
                            margin-top:.2rem;
                          "
                        >
                          <div
                            style="
                              width:34px;
                              height:34px;
                              border-radius:999px;
                              background:radial-gradient(circle,#a855f7 0%,#7e22ce 65%,#2e1065 100%);
                              display:flex;
                              align-items:center;
                              justify-content:center;
                              font-weight:600;
                              font-size:.8rem;
                            "
                          >
                            ${getInitials(third.nombre)}
                          </div>
                          <div style="display:flex; flex-direction:column;">
                            <strong style="font-size:.9rem;">${third.nombre}</strong>
                            <span style="font-size:.75rem; opacity:.7;">
                              S/. ${Number(third.gasto_total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      `
                    : html`<span style="font-size:.78rem; opacity:.7;">—</span>`}
                </div>
              </div>
            </div>
          </div>

          <div
            style="
              background:#020617;
              border-radius:.9rem;
              border:1px solid rgba(148,163,184,0.4);
              padding:.8rem .9rem;
              box-shadow:0 10px 24px rgba(15,23,42,0.85);
              display:flex;
              flex-direction:column;
              gap:.4rem;
            "
          >
            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                margin-bottom:.2rem;
              "
            >
              <h3
                style="
                  margin:0;
                  font-size:.98rem;
                "
              >
                Ranking de clientes
              </h3>
              <span style="font-size:.8rem; opacity:.65;">
                Mostrando top ${topClientes.length}
              </span>
            </div>

            <div
              style="
                max-height:400px;
                overflow-y:auto;
                display:flex;
                flex-direction:column;
                gap:.35rem;
              "
            >
              ${topClientes.length
                ? topClientes.map((c, idx) => {
                    const pct =
                      maxGasto > 0
                        ? Math.max(
                            8,
                            (Number(c.gasto_total) / maxGasto) * 100
                          )
                        : 0;
                    const colorBar =
                      idx === 0
                        ? "#4ade80"
                        : idx === 1
                        ? "#3b82f6"
                        : idx === 2
                        ? "#a855f7"
                        : "#64748b";
                    return html`
                      <div
                        style="
                          border-radius:.7rem;
                          border:1px solid rgba(30,64,175,0.5);
                          background:rgba(15,23,42,0.95);
                          padding:.45rem .6rem .5rem;
                          display:flex;
                          flex-direction:column;
                          gap:.15rem;
                        "
                      >
                        <div
                          style="
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:.6rem;
                          "
                        >
                          <div
                            style="
                              display:flex;
                              align-items:center;
                              gap:.55rem;
                            "
                          >
                            <span
                              style="
                                width:22px;
                                height:22px;
                                border-radius:999px;
                                border:1px solid rgba(148,163,184,0.7);
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:.76rem;
                                opacity:.9;
                              "
                            >
                              #${idx + 1}
                            </span>
                            <div
                              style="
                                display:flex;
                                flex-direction:column;
                                gap:.05rem;
                              "
                            >
                              <span
                                style="
                                  font-size:.9rem;
                                  font-weight:500;
                                "
                              >
                                ${c.nombre}
                              </span>
                              <span
                                style="
                                  font-size:.75rem;
                                  opacity:.65;
                                "
                              >
                                Pedidos: ${c.pedidos}
                              </span>
                            </div>
                          </div>

                          <div
                            style="
                              text-align:right;
                              min-width:90px;
                            "
                          >
                            <span
                              style="
                                font-size:.78rem;
                                opacity:.65;
                              "
                            >
                              Gasto
                            </span>
                            <div
                              style="
                                font-size:.9rem;
                                font-weight:600;
                                color:#bbf7d0;
                              "
                            >
                              S/. ${Number(c.gasto_total).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div
                          style="
                            margin-top:.25rem;
                            width:100%;
                            height:6px;
                            border-radius:999px;
                            background:#020617;
                            overflow:hidden;
                          "
                        >
                          <div
                            style="
                              height:100%;
                              width:${pct}%;
                              background:${colorBar};
                              box-shadow:0 0 10px ${colorBar}55;
                            "
                          ></div>
                        </div>
                      </div>
                    `;
                  })
                : html`<p style="font-size:.8rem; opacity:.7; margin:.2rem 0;">
                    No hay datos de clientes en el rango seleccionado.
                  </p>`}
            </div>
          </div>
        </section>

        <section
          style="
            background:linear-gradient(145deg,#020617,#020617);
            border-radius:1rem;
            border:1px solid rgba(148,163,184,0.4);
            padding:1rem;
            box-shadow:0 18px 35px rgba(15,23,42,0.9);
            display:flex;
            flex-direction:column;
            gap:.8rem;
          "
        >
          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:flex-start;
              gap:.7rem;
            "
          >
            <div style="display:flex; flex-direction:column; gap:.15rem;">
              <h2
                style="
                  margin:0;
                  font-size:1rem;
                "
              >
                Nuevos clientes por mes
              </h2>
              <p
                style="
                  margin:0;
                  font-size:.8rem;
                  opacity:.7;
                "
              >
                Evolución de alta de clientes en el periodo seleccionado.
              </p>
            </div>
            <div
              style="
                padding:.35rem .7rem;
                border-radius:999px;
                background:#020617;
                border:1px solid rgba(148,163,184,0.6);
                font-size:.75rem;
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:center;
                gap:1rem;
                min-width:150px;
                text-align:right;
              "
            >
              <span style="opacity:.7;">Total nuevos</span>
              <span
                style="
                  font-weight:600;
                  color:#4ade80;
                  font-size:.9rem;
                "
              >
                ${totalNuevos}
              </span>
            </div>
          </div>

          <div
            style="
              flex:1;
              min-height:260px;
              border-radius:.8rem;
              background:#020617;
              border:1px solid rgba(30,64,175,0.7);
              padding:.7rem .9rem;
            "
          >
            <canvas id="g_clientes_nuevos"></canvas>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              font-size:.78rem;
              opacity:.7;
              margin-top:.2rem;
            "
          >
            <span>
              Cada punto representa el número de clientes registrados en ese mes.
            </span>
          </div>
        </section>
      </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  loadReport();
}
