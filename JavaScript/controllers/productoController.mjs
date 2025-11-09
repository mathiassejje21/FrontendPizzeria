import { productoApi } from "@/api/productoApi.mjs";

const api = new productoApi();

export async function getProductos() {
    const res = await api.getProductos();
    return res;
}