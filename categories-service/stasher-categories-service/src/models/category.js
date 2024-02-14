const Sequelize = require("sequelize");

const Category = (schema, types) => {
    return schema.define('category', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter category name'
                }
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter category description'
                }
            }
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false
        },
        limitPerMonthExpense: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qtyExpenses: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        familyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
};
module.exports = Category;