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
}