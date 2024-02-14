
const mysql = require('mysql2/promise');
const TransactionModel = require('../models/transaction');
const  Sequelize  = require('sequelize');
require("dotenv").config();

module.exports = class Repository {
    constructor() {
        this.connection = null;
    }
    static async connect() {
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
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME);
    }


    static async loadModels() {
        const Transaction = TransactionModel(this.connection, Sequelize);
        module.exports.Transaction = Transaction;
        Transaction.belongsTo(Transaction);    
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