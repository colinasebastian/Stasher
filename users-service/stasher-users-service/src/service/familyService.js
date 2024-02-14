const FamilyRepository = require("../repositories/familyRepository");


module.exports = class FamilyService {

    constructor() {
        this.familyRepository =  new FamilyRepository();
    }

    async findFamilyById(id){
        return await this.familyRepository.findFamilyById(id);
    }

    async findFamilyByKey(key){
        return await this.familyRepository.findFamilyByKey(key);
    }
    
    async update(id){
        await this.familyRepository.update(id)
    }
    
    async correctApiKey(key){
        return await this.familyRepository.validApiKey(key)
    }

    async getById(id){
        return await this.familyRepository.findFamilyById(id)
    }

    async getAll(){
        return await this.familyRepository.getAll()
    }
}