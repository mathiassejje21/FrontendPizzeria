import { pagoApi } from "@api/pagoApi.mjs";

export class pagoController {
    constructor() {
        this.api = new pagoApi();
    }

    async getPago() {
        return await this.api.getPago(); 
    }
}
