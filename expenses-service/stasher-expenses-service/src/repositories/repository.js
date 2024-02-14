
const mysql = require('mysql2/promise');
const ExpenseModel = require('../models/expense');
const  Sequelize  = require('sequelize');
require("dotenv").config();

module.exports = class Repository {
    constructor() {
        this.connection = null;
    }
    static async connect() {
        var connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME);
        this.connection = await new Sequelize({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        var connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }


    static async loadModels() {
        const Expense = ExpenseModel(this.connection, Sequelize);
        module.exports.Expense = Expense;
        Expense.belongsTo(Expense);    
        return this.connection.sync();
    }

    static async initRepository() {
        try {
            await this.connect();
            await this.loadModels();
        } catch (err) {
            console.log(`Error trying to connect to database: ${err}`);
            throw err;
        }
    }
}