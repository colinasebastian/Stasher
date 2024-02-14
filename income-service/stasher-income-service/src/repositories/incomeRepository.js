const Repository = require('./repository');
var List = require("collections/list");
const { Op } = require('sequelize');

module.exports = class IncomeRepository {

  constructor() {
    this.incomeRepository = Repository.Income
  }

  async add(data, user) {
    try {
      data.registrationDate = Date.now();
        let category = data.category;
        if (category != null) {
          data.userId = user.id;
          data.categoryId = category.id
          data.familyId = user.familyId
          let income = await this.incomeRepository.create(data);
          return income;
        } else {
          throw new Error("A category associated with this income was not found");
        }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async update(data, Id,user) {
    try {      
      let category;
        if (data.category.name != null) {
          category = data.category;
          if (category != null) {
            await this.incomeRepository.update(
              {
                amount: data.amount,
                producedDate: data.producedDate,
                registrationDate: Date.now(),
                categoryId: category.id
              },
              {
                where: { id: Id },
              }
            );
          }
          else {
            throw new Error("Invalid category name")
          }
        } else {
          await this.incomeRepository.update(
            {
              amount: data.amount,
              producedDate: data.producedDate,
              registrationDate: Date.now()
            },
            {
              where: { id: Id },
            }
          );
        }
        return await this.incomeRepository.findOne({ where: { id: Id } });
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async delete(Id) {
    try {
        if(await this.incomeRepository.findOne({ where: { id: Id } })){
            await this.incomeRepository.destroy(
                {
                  where: { id: Id },
                }
              );
        } else{
          throw new Error("The income to be deleted does not exist or has already been deleted")
        }
    } catch (err) {
      throw new Error(err.message);
    }

  }

  async getByDate(filter, pagination, familyId) {
    try {
      var incomes = new List();
      const limit = pagination.limit;
      const offset = parseInt(pagination.offset);
      const page = pagination.page;
      const condition = filter.dateFrom && filter.dateTo ?
        {
          producedDate: {
            [Op.between]: [filter.dateFrom, filter.dateTo]
          },
          familyId: familyId
        } : null;
      if (familyId != null) {
        let dataIncomes = await this.incomeRepository.findAndCountAll({ where: condition, limit, offset });
        dataIncomes.rows.forEach(income => {
          incomes.push(income);
        });
        const totalItems = dataIncomes.count;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, incomes, totalPages, currentPage };
      } else {
        throw new Error("A user associated with this income was not found");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getAmountByDate(dateFrom, dateTo, familyId,categories) {
    try {
      var amountGroupByCategory = {};
      var amount;
      if (familyId != null) {
        let incomes = await this.incomeRepository.findAll();
        categories.forEach(category => {
          amount = 0;
          if (category.familyId == familyId) {            
            incomes.forEach(element => {
              if (element.producedDate.getTime() <= new Date(dateTo) &&
                element.producedDate.getTime() >= new Date(dateFrom)
                && element.categoryId == category.id) {
                amount = amount + element.amount;
              }
            });
            if(amountGroupByCategory[category.name]){
              amountGroupByCategory[category.name] += amount
            }
            else{
              amountGroupByCategory[category.name] = amount
            }
          }
        })
        return amountGroupByCategory;
      } else {
        throw new Error("A user associated with this income was not found");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getByCategory(categoryId) {
    try {
      var filteredIncomes = new List();
      let incomes = await this.incomeRepository.findAll();
      incomes.forEach(element => {
        if (element.categoryId == categoryId) {
          filteredIncomes.push(element)
        }
      });

      return filteredIncomes
    } catch (err) {
      throw new Error(err.message)
    }
  }


  async filterByDateCache(incomes, dateFrom, dateTo) {
    var filteredIncomes = new List();
    incomes.forEach(element => {
      if (element.producedDate <= dateTo && element.producedDate >= dateFrom) {
        filteredIncomes.push(element)
      }
    });
    return filteredIncomes;
  }

  async filterByDate(incomes, dateFrom, dateTo) {
    var filteredIncomes = new List();
    incomes.forEach(element => {
      if (element.producedDate.getTime() <= new Date(dateTo) && element.producedDate.getTime() >= new Date(dateFrom)) {
        filteredIncomes.push(element)
      }
    });
    return filteredIncomes;
  }

  async getBalance(dateFrom, dateTo, familyId) {
    try {
      var incomesBalance= new List();
      if (familyId != null) {
        let incomes = await this.incomeRepository.findAll();
        incomes.forEach(element => {
          if (element.producedDate.getTime() <= new Date(dateTo) &&
            element.producedDate.getTime() >= new Date(dateFrom) &&
            element.familyId == familyId) {
              incomesBalance.push(element);
          }
        });
        return incomesBalance;
      } else {
        throw new Error("A family associated with this incomes was not found");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

}