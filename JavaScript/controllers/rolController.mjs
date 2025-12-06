import { rolApi } from "@api/rolApi.mjs";

export class rolController{
    constructor() {
        this.api = new rolApi();
    }

    async getRoles() {
        return await this.api.getRoles();
    }
}
