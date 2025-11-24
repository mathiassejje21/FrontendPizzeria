import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";

export async function mostrarPedidos() {

    const apiPedido = new pedidoController();
    const pedidos = await apiPedido.getPedidos();

    let currentPage = 1;
    const rowsPerPage = 7;
    let selectedPedido = null;
    let sortDirection = "desc";

    function filterPedidos(fecha) {
        return pedidos.filter(p => {
            const fechaPedido = p.fecha_pedido.split("T")[0];
            return !fecha || fechaPedido === fecha;
        });
    }

    function ordenar(data) {
        return data.sort((a, b) => {
            const f1 = new Date(a.fecha_pedido);
            const f2 = new Date(b.fecha_pedido);
            return sortDirection === "asc" ? f1 - f2 : f2 - f1;
        });
    }

    function paginate(data) {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }

    function cambiarPagina(n) {
        currentPage = n;
        renderView();
    }

    function seleccionarPedido(p) {
        selectedPedido = p;
        renderView();
    }

    function cerrarDetalle() {
        selectedPedido = null;
        renderView();
    }

    function pagarPedido() {
        const raw = sessionStorage.getItem("last_payment_url");
        if (!raw) return;

        const data = JSON.parse(raw);
        location.href = data.url_pago;
    }

    function cambiarOrden() {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
        renderView();
    }

    function renderView() {
        const fechaFiltro = document.getElementById("filtroFecha")?.value || "";

        let filtrados = filterPedidos(fechaFiltro);
        filtrados = ordenar(filtrados);

        const totalPages = Math.ceil(filtrados.length / rowsPerPage);
        const paginaActual = paginate(filtrados);

        const template = html`
        <style>
            body { background:#f4f6f9; }
            .layout {
                display:grid;
                grid-template-columns: 2fr 1fr;
                gap:1.5rem;
                padding:2rem;
            }
            .card {
                background:#fff;
                padding:1.8rem;
                border-radius:1.1rem;
                box-shadow:0 6px 22px rgba(0,0,0,0.09);
                animation:fade .3s ease-out;
            }
            h1 {
                font-size:1.7rem;
                font-weight:800;
                color:#123c25;
            }
            table thead {
                background:#123c25;
                color:white;
            }
            tr {
                cursor:pointer;
                transition:.2s;
            }
            tr:hover {
                background: #e7f1eb !important;
            }
            .filters {
                display:flex;
                gap:1.2rem;
                align-items:end;
                margin-bottom:1rem;
            }
            label {
                font-weight:600;
                color:#123c25;
            }
            .sort-btn {
                background:#123c25;
                color:white;
                border:none;
                padding:.55rem 1rem;
                border-radius:.5rem;
                font-weight:600;
                cursor:pointer;
                transition:.2s;
            }
            .sort-btn:hover {
                background:#0e2f1c;
            }
            .paginate button {
                border-radius:.5rem;
                font-weight:600;
                padding:.45rem .9rem;
            }
            .details-box {
                background:#fff;
                padding:1.6rem;
                border-radius:1.2rem;
                box-shadow:0 6px 22px rgba(0,0,0,0.08);
                animation:fade .3s ease-out;
            }
            .details-box h3 {
                font-size:1.4rem;
                font-weight:700;
                color:#123c25;
            }
            .placeholder {
                text-align:center;
                padding:2rem;
                color:#777;
                font-size:1.1rem;
            }
            hr {
                border-top:1px solid #ddd;
            }
            @keyframes fade {
                from { opacity:0; transform:translateY(6px); }
                to { opacity:1; transform:translateY(0); }
            }
        </style>

        <main class="layout">

            <section>
                <div class="card">
                    <h1>Pedidos</h1>

                    <div class="filters">
                        <div>
                            <label>Filtrar por fecha</label>
                            <input type="date" id="filtroFecha" class="form-control" @input=${renderView}>
                        </div>

                        <div>
                            <label>Ordenar</label><br>
                            <button class="sort-btn" @click=${cambiarOrden}>
                                Fecha: ${sortDirection === "asc" ? "Ascendente" : "Descendente"}
                            </button>
                        </div>
                    </div>

                    <table class="table table-hover mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pago</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginaActual.map(p => html`
                                <tr @click=${() => seleccionarPedido(p)}>
                                    <td>${p.id}</td>
                                    <td>${p.metodoPago.tipo}</td>
                                    <td>${p.fecha_pedido.split("T")[0]}</td>
                                    <td>${p.fecha_pedido.split("T")[1].slice(0,8)}</td>
                                    <td>${p.estadoPedido.nombre}</td>
                                    <td>S/ ${p.total}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>

                    <div class="paginate mt-2">
                        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(n => html`
                            <button 
                                class="btn btn-${n === currentPage ? 'success' : 'outline-success'}"
                                @click=${() => cambiarPagina(n)}
                            >
                                ${n}
                            </button>
                        `)}
                    </div>
                </div>
            </section>

            <section>
                ${selectedPedido ? html`
                    <div class="details-box">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h3>Pedido #${selectedPedido.id}</h3>
                            <div style="display:flex; gap:.5rem; align-items:center; flex-direction:row;">
                                ${(() => {
                                    const raw = sessionStorage.getItem("last_payment_url");
                                    if (!raw) return "";

                                    const data = JSON.parse(raw);
                                    return data.id_pedido === selectedPedido.id
                                        ? html`<button class="btn btn-warning btn-sm" @click=${pagarPedido}>Pagar</button>`
                                        : "";
                                })()}
                                <button class="btn btn-danger btn-sm" @click=${cerrarDetalle}>Cerrar</button>
                            </div>
                        </div>

                        <hr>

                        <p><strong>Método de pago:</strong> ${selectedPedido.metodoPago.tipo}</p>
                        <p><strong>Fecha:</strong> ${selectedPedido.fecha_pedido.split("T")[0]}</p>
                        <p><strong>Hora:</strong> ${selectedPedido.fecha_pedido.split("T")[1].slice(0,8)}</p>
                        <p><strong>Estado:</strong> ${selectedPedido.estadoPedido.nombre}</p>
                        <p><strong>Total:</strong> S/ ${selectedPedido.total}</p>

                        <hr>

                        <h5>Productos</h5>
                        <ul>
                            ${selectedPedido.detalles?.map(d => html`
                                <li>${d.producto.nombre} x${d.cantidad} — S/ ${d.subtotal}</li>
                            `)}
                        </ul>
                    </div>
                ` : html`
                    <div class="placeholder card">
                        Selecciona un pedido para ver los detalles
                    </div>
                `}
            </section>

        </main>
        `;

        render(template, document.getElementById("contenedor"));
    }

    renderView();
}
