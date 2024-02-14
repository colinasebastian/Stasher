const ExpenseService = require('../services/expenseService');
const createLogger = require("../logger/log");
const RedisRepository = require("../cache/redisRepository");

module.exports = class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();        
        this.cache = new RedisRepository();
    }

    async add(ctx, next) {
        try {
        let data = ctx.request.body;
        let family = data.family
        let user = data.user
        let expense = await this.expenseService.add(data, user, family);
        ctx.body = { data: expense };
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
            let expense = await this.expenseService.edit(data, id);
            ctx.body = { data: expense };
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
            await this.expenseService.delete(id);
            ctx.body = { message: "Expense deleted successfully" };
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
            let expenses = await this.expenseService.getByDate(filter, pagination, familyId);
            ctx.body = { data: expenses };
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
            let categories = ctx.request.body;
            let amounts = await this.expenseService.getAmountByDate(dateFrom, dateTo, familyId,categories);          
            ctx.status = 200
            ctx.body = { data: amounts };
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
                let expenses = await this.expenseService.getByDateAndCategory(startDate,endDate,category,key,familyId,categoryId);
                ctx.body = { data: expenses};
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
            let balance = await this.expenseService.getBalance(dateFrom, dateTo, familyId);          
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