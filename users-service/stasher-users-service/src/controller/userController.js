const UserService = require('../service/userService');
const nodemailer = require("nodemailer");
const FamilyService = require('../service/familyService');
const createLogger = require("../logger/log");

module.exports = class UserController {
    constructor() {
       this.userService = new UserService();
       this.familyService = new FamilyService();
    }

    async registerAdministrator(ctx, next) {
        try {
            let data = ctx.request.body;
            let user = await this.userService.addAdministrator(data);
            ctx.body = { email: user.emailAddress };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { status: 500, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );   
        }
    }

    async registerUser(ctx, next) {
        try {
            let key = ctx.request.query.key;
            let data = ctx.request.body;
            let user = await this.userService.addUser(data,key);
            ctx.body = { email: user.emailAddress };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { status: 500, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );   
        }
        await next();
    }

    async login(ctx,next) {
        try {
          let data = ctx.request.body;
          let user = await this.userService.login(data);
          ctx.body = { data: user };
          createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url} `
          );
        } catch (err) {
          ctx.status = 400;
          ctx.body = { status: 400, message: err.message };    
          createLogger.error(
            `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 401 ${err.message}`
        );       
        }
    }


    async updateApiKey(ctx,next) {
        try {
          let token = ctx.get("authentication")
          await this.userService.updateApiKey(token);
          ctx.body = { message: "Api key refreshed successfully" };
          createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url} `
          );
        } catch (err) {
          ctx.status = 400;
          ctx.body = { status: 400, message: err.message };  
          createLogger.error(
            `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
        );         
        }
        await next();    
    }

    async getApiKey(ctx,next) {
        try {
          let token = ctx.get("authentication")
          let user =await this.userService.getApiKey(token);
          ctx.body = { key: user };
          createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url} `
          );
        } catch (err) {
          ctx.status = 400;
          ctx.body = { status: 400, message: err.message };  
          createLogger.error(
            `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
        );         
        }
        await next();    
    }

    async findUserByToken(ctx,next) {
      try {
        let token = ctx.get("authentication")
        let user =await this.userService.getUserByToken(token);
        ctx.body = { data: user };
        createLogger.info(
          `${ctx.request.method} on url ${ctx.request.url} `
        );
      } catch (err) {
        ctx.status = 400;
        ctx.body = { status: 400, message: err.message };  
        createLogger.error(
          `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
      );         
      }
      await next();    
  }


    async sendInvitation(ctx,next) {
        try {
        let token = ctx.get("authentication")
        var user =await this.userService.getUserByToken(token);
        var email= ctx.request.body.email
        var family = await this.familyService.findFamilyById(user.familyId);
        var familyName= family.name;
        var message;
         var mailOptions = {
            from: "example@gmail.com",
            to: email,
            subject: 'Stasher invitation',
            text: "Access the stasher website from the following link " + process.env.FRONTEND_URL + "/memberUserReg?key=" + family.linkGuid +   "  Family: " + familyName
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
                message = 'Email enviado: ' + info.response;              
            }
        
        });
        ctx.status = 200;
        ctx.body = { message: 'Email enviado'}; 
        createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url} `
          );
        } catch (err) {
            ctx.status = 401;
            ctx.body = { status: 401, message: err.message };    
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 401 ${err.message}`
            );     
        }
      }

  }
