import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";
import { filterBasic, sortBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";   
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function mostrarPedidos() {
    const apiPedido = new pedidoController();
    const res = await apiPedido.getPedidos();
    const pedidos = res.filter(p => p.activo === true);

    let currentPage = 1;
    const rowsPerPage = 8;
    let selectedPedido = null;
    let sortDirection = "desc";
    let fechaFiltro = "";

    const getFilterPedidos = () => {
        return filterBasic(
            pedidos,
            [],
            "",
            "fecha_pedido",
            fechaFiltro
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

    function pagarPedido() {
        const raw = sessionStorage.getItem("last_payment_url");
        if (!raw) return;
        const data = JSON.parse(raw);
        location.href = data.url_pago;
    }

    function renderView() {
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
                            <input type="date" id="filtroFecha" class="form-control" @input=${(e)=>{
                                currentPage = 1;
                                fechaFiltro = e.target.value;
                                renderView();
                            }}>
                        </div>

                        <div>
                            <label>Ordenar</label><br>
                            <button class="sort-btn" @click=${()=>{
                                sortDirection = sortDirection === "asc" ? "desc" : "asc";
                                renderView();
                            }}>
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
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${getPaginatedPedidos().map(p => html`
                                <tr>
                                    <td>${p.id}</td>
                                    <td>${p.metodoPago.tipo}</td>
                                    <td>${p.fecha_pedido.split("T")[0]}</td>
                                    <td>${p.fecha_pedido.split("T")[1].slice(0,8)}</td>
                                    <td>${p.estadoPedido.nombre}</td>
                                    <td>S/ ${p.total}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" @click=${() => { selectedPedido = p; renderView() }}>Ver</button>
                                        ${(p.estadoPedido?.id === 1 || p.estadoPedido?.id === 2) ? html`
                                        <button class="btn btn-danger btn-sm" 
                                            @click=${async () => {
                                                const result = await mensajeAlert({
                                                    icon: "warning",
                                                    title: "Eliminar pedido",
                                                    text: "¿Deseas eliminar el pedido?",
                                                    showConfirmButton: true,
                                                    confirmButtonText: "Eliminar",
                                                    showCancelButton: true,
                                                    cancelButtonText: "Cancelar"
                                                });

                                                if (!result.isConfirmed) return;

                                                const res = await apiPedido.deletePedido(p.id);

                                                if (res?.status !== 200) return null

                                                await mensajeAlert({
                                                    icon: "success",
                                                    title: "Pedido eliminado",
                                                    text: "El pedido se ha eliminado correctamente.",
                                                    timer: 1500
                                                }).then(() => {
                                                    const stored = sessionStorage.getItem("last_payment_url");

                                                    if (stored) {
                                                        const urlObj = JSON.parse(stored);
                                                        if (urlObj.id_pedido === p.id) {
                                                            sessionStorage.removeItem("last_payment_url");
                                                        }
                                                    }

                                                    location.reload(); 
                                                });                                                 
                                                }
                                            }                                                
                                        >Eliminar</button>
                                        ` : ""}
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>

                    <div class="paginate mt-2">
                        <button class="" @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
                        <span>Página ${currentPage} de ${totalPages()}</span>
                        <button class="" @click=${nextPage} ?disabled=${currentPage >= totalPages()}>Siguiente</button>
                    </div>
                </div>
            </section>

            <section>
                ${selectedPedido ? html`
                    <div class="overlay">
                        <div class="modal-box">

                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h3 style="margin:0;">Pedido #${selectedPedido.id}</h3>
                                <button class="btn btn-danger btn-sm" @click=${()=>{
                                    selectedPedido = null;
                                    renderView();
                                }}>x</button>
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
