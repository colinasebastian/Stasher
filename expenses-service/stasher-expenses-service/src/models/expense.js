const Sequelize = require("sequelize");

const Expense = (schema, types) => {
    return schema.define('expense', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter the amount of the expense'
                }
            }
        },
        producedDate: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter the produced date of the expense'
                }
            }
        },
        registrationDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter the description of the expense'
                }
            }
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        familyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
};
module.exports = Expense;