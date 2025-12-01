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
            .layout { padding:2rem; }
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
            tr { cursor:pointer; transition:.2s; }
            tr:hover { background:#e7f1eb !important; }
            .filters {
                display:flex;
                gap:1.2rem;
                align-items:end;
                margin-bottom:1rem;
            }
            label { font-weight:600; color:#123c25; }
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
            .sort-btn:hover { background:#0e2f1c; }
            .paginate button {
                border-radius:.5rem;
                font-weight:600;
                padding:.45rem .9rem;
            }
            @keyframes fade {
                from { opacity:0; transform:translateY(6px); }
                to { opacity:1; transform:translateY(0); }
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fade .25s ease-out;
            }
            .modal-box {
                background: #fff;
                width: 90%;
                max-width: 480px;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.25);
                animation: popup .25s ease-out;
            }
            @keyframes popup {
                from { transform: scale(.9); opacity: 0; }
                to   { transform: scale(1); opacity: 1; }
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
                                <th>Estado pedido
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
                                    <td>${p.activo ? "Activo" : "Cancelado"}</td>
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
                    <div class="overlay">
                        <div class="modal-box">

                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h3 style="margin:0;">Pedido #${selectedPedido.id}</h3>
                                <button class="btn btn-danger btn-sm" @click=${cerrarDetalle}>X</button>
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

                            ${(() => {
                                if(selectedPedido.estadoPedido.id !== 1) return;
                                const raw = sessionStorage.getItem("last_payment_url");
                                if (!raw) return "";
                                const data = JSON.parse(raw);
                                return data.id_pedido === selectedPedido.id
                                    ? html`<button class="btn btn-warning mt-3" @click=${pagarPedido}>Pagar ahora</button>`
                                    : "";
                            })()}

                        </div>
                    </div>
                ` : ""}
            </section>

        </main>
        `;

        render(template, document.getElementById("contenedor"));
    }

    renderView();
}
