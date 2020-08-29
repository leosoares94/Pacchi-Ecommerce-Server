require('dotenv/config');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = require('../api/models/User');
const Product = require('../api/models/Product');
const Order = require('../api/models/Order');
const Avatar = require('../api/models/Avatar');

const models = [User, Product, Order, Avatar];

models.map((model) => model.sync());

const server = new Sequelize(databaseConfig);

server.authenticate();

module.exports = server;
