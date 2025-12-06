import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/ingrediente`;

export class ingredienteApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getIngredientes() {
        const res = await this.api.get('/');
        return res.data;
    }

    async getIngredienteById($id) {
        const res = await this.api.get(`/${$id}`);
        return res.data;
    }

    async createIngrediente(ingrediente) {
        const res = await this.api.post('/', ingrediente);
        return { status: res.status, ...res.data };
    }

    async updateIngrediente($id, ingrediente) {
        const res = await this.api.put(`/${$id}`, ingrediente);
        return { status: res.status, ...res.data };
    }

    async deleteIngrediente($id) {
        const res = await this.api.delete(`/${$id}`);
        return { status: res.status, ...res.data };
    }
}
