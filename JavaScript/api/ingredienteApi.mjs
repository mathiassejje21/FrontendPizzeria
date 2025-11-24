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
}
