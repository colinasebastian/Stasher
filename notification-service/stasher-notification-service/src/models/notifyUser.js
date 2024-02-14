const Sequelize = require("sequelize");

const NotifyUser = (schema, types) => {
    return schema.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        categoryName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
};

module.exports = NotifyUser;
