const { resolve } = require('path');
const mailService = require('../../config/mailConfig');

const OrderModel = require('../models/Order');
const UserModel = require('../models/User');
const CartModel = require('../collections/cart');

const Avatar = require('../models/Avatar');

const createOrder = async (req, res) => {
    const solicitorId = req.id;

    if (!solicitorId) {
        return res.status(404).json({ Error: 'User id not provided' });
    }

    const solicitor = await UserModel.findOne({
        where: { id: solicitorId }
    });

    if (!solicitor) {
        return res.status(401).json({ Error: 'User not found' });
    }

    const pendingOrder = await CartModel.findOne({
        user_id: solicitorId,
        finished: false
    });

    if (pendingOrder) {
        return res
            .status(401)
            .json({ Error: 'You cannot have more than one pending order' });
    }

    const newOrder = await OrderModel.create({ user_id: solicitorId });

    req.body.user_id = solicitorId;

    const newCart = await CartModel.create(req.body);

    newCart.save((err) => {
        if (err) {
            console.log(err);
        }
    });

    const userAvatar = await Avatar.findOne({
        where: { id: solicitor.avatar_id }
    });

    const avatarFileName = userAvatar.dataValues.file_path;

    const message = {
        from: 'pacchi@mail.com',
        to: 'a3ef7d5939-cf0672@inbox.mailtrap.io',
        subject: 'Você tem um novo pedido!',
        text: newCart.toString(),
        template: 'layout',
        attachments: [
            {
                filename: avatarFileName,
                path: `http://localhost:3000/tmp/uploads/${avatarFileName}`,
                cid: '@avatar'
            }
        ],
        context: {
            username: solicitor.username,
            useremail: solicitor.email,
            products: newCart.products,
            phone: solicitor.phone ? solicitor.phone : 'Telefone não informado'
        }
    };

    mailService.sendEmail(message);

    return res.json({ newOrder, newCart });
};

const getOrder = async (req, res) => {
    const orderOwner = await UserModel.findOne({
        where: { id: req.params.id }
    });

    if (!orderOwner) {
        return res.status(404).json({ Error: 'User not found' });
    }

    const order = await CartModel.findOne({ user_id: orderOwner.id });

    if (!order) {
        return res.status(404).json({ Error: "There's no order to show" });
    }

    return res.json(order);
};

const listOrders = async (req, res) => {
    const pendingOrders = await CartModel.find({ finished: false });

    if (pendingOrders.length === 0) {
        return res.status(202).json({ Message: "There's no pending orders" });
    }

    return res.json(pendingOrders);
};

const toggleOrder = async (req, res) => {
    const orderOwner = await UserModel.findOne({
        where: { id: req.params.id }
    });

    const { username } = orderOwner;

    if (!orderOwner) {
        return res.status(404).json({ Error: 'User not found' });
    }

    const order = await CartModel.findOne(
        { user_id: orderOwner.id },
        { finished: false }
    );

    const { products, total, payment_method } = order;

    if (!order) {
        return res.status(404).json({ Error: "There's no order to change" });
    }

    await CartModel.findOneAndUpdate(
        { user_id: orderOwner.id },
        { finished: !order.finished }
    );

    return res.json({
        username,
        products,
        total,
        payment_method
    });
};

module.exports = { createOrder, getOrder, listOrders, toggleOrder };
