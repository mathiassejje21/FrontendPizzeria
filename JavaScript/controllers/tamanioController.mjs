import { tamanioApi } from '@api/tamanioApi.mjs';

export class tamanioController{
    constructor(){
        this.api = new tamanioApi();
    }

    async getTamanios() {
        const res = await this.api.getTamanios();
        return res;
    }

    async getTamanioById($id) {
        const res = await this.api.getTamanioById($id);
        return res;
    }

    async createTamanio(data) {
        const res = await this.api.createTamanio(data);
        return res;
    }

    async updateTamanio($id, data) {
        const res = await this.api.updateTamanio($id, data);
        return res;
    }

    async deleteTamanio($id) {
        const res = await this.api.deleteTamanio($id);
        return res;
    }
}