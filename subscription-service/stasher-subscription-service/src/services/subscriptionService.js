const SubscribedUserRepository = require("../repositories/subscribedUserRepository");
const createLogger = require("../logger/log");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

module.exports = class SubscriptionService {

    constructor() {        
        this.subscribedUserRepository = new SubscribedUserRepository();
    }

    async addSubscribedUser(data) {
        return await this.subscribedUserRepository.addSubscribedUser(data);
    }

    async deleteSubscribedUser(email,category) {
        return await this.subscribedUserRepository.deleteSubscribedUser(email,category);
    }

    async getAllSubscribedByUser(email) {
        return await this.subscribedUserRepository.getAllSubscribedByUser(email);
    }


    async getAllSubscribedUsers() {
        return await this.subscribedUserRepository.getAllSubscribedUser();
    }


    async sendEmail(category,message) {
        try {
        let users = await this.getAllSubscribedUsers()
        users.forEach(subscribedUser => {
            if(subscribedUser.dataValues.categoryName==category.split('"')[0]){
                 var mailOptions = {
                    from: "example@gmail.com",
                    to: subscribedUser.dataValues.emailAddress,
                    subject: 'Stasher notification',
                    text: message.split('"')[1] 
                };
                nodemailer.createTransport({
                    service: "gmail",
                    host: 'smtp.gmail.com ',
                    port: 465,
                    secure: true,
                    auth: {
                        user: "example@gmail.com",
                        pass: "tvdtuvdrcpmukwbh"
                    }
                }).sendMail(mailOptions, function (error, info) {
                    if (error) {
                        throw new Error(error.message);
                    } else {
                        message = 'E-mail send:' + info.response;              
                    }
                
                });
            }            
        });     
        } catch (err) {
            createLogger.error(
                ` Error ocurred: 401 ${err.message}`
            );     
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

}