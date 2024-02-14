const Sequelize = require("sequelize");

const Family = (schema, types) => {
    return schema.define('family', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg:'Enter a family name'
                }
            }
        },
        apiKey: {
            type: Sequelize.STRING,
            unique: true
        },
        linkGuid:{
            type: Sequelize.STRING,
            unique: true
        }
    });
};

module.exports = Family;
