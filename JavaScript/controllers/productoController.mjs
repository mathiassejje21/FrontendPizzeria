import { productoApi } from "@api/productoApi.mjs";

export class productoController{
  constructor(){
    this.api = new productoApi();
  }

  async getProductosClientes() {
    const productos = await this.api.getProductosClientes();
    return productos;
  }
   
  async searchProductosClientes($id) {
    const productos = await this.api.searchProductosClientes($id);
    return productos;
  }
}


