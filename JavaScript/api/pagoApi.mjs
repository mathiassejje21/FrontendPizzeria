import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/pago`;

export class pagoApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        });
    }

    async getPago() {
        const res = await this.api.get("/");
        return res.data;
    }
}   