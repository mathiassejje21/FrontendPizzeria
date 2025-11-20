import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export class authApi {
  constructor(){
    this.api = axios.create({
      baseURL: API_URL,
      withCredentials: true
    })
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
