const { data } = require('../logger/log');
const CategoryService = require('../services/categoryService');
const ImageService = require('../services/imageService');
const createLogger = require("../logger/log");

module.exports = class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
        this.imageService = new ImageService();
    }

    async add(ctx, next) {
        try {
            let data = ctx.request.body;
            const file = ctx.request.file;
            let familyId = data.familyId;
            const img = await this.imageService.upload(file);
            data.image = img;
            let category = await this.categoryService.add(data, familyId);
            category.image = this.imageService.getImageURL(category.image);            
            ctx.body = { data: category };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        }
        catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }
    
    async edit(ctx, next) {
        try {
            let id = ctx.query.id;
            let data = ctx.request.body;
            const file = ctx.request.file;
            let familyId = data.familyId;
            const oldCategory = await this.categoryService.getById(id);
            await this.imageService.delete(oldCategory.image);
            const img = await this.imageService.upload(file);
            data.image = img;
            let category = await this.categoryService.edit(data, id,familyId);
            category.image = this.imageService.getImageURL(category.image);
            ctx.body = { data: category };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }

    async delete(ctx, next) {
        try {
            let id = ctx.query.id;
           let category = await this.categoryService.getById(id);
            await this.imageService.delete(category.image);
            await this.categoryService.delete(id);
            ctx.body = { data: "Category deleted succesfully" };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }

    async getByFamily(ctx, next) {
        try {
            let data = ctx.request.body;
            let user = data.user;
            let limit = ctx.request.query.size ? ctx.request.query.size : 5;
            let page = ctx.request.query.page ? ctx.request.query.page : 0;
            let offset = ctx.request.query.page ? (page)*limit : 0;
            const pagination = { limit, offset, page };
            let categories = await this.categoryService.getByFamily(pagination, user.familyId);
            ctx.body = { data: categories };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }

    async getByName(ctx, next) {
        try {
            let name = ctx.query.name;
            let familyId = ctx.query.familyId;
            let category = await this.categoryService.getByFamilyAndName(name, familyId);
            ctx.body = { data: category };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }

    async getAll(ctx, next) {
        try {
            let categories = await this.categoryService.getAll();
            ctx.body = { data: categories };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }

    async increaseQtyExpenses(ctx, next) {
        try {
            let id = ctx.query.id;
            let data = ctx.request.body;
            let category = await this.categoryService.increaseQtyExpenses(id,data);
            ctx.body = { data: category };
            createLogger.info(
                `${ctx.request.method} on url ${ctx.request.url} `
              );
        } catch (err) {
            ctx.status = 404;
            ctx.body = { status: 404, message: err.message };
            createLogger.error(
                `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 500 ${err.message}`
            );
        }
        await next();
    }



}