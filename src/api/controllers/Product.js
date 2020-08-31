const { Op } = require('sequelize');
const Joi = require('@hapi/joi');
const ProductModel = require('../models/Product');
const UserModel = require('../models/User');

const insertProduct = async (req, res) => {
    const productEntry = req.body;

    const schema = Joi.object({
        name: Joi.string().min(5).max(30).required(),
        description: Joi.string().min(8),
        amount: Joi.string().required(),
        stock: Joi.number(),
        type: Joi.string().required(),
        color: Joi.string(),
        model: Joi.string(),
        brand: Joi.string().required(),
        product_code: Joi.number().required(),
        price: Joi.number().required()
    });

    try {
        await schema.validateAsync(productEntry);
    } catch (err) {
        return res.status(401).json(err);
    }

    const isAdmin = await UserModel.findOne({
        where: { id: req.id, admin: true }
    });

    if (!isAdmin) {
        return res.status(401).json({
            Error: 'Only an administrator can insert products in database'
        });
    }

    const productExists = await ProductModel.findOne({
        where: { product_code: productEntry.product_code }
    });

    const newProduct = await ProductModel.create(productEntry).catch((err) => {
        console.log(err);
    });

    return res.json(newProduct);
};

const listAllAvailableProducts = async (req, res) => {
    const products = await ProductModel.findAll({
        where: {
            stock: { [Op.gt]: 0 }
        },
        attributes: [
            'id',
            'name',
            'description',
            'amount',
            'stock',
            'type',
            'color',
            'model',
            'brand',
            'product_code',
            'price'
        ]
    });

    if (products.length === 0) {
        return res.status(404).json({ Error: "There's not products to show" });
    }

    return res.json(products);
};

const filterProductsByType = async (req, res) => {
    const productType = req.params.type;

    const products = await ProductModel.findAll({
        where: {
            type: productType
        }
    });

    if (products.length === 0) {
        return res
            .status(404)
            .json({ Error: "There's not products of this category to show" });
    }

    return res.json(products);
};

const editProduct = async (req, res) => {
    const { product_code } = req.params;
    const productNewData = req.body;

    const schema = Joi.object({
        name: Joi.string().min(5).max(30),
        description: Joi.string().min(8),
        amount: Joi.string(),
        stock: Joi.number(),
        type: Joi.string(),
        color: Joi.string(),
        model: Joi.string(),
        brand: Joi.string(),
        product_code: Joi.number(),
        price: Joi.number()
    });

    try {
        await schema.validateAsync(productNewData);
    } catch (err) {
        return res.status(401).json(err);
    }

    const isAdmin = await UserModel.findOne({
        where: {
            id: req.id,
            admin: true
        }
    });

    if (!isAdmin) {
        return res
            .status(401)
            .json({ Error: 'Only an administrator can edit products' });
    }

    const product = await ProductModel.findOne({
        where: {
            product_code
        }
    });

    if (!product) {
        return res
            .status(404)
            .json({ Error: "There's not a product with this product code " });
    }

    try {
        await ProductModel.update(productNewData, {
            returning: true,
            where: {
                product_code
            }
        }).then(([rowsUpdate, [updatedProduct]]) => res.json(updatedProduct));
    } catch (err) {
        return res.json(err);
    }
};

const removeProduct = async (req, res) => {
    const { product_code } = req.params;

    const isAdmin = await UserModel.findOne({
        where: {
            id: req.id,
            admin: true
        }
    });

    if (!isAdmin) {
        return res
            .status(401)
            .json({ Error: 'Only an administrator can delete products' });
    }

    const productToRemove = await ProductModel.findOne({
        where: { product_code }
    });

    if (!productToRemove) {
        return res.status(400).json({
            Error:
                'This product does not exist, check the provided product code'
        });
    }
    await ProductModel.destroy({
        where: {
            product_code
        }
    });

    return res.json({
        message: 'The following product has been removed from the database:',
        productToRemove
    });
};

module.exports = {
    insertProduct,
    listAllAvailableProducts,
    filterProductsByType,
    editProduct,
    removeProduct
};
