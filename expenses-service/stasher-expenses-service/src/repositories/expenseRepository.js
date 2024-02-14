const Repository = require('./repository');
var List = require("collections/list");
const { Op } = require('sequelize');

module.exports = class ExpenseRepository {

  constructor() {
    this.expenseRepository = Repository.Expense
  }

  async add(data, user) {
    try {
      data.registrationDate = Date.now();
        let category = data.category;
        if (category != null) {
          data.userId = user.id;
          data.categoryId = category.id
          data.familyId = user.familyId
          let expense = await this.expenseRepository.create(data);
          return expense;
        } else {
          throw new Error("A category associated with this expense was not found");
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
            await this.expenseRepository.update(
              {
                amount: data.amount,
                producedDate: data.producedDate,
                registrationDate: Date.now(),
                categoryId: category.id,
                description : data.description
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
          await this.expenseRepository.update(
            {
              amount: data.amount,
              producedDate: data.producedDate,
              description: data.description,
              registrationDate: Date.now()
            },
            {
              where: { id: Id },
            }
          );
        }
        return await this.expenseRepository.findOne({ where: { id: Id } });
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async delete(Id) {
    try {
        if(await this.expenseRepository.findOne({ where: { id: Id } })){
            await this.expenseRepository.destroy(
                {
                  where: { id: Id },
                }
              );
        } else{
          throw new Error("The expense to be deleted does not exist or has already been deleted")
        }
    } catch (err) {
      throw new Error(err.message);
    }

  }

  async getByDate(filter, pagination, familyId) {
    try {
      var expenses = new List();
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
        let dataExpenses = await this.expenseRepository.findAndCountAll({ where: condition, limit, offset });
        dataExpenses.rows.forEach(expense => {
          expenses.push(expense);
        });
        const totalItems = dataExpenses.count;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, expenses, totalPages, currentPage };
      } else {
        throw new Error("A user associated with this expense was not found");
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
        let expenses = await this.expenseRepository.findAll();
        categories.forEach(category => {
          amount = 0;
          if (category.familyId == familyId) {            
            expenses.forEach(element => {
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
        throw new Error("A user associated with this expense was not found");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getByCategory(categoryId) {
    try {
      var filteredExpenses = new List();
      let expenses = await this.expenseRepository.findAll();
      expenses.forEach(element => {
        if (element.categoryId == categoryId) {
          filteredExpenses.push(element)
        }
      });

      return filteredExpenses
    } catch (err) {
      throw new Error(err.message)
    }
  }


  async filterByDateCache(expenses, dateFrom, dateTo) {
    var filteredExpenses = new List();
    expenses.forEach(element => {
      if (element.producedDate <= dateTo && element.producedDate >= dateFrom) {
        filteredExpenses.push(element)
      }
    });
    return filteredExpenses;
  }

  async filterByDate(expenses, dateFrom, dateTo) {
    var filteredExpenses = new List();
    expenses.forEach(element => {
      if (element.producedDate.getTime() <= new Date(dateTo) && element.producedDate.getTime() >= new Date(dateFrom)) {
        filteredExpenses.push(element)
      }
    });
    return filteredExpenses;
  }

  async getBalance(dateFrom, dateTo, familyId) {
    try {
      var expencesBalance= new List();
      if (familyId != null) {
        let expenses = await this.expenseRepository.findAll();
        expenses.forEach(element => {
          if (element.producedDate.getTime() <= new Date(dateTo) &&
            element.producedDate.getTime() >= new Date(dateFrom) &&
            element.familyId == familyId) {
              expencesBalance.push(element)
          }
        });
        return expencesBalance;
      } else {
        throw new Error("A family associated with this expenses was not found");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

}