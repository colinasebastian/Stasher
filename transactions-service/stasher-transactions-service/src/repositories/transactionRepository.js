const Repository = require('./repository');
var List = require("collections/list");
const { Op } = require('sequelize');

module.exports = class TransactionRepository {

  constructor() {
    this.transactionRepository = Repository.Transaction;
  }

  async add(data, user) {
    try {
      let transactionExist = await this.transactionRepository.findTransactionByName(data.name);    
        if (transactionExist == null) {
          data.userId = user.id;
          data.familyId = user.familyId;
          var newDate = new Date();
          newDate.setDate(newDate.getDate() + data.repeatDays);
          data.runDate = newDate;
          let transaction = await this.transactionRepository.create(data);
          return transaction;
        } else {
          throw new Error("There is already a transaction with that name");
        }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async update(data, Id, user) {
    try {      
      let transactionExistById = await this.transactionRepository.findOne({ where: { id: Id } });  
          if (transactionExistById != null) {
            let transactionExistByName = await this.transactionRepository.findTransactionByName(data.name);  
            if(!transactionExistByName || transactionExistByName.id == Id){
              let runDate = new Date(dataTransaction.runDate);
              const currentDate = new Date();
              const sameDate = runDate.getFullYear() == currentDate.getFullYear() 
              && runDate.getMonth() == currentDate.getMonth()  
              && runDate.getDate() == currentDate.getDate();
              if(sameDate) {
                runDate.setDate(newDate.getDate() + data.repeatDays);
                data.runDate = runDate;
              }

              await this.transactionRepository.update(
                {
                  name: data.name,
                  amount: data.amount,
                  producedDate: data.producedDate,
                  runDate: data.runDate,
                  type: data.type,
                  userId: user.id,
                  familyId: user.familyId,
                  repeatDays: data.repeatDays
                },
                {
                  where: { id: Id },
                }
              );
            } else {
              throw new Error("A transaction exists with this name");
            }
          } else {
            throw new Error("No transaction exists with this id");
          }
        return await this.transactionRepository.findOne({ where: { id: Id } });
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async delete(Id) {
    try {
        if(await this.transactionRepository.findOne({ where: { id: Id } })){
            await this.transactionRepository.destroy(
                {
                  where: { id: Id },
                }
              );
        } else{
          throw new Error("The transaction to be deleted does not exist or has already been deleted")
        }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findTransactionByName(name) {
    try {
      return await this.transactionRepository.findOne({where:{name:name}});
    } catch (err) {
        throw new Error(err.message)
    }
 }

}