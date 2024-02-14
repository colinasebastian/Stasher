const Sequelize = require("sequelize");

const Income = (schema, types) => {
    return schema.define('income', {
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
                    msg: 'Enter the amount of the income'
                }
            }
        },
        producedDate: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter the produced date of the income'
                }
            }
        },
        registrationDate: {
            type: Sequelize.DATE,
            allowNull: false
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
module.exports = Income;