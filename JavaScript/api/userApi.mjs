import axios from 'axios';

const API_URL = 'http://localhost:8000/api/usuario';

export class userApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })
    }

    async getUser() {
        const res = await this.api.get('/');
        return res.data;
    }
}