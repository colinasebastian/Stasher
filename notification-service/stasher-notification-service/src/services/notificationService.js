const createLogger = require("../logger/log");
const nodemailer = require("nodemailer");
const axios = require("axios");
const NotifyUserRepository = require("../repositories/notifyUserRepository");
require("dotenv").config();

module.exports = class NotificationService {

    constructor() {        
        this.notifyUserRepository = new NotifyUserRepository();
    }

    async addNotifyUser(data) {
        return await this.notifyUserRepository.addNotifyUser(data);
    }

    async deleteNotifyUser(email,category) {
        return await this.notifyUserRepository.deleteNotifyUser(email,category);
    }

    async getAllNotifyByUser(email) {
        return await this.notifyUserRepository.getAllNotifyByUser(email);
    }

    async getAllNotifyUsers() {
        return await this.notifyUserRepository.getAllNotifyUsers();
    }

    async sendAlert(category,message) {
        try {
        const msg=message.split('"')[1];
        let users = await this.getAllNotifyUsers();
        users.forEach(notifyUser => {
            if(notifyUser.dataValues.categoryName.toLowerCase().replace(/\s/g, "")==category.split('"')[0].toLowerCase().replace(/\s/g, "")){
                 var mailOptions = {
                    from: "example@gmail.com",
                    to: notifyUser.dataValues.emailAddress,
                    subject: 'Stasher alert',
                    text: msg 
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