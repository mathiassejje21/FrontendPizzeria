import { pedidoApi } from "@api/pedidoApi.mjs";

export class pedidoController {
    constructor() {
        this.api = new pedidoApi();
    }

    async getPedidos() {
        const res = await this.api.getPedidos();
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
}