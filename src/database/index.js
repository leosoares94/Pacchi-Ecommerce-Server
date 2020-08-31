require('dotenv/config');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');

const uri = process.env.MONGO_URI;

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDB connected successfully');
    });

const User = require('../api/models/User');
const Product = require('../api/models/Product');
const Order = require('../api/models/Order');
const Avatar = require('../api/models/Avatar');

const models = [User, Product, Order, Avatar];

models.map((model) => model.sync());

const server = new Sequelize(databaseConfig);

server.authenticate().then(() => {
    console.log('Sequelize ORM is ready');
});

module.exports = server;
