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
        const port = argv.port ? parseInt(argv.port) : 6065;
     
        app.use(koaNewrelic)
        app.use(cors());
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());


    app.listen(port);
    console.log(`Server started, and ready to accept requests`);
  }
}

module.exports = Server;