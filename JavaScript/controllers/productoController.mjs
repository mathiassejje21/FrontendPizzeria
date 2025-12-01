import { productoApi } from "@api/productoApi.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export class productoController {
  constructor() {
    this.api = new productoApi();
  }

  async getProductos() {
    try {
      return await this.api.getProductos();
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al obtener productos",
        text: err.response?.data?.mensaje || "No se pudo cargar la lista de productos."
      });
      return [];
    }
  }

  async getProductoById(id) {
    try {
      return await this.api.getProductoById(id);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Producto no encontrado",
        text: err.response?.data?.mensaje || "No se pudo cargar la información del producto."
      });
      return null;
    }
  }

  async getProductoActivo() {
    try {
      return await this.api.getProductoActivo();
    } catch (err) {
      mensajeAlert({
        icon: "warning",
        title: "Productos activos no disponibles",
        text: err.response?.data?.mensaje || "No se pudieron cargar los productos activos."
      });
      return [];
    }
  }

  async getProductosporCategoria(id) {
    try {
      return await this.api.getProductosporCategoria(id);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al cargar categoría",
        text: err.response?.data?.mensaje || "No se pudieron cargar los productos de esta categoría."
      });
      return [];
    }
  }

  async getProductosporCategoriaActivo(id) {
    try {
      return await this.api.getProductosporCategoriaActivo(id);
    } catch (err) {
      mensajeAlert({
        icon: "warning",
        title: "Productos activos no disponibles",
        text: err.response?.data?.mensaje || "No se pudieron cargar los productos activos de esta categoría."
      });
      return [];
    }
  }

  async createProducto(producto) {
    try {
      return await this.api.createProducto(producto);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al crear producto",
        text: err.response?.data?.mensaje || "No se pudo crear el producto."
      });
      return null;
    }
  }

  async updateProducto(id, producto) {
    try {
      return await this.api.updateProducto(id, producto);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al actualizar producto",
        text: err.response?.data?.mensaje || "No se pudo actualizar el producto."
      });
      return null;
    }
  }

  async deleteProducto(id) {
    try {
      return await this.api.deleteProducto(id);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al eliminar producto",
        text: err.response?.data?.mensaje || "No se pudo eliminar el producto."
      });
      return null;
    }
  }

  async assingIngredienteToProducto(id, ingrediente) {
    try {
      return await this.api.assingIngredienteToProducto(id, ingrediente);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al agregar ingrediente",
        text: err.response?.data?.mensaje || "No se pudo agregar el ingrediente al producto."
      });
      return null;
    }
  }

  async deleteIngredienteFromProducto(id, idIngrediente) {
    try {
      return await this.api.deleteIngredienteFromProducto(id, idIngrediente);
    } catch (err) {
      mensajeAlert({
        icon: "error",
        title: "Error al eliminar ingrediente",
        text: err.response?.data?.mensaje || "No se pudo eliminar el ingrediente del producto."
      });
      return null;
    }
  }
}
