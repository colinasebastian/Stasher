const Repository = require('./repository');
require("dotenv").config();

module.exports = class NotifyUserRepository {

  constructor() {
    this.userRepository = Repository.NotifyUser;
  }

  async addNotifyUser(data) {
    try {
       const user= data.data
       user.categoryName = data.categoryName;
       user.id = null;
        let existing = await this.userRepository.findOne({ where: { emailAddress: user.emailAddress,  categoryName:user.categoryName} }).then((result) => {
            return result;
        });
        if (existing == null) {
          let notifyUser = await this.userRepository.create(user);
          return notifyUser;
        } else {
          throw new Error("This user is already added to notice to this category");
        }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getAllNotifyUsers() {
    try {
       return await this.userRepository.findAll();
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getAllNotifyByUser(email) {
    try {
       return await this.userRepository.findAll({ where: { emailAddress: email } });
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async deleteNotifyUser(email,category) {
    try {
      if(await this.userRepository.findOne({ where: { emailAddress: email, categoryName:category } })){
          await this.userRepository.destroy(
              {
                where: { emailAddress: email, categoryName:category},
              }
            );
      } else{
        throw new Error("The user to unsubscribe does not exist or has already been unsubscribed")
      }
  } catch (err) {
    throw new Error(err.message);
  }
  }
}