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

    async getUser(token){ 
        return JSON.parse(await this.client.get(token)) 
    }

    async saveUser(token,user){
      await this.client.set(token,JSON.stringify(user));
    }

    async removeUser(token){
      await this.client.del(token)
    }

}