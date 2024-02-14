const Sequelize = require("sequelize");

const User = (schema, types) => {
    return schema.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter a user name'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {    
                args: true,    
                msg: 'That user email already exist in the system',
            },
            validate: {
                isEmail: {
                    msg: 'Invalid user email'
                },
                notEmpty: {
                    msg: 'Enter a user email'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING,
            unique: true
        },
        role: {
            type: Sequelize.ENUM(
                { values: ['administrator', 'member'] }),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Enter a user role'
                }
            }
        }
    });
};

module.exports = User;
