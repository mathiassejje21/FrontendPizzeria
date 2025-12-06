import { userApi } from "@api/userApi.mjs";

export class userController {
    constructor() {
        this.api = new userApi();
    }
    async getUsers() {
        const res = await this.api.getUsers();
        return res;
    }

    async getUserById(id) {
        const res = await this.api.getUserById(id);
        return res;
    }

    async createUser(user) {
        const res = await this.api.createUser(user);
        return { status: res.status, ...res.data }; 
    }

    async updateUser(id, user) {
        const res = await this.api.updateUser(id, user);
        return { status: res.status, ...res.data }; 
    }

    async deleteUser(id) {
        const res = await this.api.deleteUser(id);
        return { status: res.status, ...res.data };
    }

    async updateProfile(user) {
        const res = await this.api.updateProfile(user);
        return { status: res.status, ...res.data }; 
    }

    async deleteProfile() {
        const res = await this.api.deleteProfile();
        return { status: res.status, ...res.data };
    }
}