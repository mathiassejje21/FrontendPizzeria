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

    async getProductoActivo() {
        const res = await this.api.get('?activo=true');
        return res.data;
    }

    async getProductoById($id) {
        const res = await this.api.get(`/${$id}`);
        return res.data;
    }

    async getProductosporCategoria($id) {
        const res = await this.api.get(`?id_categoria=${$id}`);
        return res.data;
    }    

    async getProductosporCategoriaActivo($id) {
        const res = await this.api.get(`?activo=true&id_categoria=${$id}`);
        return res.data;
    }

    async createProducto(producto) {
        const res = await this.api.post('/', producto);
        return { status: res.status, ...res.data};
    }

    async updateProducto($id, producto) {
        const res = await this.api.put(`/${$id}`, producto);
        return { status: res.status, ...res.data};
    }

    async deleteProducto($id) {
        const res = await this.api.delete(`/${$id}`);
        return { status: res.status, ...res.data};
    }

    async assingIngredienteToProducto($id, ingrediente) {
        const res = await this.api.post(`/${$id}/ingrediente`, ingrediente);
        return { status: res.status, ...res.data};
    }

    async deleteIngredienteFromProducto($id, idIngrediente) {
        const res = await this.api.delete(`/${$id}/ingrediente/${idIngrediente}`);
        return { status: res.status, ...res.data};
    }
}