import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";
import { estadoController } from "../../controllers/estadoController.mjs";
import { router } from "@/router.mjs";

export async function renderPedidosView() {

    const estadoApi = new estadoController();
    const apiPedido = new pedidoController();

    const pedidos = await apiPedido.getPedidos();
    const estados = await estadoApi.getEstados();

    let currentPage = 1;
    const rowsPerPage = 8;
    let sortDirection = "desc";
    let estadoFiltro = "";  

    function getRowColor(id) {
        if (id === 1) return "#c0c0c0ff"; 
        return "#000";               
    }

    function filterPedidos(fecha, estadoId) {
        return pedidos.filter(p => {
            const f = p.fecha_pedido.split("T")[0];
            const matchFecha = !fecha || f === fecha;
            const matchEstado = !estadoId || p.estadoPedido.id == estadoId;
            return matchFecha && matchEstado;
        });
    }

    function ordenar(data) {
        return data.sort((a, b) =>
            sortDirection === "asc"
                ? new Date(a.fecha_pedido) - new Date(b.fecha_pedido)
                : new Date(b.fecha_pedido) - new Date(a.fecha_pedido)
        );
    }

    function paginate(data) {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }

    function cambiarPagina(n) {
        currentPage = n;
        renderView();
    }

    function cambiarOrden() {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
        renderView();
    }

    function cambiarEstado(e) {
        estadoFiltro = e.target.value;
        renderView();
    }

    function renderView() {
        const fechaFiltro = document.getElementById("filtroFecha")?.value || "";

        let filtrados = filterPedidos(fechaFiltro, estadoFiltro);
        filtrados = ordenar(filtrados);

        const totalPages = Math.ceil(filtrados.length / rowsPerPage);
        const paginaActual = paginate(filtrados);

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
                        <input type="date" id="filtroFecha" @input=${renderView}>
                    </div>

                    <div>
                        <label>Ordenar</label>
                        <button class="sort-btn" @click=${cambiarOrden}>
                            Fecha: ${sortDirection === "asc" ? "Asc" : "Desc"}
                        </button>
                    </div>

                    <div>
                        <label>Filtrar por estado</label>
                        <select @change=${cambiarEstado}>
                            <option value="">Todos</option>
                            ${estados.map(e => html`
                                <option value="${e.id}">${e.nombre}</option>
                            `)}
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
                        ${paginaActual.map(p => html`
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
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(n => html`
                        <button 
                            class="page-btn ${n === currentPage ? 'active' : ''}"
                            @click=${() => cambiarPagina(n)}
                        >
                            ${n}
                        </button>
                    `)}
                </div>

            </div>
        </main>
        `;

        render(template, document.getElementById("contenedor"));
    }

    renderView();
}
