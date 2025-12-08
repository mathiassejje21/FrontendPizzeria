import { html, render } from "lit-html";
import Chart from "chart.js/auto";
import { authController } from "@/controllers/authController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { reporteController } from "@controllers/reporteController.mjs";

export function renderDashboardView(user) {
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
  const mesLabel = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(hoy);

  let dataVentas = null;
  let dataPedidos = null;
  let dataCategorias = null;
  let dataClientes = null;
  let dataProductos = null;

  async function loadDashboard() {
    try {
      const paramsVentas = {
        start_date: startDate,
        end_date: endDate,
        granularity: "day",
      };

      const paramsPedidos = {
        start_date: startDate,
        end_date: endDate,
      };

      const paramsCategorias = {
        start_date: startDate,
        end_date: endDate,
        top: 5,
      };

      const paramsClientes = {
        start_date: startDate,
        end_date: endDate,
        top: 5,
      };

      const paramsProductos = {
        start_date: startDate,
        end_date: endDate,
        top: 10,
      };

      const [resVentas, resPedidos, resCat, resCli, resProd] = await Promise.all([
        api.ventas(paramsVentas),
        api.pedidos(paramsPedidos),
        api.categorias(paramsCategorias),
        api.clientes(paramsClientes),
        api.productos(paramsProductos),
      ]);

      dataVentas = resVentas || null;
      dataPedidos = resPedidos || null;
      dataCategorias = resCat || null;
      dataClientes = resCli || null;
      dataProductos = resProd || null;

      actualizarVista();
      renderGraficos();
    } catch (e) {
      console.error(e);
    }
  }

  function renderGraficos() {
    if (dataVentas && dataVentas.serie && dataVentas.serie.length) {
      const labels = dataVentas.serie.map((s) => s.periodo);
      const valores = dataVentas.serie.map((s) => Number(s.total));
      const ctx = document.getElementById("g_ingresos_linea");
      if (ctx) {
        if (charts.ingresos) charts.ingresos.destroy();
        charts.ingresos = new Chart(ctx.getContext("2d"), {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Ingresos",
                data: valores,
                borderColor: "#4ade80",
                backgroundColor: "rgba(74,222,128,0.12)",
                borderWidth: 3,
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { intersect: false, mode: "index" },
            },
            scales: {
              x: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148,163,184,0.12)" },
              },
              y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148,163,184,0.12)" },
              },
            },
          },
        });
      }
    }

    if (dataCategorias && dataCategorias.categorias && dataCategorias.categorias.length) {
      const labels = dataCategorias.categorias.map((c) => c.nombre);
      const ingresos = dataCategorias.categorias.map((c) => c.ingresos);
      const ctxBar = document.getElementById("g_categorias_barra");
      if (ctxBar) {
        if (charts.categorias) charts.categorias.destroy();
        charts.categorias = new Chart(ctxBar.getContext("2d"), {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Ingresos",
                data: ingresos,
                backgroundColor: ["#4ade80", "#3b82f6", "#a855f7", "#f97316", "#ef4444"],
                borderRadius: 10,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { intersect: false, mode: "index" },
            },
            scales: {
              x: {
                ticks: { color: "#cbd5e1" },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148,163,184,0.15)" },
              },
            },
          },
        });
      }
    }

    if (dataPedidos && dataPedidos.porEstado && dataPedidos.porEstado.length) {
      const labelsEstados = dataPedidos.porEstado.map((e) => e.estado);
      const valoresEstados = dataPedidos.porEstado.map((e) => e.porcentaje);
      const ctxRadar = document.getElementById("g_estados_radar");
      const ctxDonut = document.getElementById("g_estados_donut");

      if (ctxRadar) {
        if (charts.estadosRadar) charts.estadosRadar.destroy();
        charts.estadosRadar = new Chart(ctxRadar.getContext("2d"), {
          type: "radar",
          data: {
            labels: labelsEstados,
            datasets: [
              {
                label: "Estados",
                data: valoresEstados,
                backgroundColor: "rgba(59,130,246,0.25)",
                borderColor: "#3b82f6",
                borderWidth: 2,
                pointBackgroundColor: "#4ade80",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              r: {
                angleLines: { color: "rgba(148,163,184,0.15)" },
                grid: { color: "rgba(148,163,184,0.25)" },
                pointLabels: { color: "#e5e7eb" },
                ticks: { display: false },
              },
            },
          },
        });
      }

      if (ctxDonut) {
        if (charts.estadosDonut) charts.estadosDonut.destroy();
        charts.estadosDonut = new Chart(ctxDonut.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: labelsEstados,
            datasets: [
              {
                data: valoresEstados,
                backgroundColor: ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#ef4444"],
                hoverOffset: 8,
              },
            ],
          },
          options: {
            cutout: "68%",
            plugins: { legend: { display: false } },
          },
        });
      }
    }

    if (dataClientes && dataClientes.nuevos_por_mes && dataClientes.nuevos_por_mes.length) {
      const labelsMes = dataClientes.nuevos_por_mes.map((m) => m.mes);
      const valoresNuevos = dataClientes.nuevos_por_mes.map((m) => m.nuevos);
      const ctxNuevos = document.getElementById("g_nuevos_clientes");
      if (ctxNuevos) {
        if (charts.nuevos) charts.nuevos.destroy();
        charts.nuevos = new Chart(ctxNuevos.getContext("2d"), {
          type: "bar",
          data: {
            labels: labelsMes,
            datasets: [
              {
                label: "Nuevos clientes",
                data: valoresNuevos,
                backgroundColor: "#38bdf8",
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { color: "#cbd5e1" },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148,163,184,0.18)" },
              },
            },
          },
        });
      }
    }

    if (dataProductos && dataProductos.top && dataProductos.top.length) {
      const topList = dataProductos.top.slice(0, 5);
      const labelsTop = topList.map((p) => p.nombre);
      const valoresTop = topList.map((p) => Number(p.cantidad_vendida || 0));
      const ctxTop = document.getElementById("g_productos_top_bar");
      if (ctxTop) {
        if (charts.productosTop) charts.productosTop.destroy();
        charts.productosTop = new Chart(ctxTop.getContext("2d"), {
          type: "bar",
          data: {
            labels: labelsTop,
            datasets: [
              {
                label: "Unidades vendidas",
                data: valoresTop,
                backgroundColor: ["#4ade80", "#22c55e", "#16a34a", "#3b82f6", "#a855f7"],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "#cbd5e1" }, grid: { display: false } },
              y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.18)" } },
            },
          },
        });
      }
    }

    if (dataProductos && dataProductos.menos_vendidos && dataProductos.menos_vendidos.length) {
      const bottomList = dataProductos.menos_vendidos.slice(0, 5);
      const labelsBottom = bottomList.map((p) => p.nombre);
      const valoresBottom = bottomList.map((p) => Number(p.cantidad_vendida || 0));
      const ctxBottom = document.getElementById("g_productos_bottom_bar");
      if (ctxBottom) {
        if (charts.productosBottom) charts.productosBottom.destroy();
        charts.productosBottom = new Chart(ctxBottom.getContext("2d"), {
          type: "bar",
          data: {
            labels: labelsBottom,
            datasets: [
              {
                label: "Unidades vendidas",
                data: valoresBottom,
                backgroundColor: ["#ef4444", "#f97316", "#eab308", "#64748b", "#94a3b8"],
                borderRadius: 8,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.18)" } },
              y: { ticks: { color: "#cbd5e1" }, grid: { display: false } },
            },
          },
        });
      }
    }
  }

  const actualizarVista = () => {
    const pedidosMes = dataPedidos?.total || 0;
    const ingresosMes = dataVentas?.ingresosTotales || 0;
    const ticketProm = dataVentas?.promedioPorPedido || 0;
    const topCliente = dataClientes?.top_clientes?.[0] || null;
    const nuevosMesActual = (() => {
      if (!dataClientes || !dataClientes.nuevos_por_mes) return 0;
      const registro = dataClientes.nuevos_por_mes.find(
        (m) => m.mes === `${year}-${String(month + 1).padStart(2, "0")}`
      );
      return registro ? registro.nuevos : 0;
    })();

    const topProductos = dataProductos && dataProductos.top ? dataProductos.top.slice(0, 3) : [];
    const menosProductos =
      dataProductos && dataProductos.menos_vendidos
        ? dataProductos.menos_vendidos.slice(0, 3)
        : [];

    const template = html`
      <div
        style="
          width:100%;
          height:100vh;
          overflow-y:auto;
          background:#020617;
          color:white;
          padding:1.2rem;
          box-sizing:border-box;
        "
      >
        <div
          style="
            max-width:1280px;
            margin:0 auto;
            display:flex;
            flex-direction:column;
            gap:1rem;
          "
        >
          <header
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:1rem;
            "
          >
            <div>
              <p style="margin:0; opacity:.7; font-size:.8rem;">Panel general · ${mesLabel}</p>
            </div>
            <div
              style="
                padding:.6rem 1rem;
                border-radius:999px;
                background:#020617;
                border:1px solid rgba(148,163,184,0.4);
                font-size:.8rem;
              "
            >
              Vista resumen del mes actual
            </div>
          </header>

          <section
            style="
              display:grid;
              grid-template-columns:repeat(4,minmax(0,1fr));
              gap:.9rem;
            "
          >
            <div
              style="
                background:linear-gradient(145deg,#1e293b,#020617);
                padding:1rem;
                border-radius:.9rem;
                border:1px solid rgba(148,163,184,0.2);
                box-shadow:0 3px 14px rgba(0,0,0,0.4);
              "
            >
              <p style="margin:0; font-size:.8rem; opacity:.8;">Pedidos del mes</p>
              <h2 style="margin:.4rem 0 0; font-size:1.9rem; color:#4ade80;">
                ${pedidosMes}
              </h2>
            </div>

            <div
              style="
                background:linear-gradient(145deg,#1e293b,#020617);
                padding:1rem;
                border-radius:.9rem;
                border:1px solid rgba(148,163,184,0.2);
                box-shadow:0 3px 14px rgba(0,0,0,0.4);
              "
            >
              <p style="margin:0; font-size:.8rem; opacity:.8;">Ingresos del mes</p>
              <h2 style="margin:.4rem 0 0; font-size:1.9rem; color:#4ade80;">
                S/. ${ingresosMes ? ingresosMes.toFixed(2) : "0.00"}
              </h2>
            </div>

            <div
              style="
                background:linear-gradient(145deg,#1e293b,#020617);
                padding:1rem;
                border-radius:.9rem;
                border:1px solid rgba(148,163,184,0.2);
                box-shadow:0 3px 14px rgba(0,0,0,0.4);
              "
            >
              <p style="margin:0; font-size:.8rem; opacity:.8;">Ticket promedio</p>
              <h2 style="margin:.4rem 0 0; font-size:1.9rem; color:#facc15;">
                S/. ${ticketProm ? ticketProm.toFixed(2) : "0.00"}
              </h2>
            </div>

            <div
              style="
                background:linear-gradient(145deg,#1e293b,#020617);
                padding:1rem;
                border-radius:.9rem;
                border:1px solid rgba(148,163,184,0.2);
                box-shadow:0 3px 14px rgba(0,0,0,0.4);
                display:flex;
                flex-direction:column;
                justify-content:space-between;
              "
            >
              <div>
                <p style="margin:0; font-size:.8rem; opacity:.8;">Top cliente del mes</p>
                <h3 style="margin:.3rem 0 0; font-size:1rem;">
                  ${topCliente ? topCliente.nombre : "Sin datos"}
                </h3>
              </div>
              <p style="margin:.4rem 0 0; font-size:.8rem; opacity:.8;">
                Nuevos clientes este mes: <b>${nuevosMesActual}</b>
              </p>
            </div>
          </section>

          <section
            style="
              display:grid;
              grid-template-columns:2fr 1.2fr;
              gap:1rem;
            "
          >
            <div
              style="
                background:#020617;
                border-radius:1rem;
                border:1px solid rgba(148,163,184,0.25);
                padding:1rem;
                display:flex;
                flex-direction:column;
                gap:.6rem;
              "
            >
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h2 style="margin:0; font-size:1.05rem;">Ingresos diarios del mes</h2>
                  <p style="margin:.2rem 0 0; font-size:.78rem; opacity:.7;">
                    Tendencia de ingresos en ${mesLabel}
                  </p>
                </div>
              </div>
              <div style="height:260px;">
                <canvas id="g_ingresos_linea"></canvas>
              </div>
            </div>

            <div
              style="
                display:flex;
                flex-direction:column;
                gap:.8rem;
              "
            >
              <div
                style="
                  background:#020617;
                  border-radius:1rem;
                  border:1px solid rgba(148,163,184,0.25);
                  padding:1rem;
                  flex:1;
                "
              >
                <h3 style="margin:0 0 .3rem; font-size:1rem;">Estados de pedidos</h3>
                <div style="height:160px;">
                  <canvas id="g_estados_radar"></canvas>
                </div>
              </div>

              <div
                style="
                  background:#020617;
                  border-radius:1rem;
                  border:1px solid rgba(148,163,184,0.25);
                  padding:1rem;
                  flex:1;
                  display:flex;
                  align-items:center;
                  gap:.8rem;
                "
              >
                <div style="flex:1; height:130px;">
                  <canvas id="g_estados_donut"></canvas>
                </div>
                <div style="flex:1; font-size:.8rem;">
                  <h4 style="margin:0 0 .3rem; font-size:.85rem;">Distribución %</h4>
                  ${dataPedidos && dataPedidos.porEstado && dataPedidos.porEstado.length
                    ? dataPedidos.porEstado.map(
                        (e) => html`
                          <div
                            style="
                              display:flex;
                              justify-content:space-between;
                              margin-bottom:.15rem;
                            "
                          >
                            <span>${e.estado}</span>
                            <b>${e.porcentaje.toFixed(2)}%</b>
                          </div>
                        `
                      )
                    : html`<p style="opacity:.7; margin:0;">Sin datos.</p>`}
                </div>
              </div>
            </div>
          </section>

          <section
            style="
              display:grid;
              grid-template-columns:1.4fr 1fr;
              gap:1rem;
            "
          >
            <div
              style="
                background:#020617;
                border-radius:1rem;
                border:1px solid rgba(148,163,184,0.25);
                padding:1rem;
                display:flex;
                flex-direction:column;
                gap:.6rem;
              "
            >
              <h2 style="margin:0; font-size:1.05rem;">Ventas por categoría</h2>
              <p style="margin:0; font-size:.78rem; opacity:.7;">
                Top categorías por ingresos
              </p>
              <div style="height:220px;">
                <canvas id="g_categorias_barra"></canvas>
              </div>
            </div>

            <div
              style="
                background:#020617;
                border-radius:1rem;
                border:1px solid rgba(148,163,184,0.25);
                padding:1rem;
                display:flex;
                flex-direction:column;
                gap:.6rem;
              "
            >
              <h2 style="margin:0; font-size:1.05rem;">Nuevos clientes</h2>
              <p style="margin:0; font-size:.78rem; opacity:.7;">
                Evolución de altas recientes
              </p>
              <div style="height:220px;">
                <canvas id="g_nuevos_clientes"></canvas>
              </div>
            </div>
          </section>

          <section
            style="
              display:grid;
              grid-template-columns:1.5fr 1.1fr;
              gap:1rem;
            "
          >
            <div
              style="
                background:#020617;
                border-radius:1rem;
                border:1px solid rgba(148,163,184,0.25);
                padding:1rem;
                display:flex;
                flex-direction:column;
                gap:.6rem;
              "
            >
              <h2 style="margin:0; font-size:1.05rem;">Top productos del mes</h2>
              <p style="margin:0; font-size:.78rem; opacity:.7;">
                Ranking de productos más vendidos
              </p>

              <div
                style="
                  display:grid;
                  grid-template-columns:repeat(3,minmax(0,1fr));
                  gap:.6rem;
                  margin:.4rem 0 .6rem;
                "
              >
                ${topProductos.length
                  ? topProductos.map((p, idx) => {
                      const medallas = ["🥇", "🥈", "🥉"];
                      const colores = ["#facc15", "#e5e7eb", "#f97316"];
                      const bg = ["rgba(250,204,21,0.12)", "rgba(148,163,184,0.12)", "rgba(248,113,113,0.12)"];
                      return html`
                        <div
                          style="
                            background:${bg[idx]};
                            border-radius:.8rem;
                            padding:.6rem .7rem;
                            border:1px solid rgba(148,163,184,0.35);
                            display:flex;
                            flex-direction:column;
                            gap:.15rem;
                          "
                        >
                          <span style="font-size:1.3rem;">${medallas[idx]}</span>
                          <p style="margin:0; font-size:.78rem; opacity:.8;">${p.nombre}</p>
                          <p style="margin:0; font-size:.8rem;">
                            <b style="color:#4ade80;">${p.cantidad_vendida}</b> unidades ·
                            S/. ${Number(p.ingresos).toFixed(2)}
                          </p>
                        </div>
                      `;
                    })
                  : html`<p style="margin:0; font-size:.8rem; opacity:.75;">
                      Aún no hay información de productos para este mes.
                    </p>`}
              </div>

              <div style="height:230px;">
                <canvas id="g_productos_top_bar"></canvas>
              </div>
            </div>

            <div
              style="
                background:#020617;
                border-radius:1rem;
                border:1px solid rgba(148,163,184,0.25);
                padding:1rem;
                display:flex;
                flex-direction:column;
                gap:.6rem;
              "
            >
              <h2 style="margin:0; font-size:1.05rem;">Productos con baja rotación</h2>
              <p style="margin:0; font-size:.78rem; opacity:.7;">
                Menos vendidos en el periodo
              </p>

              <div
                style="
                  display:flex;
                  flex-direction:column;
                  gap:.35rem;
                  margin:.4rem 0 .6rem;
                  font-size:.8rem;
                "
              >
                ${menosProductos.length
                  ? menosProductos.map((p, idx) => html`
                      <div
                        style="
                          display:flex;
                          justify-content:space-between;
                          align-items:center;
                          padding:.4rem .5rem;
                          border-radius:.6rem;
                          background:rgba(15,23,42,0.9);
                          border:1px solid rgba(30,64,175,0.5);
                        "
                      >
                        <span>${p.nombre}</span>
                        <span
                          style="
                            padding:.15rem .6rem;
                            border-radius:999px;
                            background:${Number(p.cantidad_vendida) === 0
                              ? "rgba(239,68,68,0.18)"
                              : "rgba(234,179,8,0.18)"};
                            color:${Number(p.cantidad_vendida) === 0 ? "#fecaca" : "#fef3c7"};
                          "
                        >
                          ${Number(p.cantidad_vendida) === 0
                            ? "Sin ventas"
                            : `${p.cantidad_vendida} uds.`}
                        </span>
                      </div>
                    `)
                  : html`<p style="margin:0; font-size:.8rem; opacity:.75;">
                      No hay productos con baja rotación.
                    </p>`}
              </div>

              <div style="height:160px;">
                <canvas id="g_productos_bottom_bar"></canvas>
              </div>
            </div>
          </section>

          <section
            style="
              background:#020617;
              border-radius:1rem;
              border:1px solid rgba(148,163,184,0.25);
              padding:1rem;
              display:flex;
              flex-direction:column;
              gap:.6rem;
              margin-bottom:1rem;
            "
          >
            <h2 style="margin:0; font-size:1.05rem;">Ranking de clientes</h2>
            <p style="margin:0; font-size:.78rem; opacity:.7;">
              Top compradores del mes por gasto total
            </p>

            ${dataClientes && dataClientes.top_clientes && dataClientes.top_clientes.length
              ? html`
                  <table
                    style="
                      width:100%;
                      border-collapse:collapse;
                      font-size:.85rem;
                      margin-top:.4rem;
                    "
                  >
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align:left;
                            padding:.4rem;
                            border-bottom:1px solid rgba(148,163,184,0.35);
                          "
                        >
                          #
                        </th>
                        <th
                          style="
                            text-align:left;
                            padding:.4rem;
                            border-bottom:1px solid rgba(148,163,184,0.35);
                          "
                        >
                          Cliente
                        </th>
                        <th
                          style="
                            text-align:center;
                            padding:.4rem;
                            border-bottom:1px solid rgba(148,163,184,0.35);
                          "
                        >
                          Pedidos
                        </th>
                        <th
                          style="
                            text-align:right;
                            padding:.4rem;
                            border-bottom:1px solid rgba(148,163,184,0.35);
                          "
                        >
                          Gasto total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${dataClientes.top_clientes.slice(0, 3).map((c, idx) => {
                        let badge = "";
                        let badgeBg = "";
                        if (idx === 0) {
                          badge = "🥇";
                          badgeBg = "rgba(250,204,21,0.15)";
                        } else if (idx === 1) {
                          badge = "🥈";
                          badgeBg = "rgba(148,163,184,0.15)";
                        } else if (idx === 2) {
                          badge = "🥉";
                          badgeBg = "rgba(248,113,113,0.15)";
                        }
                        return html`
                          <tr
                            style="
                              border-bottom:1px solid rgba(30,41,59,0.9);
                              background:${idx % 2 === 0
                                ? "rgba(15,23,42,0.9)"
                                : "rgba(15,23,42,0.7)"};
                            "
                          >
                            <td style="padding:.45rem .4rem;">
                              <span
                                style="
                                  padding:.15rem .45rem;
                                  border-radius:999px;
                                  background:${badgeBg || "transparent"};
                                "
                              >
                                ${badge || idx + 1}
                              </span>
                            </td>
                            <td style="padding:.45rem .4rem;">
                              ${c.nombre}
                            </td>
                            <td style="padding:.45rem .4rem; text-align:center;">
                              ${c.pedidos}
                            </td>
                            <td
                              style="
                                padding:.45rem .4rem;
                                text-align:right;
                                color:#4ade80;
                                font-weight:600;
                              "
                            >
                              S/. ${Number(c.gasto_total).toFixed(2)}
                            </td>
                          </tr>
                        `;
                      })}
                    </tbody>
                  </table>
                `
              : html`<p style="margin-top:.4rem; font-size:.85rem; opacity:.75;">
                  Aún no hay datos de clientes para este mes.
                </p>`}
          </section>
        </div>
      </div>
    `;

    render(template, document.getElementById("contenedor"));
  };

  loadDashboard();
}
