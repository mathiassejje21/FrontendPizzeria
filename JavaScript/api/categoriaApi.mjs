import axios from 'axios';

const API_URL = 'http://localhost:8000/api/categoria';

export class categoriaApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getCategorias() {
        const res = await this.api.get('/');
        return res.data;
    }
}