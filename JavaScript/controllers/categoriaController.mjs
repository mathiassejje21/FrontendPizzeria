import { categoriaApi } from "@api/categoriaApi.mjs";

export class categoriaController {
    constructor() {
        this.api = new categoriaApi();
    }

    async getCategorias() {
        const res = await this.api.getCategorias();
        return res;
    }

    async getCategoriasActivo() {
        const res = await this.api.getCategoriasActivo();
        return res;
    }
}