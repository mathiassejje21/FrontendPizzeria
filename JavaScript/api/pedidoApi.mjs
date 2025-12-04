import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/pedido`;

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

    async getPedidoById(id) {
        const response = await this.api.get(`/${id}`);
        return response.data;
    }

    async postPedidos(pedido) {
        const response = await this.api.post("/", pedido);
        return {
            status: response.status,
            ...response.data,
        };
    }

    async updateEstadoPedido(id, id_estado) {
        const body = { id_estado };
        const res = await this.api.put(`/${id}/estado`, body);
        return res.data.pedido;
    }

    async deletePedido(id) {
        const response = await this.api.delete(`/${id}`);
        return {
            status: response.status,
            ...response.data,
        };
    }
    
}