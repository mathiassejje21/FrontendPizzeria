import axios from 'axios';

const API_URL = "http://localhost:8000/api/pago";

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