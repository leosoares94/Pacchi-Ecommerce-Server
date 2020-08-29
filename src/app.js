const express = require('express');

const routes = require('./routes');
const { resolve } = require('path');

const app = express();

app.use(express.json());
app.use(express.static(resolve(__dirname, 'public')));
app.use(routes);

app.set('view engine', 'handlebars');

module.exports = app;
