require('dotenv/config');
const { resolve } = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const nmhbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const options = {
    viewEngine: expressHandlebars.create({
        extname: '.handlebars',
        viewPath: resolve(__dirname, '..', 'views', 'email'),
        layoutsDir: resolve(__dirname, '..', 'views', 'email'),
        partialsDir: resolve(__dirname, '..', 'views', 'email', 'partials'),
        defaultLayout: 'layout.handlebars'
    }),
    extname: '.handlebars',
    viewPath: resolve(__dirname, '..', 'views', 'email')
};

handlebars.registerHelper('math', (lvalue, operator, rvalue) => {
    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': (lvalue * rvalue).toFixed(2).toString().replace('.', ','),
        '/': lvalue / rvalue,
        '%': lvalue % rvalue
    }[operator];
});

transporter.use('compile', nmhbs(options));

const sendEmail = (message) => {
    transporter.sendMail(message);
};

module.exports = { transporter, sendEmail };
