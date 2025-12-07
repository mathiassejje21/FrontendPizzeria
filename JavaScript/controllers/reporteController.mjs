import { reporteApi } from "@api/reporteApi.mjs";

export class reporteController {
    constructor() {
        this.api = new reporteApi();
    }

    async pedidos(params) {
        const res = await this.api.pedidos(params);
        return res;
    }

    async ventas(params) {
        const res = await this.api.ventas(params);
        return res;
    }

    async productos(params) {
        const res = await this.api.productos(params);
        return res;
    }

    async categorias(params) {
        const res = await this.api.categorias(params);
        return res;
    }

    async ingredientes(params) {
        const res = await this.api.ingredientes(params);
        return res;
    }

    async clientes(params) {
        const res = await this.api.clientes(params);
        return res;
    }
}
