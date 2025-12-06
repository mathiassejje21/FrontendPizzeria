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

    async getIngrediente(id) {
        try {
            const res = await this.api.getIngrediente(id);
            return res;
        }catch(error) {
            mensajeAlert({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.mensaje || "Error al obtener el ingrediente"
            });
            return null;
        }
    }

    async createIngrediente(ingrediente) {
        try {
            const res = await this.api.createIngrediente(ingrediente);
            return res;
        }catch(error) {
            mensajeAlert({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.mensaje || "Error al crear el ingrediente"
            });
            return null;
        }
    }

    async updateIngrediente(id, ingrediente) {
        try {
            const res = await this.api.updateIngrediente(id, ingrediente);
            return res;
        }catch(error) {
            mensajeAlert({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.mensaje || "Error al actualizar el ingrediente"
            });
            return null;
        }
    }

    async deleteIngrediente(id) {
        try {
            const res = await this.api.deleteIngrediente(id);
            return res;
        }catch(error) {
            mensajeAlert({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.mensaje || "Error al eliminar el ingrediente"
            });
            return null;
        }
    }
}