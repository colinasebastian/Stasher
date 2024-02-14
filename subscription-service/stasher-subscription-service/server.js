const SubscriptionService = require('./src/services/subscriptionService');

class Server {
  constructor() {
  }

    async initServer() {
        const router = require('./src/controllers/router');
        const argv = require('minimist')(process.argv.slice(2));
        const Koa = require('koa');
        const newrelic = require('newrelic');
        const koaNewrelic = require('koa-newrelic')(newrelic);
        const bodyParser = require("koa-bodyparser");
        const app = new Koa();
        const cors = require('@koa/cors');
        const port = argv.port ? parseInt(argv.port) : 6061;
     
        app.use(koaNewrelic)
        app.use(cors());
        app.use(auth)
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());


    app.listen(port);
    console.log(`Server started,and ready to accept requests`);
  }
}

  async function auth(ctx, next) {
    const subscriptionService = new SubscriptionService();
      const createLogger = require("./src/logger/log");
          try {
              var url = ctx.originalUrl
              if(url!="/api/login" && url!="/api/administrator" && !url.includes("/api/notification") && !url.includes("/api/user") &&
              url!="/api/categories/expenses" && !url.includes("/api/expenses") && !url.includes("/api/income")){
                  await subscriptionService.auth(ctx,next);
              }
          await next()

          }
          catch (err) {
              ctx.status = 400;
              ctx.body = { status: 400, message: err.message };
              createLogger.error(
                  `${ctx.request.method} on url ${ctx.request.url}-> error ocurred: 400 ${err.message}`
              );
          }
  }

module.exports = Server;