import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { reporteController } from "@controllers/reporteController.mjs";
import { categoriaController } from "@controllers/categoriaController.mjs";

export function renderReportesProductosView() {
  const apiReporte = new reporteController();
  const apiCategoria = new categoriaController();

  let data = null;
  let categorias = [];
  let idCategoria = "";
  let startDate = "";
  let endDate = "";
  let topN = 10;
  const charts = {
    ranking: null,
    incomes: null,
  };

  async function loadReport() {
    try {
      const params = {};
      if (idCategoria) params.id_categoria = idCategoria;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (topN) params.top = topN;

      data = await apiReporte.productos(params);
      actualizarVista();
    } catch (e) {
      console.error(e);
    }
  }

  async function loadInitial() {
    try {
      categorias = await apiCategoria.getCategorias();
    } catch (e) {
      console.error(e);
    }
    await loadReport();
  }

  const onFilter = (e) => {
    e.preventDefault();
    const catSel = document.getElementById("p_categoria");
    const startInput = document.getElementById("p_start");
    const endInput = document.getElementById("p_end");
    const topInput = document.getElementById("p_top");

    idCategoria = catSel ? catSel.value : "";
    startDate = startInput ? startInput.value : "";
    endDate = endInput ? endInput.value : "";
    const valTop = topInput ? parseInt(topInput.value, 10) : 10;
    topN = Number.isNaN(valTop) || valTop <= 0 ? 10 : valTop;

    loadReport();
  };

  function renderGraficos() {
    if (!data || !data.top || data.top.length === 0) {
      if (charts.ranking) {
        charts.ranking.destroy();
        charts.ranking = null;
      }
      if (charts.incomes) {
        charts.incomes.destroy();
        charts.incomes = null;
      }
      return;
    }

    const top = data.top;
    const labels = top.map((p) => p.nombre);
    const cantidades = top.map((p) => Number(p.cantidad_vendida || 0));
    const ingresos = top.map((p) => Number(p.ingresos || 0));

    const baseColors = [
      "#22c55e",
      "#3b82f6",
      "#a855f7",
      "#f97316",
      "#eab308",
      "#06b6d4",
      "#f43f5e",
      "#10b981",
      "#6366f1",
      "#ec4899",
    ];
    const colores = labels.map((_, i) => baseColors[i % baseColors.length]);

    const rankingCanvas = document.getElementById("g_ranking_productos");
    if (rankingCanvas) {
      const ctxRanking = rankingCanvas.getContext("2d");
      if (charts.ranking) charts.ranking.destroy();

      charts.ranking = new Chart(ctxRanking, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Cantidad vendida",
              data: cantidades,
              backgroundColor: colores,
              borderWidth: 0,
              borderRadius: 10,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` ${ctx.parsed.x} unidades vendidas`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#cbd5e1" },
              grid: { color: "rgba(148,163,184,0.15)" },
            },
            y: {
              ticks: { color: "#cbd5e1" },
              grid: { display: false },
            },
          },
        },
      });
    }

    const incomesCanvas = document.getElementById(
      "g_ingresos_productos_donut"
    );
    if (incomesCanvas) {
      const ctxIncomes = incomesCanvas.getContext("2d");
      if (charts.incomes) charts.incomes.destroy();

      charts.incomes = new Chart(ctxIncomes, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: ingresos,
              backgroundColor: colores,
              borderWidth: 0,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const valor = ctx.raw || 0;
                  return ` S/. ${valor.toFixed(2)}`;
                },
              },
            },
          },
        },
      });
    }
  }

  const actualizarVista = () => {
    const top = data?.top || [];
    const menos = data?.menos_vendidos || [];
    const top3 = top.slice(0, 3);

    const template = html`
      <main
        style="
          display:grid;
          grid-template-columns:1.4fr 1.1fr;
          gap:1rem;
          padding:1rem;
          min-height:100vh;
          background:#020617;
        "
      >
        <section style="display:flex; flex-direction:column; gap:1rem;">
          <div
            style="
              background:linear-gradient(135deg,#1f2937,#020617);
              padding:1.2rem 1.5rem;
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.25);
              color:white;
              display:flex;
              justify-content:space-between;
              align-items:center;
              box-shadow:0 4px 20px rgba(0,0,0,0.4);
            "
          >
            <div>
              <p style="margin:0; opacity:.8; font-size:.9rem;">
                Rendimiento por producto
              </p>
              <h1
                style="
                  margin:.3rem 0 0;
                  font-size:1.8rem;
                  font-weight:700;
                  letter-spacing:.03em;
                "
              >
                Top productos vendidos
              </h1>
              <p style="margin:.3rem 0 0; font-size:.8rem; opacity:.7;">
                Analiza cuáles productos impulsan tus ventas en el periodo
                seleccionado.
              </p>
            </div>
            <div
              style="
                padding:.6rem 1rem;
                border-radius:999px;
                background:#020617;
                border:1px solid rgba(148,163,184,0.4);
                font-size:.8rem;
                display:flex;
                flex-direction:column;
                gap:.15rem;
                min-width:180px;
                align-items:flex-end;
              "
            >
              <span style="opacity:.7;">Productos analizados</span>
              <span style="font-size:1.1rem; font-weight:700; color:#4ade80;">
                ${top.length}
              </span>
            </div>
          </div>

          <div
            style="
              background:linear-gradient(135deg,#020617,#020617);
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.3);
              padding:1rem 1.2rem;
              color:white;
              display:flex;
              flex-direction:column;
              gap:.6rem;
            "
          >
            <h3 style="margin:0; font-size:1rem;">Top 3 productos</h3>
            <p style="margin:0; font-size:.8rem; opacity:.7;">
              Ranking destacado por cantidad vendida.
            </p>

            <div
              style="
                display:grid;
                grid-template-columns:repeat(3,minmax(0,1fr));
                gap:.8rem;
                margin-top:.4rem;
              "
            >
              ${top3.length === 0
                ? html`<p style="grid-column:1/-1; opacity:.7; font-size:.85rem;">
                    No hay datos para el rango seleccionado.
                  </p>`
                : top3.map((p, i) => {
                    const posiciones = ["1°", "2°", "3°"];
                    const coloresGrad = [
                      "linear-gradient(145deg,#22c55e,#15803d)",
                      "linear-gradient(145deg,#3b82f6,#1d4ed8)",
                      "linear-gradient(145deg,#a855f7,#7e22ce)",
                    ];
                    const borderColores = [
                      "rgba(34,197,94,0.6)",
                      "rgba(59,130,246,0.6)",
                      "rgba(168,85,247,0.6)",
                    ];
                    const fontSize = i === 0 ? "1.1rem" : ".95rem";
                    const badgeBg =
                      i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "#a855f7";
                    return html`
                      <div
                        style="
                          background:${coloresGrad[i]};
                          border-radius:.9rem;
                          padding:.8rem;
                          border:1px solid ${borderColores[i]};
                          box-shadow:0 6px 18px rgba(0,0,0,0.45);
                          display:flex;
                          flex-direction:column;
                          gap:.35rem;
                        "
                      >
                        <div
                          style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                          "
                        >
                          <span
                            style="
                              padding:.2rem .6rem;
                              border-radius:999px;
                              font-size:.75rem;
                              font-weight:600;
                              background:#020617;
                            "
                          >
                            ${posiciones[i]}
                          </span>
                          <span
                            style="
                              font-size:.8rem;
                              opacity:.85;
                            "
                          >
                            ${p.cantidad_vendida} Soles
                          </span>
                        </div>
                        <p
                          style="
                            margin:0;
                            font-size:${fontSize};
                            font-weight:600;
                          "
                        >
                          ${p.nombre}
                        </p>
                        <span
                          style="
                            font-size:.8rem;
                            opacity:.85;
                          "
                        >
                          Ingresos: <strong>S/. ${Number(
                            p.ingresos || 0
                          ).toFixed(2)}</strong>
                        </span>
                        <span
                          style="
                            margin-top:.2rem;
                            font-size:.75rem;
                            opacity:.7;
                            display:inline-flex;
                            align-items:center;
                            gap:.25rem;
                          "
                        >
                          <span
                            style="
                              width:.4rem;
                              height:.4rem;
                              border-radius:999px;
                              background:${badgeBg};
                            "
                          ></span>
                          Producto destacado
                        </span>
                      </div>
                    `;
                  })}
            </div>
          </div>

          <div
            style="
              background:linear-gradient(145deg,#020617,#020617);
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.3);
              padding:1rem 1.2rem;
              color:white;
              display:flex;
              flex-direction:column;
              gap:.6rem;
              box-shadow:0 4px 18px rgba(0,0,0,0.45);
            "
          >
            <div
              style="
                display:flex;
                justify-content:space-between;
                align-items:flex-end;
                gap:.5rem;
              "
            >
              <div>
                <h3 style="margin:0; font-size:1rem;">
                  Ranking de productos
                </h3>
                <p style="margin:.15rem 0 0; font-size:.8rem; opacity:.7;">
                  Ordenado por cantidad total vendida.
                </p>
              </div>
              <span
                style="
                  font-size:.75rem;
                  opacity:.7;
                  padding:.2rem .55rem;
                  border-radius:999px;
                  border:1px solid rgba(148,163,184,0.35);
                  background:#020617;
                "
              >
                Top ${topN}
              </span>
            </div>
            <div style="margin-top:.4rem; height:260px;">
              <canvas id="g_ranking_productos"></canvas>
            </div>
          </div>

          <div
            style="
              background:linear-gradient(145deg,#020617,#020617);
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.3);
              padding:1rem 1.2rem;
              color:white;
              display:flex;
              flex-direction:column;
              gap:.4rem;
              box-shadow:0 4px 18px rgba(0,0,0,0.45);
            "
          >
            <h3 style="margin:0; font-size:1rem;">
              Distribución de ingresos (productos top)
            </h3>
            <p style="margin:0; font-size:.8rem; opacity:.7;">
              Muestra qué porcentaje de los ingresos de los productos top
              aporta cada uno.
            </p>
            <div style="margin-top:.4rem; height:240px;">
              <canvas id="g_ingresos_productos_donut"></canvas>
            </div>
          </div>
        </section>

        <section
          style="
            background:linear-gradient(145deg,#020617,#020617);
            padding:1rem 1.1rem;
            border-radius:1rem;
            color:white;
            border:1px solid rgba(148,163,184,0.28);
            box-shadow:0 4px 20px rgba(0,0,0,0.45);
            display:flex;
            flex-direction:column;
            gap:1rem;
          "
        >
          <div>
            <h2
              style="
                margin:0 0 .4rem;
                font-size:1.15rem;
              "
            >
              Filtros
            </h2>
            <p
              style="
                margin:0;
                font-size:.8rem;
                opacity:.7;
              "
            >
              Ajusta la categoría, el rango de fechas y la cantidad de productos
              en el ranking.
            </p>
          </div>

          <form
            style="
              display:flex;
              flex-direction:column;
              gap:.6rem;
              background:#020617;
              border-radius:.7rem;
              padding:.8rem;
              border:1px solid rgba(148,163,184,0.35);
            "
          >
            <label
              style="
                font-size:.85rem;
                display:flex;
                flex-direction:column;
                gap:.25rem;
              "
            >
              Categoría
              <select
                id="p_categoria"
                style="
                  padding:.45rem .55rem;
                  border-radius:.4rem;
                  border:1px solid #334155;
                  background:#020617;
                  color:#e5e7eb;
                  font-size:.85rem;
                "
              >
                <option value="">Todas las categorías</option>
                ${categorias && categorias.length
                  ? categorias.map(
                      (c) => html`
                        <option value="${c.id}">
                          ${c.nombre}
                        </option>
                      `
                    )
                  : ""}
              </select>
            </label>

            <div
              style="
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                gap:.6rem;
              "
            >
              <label
                style="
                  font-size:.85rem;
                  display:flex;
                  flex-direction:column;
                  gap:.25rem;
                "
              >
                Fecha inicio
                <input
                  id="p_start"
                  type="date"
                  style="
                    width:100%;
                    padding:.4rem .5rem;
                    border-radius:.4rem;
                    border:1px solid #334155;
                    background:#020617;
                    color:#e5e7eb;
                    font-size:.85rem;
                  "
                />
              </label>

              <label
                style="
                  font-size:.85rem;
                  display:flex;
                  flex-direction:column;
                  gap:.25rem;
                "
              >
                Fecha fin
                <input
                  id="p_end"
                  type="date"
                  style="
                    width:100%;
                    padding:.4rem .5rem;
                    border-radius:.4rem;
                    border:1px solid #334155;
                    background:#020617;
                    color:#e5e7eb;
                    font-size:.85rem;
                  "
                />
              </label>
            </div>

            <label
              style="
                font-size:.85rem;
                display:flex;
                flex-direction:column;
                gap:.25rem;
              "
            >
              Cantidad de productos en el ranking (Top N)
              <input
                id="p_top"
                type="number"
                min="1"
                value="${topN}"
                style="
                  width:100%;
                  padding:.4rem .5rem;
                  border-radius:.4rem;
                  border:1px solid #334155;
                  background:#020617;
                  color:#e5e7eb;
                  font-size:.85rem;
                "
              />
            </label>

            <button
              @click=${onFilter}
              style="
                margin-top:.3rem;
                padding:.55rem;
                background:linear-gradient(135deg,#22c55e,#16a34a);
                color:#020617;
                border:none;
                border-radius:.5rem;
                cursor:pointer;
                font-weight:600;
                font-size:.9rem;
                display:flex;
                align-items:center;
                justify-content:center;
                gap:.3rem;
              "
            >
              Aplicar filtros
            </button>
          </form>

          <div
            style="
              margin-top:.3rem;
              background:#020617;
              border-radius:.8rem;
              border:1px solid rgba(148,163,184,0.3);
              padding:.8rem;
              display:flex;
              flex-direction:column;
              gap:.5rem;
            "
          >
            <h3
              style="
                margin:0;
                font-size:1rem;
              "
            >
              Detalle de productos top
            </h3>
            <div
              style="
                max-height:220px;
                overflow-y:auto;
                border-radius:.6rem;
                border:1px solid rgba(30,41,59,0.9);
              "
            >
              ${top.length
                ? html`
                    <table
                      style="
                        width:100%;
                        border-collapse:collapse;
                        font-size:.84rem;
                        color:#e5e7eb;
                      "
                    >
                      <thead>
                        <tr style="background:#020617;">
                          <th
                            style="
                              padding:.45rem .45rem;
                              text-align:left;
                              border-bottom:1px solid rgba(148,163,184,0.4);
                            "
                          >
                            Producto
                          </th>
                          <th
                            style="
                              padding:.45rem .45rem;
                              text-align:right;
                              border-bottom:1px solid rgba(148,163,184,0.4);
                            "
                          >
                            Cantidad
                          </th>
                          <th
                            style="
                              padding:.45rem .45rem;
                              text-align:right;
                              border-bottom:1px solid rgba(148,163,184,0.4);
                            "
                          >
                            Ingresos
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${top.map(
                          (p, idx) => html`
                            <tr
                              style="
                                background:${idx % 2 === 0
                                  ? "rgba(15,23,42,0.9)"
                                  : "rgba(15,23,42,0.7)"};
                                border-bottom:1px solid rgba(15,23,42,0.95);
                              "
                            >
                              <td style="padding:.45rem .45rem;">
                                ${p.nombre}
                              </td>
                              <td
                                style="
                                  padding:.45rem .45rem;
                                  text-align:right;
                                "
                              >
                                ${p.cantidad_vendida}
                              </td>
                              <td
                                style="
                                  padding:.45rem .45rem;
                                  text-align:right;
                                  color:#4ade80;
                                  font-weight:600;
                                "
                              >
                                S/. ${Number(p.ingresos || 0).toFixed(2)}
                              </td>
                            </tr>
                          `
                        )}
                      </tbody>
                    </table>
                  `
                : html`<p
                    style="
                      margin:.4rem 0;
                      font-size:.83rem;
                      opacity:.75;
                    "
                  >
                    No hay productos en el top para los filtros actuales.
                  </p>`}
            </div>
          </div>

          <div
            style="
              margin-top:.4rem;
              background:#020617;
              border-radius:.8rem;
              border:1px solid rgba(148,163,184,0.3);
              padding:.8rem;
              display:flex;
              flex-direction:column;
              gap:.5rem;
            "
          >
            <h3
              style="
                margin:0;
                font-size:1rem;
              "
            >
              Productos menos vendidos
            </h3>
            <p
              style="
                margin:0;
                font-size:.78rem;
                opacity:.7;
              "
            >
              Útil para detectar productos con baja rotación.
            </p>
            <div
              style="
                max-height:200px;
                overflow-y:auto;
                border-radius:.6rem;
                border:1px solid rgba(30,41,59,0.9);
              "
            >
              ${menos.length
                ? html`
                    <table
                      style="
                        width:100%;
                        border-collapse:collapse;
                        font-size:.82rem;
                        color:#e5e7eb;
                      "
                    >
                      <thead>
                        <tr style="background:#020617;">
                          <th
                            style="
                              padding:.45rem .45rem;
                              text-align:left;
                              border-bottom:1px solid rgba(148,163,184,0.4);
                            "
                          >
                            Producto
                          </th>
                          <th
                            style="
                              padding:.45rem .45rem;
                              text-align:right;
                              border-bottom:1px solid rgba(148,163,184,0.4);
                            "
                          >
                            Cantidad
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${menos.map(
                          (p, idx) => html`
                            <tr
                              style="
                                background:${idx % 2 === 0
                                  ? "rgba(15,23,42,0.9)"
                                  : "rgba(15,23,42,0.7)"};
                                border-bottom:1px solid rgba(15,23,42,0.95);
                              "
                            >
                              <td style="padding:.45rem .45rem;">
                                ${p.nombre}
                              </td>
                              <td
                                style="
                                  padding:.45rem .45rem;
                                  text-align:right;
                                "
                              >
                                ${p.cantidad_vendida}
                              </td>
                            </tr>
                          `
                        )}
                      </tbody>
                    </table>
                  `
                : html`<p
                    style="
                      margin:.4rem 0;
                      font-size:.83rem;
                      opacity:.75;
                    "
                  >
                    No se encontraron productos con baja venta.
                  </p>`}
            </div>
          </div>
        </section>
      </main>
    `;

    render(template, document.getElementById("contenedor"));
    renderGraficos();
  };

  loadInitial();
}
