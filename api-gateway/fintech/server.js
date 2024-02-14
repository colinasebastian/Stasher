const GatewayService = require('./src/services/gatewayService');

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
        const port = argv.port ? parseInt(argv.port) : 8080;
        const vv = require('./healthCkeck')
        const mySequelizeConf = {
            database: 'fintechDB',
            username: 'root',
            password: 'abc123',
            options: {
              dialect: 'mysql'
            },
          };
          
          const myDBCheck = {
            name: 'Db mysql check',
            type: 'db',
            configuration: mySequelizeConf
          };         

          
        const myChecks = [myDBCheck];
        vv(app, myChecks); 
        app.use(koaNewrelic)
        app.use(cors());
        app.use(auth);
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());


    app.listen(port);
    console.log(`Server started,and ready to accept requests`);
  }
}

async function auth(ctx, next) {
  const gatewayService = new GatewayService();
    const createLogger = require("./src/logger/log");
        try {
            var url = ctx.originalUrl
            if(url!="/api/login" && !url.includes("/api/notification") && url!="/api/administrator" && !url.includes("/api/user") &&
            url!="/api/categories/expenses" && !url.includes("/api/expenses") && url!="/api/income"){
              await gatewayService.auth(ctx,next);
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