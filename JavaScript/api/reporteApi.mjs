import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/reporte`;

export class reporteApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        });
    }

    async pedidos(params = {}) {
        const res = await this.api.get("/pedidos", { params });
        return res.data;
    }

    async ventas(params = {}) {
        const res = await this.api.get("/ventas", { params });
        return res.data;
    }

    async productos(params = {}) {
        const res = await this.api.get("/productos", { params });
        return res.data;
    }

    async categorias(params = {}) {
        const res = await this.api.get("/categorias", { params });
        return res.data;
    }

    async ingredientes(params = {}) {
        const res = await this.api.get("/ingredientes", { params });
        return res.data;
    }

    async clientes(params = {}) {
        const res = await this.api.get("/clientes", { params });
        return res.data;
    }
}
