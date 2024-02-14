require("dotenv").config();
const AuthenticationFilter = require('../service/authenticationFilter');

const createLogger = require("../logger/log");
module.exports = class AuthenticationController {
  constructor() {
    this.authenticatitonService = new AuthenticationFilter();
  }


  async saveAuthentication(ctx, next) {    
    try {
        let user = await this.authenticatitonService.saveAuthentication(ctx,next);
        ctx.status = 200;
        ctx.body = user;
        createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url}`
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

  async authenticate(ctx, next) {    
    try {
        let user = await this.authenticatitonService.auth(ctx,next);
        ctx.status = 200;
        ctx.body = user;
        createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url}`
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
}