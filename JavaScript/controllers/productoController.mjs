import { productoApi } from "@api/productoApi.mjs";

export class productoController{
  constructor(){
    this.api = new productoApi();
  }

  async getProductos() {
    const productos = await this.api.getProductos();
    return productos;
  }
   
  async getProductosporCategoria($id) {
    const productos = await this.api.getProductosporCategoria($id);
    return productos;
  }
}


