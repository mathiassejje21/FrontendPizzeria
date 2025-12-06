import { estadoApi } from "@api/estadoApi.mjs";

export class estadoController{
    constructor() {
        this.api = new estadoApi();
    }

    async getEstados() {
        return await this.api.getEstados();
    }

    async getEstadoById($id) {
        return await this.api.getEstadoById($id);
    }

    async createEstado(estado) {
        return await this.api.createEstado(estado);
    }

    async updateEstado($id, estado) {
        return await this.api.updateEstado($id, estado);
    }

    async deleteEstado($id) {
        return await this.api.deleteEstado($id);
    }

}