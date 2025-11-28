import { estadoApi } from "@api/estadoApi.mjs";

export class estadoController{
    constructor() {
        this.api = new estadoApi();
    }

    async getEstados() {
        return await this.api.getEstados();
    }
}