import { categoriaApi } from "@api/categoriaApi.mjs";

export class categoriaController {
    constructor() {
        this.api = new categoriaApi();
    }

    async getCategorias() {
        try {
            const res = await this.api.getCategorias();
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async getCategoriasActivo() {
        try {
            const res = await this.api.getCategoriasActivo();
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async getCategoriaById($id) {
        try {
            const res = await this.api.getCategoriaById($id);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async createCategoria(categoria) {
        try {
            const res = await this.api.createCategoria(categoria);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async updateCategoria($id, categoria) {
        try {
            const res = await this.api.updateCategoria($id, categoria);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCategoria($id) {
        try {
            const res = await this.api.deleteCategoria($id);
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}