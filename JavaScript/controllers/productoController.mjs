import { productoApi } from "@api/productoApi.mjs";

export class productoController{
  constructor(){
    this.api = new productoApi();
  }

  async getProductos() {
    const productos = await this.api.getProductos();
    return productos;
  }

  async getProductoById($id) {
    const producto = await this.api.getProductoById($id);
    return producto;
  }

  async getProductoActivo() {
    const producto = await this.api.getProductoActivo();
    return producto;
  }
   
  async getProductosporCategoria($id) {
    const productos = await this.api.getProductosporCategoria($id);
    return productos;
  }

  async getProductosporCategoriaActivo($id) {
    const productos = await this.api.getProductosporCategoriaActivo($id);
    return productos;
  }
}


