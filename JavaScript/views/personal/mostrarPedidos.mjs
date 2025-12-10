import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";
import { estadoController } from "../../controllers/estadoController.mjs";
import { filterBasic, sortBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { router } from "@/router.mjs";

export async function renderPedidosView() {
    const estadoApi = new estadoController();
    const apiPedido = new pedidoController();

    const res = await apiPedido.getPedidos();
    const pedidos = res.filter(p => p.activo === true);
    const estados = await estadoApi.getEstados();

    let currentPage = 1;
    const rowsPerPage = 6;
    let fechaFiltro = "";
    let estadoFiltro = null;
    let sortDirection = "desc";

    function getRowColor(id) {
        if (id === 1) return "#c0c0c0ff";
        return "#000";
    }

    const getFilterPedidos = () => {
        return filterBasic(
            pedidos,
            [],
            "",
            "fecha_pedido",
            fechaFiltro,
            "estadoPedido.id",
            estadoFiltro
        );
    };

    const getSortedPedidos = () => {
        const filtered = getFilterPedidos();
        return sortBasic(filtered, "fecha_pedido", sortDirection);
    };

    const getPaginatedPedidos = () => {
        const filtered = getSortedPedidos();
        return paginateBasic(filtered, currentPage, rowsPerPage);
    };

    const totalPages = () => {
        const filtered = getSortedPedidos();
        return totalPagesBasic(filtered, rowsPerPage);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            currentPage--;
            renderView();
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages()) {
            currentPage++;
            renderView();
        }
    };

    function renderView() {
        const template = html`
        <style>
            body {
                background:#f1f5f9;
                font-family:"Inter", sans-serif;
            }
            .layout {
                padding:2rem;
                display:flex;
                justify-content:center;
            }
            .card {
                background:#ffffff;
                width:100%;
                max-width:1200px;
                padding:2rem;
                border-radius:1.2rem;
                box-shadow:0 8px 25px rgba(0,0,0,0.08);
                border:1px solid #e2e8f0;
            }
            h1 {
                font-size:2rem;
                font-weight:800;
                color:#0f172a;
                margin-bottom:2rem;
                text-align:center;
            }
            .filters {
                display:grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap:1.5rem;
                margin-bottom:2rem;
            }
            .filter-box {
                display:flex;
                flex-direction:column;
                gap:.35rem;
            }
            label {
                font-weight:600;
                color:#334155;
                font-size:.9rem;
            }
            input[type="date"],
            select {
                border:1px solid #cbd5e1;
                padding:.65rem .8rem;
                border-radius:.5rem;
                font-size:.95rem;
                outline:none;
                background:white;
                transition:0.25s;
            }
            input[type="date"]:focus,
            select:focus {
                border-color:#0a3a17;
                box-shadow:0 0 0 3px rgba(10,58,23,0.15);
            }
            .sort-btn {
                background:#0f172a;
                color:white;
                border:none;
                padding:.65rem 1rem;
                border-radius:.5rem;
                font-weight:600;
                cursor:pointer;
                transition:0.25s;
            }
            .sort-btn:hover {
                background:#1e293b;
            }
            table {
                width:100%;
                border-collapse:separate;
                border-spacing:0 8px;
            }
            thead {
                background:#0f172a;
                color:white;
            }
            thead th {
                padding:1rem;
                font-size:.9rem;
                text-transform:uppercase;
                letter-spacing:0.5px;
            }
            tbody tr {
                background:white;
                box-shadow:0 4px 12px rgba(0,0,0,0.06);
                transition:0.25s;
                cursor:pointer;
            }
            tbody tr:hover {
                transform:scale(1.01);
                box-shadow:0 6px 20px rgba(0,0,0,0.10);
            }
            tbody td {
                padding:1rem;
                border-bottom:1px solid #e2e8f0;
                color:#0f172a;
                font-size:.95rem;
                font-weight:600;
            }
            .paginate {
                margin-top:2rem;
                display:flex;
                justify-content:center;
                align-items:center;
                gap:1rem;
            }
            .page-btn {
                padding:.55rem 1rem;
                border:none;
                background:#e2e8f0;
                border-radius:.4rem;
                cursor:pointer;
                font-weight:600;
                transition:.25s;
            }
            .page-btn:hover:not([disabled]) {
                background:#0f172a;
                color:white;
            }
            .page-btn[disabled] {
                opacity:.5;
                cursor:not-allowed;
            }
            .page-number {
                font-size:1rem;
                font-weight:700;
                color:#0f172a;
            }
        </style>

        <main class="layout">
            <div class="card">
                <h1>Gestión de Pedidos</h1>

                <div class="filters">
                    <div class="filter-box">
                        <label>Filtrar por fecha</label>
                        <input type="date" id="filtroFecha"
                            @input=${(e) => { currentPage = 1; fechaFiltro = e.target.value; renderView(); }}>
                    </div>

                    <div class="filter-box">
                        <label>Ordenar por fecha</label>
                        <button class="sort-btn" @click=${() =>{
                            sortDirection = sortDirection === "asc" ? "desc" : "asc"; renderView();
                        }}>
                            ${sortDirection === "asc" ? "Ascendente" : "Descendente"}
                        </button>
                    </div>

                    <div class="filter-box">
                        <label>Estado del pedido</label>
                        <select @change=${ e =>{
                            currentPage = 1;
                            estadoFiltro = e.target.value? Number(e.target.value) : null;
                            renderView();
                        }}>
                            <option value="">Todos</option>
                            ${estados.map(e => html`<option value="${e.id}">${e.nombre}</option>`)}
                        </select>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Pago</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${getPaginatedPedidos().map(p => html`
                            <tr style="color:${getRowColor(p.estadoPedido.id)};"
                                @click=${() => router.navigate(`/personal/pedidos/${p.id}`)}>
                                <td>${p.id}</td>
                                <td>${p.cliente.nombre}</td>
                                <td>${p.metodoPago.tipo}</td>
                                <td>${p.fecha_pedido.split("T")[0]}</td>
                                <td>${p.fecha_pedido.split("T")[1].slice(0,8)}</td>
                                <td>${p.estadoPedido.nombre}</td>
                                <td>S/ ${p.total}</td>
                            </tr>
                        `)}
                    </tbody>
                </table>

                <div class="paginate">
                    <button class="page-btn" @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
                    <span class="page-number">Página ${currentPage} de ${totalPages()}</span>
                    <button class="page-btn" @click=${nextPage} ?disabled=${currentPage >= totalPages()}>Siguiente</button>
                </div>
            </div>
        </main>
        `;

        render(template, document.getElementById("contenedor"));
    }

    renderView();
}
