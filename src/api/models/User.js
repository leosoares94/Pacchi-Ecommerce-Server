const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const databaseConfig = require('../../config/database');

const Avatar = require('../models/Avatar');

const connection = new Sequelize(databaseConfig);

const User = connection.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    raw_password: DataTypes.VIRTUAL,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    avatar_id: DataTypes.INTEGER
});

User.addHook('beforeSave', async (user) => {
    user.password = await bcrypt.hash(user.raw_password, 10);
});

User.hasOne(Avatar, { foreignKey: 'id', as: 'avatar' });

module.exports = User;
