import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuario`;

export class userApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        });
    }

    async getUsers(params = {}) {
        const res = await this.api.get('/', { params });
        return res.data;
    }

    async getUserById(id) {
        const res = await this.api.get(`/${id}`);
        return res.data;
    }

    async createUser(user) {
        const res = await this.api.post('/', user);
        return res;
    }

    async updateUser(id, data) {
        const res = await this.api.put(`/${id}`, data);
        return res;
    }

    async deleteUser(id) {
        const res = await this.api.delete(`/${id}`);
        return res;
    }

    async getMe() {
        const res = await this.api.get('/me');
        return res.data;
    }

    async updateProfile(data) {
        const res = await this.api.put('/me', data);
        return res;
    }

    async deleteProfile() {
        const res = await this.api.delete('/me');
        return res;
    }
}
