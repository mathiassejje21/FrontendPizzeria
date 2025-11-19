import { userApi } from "@api/userApi.mjs";

export class userController {
    constructor() {
        this.api = new userApi();
    }
    async getUser() {
        const res = await this.api.getUser();
        return res;
    }
}