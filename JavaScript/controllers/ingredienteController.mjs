import { ingredienteApi } from "../api/ingredienteApi.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export class ingredienteController {
    constructor() {
        this.api = new ingredienteApi();
    }

    async getIngredientes() {
        try {
            const res = await this.api.getIngredientes();
            return res;
        }catch(error) {
            mensajeAlert({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.mensaje || "Error al obtener los ingredientes"
            });
            return null;
        }
    }
}