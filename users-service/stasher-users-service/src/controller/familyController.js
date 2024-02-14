const FamilyService = require('../service/familyService');
const createLogger = require("../logger/log");

module.exports = class FamilyController {
    constructor() {
       this.familyService = new FamilyService();
    }

    async findFamilyById(ctx, next) {
        try {
            let id = ctx.query.id;
            let family = await this.familyService.getById(id);
            ctx.body = { data: family };
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

    async findFamilyByKey(ctx, next) {
        try {
            let key = ctx.query.key;
            let family = await this.familyService.findFamilyByKey(key);
            ctx.body = { data: family };
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

    async getAll(ctx, next) {
        try {
            let families = await this.familyService.getAll();
            ctx.body = { families};
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
}