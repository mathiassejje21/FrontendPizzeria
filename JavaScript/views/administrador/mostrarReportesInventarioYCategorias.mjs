import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";

export function renderReportesInventarioYCategoriasView() {
  const api = new reporteController();

  let dataIng = null;
  let dataCat = null;
  let startDate = "";
  let endDate = "";
  let soloCriticos = false;
  let umbral = 10;
  let top = 5;
  const charts = {};

  const onFilter = (e) => {
    e.preventDefault();
    startDate = document.getElementById("f_start")?.value || "";
    endDate = document.getElementById("f_end")?.value || "";
    soloCriticos = document.getElementById("f_criticos")?.checked || false;
    umbral = Number(document.getElementById("f_umbral")?.value || 10);
    top = Number(document.getElementById("f_topcat")?.value || 5);
    loadReports();
  };

  async function loadReports() {
    const pIng = { start_date: startDate, end_date: endDate, solo_criticos: soloCriticos, umbral };
    const pCat = { start_date: startDate, end_date: endDate, top };
    const [resIng, resCat] = await Promise.all([api.ingredientes(pIng), api.categorias(pCat)]);
    dataIng = resIng || { ingredientes: [], reorden_sugerido: [] };
    dataCat = resCat || { categorias: [] };
    actualizarVista();
    renderGraficos();
  }

  function renderGraficos() {
    if (!dataCat?.categorias?.length) return;

    const labels = dataCat.categorias.map((c) => c.nombre);
    const ingresos = dataCat.categorias.map((c) => c.ingresos);
    const porcentajes = dataCat.categorias.map((c) => c.porcentaje);

    const bar = document.getElementById("g_cat")?.getContext("2d");
    const pie = document.getElementById("g_cat_pie")?.getContext("2d");

    if (!bar || !pie) return;

    if (charts.bar) charts.bar.destroy();
    charts.bar = new Chart(bar, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Ingresos",
            data: ingresos,
            backgroundColor: ["#4ade80", "#3b82f6", "#a855f7", "#f97316", "#ef4444"],
            borderRadius: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#e2e8f0" } },
          y: { ticks: { color: "#e2e8f0" } }
        }
      }
    });

    if (charts.pie) charts.pie.destroy();
    charts.pie = new Chart(pie, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: porcentajes,
            backgroundColor: ["#4ade80", "#3b82f6", "#a855f7", "#f97316", "#ef4444"],
            hoverOffset: 8
          }
        ]
      },
      options: { cutout: "70%", plugins: { legend: { display: false } } }
    });
  }

  const actualizarVista = () => {
    const template = html`
      <div
        style="
          width:100%min-;
          min-height:100vh;
          overflow-y:auto;
          background: radial-gradient(circle at top, #0f172a 0%, #020617 60%, #000 100%);
          padding:1.5rem;
          color:white;
        "
      >
        <div
          style="
            width:100%;
            min-height:100vh;
            border:none;
            display:flex;
            flex-direction:column;
            gap:1.5rem;
          "
        >
          <header
            style="
              display:flex;
              align-items:center;
              gap:.8rem;
              padding:1rem;
              background:rgba(15,23,42,0.6);
              border-radius:.8rem;
              border:1px solid rgba(255,255,255,0.08);
            "
          >
            <input id="f_start" type="date"
              style="
                padding:.6rem .8rem;
                background:#020617;
                border:1px solid #334155;
                color:#e2e8f0;
                border-radius:.5rem;
                flex:1;
              "/>

            <input id="f_end" type="date"
              style="
                padding:.6rem .8rem;
                background:#020617;
                border:1px solid #334155;
                color:#e2e8f0;
                border-radius:.5rem;
                flex:1;
              "/>

            <label
              style="
                display:flex; align-items:center; gap:.4rem;
                font-size:.8rem; padding:.5rem .8rem;
                background:#020617; border-radius:.5rem;
                border:1px solid #334155;
              "
            >
              <input id="f_criticos" type="checkbox" /> Críticos
            </label>

            <input id="f_umbral" type="number" value="10"
              style="
                width:90px; padding:.6rem .4rem;
                background:#020617; border:1px solid #334155;
                color:#e2e8f0; border-radius:.5rem;
              "/>

            <input id="f_topcat" type="number" value="5"
              style="
                width:90px; padding:.6rem .4rem;
                background:#020617; border:1px solid #334155;
                color:#e2e8f0; border-radius:.5rem;
              "/>

            <button @click=${onFilter}
              style="
                padding:.7rem 1.2rem;
                background:linear-gradient(135deg,#22c55e,#16a34a);
                border:none;
                border-radius:.6rem;
                font-weight:700;
                color:#020617;
                cursor:pointer;
              "
            >
              Aplicar
            </button>
          </header>

          <main
            style="
              display:grid;
              grid-template-columns: 1fr 2fr;
              gap:1.5rem;
              align-items:flex-start;
            "
          >

            <section
              style="
                background:rgba(15,23,42,0.75);
                padding:1.2rem;
                border-radius:1rem;
                border:1px solid rgba(255,255,255,0.10);
                backdrop-filter:blur(10px);
                display:flex;
                flex-direction:column;
                gap:1rem;
                box-shadow:0 0 25px rgba(0,0,0,0.45);
              "
            >
              <h2 style="margin:0; font-size:1.15rem; color:#4ade80;">Estado de Ingredientes</h2>

              <div
                style="
                  max-height:450px;
                  overflow-y:auto;
                  display:flex;
                  flex-direction:column;
                  gap:.7rem;
                  padding-right:.3rem;
                "
              >
                ${dataIng?.ingredientes?.length
                  ? dataIng.ingredientes.map(
                      (i) => html`
                        <div
                          style="
                            background:#0f172a;
                            padding:.75rem 1rem;
                            border-radius:.8rem;
                            border:1px solid rgba(255,255,255,0.10);
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                          "
                        >
                          <div>
                            <b style="color:#e2e8f0;">${i.nombre}</b><br />
                            <span style="opacity:.75; font-size:.8rem;">
                              Usado: ${i.usado} | Stock: ${i.stock}
                            </span>
                          </div>

                          <span
                            style="
                              padding:.25rem .7rem;
                              border-radius:999px;
                              font-size:.75rem;
                              background:${i.critico ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'};
                              border:1px solid ${i.critico ? '#ef4444' : '#22c55e'};
                              color:${i.critico ? '#fecaca' : '#bbf7d0'};
                            "
                          >
                            ${i.critico ? "Crítico" : "OK"}
                          </span>
                        </div>
                      `
                    )
                  : html`<p style="opacity:.7;">No hay ingredientes.</p>`}
              </div>

              <h3 style="font-size:1rem; color:#4ade80; margin-top:.5rem;">Reorden Sugerido</h3>

              <div style="display:flex; flex-direction:column; gap:.5rem;">
                ${dataIng?.reorden_sugerido?.length
                  ? dataIng.reorden_sugerido.map(
                      (r) => html`
                        <div
                          style="
                            background:#1e293b;
                            padding:.7rem 1rem;
                            border-radius:.7rem;
                            border:1px solid rgba(255,255,255,0.10);
                            color:#e2e8f0;
                          "
                        >
                          ${r.nombre}
                          → <b style="color:#4ade80;">${r.cantidad_recomendada}</b>
                        </div>
                      `
                    )
                  : html`<p style="opacity:.7;">Sin recomendaciones.</p>`}
              </div>
            </section>

            <section
              style="
                background:rgba(2,6,23,0.75);
                padding:1.2rem;
                border-radius:1rem;
                border:1px solid rgba(255,255,255,0.08);
                backdrop-filter:blur(10px);
                display:flex;
                flex-direction:column;
                gap:1.2rem;
                box-shadow:0 0 25px rgba(0,0,0,0.45);
              "
            >
              <h2 style="margin:0; font-size:1.15rem; color:#3b82f6;">Rendimiento por Categoría</h2>

              <div style="height:260px;"><canvas id="g_cat"></canvas></div>

              <div
                style="
                  display:flex;
                  gap:1rem;
                  align-items:center;
                  background:#020617;
                  border-radius:.9rem;
                  padding:.7rem .5rem;
                  padding:1rem;
                  border:1px solid rgba(255,255,255,0.10);
                "
              >
                <div style="flex:1; height:300px;"><canvas id="g_cat_pie" style="display:block; margin:0 auto;"></canvas></div>

                <div style="flex:1; font-size:.85rem; display:flex; flex-direction:column; gap:.3rem;">
                  <h3 style="margin:0; font-size:.95rem; color:#3b82f6;">Participación</h3>

                  ${dataCat?.categorias?.length
                    ? dataCat.categorias.map(
                        (c) => html`
                          <div
                            style="
                              display:flex; justify-content:space-between;
                              padding:.3rem 0;
                            "
                          >
                            <span>${c.nombre}</span>
                            <b style="color:#4ade80;">${c.porcentaje.toFixed(2)}%</b>
                          </div>
                        `
                      )
                    : html`<p style="opacity:.7;">Sin datos.</p>`}
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    `;

    render(template, document.getElementById("contenedor"));
  };

  loadReports();
}
