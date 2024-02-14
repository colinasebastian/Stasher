const IncomeRepository = require("../repositories/incomeRepository");
const axios = require("axios");
require("dotenv").config();

module.exports = class IncomeService {

    constructor() {
        this.incomeRepository = new IncomeRepository();
    }

    async add(data, user) {
        if (user != null) {
            let income = await this.incomeRepository.add(data, user);
            return income;
        } else {
            throw new Error("A user associated with this income was not found");
        }
    }

    async edit(data, id) {        
        let user = data.user
          if (user != null) {
              return await this.incomeRepository.update(data, id,user);
          } else {
              throw new Error("A user associated with this income was not found");
          }
      }
  
      
    async delete(id) {
        return await this.incomeRepository.delete(id);
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
    async getByDate(filter, pagination, familyId) {
        return await this.incomeRepository.getByDate(filter, pagination, familyId);
    }

    async getAmountByDate(dateFrom, dateTo, familyId,categories) {
        return await this.incomeRepository.getAmountByDate(dateFrom, dateTo, familyId,categories);
    }

    async getByDateAndCategory(startDate, endDate, category, key, familyId, categoryId) {
        let filIncomes;
        if(familyId!=null){ 
            if(categoryId!=null){
                 let incomes = await this.cache.getIncomesByCategory(category,key);
                  if(incomes!=null){
                    filIncomes = this.incomeRepository.filterByDateCache(incomes,startDate,endDate) 
                  }
                  else{
                    incomes = await this.incomeRepository.getByCategory(categoryId);
                    this.cache.saveIncomesByCategory(category,key,incomes)
                     filIncomes = this.incomeRepository.filterByDate(incomes,startDate,endDate)  
                }             
                return filIncomes;  
            }
            else {
                throw new Error("The category does not exist");
            }
        } else {
            throw new Error("Wrong api key");
        }
    }

    async getBalance(dateFrom, dateTo, familyId) {
      return await this.incomeRepository.getBalance(dateFrom, dateTo, familyId);
  }
}