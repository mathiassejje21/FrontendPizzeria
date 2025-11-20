import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuario`;

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

    async updateProfile(user) {
        const res = await this.api.put('/me', user);
        return res.data;
    }
}