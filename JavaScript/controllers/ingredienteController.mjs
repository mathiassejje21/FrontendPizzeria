import { ingredienteApi } from "../api/ingredienteApi.mjs";

export class ingredienteController {
    constructor() {
        this.api = new ingredienteApi();
    }

    async getIngredientes() {
        const res = await this.api.getIngredientes();
        return res;
    }
}