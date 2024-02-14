const RedisRepository = require("../cache/redisRepository");
const ExpenseRepository = require("../repositories/expenseRepository");
const axios = require("axios");
require("dotenv").config();

module.exports = class ExpenseService {

    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.cache = new RedisRepository();
    }

    async add(data, user, family) {
        if (user != null) {
            let expense = await this.expenseRepository.add(data, user);
            this.cache.updateTopThree(data.categories,family.apiKey);
            this.cache.updateExpenses(data.category.name, family.apiKey);
            return expense;
        } else {
            throw new Error("A user associated with this expense was not found");
        }
    }


    async edit(data, id) {        
      let user = data.user
        if (user != null) {
            return await this.expenseRepository.update(data, id,user);
        } else {
            throw new Error("A user associated with this expense was not found");
        }
    }

    async delete(id) {
        return await this.expenseRepository.delete(id);
    }

    async getByDate(filter, pagination, familyId) {
        return await this.expenseRepository.getByDate(filter, pagination, familyId);
    }

    async getAmountByDate(dateFrom, dateTo, familyId,categories) {
        return await this.expenseRepository.getAmountByDate(dateFrom, dateTo, familyId,categories);
    }

    async getByDateAndCategory(startDate, endDate, category, key, familyId,categoryId) {
        let filExpenses;
        if(familyId!=null){ 
            if(categoryId!=null){
                 let expenses = await this.cache.getExpensesByCategory(category,key);
                  if(expenses!=null){
                    filExpenses = this.expenseRepository.filterByDateCache(expenses,startDate,endDate) 
                  }
                  else{
                    expenses = await this.expenseRepository.getByCategory(categoryId);
                    this.cache.saveExpensesByCategory(category,key,expenses)
                     filExpenses = this.expenseRepository.filterByDate(expenses,startDate,endDate)  
                }             
                return filExpenses;  
            }
            else {
                throw new Error("The category does not exist");
            }
        } else {
            throw new Error("Wrong api key");
        }
    }

    async auth(ctx, next) {    
        let token = ctx.get("authentication")
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

      async getBalance(dateFrom, dateTo, familyId) {
        return await this.expenseRepository.getBalance(dateFrom, dateTo, familyId);
    }
  
}