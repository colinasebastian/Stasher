const Repository = require('./repository');
require("dotenv").config();

module.exports = class SubscribedUserRepository {

  constructor() {
    this.userRepository = Repository.SubscribedUser;
  }

  async addSubscribedUser(data) {
    try {
       const user= data.data
       user.categoryName = data.categoryName;
       user.id = null;
       let existing = await this.userRepository.findOne({ where: { emailAddress: user.emailAddress,  categoryName:user.categoryName} })
        if (existing == null) {
          let subscribedUser = await this.userRepository.create(user);
          return subscribedUser;
        } else {
          throw new Error("This user is already subscribed to this category");
        }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getAllSubscribedByUser(email) {
    try {
       return await this.userRepository.findAll({ where: { emailAddress: email } });
    } catch (err) {
      throw new Error(err.message)
    }
  }


  async getAllSubscribedUser() {
    try {
       return await this.userRepository.findAll();
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async deleteSubscribedUser(email,category) {
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