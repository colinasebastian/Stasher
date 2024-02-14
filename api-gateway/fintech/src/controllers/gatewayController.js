const GatewayService = require("../services/gatewayService");
const log = require("../logger/log");

module.exports = class GatewayController {
  constructor() {
    this.gatewayService = new GatewayService();
  }


  async registerAdministrator(ctx, next) {
    try {
      let message = await this.gatewayService.registerAdministrator(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async registerUser(ctx, next) {
    try {
      let message = await this.gatewayService.registerUser(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async login(ctx, next) {
    try {
      let message = await this.gatewayService.login(ctx);
      ctx.body =message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async updateApiKey(ctx, next) {
    try {
      let message = await this.gatewayService.updateApiKey(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getApiKey(ctx, next) {
    try {
      let key = await this.gatewayService.getApiKey(ctx);
      ctx.body = key;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async sendInvitation(ctx, next) {
    try {
      let message = await this.gatewayService.sendInvitation(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

   //////////////////////////////////////////EXPENSE
  async addExpense(ctx, next) {
    try {
      let message = await this.gatewayService.addExpense(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async editExpense(ctx, next) {
    try {
      let message = await this.gatewayService.editExpense(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async deleteExpense(ctx, next) {
    try {
      let message = await this.gatewayService.deleteExpense(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getExpenseByDate(ctx, next) {
    try {
      let message = await this.gatewayService.getExpenseByDate(ctx);
      ctx.body = { message};
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }


  async getExpensesAmountByDate(ctx, next) {
    try {
      let message = await this.gatewayService.getExpensesAmountByDate(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

 //////////////////////////////////////////CATEGORY
  async addCategory(ctx, next) {
    try {
      let message = await this.gatewayService.addCategory(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async editCategory(ctx, next) {
    try {
      let message = await this.gatewayService.editCategory(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async deleteCategory(ctx, next) {
    try {
      let message = await this.gatewayService.deleteCategory(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }


  async getCategoriesByFamily(ctx, next) {
    try {
      let message = await this.gatewayService.getCategoriesByFamily(ctx);
      ctx.body = {data: message};
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  //////////////////////////////////////////REST
  async getTopThreeCategories(ctx, next) {
    try {
      let message = await this.gatewayService.getTopThreeCategories(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getExpensesByCategory(ctx, next) {
    try {
      let message = await this.gatewayService.getExpensesByCategory(ctx);
      ctx.body = {data: message};
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

   //////////////////////////////////////////INCOME
   async addIncome(ctx, next) {
    try {
      let message = await this.gatewayService.addIncome(ctx);
      ctx.body =message
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async editIncome(ctx, next) {
    try {
      let message = await this.gatewayService.editIncome(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async deleteIncome(ctx, next) {
    try {
      let message = await this.gatewayService.deleteIncome(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getIncomeByDate(ctx, next) {
    try {
      let message = await this.gatewayService.getIncomeByDate(ctx);
      ctx.body = { message};
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }


  async getIncomesAmountByDate(ctx, next) {
    try {
      let message = await this.gatewayService.getIncomesAmountByDate(ctx);
      ctx.body = {data: message};
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async subscribe(ctx, next) {
    try {
      let message = await this.gatewayService.subscribe(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async unsubscribe(ctx, next) {
    try {
      let message = await this.gatewayService.unsubscribe(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getSubscriptions(ctx, next) {
    try {
      let message = await this.gatewayService.getSubscriptions(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async sendMail(ctx, next) {
    try {
      let message = await this.gatewayService.sendMail(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  //////////////////////////////////////////TRANSACTION
  async addTransaction(ctx, next) {
    try {
      let message = await this.gatewayService.addTransaction(ctx);
      ctx.body = message
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async editTransaction(ctx, next) {
    try {
      let message = await this.gatewayService.editTransaction(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async deleteTransaction(ctx, next) {
    try {
      let message = await this.gatewayService.deleteTransaction(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }
  async notify(ctx, next) {
    try {
      let message = await this.gatewayService.notify(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async deleteNotify(ctx, next) {
    try {
      let message = await this.gatewayService.deleteNotify(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getNotifications(ctx, next) {
    try {
      let message = await this.gatewayService.getNotifications(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

  async getBalance(ctx, next) {
    try {
      let message = await this.gatewayService.getBalance(ctx);
      ctx.body = message;
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { status: 500, message: err.message };
      log.error(
        `${ctx.request.method} on url ${ctx.request.url} -> ${err.message}`
      );
    }
  }

}