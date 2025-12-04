import { pedidoApi } from "@api/pedidoApi.mjs";

export class pedidoController {
    constructor() {
        this.api = new pedidoApi();
    }

    async getPedidos() {
        const res = await this.api.getPedidos();
        return res;
    }

    async getPedidoById(id) {
        const res = await this.api.getPedidoById(id);
        return res;
    }

    async crearPedido(pedido) {
        try {
            const res = await this.api.postPedidos(pedido);
            return res;
        } catch (error) {
            alert(error);
        }
    }

    async updateEstadoPedido(id, id_estado) {
        try {
            return await this.api.updateEstadoPedido(id, id_estado);
        } catch {
            alert("Error actualizando estado");
        }
    }

    async deletePedido(id) {
        try {
            return await this.api.deletePedido(id);
        } catch {
            alert("Error eliminando pedido");
        }
    }

}