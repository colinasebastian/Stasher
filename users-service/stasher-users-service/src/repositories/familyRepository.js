const Repository = require('./repository');
const generateApiKey  = require('generate-api-key');
module.exports = class FamilyRepository {

    constructor() {
        this.familyRepository = Repository.Family;
    }

    async add(data) {
        try {
            let family = await this.familyRepository.create(data);
            return family;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getAll() {
      try {
          return await this.familyRepository.findAll();
        } catch (err) {
          throw new Error(err.message)
      }
  }

    async findFamilyById(id) {
        try {
          return await this.familyRepository.findOne({where:{id:id}});
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async findFamilyByName(name) {
      try {
        return await this.familyRepository.findOne({where:{name:name}});
      } catch (err) {
          throw new Error(err.message)
      }
   }
    async findFamilyByGuid(guid) {
      try {
        return await this.familyRepository.findOne({where:{linkGuid:guid}});
      } catch (err) {
          throw new Error(err.message)
      }
  }

  async findFamilyByKey(key) {
    try {
      return await this.familyRepository.findOne({where:{apiKey:key}});
    } catch (err) {
        throw new Error(err.message)
    }
  }

  async validApiKey(key) {
    try {   
      return this.findFamilyByKey(key)!=null
    } catch (err) {
        throw new Error(err.message)
    }
  }

    async update(Id){
      try {
        await this.familyRepository.update(
            {
              apiKey: generateApiKey.generateApiKey(),
            },
            {
              where: { id: Id },
            }
          );
        } catch (err) {
          throw new Error(err.message)
      }
    }


}