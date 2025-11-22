import axios from "axios";
import { redirectByRole } from "@/service/redirectByRole.mjs";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/pedido`;

export class pedidoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true,
        });
        this.api.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error?.response?.status === 401) {
              const url = redirectByRole();
              sessionStorage.clear();
              location.href = url;
            }
            return Promise.reject(error);
          }
        )
    }

    async getPedidos() {
        const response = await this.api.get("/");
        return response.data;
    }

    async postPedidos(pedido) {
        console.log(pedido);
        const response = await this.api.post("/", pedido);
        return {
            status: response.status,
            ...response.data,
        };
    }

    
}