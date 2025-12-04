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
    const rowsPerPage = 8;
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
    }

    const getSortedPedidos = () => {
        const filtered = getFilterPedidos();
        return sortBasic(filtered, "fecha_pedido", sortDirection);
    }

    const getPaginatedPedidos = () => {
        const filtered = getSortedPedidos();
        return paginateBasic(filtered, currentPage, rowsPerPage);
    }

    const totalPages = () => {
        const filtered = getSortedPedidos();
        return totalPagesBasic(filtered, rowsPerPage);
    }

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
            body { background:#f4f6f9; }

            .layout { padding:2rem; font-family: "Inter", sans-serif; }

            .card {
                background:#fff;
                padding:1rem;
                border-radius:1rem;
                box-shadow:0 5px 20px rgba(0,0,0,0.1);
            }

            h1 {
                font-size:1.8rem;
                font-weight:800;
                color:#0a3a17;
                margin-bottom:1rem;
            }

            .filters {
                display:flex;
                flex-wrap:wrap;
                gap:1.2rem;
                align-items:end;
                margin-bottom:1.5rem;
            }

            label {
                font-weight:600;
                color:#0a3a17;
                margin-bottom:.3rem;
                display:block;
            }

            input[type="date"], select {
                border:1px solid #cfcfcf;
                padding:.55rem .8rem;
                border-radius:.4rem;
                font-size:.95rem;
                outline:none;
            }

            input[type="date"]:focus, select:focus {
                border-color:#0a3a17;
            }

            .sort-btn {
                background:#0a3a17;
                color:white;
                border:none;
                padding:.55rem 1rem;
                border-radius:.5rem;
                font-weight:600;
                cursor:pointer;
                margin-top:.3rem;
            }

            table {
                width:100%;
                border-collapse:collapse;
                margin-top:1rem;
            }

            thead {
                background:#0a3a17;
                color:white;
            }

            th, td {
                padding:.9rem 1rem;
                text-align:left;
            }

            tbody tr {
                transition:.2s;
            }

            tbody tr:hover {
                filter:brightness(.95);
            }

            .paginate {
                margin-top:1rem;
                display:flex;
                gap:.5rem;
            }

            .page-btn {
                padding:.45rem .9rem;
                border:none;
                background:#e3e3e3;
                border-radius:.4rem;
                cursor:pointer;
            }

            .page-btn.active {
                background:#0a3a17;
                color:white;
                font-weight:bold;
            }
        </style>

        <main class="layout">

            <div class="card">
                <h1>Pedidos</h1>

                <div class="filters">

                    <div>
                        <label>Filtrar por fecha</label>
                        <input type="date" id="filtroFecha" @input=${(e) => { 
                            currentPage = 1; fechaFiltro = e.target.value; renderView();
                        }}>
                    </div>

                    <div>
                        <label>Ordenar</label>
                        <button class="sort-btn" @click=${() =>{
                            sortDirection = sortDirection === "asc" ? "desc" : "asc"; renderView();
                        }}>
                            Fecha: ${sortDirection === "asc" ? "Asc" : "Desc"}
                        </button>
                    </div>

                    <select @change=${ e =>{
                        currentPage = 1;
                        estadoFiltro = e.target.value? Number(e.target.value) : null;
                        renderView();
                    }}>
                        <option value="">Todos</option>
                        ${estados.map(e => html`
                            <option value="${e.id}">${e.nombre}</option>
                        `)}
                    </select>

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
                            <tr 
                                style="color:${getRowColor(p.estadoPedido.id)}; 
                                font-weight:bold; 
                                cursor:pointer"
                                @click=${() => router.navigate(`/personal/pedidos/${p.id}`)}
                            >
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
                    <button class="" @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
                    <span>Página ${currentPage} de ${totalPages()}</span>
                    <button class="" @click=${nextPage} ?disabled=${currentPage >= totalPages()}>Siguiente</button>
                </div>

            </div>
        </main>
        `;

        render(template, document.getElementById("contenedor"));
    }

    renderView();
}
