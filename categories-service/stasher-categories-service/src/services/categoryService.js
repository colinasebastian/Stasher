const CategoryRepository = require("../repositories/categoryRepository");
const axios = require("axios");
require("dotenv").config();

module.exports = class CategoryService {

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async add(data, familyId) {        
        if (familyId != null) {
            return await this.categoryRepository.add(data, familyId);
        } else {
            throw new Error("A user associated with this category was not found");
        }
    }

    async edit(data, id,familyId) {
        if (familyId != null) {
            return await this.categoryRepository.update(data, id,familyId); 
        } else {
            throw new Error("A user associated with this category was not found");
        }
    }

    async delete(id) {
        return await this.categoryRepository.delete(id);
    }

    async getById(id) {
        return await this.categoryRepository.getById(id);
    }

    async getByFamily(pagination, familyId) {
        return await this.categoryRepository.getByFamily(pagination, familyId);
    }

    async getTopThree(key) {
        return await this.categoryRepository.getTopThree(key,family);
    }

    async getByFamilyAndName(name, familyId) {
        return await this.categoryRepository.getByFamilyAndName(name, familyId);
    }

    async getAll() {
        return await this.categoryRepository.getAll();
    }

    async increaseQtyExpenses(id,data) {
        return await this.categoryRepository.increaseQtyExpenses(id,data);
    }

  async auth(ctx, next) {    
    let token = ctx.get("authentication");
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_AUTH_SERVICE_URL}/authentication`, ctx,{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

}