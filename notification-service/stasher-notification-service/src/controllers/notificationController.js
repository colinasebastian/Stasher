const NotificationService = require('../services/notificationService');
const createLogger = require("../logger/log");

module.exports = class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();   
    }

    async notify(ctx, next) {
        try {
        let data = ctx.request.body;
        let user = await this.notificationService.addNotifyUser(data);
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

    async getAllNotificationByUser(ctx, next) {
        try {
            let email = ctx.query.email;
            let list = await this.notificationService.getAllNotifyByUser(email);
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



    async deleteNotify(ctx, next) {
        try {
            let email = ctx.query.email;
            let category = ctx.query.category;
            await this.notificationService.deleteNotifyUser(email,category);
            ctx.body = { message: "User deleted to notice successfully" };
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