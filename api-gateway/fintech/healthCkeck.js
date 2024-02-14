
const router = require('koa-router')();
const checks = require('koa-healthcheck/checks');
const paths = ['/ping', '/version', '/healthcheck', '/metrics'];
const redis = require('redis');
const mysql = require('mysql2/promise');
require("dotenv").config();

function healthcheckPlugin(app, checksConf, version) {
  const count = {
    Http2XX: 0,
    Http4XX: 0,
    Http5XX: 0,
  };



  async function healthcheck(ctx) {
    const result = {};
    const promises = checksConf.map((check) => {
      return checks(check);
    });

    await Promise.all(promises)
      .then((data) => {
        checksConf.map((check, index) => {
          result[check.name || `no-name-${index}`] = data[index];
        });
      });

    if (result['Db mysql check']!=null){
      if (result['Db mysql check'] == 0){
      return 'Mysql database is up'
      }
      else if (result['Db mysql check'] == 1){
        return 'Mysql database is down'
        }
    }
    else{
      return 'Mysql database is down'
    }
  }

  async function checkMySql() {

    try{
     await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
      return true;
    }
    catch(err){
      return false;
    }
  }

  async function checkMySqlExpenses() {

    try{
     await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT2,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
      return true;
    }
    catch(err){
      return false;
    }
  }

  async function checkRedis() {

    try{
      await redis.createClient({url: 'redis://'+process.env.REDIS_HOST+':'+process.env.REDIS_PORT}); 
      return true;
    }
    catch(err){
      return false;
    }
  }

  async function checkRedisAuth() {

    try{
      await redis.createClient({url: 'redis://'+process.env.REDIS_HOST+':'+process.env.REDIS_PORT2}); 
      return true;
    }
    catch(err){
      return false;
    }
  }

  async function metricsMiddleware(ctx, next) {
    await next();
    if (paths.includes(ctx.path)) {
      return;
    }
    if (ctx.status >= 200 && ctx.status < 300) {
      count.Http2XX++;
    }
    if (ctx.status >= 400 && ctx.status < 400) {
      count.Http4XX++;
    }
    if (ctx.status >= 400 && ctx.status < 600) {
      count.Http5XX++;
    }
  }

  router
    .get('/ping', (ctx) => { ctx.body = 'pong'; })
    .get('/version', (ctx) => { ctx.body = version; })
     .get('/healthcheck', async (ctx) => { 
      ctx.body = {data: ["Request Availability: OK", "Database Users MySQL Connectivity: "+ await checkMySql(),
      "Database Expenses MySQL Connectivity: "+ await checkMySqlExpenses(), 
      "Cache Expenses and Categories Redis Connectivity: "+ await checkRedis(),
      "Cache Auth Redis Connectivity: "+ await checkRedisAuth(),
      "Database Categories MySQL Connectivity: "+ await checkMySqlExpenses(), 
      "Database Income MySQL Connectivity: "+ await checkRedis(),
      "Database notification MySQL Connectivity: "+ await checkMySqlExpenses(), 
      "Database Subscription Connectivity: "+ await checkRedis(),
      "Database Users and Families MySQL Connectivity: "+ await checkRedisAuth(),
      "Database Users and Families MySQL Connectivity: "+ await checkRedisAuth(),
      "Metrics: "+  "{ Http2XX: " + count.Http2XX + 
      " Http4XX: " + count.Http4XX + 
      " HttpHttp5XX: " + count.Http5XX+ " }"]}})
    .get('/metrics', (ctx) => { ctx.body = count; });

  app.use(metricsMiddleware);
  app.use(router.routes());
}

module.exports = healthcheckPlugin;
