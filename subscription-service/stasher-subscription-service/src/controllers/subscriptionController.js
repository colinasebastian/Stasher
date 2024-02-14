const SubscriptionService = require('../services/subscriptionService');
const Subscriber = require("../services/subscriber")
const subscriber = new Subscriber();
const createLogger = require("../logger/log");

module.exports = class IncomeController {
    constructor() {
        this.subscriptionService = new SubscriptionService();   
    }

    async subscribe(ctx, next) {
        try {
        let data = ctx.request.body;
        let user = await this.subscriptionService.addSubscribedUser(data);
        ctx.body = { data: user };
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

    async getAllSubscribedByUser(ctx, next) {
        try {
            let email = ctx.query.email;
            let list = await this.subscriptionService.getAllSubscribedByUser(email);
            ctx.body = { message: list };
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



    async unsubscribe(ctx, next) {
        try {
            let email = ctx.query.email;
            let category = ctx.query.category;
            await this.subscriptionService.deleteSubscribedUser(email,category);
            ctx.body = { message: "User unsubscribe successfully" };
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