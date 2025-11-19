import { tamanioApi } from '@api/tamanioApi.mjs';

export class tamanioController{
    constructor(){
        this.api = new tamanioApi();
    }

    async getTamanios() {
        const res = await this.api.getTamanios();
        return res;
    }
}