import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/producto`;

export class productoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getProductos() {
        const res = await this.api.get('/');
        return res.data;
    } 
    
    async getProductosporCategoria($id) {
        const res = await this.api.get(`?id_categoria=${$id}`);
        return res.data;
    }
}