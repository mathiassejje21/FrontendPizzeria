import { html, render } from "lit-html";
import { pedidoController } from "@controllers/pedidoController.mjs";

export async function mostrarPedidos() {
    const apiPedido = new pedidoController();
    const pedidos = await apiPedido.getPedidos();

    let template = html`
    <main style="display: grid; grid-template-columns: 2fr 1fr;">
        <section style="width: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
            <section id='search'>
                <input type="text" id="searchInput" placeholder="Buscar">
            </section>
            <h1>Lista de Pedidos</h1>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Metodo de Pago</th>
                        <th scope="col">Fecha de Pedido</th>
                        <th scope="col">Hora de Pedido</th>
                        <th scope="col">Estado Pedido</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedidos.map((pedido) => 
                    html`
                        <tr>
                        <td scope="row">${pedido.id}</td>
                        <td>${pedido.metodoPago.tipo}</td>
                        <td>${pedido.fecha_pedido.split("T")[0]}</td>
                        <td>${pedido.fecha_pedido.split("T")[1].slice(0, 8)}</td>
                        <td>${pedido.estadoPedido.nombre}</td>
                        <td>${pedido.total}</td>
                        </tr>
                    `
                    )}

                </tbody>
            </table>
        </section>
        <section style="width: 100%;">
            contenedor mostrar detalle pedido
        </section>
    </main>
        `;

    render(template, document.getElementById("contenedor"));
}
