const jwt = require("jsonwebtoken");
require("dotenv").config();
const RedisRepository = require("../cache/redisRepository");
 

module.exports = class AuthenticationFilter {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.redisRepository = new RedisRepository();
  }


  async authenticateWithOutRole(token) {
    try {
      let decode = decodeJwt(token, this.secret);
      var user;
      let users = await this.userRepository.findAll();
      users.forEach(element => {
        if (element.token == token) {
          user = element
        } });        
        if (decode){
            return user;
        }
        else {
          throw new Error("Log in to use this function")
        }
    } catch (err) {
      throw new Error("Log in to use this function");     
    }
  }

  
async authenticate(token, role) {
  try {
    let decode = decodeJwt(token, this.secret);
    let user = await this.redisRepository.getUser(token);          
      if (decode){
        if (user.role == role) {
          return user;          
        } else {
          throw new Error("User don't allow to do this action")
        }
      }
      else {
        throw new Error("Log in to use this function")
      }
  } catch (err) {
    throw new Error("Log in to use this function");     
  }
}

async saveAuthentication(ctx,next) {
  try {
    let data= ctx.request.body;
    let token = data.token;
    await this.redisRepository.saveUser(token,data);
  } catch (err) {
    throw new Error("error ocurred");     
  }
}

async auth(ctx,next) {
  try {
    let data= ctx.request.body 
    let token = ctx.get("authentication")
    let decode = decodeJwt(token, this.secret);
    var user = await this.redisRepository.getUser(token);
      if (decode && user){
        if ((user.role == "administrator" && data.request.method == "POST") ||
            (user.role == "administrator" && data.request.method == "PUT") || 
            (user.role == "administrator" && data.request.url == "/api/key")  ||
            (user.role == "administrator" && data.request.method == "DELETE") ||
            (user.role == "administrator" ||user.role == "member" && data.request.url != "/api/key" && data.request.method == "GET")) {
             return token;       
        } else {
          throw new Error("User don't allow to do this action")
        }
      }
      else {
        throw new Error("Log in to use this function")
      }
  } catch (err) {
    throw new Error(err.message);     
  }
  
}


}

function decodeJwt(token, secret) {
  if (token == "") {
    throw new Error("Log in to use this function");
  } else {
    return jwt.verify(token, secret);
  }
}