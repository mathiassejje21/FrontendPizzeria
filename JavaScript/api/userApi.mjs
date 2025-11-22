import axios from 'axios';
import { redirectByRole } from '@/service/redirectByRole.mjs';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/usuario`;

export class userApi {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            withCredentials: true
        })

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

    async getUser() {
        const res = await this.api.get('/');
        return res.data;
    }

    async updateProfile(user) {
        const res = await this.api.put('/me', user);
        return res.data;
    }
}