require('dotenv/config');

module.exports = {
    host: process.env.HOST,
    dialect: process.env.DATABASE_DIALECT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    logQueryParameters: false,
    logging: false,
    define: {
        underscored: true,
        timestamps: true
    }
};
