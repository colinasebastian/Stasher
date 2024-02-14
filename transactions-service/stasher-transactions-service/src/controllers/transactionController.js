const TransactionService = require('../services/transactionService');
const createLogger = require("../logger/log");

module.exports = class TransactionController {
    constructor() {
        this.transactionService = new TransactionService();   
    }

    async add(ctx, next) {
        try {
        let data = ctx.request.body;
        let family = data.family
        let user = data.user
        let transaction = await this.transactionService.add(data, user, family);
        ctx.body = { data: transaction };
        createLogger.info(
            `${ctx.request.method} on url ${ctx.request.url} `
            );
        }
        catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
            );
        }
        await next();
    }

  async edit(ctx, next) {
      try {
          let id = ctx.query.id;
          let data = ctx.request.body;
          let transaction = await this.transactionService.edit(data, id);
          ctx.body = { data: transaction };
          createLogger.info(
              `${ctx.request.method} on url ${ctx.request.url} `
            );
      } catch (err) {
          ctx.status = 404;
          ctx.body = { status: 404, message: err.message };
          createLogger.error(
              `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
          );
      }
      await next();
  }


async delete(ctx, next) {
  try {
      let id = ctx.query.id;
      await this.transactionService.delete(id);
      ctx.body = { message: "Transaction deleted successfully" };
      createLogger.info(
          `${ctx.request.method} on url ${ctx.request.url} `
        );
  } catch (err) {
      ctx.status = 404;
      ctx.body = { status: 404, message: err.message };
      createLogger.error(
          `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
      );
  }
  await next();
}

}