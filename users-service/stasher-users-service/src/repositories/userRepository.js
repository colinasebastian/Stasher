const Repository = require('./repository');
const md5 = require("md5");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateApiKey = require('generate-api-key');
const FamilyRepository = require('../repositories/familyRepository');
const {
  v1: uuidv1
} = require('uuid');


module.exports = class UserRepository {

  constructor() {
    this.userRepository = Repository.User;
    this.familyRepository = new FamilyRepository()
    this.relations = 'family'
  }

  async findByToken(token){
    try {
      return await this.userRepository.findOne({ where: { token: token }});   
    }
    catch (err) {
      throw new Error("User not login in the system")
    }
  }

  async addAdministrator(data) {
      try {
          let familyexist = await this.familyRepository.findFamilyByName(data.family.name);    
          data.role = "administrator";
          data.password = md5(data.password);
          data.family.apiKey = generateApiKey.generateApiKey()
          data.family.linkGuid = uuidv1();
          if(familyexist==null){
              let existing = await this.userRepository.findOne({ where: { emailAddress: data.emailAddress }});            
              if (existing == null) {
                let administrator = await this.userRepository.create(data, { include: this.relations });
                return administrator;
              } else {
              throw new Error("That administrator already exists");
              }
          }
          else {
            throw new Error("That family already exists");
          }
      } catch (err) {
          throw new Error(err.message)
      }
  }
  

  async addUser(data, guid) {
    try {
      data.password = md5(data.password);
      let family = await this.familyRepository.findFamilyByGuid(guid);
      if (family != null) {
        data.familyId = family.id;
        let existing = await this.userRepository.findOne({ where: { emailAddress: data.emailAddress } });
        if (existing == null) {
          let administrator = await this.userRepository.create(data, { include: this.relations });
          return administrator;
        } else {
          throw new Error("That user already exists");
        }
      }
      else {
        throw new Error("Key does not exist");
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async login(data) {
    try {
      if (data.password != "" && data.emailAddress != "") {
        let password = md5(data.password);
        var user = await this.userRepository.findOne({where:{emailAddress:data.emailAddress, password: password}});
        if (user) {
          var role = user.role;
          const token = jwt.sign(
            {
              name: user.name,
              id: user.id,
              emailAddress: user.emailAddress,
              role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
          );
          await this.userRepository.update(
          {
            token: token,
          },
          {
            where: {
              emailAddress: user.emailAddress,
              password: user.password
            },
          })
          return await this.userRepository.findOne({attributes: ['token','role'],where:{emailAddress:data.emailAddress, password: password}});
        }
        else {
          throw new Error("User not registered in the system")
        }
      } else {
        throw new Error("Password and email cannot be empty")
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateApiKey(token) {
    try {
      let user = await this.userRepository.findOne({where:{token:token}});
      if(user){
        var Id = user.familyId
        await this.familyRepository.update(Id);
        return user
      } else {
        throw new Error("Log in to use this function");   
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getApiKey(token) {
    try {
      let user = await this.userRepository.findOne({where:{token:token}});
      if(user){
        var Id = user.familyId
        let family = await this.familyRepository.findFamilyById(Id);
        if (family){
         return family.apiKey;
        } else {
          throw new Error("Family does not exist");   
        }     
      } else {
        throw new Error("Log in to use this function");   
      }      
    } catch (error) {
      throw new Error(error.message);
    }
  }

}