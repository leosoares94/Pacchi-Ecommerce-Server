const { Sequelize, DataTypes } = require('sequelize');

const databaseConfig = require('../../config/database');
const User = require('./User');

const connection = new Sequelize(databaseConfig);

const Order = connection.define('Order', {
    user_id: DataTypes.INTEGER
});

Order.hasOne(User, { foreignKey: 'id', as: 'solicitor_id' });

module.exports = Order;
