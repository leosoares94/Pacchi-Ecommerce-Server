const { Sequelize, DataTypes } = require('sequelize');

const databaseConfig = require('../../config/database');

const connection = new Sequelize(databaseConfig);

const Avatar = connection.define('Avatar', {
    file_path: DataTypes.STRING
});

module.exports = Avatar;
