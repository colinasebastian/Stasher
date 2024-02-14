const UserRepository = require("../repositories/userRepository");

module.exports = class UserService {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async addAdministrator(data) {
        return await this.userRepository.addAdministrator(data);
    }

    async addUser(data,guid) {
        return await this.userRepository.addUser(data,guid);
    }

    async login(data) {
        return await this.userRepository.login(data);
    }

    async updateApiKey(token){
        return await this.userRepository.updateApiKey(token);
    }

    async getApiKey(token){
        return await this.userRepository.getApiKey(token);
    }

    async getUserByToken(token){
        return await this.userRepository.findByToken(token);
    }

}