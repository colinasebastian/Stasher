const axios = require("axios");
require("dotenv").config();
const FormData = require('form-data');
var amqp = require('amqplib/callback_api');
module.exports = class GatewayService {
  constructor() { }

  async auth(ctx, next) {    
    let token = ctx.get("authentication")
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_AUTH_SERVICE_URL}/authentication`, ctx,{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async saveLogin(data) {
    return new Promise(async (resolve, reject) => {
      return axios
        .put(`${process.env.STASHER_AUTH_SERVICE_URL}/authentication`, data.data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async registerAdministrator(ctx) {
    const data = ctx.request.body
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_USER_SERVICE_URL}/administrator`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async registerUser(ctx) {
    const data = ctx.request.body
    let key = ctx.request.query.key
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_USER_SERVICE_URL}/user`, data,{ 
          params: {
            key
        }})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async login(ctx) {
    const data = ctx.request.body
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_USER_SERVICE_URL}/login`, data)
        .then((response) => {
          this.saveLogin(response.data)
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async updateApiKey(ctx) {
    let token = ctx.get("authentication")
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_USER_SERVICE_URL}/key/refresh`, {
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getApiKey(ctx) {
    let token = ctx.get("authentication")
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_USER_SERVICE_URL}/key`, {
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async sendInvitation(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_USER_SERVICE_URL}/administrator/invitation`, data ,{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async findUserByToken(token) {
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_USER_SERVICE_URL}/users`,{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async findFamilyById(id,token) {
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_USER_SERVICE_URL}/families/id`,{
          headers: {
            authentication: token 
          },
          params: {
             id: id 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async addCategory(ctx) {
    const data2 = ctx.request.body
    const file = ctx.file;
    data2.file = file
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    data2.user = user.data;
    const data = new FormData()
    data.append('name', data2.name)
    data.append('description', data2.description)
    data.append('limitPerMonthExpense', data2.limitPerMonthExpense)
    data.append('familyId', data2.user.familyId)
    data.append('file', file.buffer, file.originalname)
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories`, data,{
          headers: {
            authentication: token,
            "Content-Type": "multipart/form-data"
          }
         
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async editCategory(ctx) {
    const id = ctx.params.id;
    const data2 = ctx.request.body
    const file = ctx.file;
    data2.file = file
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    data2.user = user.data;
    const data = new FormData()
    data.append('name', data2.name)
    data.append('description', data2.description)
    data.append('limitPerMonthExpense', data2.limitPerMonthExpense)
    data.append('familyId', data2.user.familyId)
    data.append('file', file.buffer, file.originalname)
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories/:id`, data,{
          headers: {
            authentication: token,
            "Content-Type": "multipart/form-data"
          },
          params:{
            id:id
          }         
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async deleteCategory(ctx) {
    let token = ctx.get("authentication")
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
        .delete(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories/:id`,{
          headers: {
            authentication: token,
            "Content-Type": "multipart/form-data"
          },
          params: {
             id: id 
          }}
          )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getCategoriesByFamily(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    data.user = user.data;
    let page = ctx.request.query.page ? ctx.request.query.page : 0;
    let size = ctx.request.query.size ? ctx.request.query.size : 15;
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories/family?page=${page}&size=${size}`, {
          data,
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getCategoryByFamilyAndName(categoryName, familyId,token){
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories/name`, {
          headers: {
            authentication: token 
          },
          params: {
            name: categoryName,
            familyId:familyId
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async increaseQtyExpenses(data,id,token){
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories/qty/:id`, data,{
          headers: {
            authentication: token 
          },
          params: {
             id: id 
          }
        })
        .then((response) => {
          if (response.data.data.limitPerMonthExpense<response.data.data.qtyExpenses){
            this.alert(response.data.data.name,response.data.data.limitPerMonthExpense,response.data.data.qtyExpenses)
          }
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getAllCategories(token){
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_CATEGORY_SERVICE_URL}/categories`,{headers: {
          authentication: token
        }})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async addExpense(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId,token)
    let category = await this.getCategoryByFamilyAndName(data.category.name, family.data.id,token);
    await this.increaseQtyExpenses(data,category.data.id,token)
    data.family = family.data;
    data.user = user.data;
    data.category = category.data;
    let categories = await this.getAllCategories(token);
    data.categories = categories.data;
    this.publish(category.data,data,"Expense")
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses`, data, {
          headers: {
            authentication: token
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async editExpense(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId,token)
    let category = await this.getCategoryByFamilyAndName(data.category.name, family.data.id,token);
    await this.increaseQtyExpenses(data,category.data.id,token)
    data.family = family.data;
    data.user = user.data;
    data.category = category.data;
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
      .post(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/:id`, data,{
        headers: {
          authentication: token
        },
        params:{
          id:id
        }         
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async deleteExpense(ctx) {
    let token = ctx.get("authentication")
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
      .delete(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/:id`,{
        params: {
           id: id 
        },
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getExpenseByDate(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let dateFrom = ctx.request.query.dateFrom;
    let dateTo = ctx.request.query.dateTo;
    let limit = ctx.request.query.size ? +ctx.request.query.size : 5;
    let page = ctx.request.query.page ? ctx.request.query.page : 1;
    let offset = ctx.request.query.page ? ctx.request.query.page * limit : 0;
    let familyId = user.data.familyId;
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses`, {
          params: {
            dateFrom: dateFrom ,
            dateTo:dateTo,
            page:page,
            offset:offset,
            familyId:familyId
          }
        },{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  
  async getExpensesAmountByDate(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token); 
    let dateFrom = ctx.request.query.dateFrom;
    let dateTo = ctx.request.query.dateTo;
    let familyId = user.data.familyId;
    let categories = await this.getAllCategories(token);
    categories = categories.data;
    ctx.request.body = categories;
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/amount`,ctx.request.body, {
          params: {
            dateFrom: dateFrom ,
            dateTo:dateTo,
            familyId:familyId
          },
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async findFamilyByKey(key) {
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_USER_SERVICE_URL}/families/key`,{
          params: {
            key: key 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async getExpensesByCategory(ctx) {
    let key = ctx.get("key");
    let startDate = ctx.request.query.startDate;
    let endDate = ctx.request.query.endDate;
    let categoryName = ctx.params.category;  
    let family = await this.findFamilyByKey(key)
    let familyId= family.data.id;
    let category = await this.getCategoryByFamilyAndName(categoryName,familyId);
    let categoryId = category.data.id;
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/category`, {
          params:{
            key:key,
            startDate:startDate,
            endDate:endDate,
            category:categoryName,
            familyId:familyId,
            categoryId:categoryId
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async getTopThreeCategories(ctx) {
    let key = ctx.get("key");
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/categories`, {
          params:{
            key:key
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async addIncome(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId,token)
    let category = await this.getCategoryByFamilyAndName(data.category.name, family.data.id,token);
    data.family = family.data;
    data.user = user.data;
    data.category = category.data;
    this.publish(category.data,data,"Income")
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_INCOME_SERVICE_URL}/income`, data, {
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async editIncome(ctx) {
    const data = ctx.request.body
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId,token)
    let category = await this.getCategoryByFamilyAndName(data.category.name, family.data.id,token);
    data.family = family.data;
    data.user = user.data;
    data.category = category.data;
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
      .post(`${process.env.STASHER_INCOME_SERVICE_URL}/income/:id`, data,{
        headers: {
          authentication: token
        },
        params:{
          id:id
        }         
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async deleteIncome(ctx) {
    let token = ctx.get("authentication")
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
      .delete(`${process.env.STASHER_INCOME_SERVICE_URL}/income/:id`,{
        params: {
           id: id 
        }
      },{
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async subscribe(ctx) { 
    let token = ctx.get("authentication");
    await this.findUserByToken(token).then((response) => {
      return new Promise(async (resolve, reject) => {
        response.categoryName = ctx.params.category;
        return axios
          .post(`${process.env.STASHER_SUBSCRIPTION_SERVICE_URL}/subscription/user`, response, {
            headers: {
              authentication: token 
            }
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(new Error(error.response.data.message));
          });
      });
    });
    
  }

  async unsubscribe(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let category = ctx.params.category;    
    return new Promise(async (resolve, reject) => {
      return axios
      .delete(`${process.env.STASHER_SUBSCRIPTION_SERVICE_URL}/subscription/category/:category/user/:email`,{
        params: {
          category: category,
          email: user.data.emailAddress
        },
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async getSubscriptions(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    return new Promise(async (resolve, reject) => {
      return axios
      .get(`${process.env.STASHER_SUBSCRIPTION_SERVICE_URL}/subscription/user/:email`,{
        params: {
          email: user?.data?.emailAddress
        }
      },{
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async addTransaction(ctx) {
    const dataTransaction = ctx.request.body.transaction;
    const transactionType = ctx.request.body.transactionType;
    let token = ctx.get("authentication");
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId, token);
    dataTransaction.family = family.data;
    dataTransaction.user = user.data;
    transactionType.family = family.data;
    transactionType.user = user.data;
    ctx.request.body = transactionType;

    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_TRANSACTION_SERVICE_URL}/transaction`, dataTransaction, {
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          // EXPENSE
          if (data.transaction.type == 1) {
            ctx.request.body = transactionType;
            addExpense(ctx);
          } 
          // INCOME
          else {
            ctx.request.body = transactionType;
            addIncome(ctx);
          }
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async editTransaction(ctx) {
    const dataTransaction = ctx.request.body.transaction;
    const transactionType = ctx.request.body.transactionType;
    const runDate = new Date(dataTransaction.runDate);
    const currentDate = new Date();
    const id = ctx.params.id;

    let token = ctx.get("authentication");
    let user = await this.findUserByToken(token);
    let family = await this.findFamilyById(user.data.familyId, token);
    dataTransaction.family = family.data;
    dataTransaction.user = user.data;
    transactionType.family = family.data;
    transactionType.user = user.data;

    console.log(transactionType);
    ctx.request.body = transactionType;
    console.log(ctx.request.body);

    return new Promise(async (resolve, reject) => {
      return axios
      .put(`${process.env.STASHER_TRANSACTION_SERVICE_URL}/transaction/:id`, dataTransaction,{
        params: {
           id: id 
        }
      },{
        headers: {
          authentication: token 
        }})
        .then((response) => {

          if(runDate.getFullYear() == currentDate.getFullYear() 
          && runDate.getMonth() == currentDate.getMonth()  
          && runDate.getDate() == currentDate.getDate() ) {
            // EXPENSES
            if (data.transaction.type  == 1) {
              ctx.request.body = transactionType;
              addExpense(ctx);
            } 
            // INCOME
            else {
              ctx.request.body = transactionType;
              addIncome(ctx);
            }
          }
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async deleteTransaction(ctx) {
    let token = ctx.get("authentication")
    const id = ctx.params.id;
    return new Promise(async (resolve, reject) => {
      return axios
      .delete(`${process.env.STASHER_TRANSACTION_SERVICE_URL}/transaction/:id`,{
        params: {
           id: id 
        }
      },{
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async publish(category,data,type) { 
    let msg= 'An ' + type +  ' of amount ' + data.amount + ' and category ' + category.name+ ' was added :'+category.name;
    var raabitmqSettings = {
      protocol: process.env.RABBITMQ_PROTOCOL,
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      username:  process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD
    };
    await amqp.connect(raabitmqSettings, async function(err,connection) {
      if(err){
        console.error('Error in connection', err.message);
        throw err;
      }
     try{
        const channel = await connection.createChannel();
        try {
          console.log('Publishing');
          const exchange = 'amq.topic';
          const queue = 'Category subscription';
          const routingKey = 'sign_up_email';
          
          await channel.assertExchange(exchange, 'topic', {durable: true});
          await channel.assertQueue(queue, {durable: true});
          await channel.bindQueue(queue, exchange, routingKey);
          
          await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
          console.log('Message published');
        } catch(e) {
          console.error('Error in publishing message', e);
        } 
      } catch(err) {
        console.error('Error in connection', err.message);
      } 
    });
    }

    async alert(category,limit,qty) { 

      let msg= 'Monthly limit ' + limit + ' of expenses of category ' + category + ' was exceeded with amount ' + qty + ' : ' +category;
      var raabitmqSettings = {
        protocol: process.env.RABBITMQ_PROTOCOL,
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        username:  process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD
      };
      await amqp.connect(raabitmqSettings, async function(err,connection) {
        if(err){
          console.error('Error in connection', err.message);
          throw err;
        }
       try{
          const channel = await connection.createChannel();
          try {
            console.log('Publishing');
            const exchange = 'amq.topic';
            const queue = 'Category alert';
            const routingKey = 'sign_up_alert';
            
            await channel.assertExchange(exchange, 'topic', {durable: true});
            await channel.assertQueue(queue, {durable: true});
            await channel.bindQueue(queue, exchange, routingKey);
            
            await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
            console.log('Message published');
          } catch(e) {
            console.error('Error in publishing message', e);
          } 
        } catch(err) {
          console.error('Error in connection', err.message);
        } 
      });
      }

  async getIncomeByDate(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let dateFrom = ctx.request.query.dateFrom;
    let dateTo = ctx.request.query.dateTo;
    let limit = ctx.request.query.size ? +ctx.request.query.size : 5;
    let page = ctx.request.query.page ? ctx.request.query.page : 1;
    let offset = ctx.request.query.page ? ctx.request.query.page * limit : 0;
    let familyId = user.data.familyId;
    return new Promise(async (resolve, reject) => {
      return axios
        .get(`${process.env.STASHER_INCOME_SERVICE_URL}/incomes`, {
          params: {
            dateFrom: dateFrom ,
            dateTo:dateTo,
            page:page,
            offset:offset,
            familyId:familyId
          }
        },{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async notify(ctx) { 
    let token = ctx.get("authentication");
    await this.findUserByToken(token).then((response) => {
      return new Promise(async (resolve, reject) => {
        response.categoryName = ctx.params.category;
        return axios
          .post(`${process.env.STASHER_NOTIFICATION_SERVICE_URL}/notification/user`, response, {
            headers: {
              authentication: token 
            }
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(new Error(error.response.data.message));
          });
      });
    });
    
  }

  async deleteNotify(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    let category = ctx.params.category;    
    return new Promise(async (resolve, reject) => {
      return axios
      .delete(`${process.env.STASHER_NOTIFICATION_SERVICE_URL}/notification/category/:category/user/:email`,{
        params: {
          category: category,
          email: user.data.emailAddress
        },
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }


  async getNotifications(ctx) {
    let token = ctx.get("authentication")
    let user = await this.findUserByToken(token);
    return new Promise(async (resolve, reject) => {
      return axios
      .get(`${process.env.STASHER_NOTIFICATION_SERVICE_URL}/notification/user/:email`,{
        params: {
          email: user?.data?.emailAddress
        }
      },{
        headers: {
          authentication: token 
        }}
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async sendMailBalance(ctx) {
    const data = ctx.request.body;
    let token = ctx.get("authentication");

    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_MESSAGE_SERVICE_URL}/mail/balance`, data ,{
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    });
  }

  async getBalance(ctx) { 
    let token = ctx.get("authentication");
    let user = await this.findUserByToken(token);
    let emailAddress = user.data.emailAddress;
    let familyId = user.data.familyId;
    
    let incomeBalance = await this.getIncomeBalance(ctx, token, familyId);
    let expenseBalance = await this.getExpensesBalance(ctx, token, familyId);
    const dataBalance = {"incomes":incomeBalance.data, "expenses": expenseBalance.data};

    let ctxMail = ctx;
    ctxMail.request.body = {"header": "Balance", "recipient": emailAddress,
    "body": "", "data": dataBalance};
    const response = await this.sendMailBalance(ctxMail);
    console.log(response);
    return response;
  }

  async getIncomeBalance(ctx, token, familyId) { 
    let dateFrom = ctx.request.query.dateFrom;
    let dateTo = ctx.request.query.dateTo;
    
    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_INCOME_SERVICE_URL}/incomes/balance`, ctx.request.body, {
          params: {
            dateFrom: dateFrom ,
            dateTo:dateTo,
            familyId:familyId
          },
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    }); 
  }

  async getExpensesBalance(ctx, token, familyId) { 
    let dateFrom = ctx.request.query.dateFrom;
    let dateTo = ctx.request.query.dateTo;

    return new Promise(async (resolve, reject) => {
      return axios
        .post(`${process.env.STASHER_EXPENSE_SERVICE_URL}/expenses/balance`, ctx.request.body, {
          params: {
            dateFrom: dateFrom ,
            dateTo:dateTo,
            familyId:familyId
          },
          headers: {
            authentication: token 
          }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(error.response.data.message));
        });
    }); 
  }

}