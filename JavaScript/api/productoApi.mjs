import axios from 'axios';

const API_URL = 'http://localhost:8000/api/producto';

export class productoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getProductosClientes() {
        const res = await this.api.get('?&activo=true');
        return res.data;
    } 
    
    async searchProductosClientes($id) {
        const res = await this.api.get(`?&activo=true&id_categoria=${$id}`);
        return res.data;
    }


}