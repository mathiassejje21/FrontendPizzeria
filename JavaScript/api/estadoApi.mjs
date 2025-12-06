import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/estado`;

export class estadoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        });
    }

    async getEstados() {
        const res = await this.api.get('/');
        return res.data;
    }

    async getEstadoById($id) {
        const res = await this.api.get(`/${$id}`);
        return res.data;
    }

    async createEstado(estado) {
        const res = await this.api.post('/', estado);
        return { status: res.status, ...res.data};
    }

    async updateEstado($id, estado) {
        const res = await this.api.put(`/${$id}`, estado);
        return { status: res.status, ...res.data};
    }

    async deleteEstado($id) {
        const res = await this.api.delete(`/${$id}`);
        return { status: res.status, ...res.data};
    }
}