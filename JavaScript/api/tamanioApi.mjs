import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tamano`;

export class tamanioApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getTamanios() {
        const res = await this.api.get('/');
        return res.data;
    }

    async getTamanioById($id) {
        const res = await this.api.get(`/${$id}`);
        return res.data;
    }

    async updateTamanio($id, tamanio) {
        const res = await this.api.put(`/${$id}`, tamanio);
        return { status: res.status, ...res.data };
    }

    async createTamanio(tamanio) {
        const res = await this.api.post('/', tamanio);
        return { status: res.status, ...res.data };
    }

    async deleteTamanio($id) {
        const res = await this.api.delete(`/${$id}`);
        return { status: res.status, ...res.data };
    }
}