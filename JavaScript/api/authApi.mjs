import axios from 'axios';
import { redirectByRole } from '@/service/redirectByRole.mjs';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export class authApi {
  constructor(){
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

  async register(nombre, email, password) {
    const res = await this.api.post('/register', { nombre, email, password });
    return {status:res.status, ...res.data};
  }

  async login(email, password){
    const res = await this.api.post('/login', { email, password });
    return { status: res.status, ...res.data }
  }

  async getProfile(){
    const res = await this.api.get('/profile');
    return res.data.user;
  }

  async logout(){
    const res = await this.api.post('/logout');
    return { status: res.status, ...res.data };
  }
}
