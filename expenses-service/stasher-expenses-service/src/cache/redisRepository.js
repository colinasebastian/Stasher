const redis = require('redis');
require("dotenv").config();

module.exports = class RedisRepository {
 constructor(){
    this.client= redis.createClient({url: 'redis://'+process.env.REDIS_HOST+':'+process.env.REDIS_PORT}); 
    this.client.on('error', (err) => console.log('Redis Client Error', err))   ;   
      this.client.connect();     
  }

     async connect()  {     
      this.client = await redis.createClient({url: 'redis://'+process.env.REDIS_HOST+':'+process.env.REDIS_PORT}); 
      this.client.on('error', (err) => console.log('Redis Client Error', err))   ;   
       await this.client.connect();     
     
    }

    async updateTopThree(categories,key){
        this.client.set(key,JSON.stringify(categories));  
    }

    async updateExpenses(category,key){
      var keyredis = category+key;
      this.client.del(keyredis);      
    }

    async getTopThree(key){    
      return JSON.parse(await this.client.get(key));      
    }

    async getExpensesByCategory(category,key){ 
       var keyredis = category+key;
      return JSON.parse(await this.client.get(keyredis)) 
    }

    async saveExpensesByCategory(category,key,expenses){
       var keyredis = category+key;
      await this.client.set(keyredis,JSON.stringify(expenses));
    }
}