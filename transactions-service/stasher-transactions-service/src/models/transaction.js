const Sequelize = require("sequelize");

const Transaction = (schema, types) => {
    return schema.define('transaction', {
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
                    msg: 'Enter transaction name'
                }
            }
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter the amount of the transaction'
                }
            }
        },
        runDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER,
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
        repeatDays: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
};
module.exports = Transaction;