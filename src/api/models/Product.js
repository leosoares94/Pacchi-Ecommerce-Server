const { Sequelize, DataTypes } = require('sequelize');

const databaseConfig = require('../../config/database');

const connection = new Sequelize(databaseConfig);

const Product = connection.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    amount: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    type: DataTypes.STRING,
    color: DataTypes.STRING,
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    product_code: DataTypes.BIGINT,
    price: DataTypes.DECIMAL(10, 2)
});

module.exports = Product;
