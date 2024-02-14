const IncomeService = require('../services/incomeService');
const createLogger = require("../logger/log");

module.exports = class IncomeController {
    constructor() {
        this.incomeService = new IncomeService();   
    }

    async add(ctx, next) {
        try {
        let data = ctx.request.body;
        let family = data.family
        let user = data.user
        let income = await this.incomeService.add(data, user, family);
        ctx.body = { data: income };
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
          let income = await this.incomeService.edit(data, id);
          ctx.body = { data: income };
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
      await this.incomeService.delete(id);
      ctx.body = { message: "Income deleted successfully" };
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

async getByDate(ctx, next) {
    try {
        let dateFrom = ctx.query.dateFrom;
        let dateTo = ctx.query.dateTo;
        let familyId = ctx.query.familyId;
        let limit = ctx.query.size ? +ctx.query.size : 5;
        let page = ctx.query.page ? ctx.query.page : 1;
        let offset = ctx.query.offset ? ctx.query.offset : 0;
        const filter = { dateFrom, dateTo };
        const pagination = { limit, offset, page }
        let incomes = await this.incomeService.getByDate(filter, pagination, familyId);
        ctx.body = { data: incomes };
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

async getAmountByDate(ctx, next) {
    try {
        let dateFrom = ctx.query.dateFrom;
        let dateTo = ctx.query.dateTo;
        let familyId = ctx.query.familyId;
        let categories = ctx.request.body.categories;
        let amount = await this.incomeService.getAmountByDate(dateFrom, dateTo, familyId,categories);
        ctx.body = { data: amount };
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

async getByCategory(ctx, next) {
    try {
        let key = ctx.query.key;
        let familyId =ctx.query.familyId;
        if (familyId!=null && key!=null) {
            let startDate = ctx.query.startDate;
            let endDate = ctx.query.endDate;
            let category = ctx.query.category;    
            let categoryId = ctx.query.categoryId;  
            let incomes = await this.incomeService.getByDateAndCategory(startDate,endDate,category,key,familyId,categoryId);
            ctx.body = { data: incomes};
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        }else{
            ctx.status = 404;
            ctx.body = { status: 404, message: "Wrong api key" };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 Wrong api key`
            );
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = { status: 404, message: err.message };
        createLogger.error(
            `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
        );
    }
    await next();
}

async getTopThree(ctx, next) {
    try {
        let key = ctx.query.key;       
        if (key!=null) {
            let categories = await this.cache.getTopThree(key);
            ctx.body = { data: categories };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } else {
            ctx.status = 404;
            ctx.body = { status: 404, message: "Wrong api key" };
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = { status: 404, message: err.message };
        createLogger.error(
            `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
        );
    }
    await next();
}

async getBalance(ctx, next) {
    try {
        let dateFrom = ctx.query.dateFrom;
        let dateTo = ctx.query.dateTo;
        let familyId = ctx.query.familyId;
        let balance = await this.incomeService.getBalance(dateFrom, dateTo, familyId);          
        ctx.status = 200
        ctx.body = { data: balance };
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