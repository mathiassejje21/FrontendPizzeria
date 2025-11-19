import axios from 'axios';

const API_URL = 'http://localhost:8000/api/producto';

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