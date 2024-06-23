// index.js
const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize(
    'acquaint_practical',
    'root',
    'Pratik@12',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging:false
    }
);

connection.authenticate()
    .then(() => {
        console.log('Connection established with database');
    })
    .catch((err) => {
        console.log('Database connection error', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.connection = connection;

db.auth = require('./auth')(connection,DataTypes)
db.product = require('./product')(connection,DataTypes)
db.connection.sync({ force: false })

module.exports = db;
