import axios from "axios";

const API_URL = "http://localhost:8000/api/pedido";

export class pedidoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true,
        });
    }

    async getPedidos() {
        const response = await this.api.get("/");
        return response.data;
    }

    async postPedidos(pedido) {
        const response = await this.api.post("/", pedido);
        return {
            status: response.status,
            ...response.data,
        };
    }

    
}