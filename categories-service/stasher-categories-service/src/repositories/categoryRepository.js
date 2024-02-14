const Repository = require('./repository');
var List = require("collections/list");

module.exports = class CategoryRepository {

    constructor() {
        this.categoryRepository = Repository.Category;

    }

    async add(data, familyId) {
        try {
            let existing = await this.categoryRepository.findOne({ where: { name: data.name, familyId: familyId, active:true } });
            if (existing == null) {
                data.familyId = familyId;
                data.active =true;
                let category = await this.categoryRepository.create(data);
                return category;
            } else {
                throw new Error("There is already a category with that name");
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(data, Id, familyId) {
        try {
            let existingCategoryByName = await this.categoryRepository.findOne({ where: { name: data.name, familyId: familyId,active:true} });
            let existingCategoryInMyFamily = await this.categoryRepository.findOne({ where: { familyId: familyId, id: Id,active:true } });
            if (existingCategoryInMyFamily != null) {
                if (existingCategoryByName != null && Id == existingCategoryByName.id || existingCategoryByName == null) {
                    await this.categoryRepository.update(
                        {
                            name: data.name,
                            description: data.description,
                            image: data.image,
                            limitPerMonthExpense: data.limitPerMonthExpense
                        },
                        {
                            where: { id: Id },
                        }
                    );
                    return await this.categoryRepository.findOne({ where: { id: Id } });
                } else {
                    throw new Error("you cannot update this category with this name since there is another category associated with that name");
                }
            } else {
                throw new Error("you cannot update this category because it does not belong to your family");
            }

        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(Id) {
        try {
            let category = await this.categoryRepository.findOne({ where: { id: Id, active:true } })
            if(category){
            await this.categoryRepository.update(
                {
                    active: false
                },
                {
                    where: { id: Id },
            });
            }else{
                throw new Error("The category to be deleted does not exist or has already been deleted")
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getById(Id) {
        return await this.categoryRepository.findOne({ where: { id: Id } });
    }

    async getByFamily(pagination, familyId) {
        var categories = new List();
        const limit = parseInt(pagination.limit);
        const offset = parseInt(pagination.offset);
        const page = parseInt(pagination.page);
        let dataCategories = await this.categoryRepository.findAndCountAll({ where: { familyId: familyId, active:true }, limit, offset });
        dataCategories.rows.forEach(category => {
            categories.push(category);
        });
        const totalItems = dataCategories.count;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, categories, totalPages, currentPage };
    }

    async getByFamilyAndName(name, familyId) {
        return await this.categoryRepository.findOne({ where: { familyId: familyId, name: name, active:true } });
    }

    async getAll() {
        return await this.categoryRepository.findAll();
    }

    async increaseQtyExpenses(id,data) {  
        try {
            var date = new Date()
            var lastDay = 31;
            var month=date.getMonth()+1;
            var day = date.getDay()
            if (month == 1 || month == 3 || month == 5  || month == 7 || month == 8 || month == 10 || month == 12){
            lastDay=31
            }
            else if (month == 2){
                lastDay=28
            }
            else{
                lastDay=30
            }
            let category = await this.categoryRepository.findOne({ where: { id: id } });
            if (day!=lastDay){
                await this.categoryRepository.update(
                {
                    qtyExpenses: category.qtyExpenses +data.amount
                },
                {
                    where: { id: id },
                });
          
            }
            else{
                await this.categoryRepository.update(
                    {
                        qtyExpenses: data.amount
                    },
                    {
                        where: { id: id },
                    });
            }
            return await this.categoryRepository.findOne({ where: { id: id } });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getTopThree(family) {
        try {
            let categories = await this.categoryRepository.findAll();
            let topThreeCategory = new List();
            var counts = {};
            if (family != null) {
                if (categories) {
                    categories.forEach(category => {
                        if (category.familyId == family.id && category.active==true)
                            if (category.qtyExpenses != null) {
                                counts[category.id] = category.qtyExpenses;
                            }
                    });

                    var items = Object.keys(counts).map(function (keey) {
                        return [keey, counts[keey]];
                    });
                    items.sort(function (first, second) {
                        return second[1] - first[1];
                    });
                    if (items.length > 0) {
                        if (items[0][0] != null) {
                            var cat1 = await this.categoryRepository.findOne({ where: { id: items[0][0] } });
                            if (cat1 != null) {
                                topThreeCategory.push(cat1.name);
                            }
                        }
                    }
                    if (items.length > 1) {
                        if (items[1][0] != null) {
                            var cat2 = await this.categoryRepository.findOne({ where: { id: items[1][0] } });
                            if (cat2 != null) {
                                topThreeCategory.push(cat2.name);
                            }
                        }
                    }
                    if (items.length > 2) {
                        if (items[2][0] != null) {
                            var cat3 = await this.categoryRepository.findOne({ where: { id: items[2][0] } });
                            if (cat3 != null) {
                                topThreeCategory.push(cat3.name);
                            }
                        }
                    }
                    return topThreeCategory;
                }
                else {
                    return null;
                }
            } else {
                throw new Error("The family api key does not exist");
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }


}