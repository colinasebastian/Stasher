const TransactionRepository = require("../repositories/transactionRepository");

module.exports = class Transactionervice {

    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    async add(data, user) {
        if (user != null) {
            let transaction = await this.transactionRepository.add(data, user);
            return transaction;
        } else {
            throw new Error("A user associated with this transaction was not found");
        }
    }

    async edit(data, id) {        
        let user = data.user
          if (user != null) {
              return await this.transactionRepository.update(data, id,user);
          } else {
              throw new Error("A user associated with this transaction was not found");
          }
      }
      
    async delete(id) {
        return await this.transactionRepository.delete(id);
    }
  
}