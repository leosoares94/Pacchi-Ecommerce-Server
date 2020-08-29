const mongoose = require('mongoose');
const { Double } = require('mongodb');

const schema = new mongoose.Schema({
    user_id: Number,
    products: Array,
    total: Number,
    payment_method: String,
    finished: Boolean
});

const Model = mongoose.model('Cart', schema, 'cart');

module.exports = Model;
