const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const UserModel = require('../models/User');

const signUp = async (req, res) => {
    const userEntry = req.body;

    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        raw_password: Joi.string().min(6).max(20).required(),
        admin: Joi.boolean(),
        confirm_password: Joi.any().valid(Joi.ref('raw_password')).required()
    });

    try {
        await schema.validateAsync(userEntry);
    } catch (err) {
        return res.status(401).json(err);
    }

    const userExists = await UserModel.findOne({
        where: { email: userEntry.email }
    });

    if (userExists) {
        return res
            .status(401)
            .json({ Error: 'This email is already registered' });
    }

    const { id, username, email, admin } = await UserModel.create(userEntry);

    return res.status(201).json({
        message: 'User created successfully!',
        id,
        username,
        email,
        admin
    });
};

const signIn = async (req, res) => {
    const userEntry = req.body;

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required()
    });

    try {
        await schema.validateAsync(userEntry);
    } catch (err) {
        return res.status(401).json(err);
    }

    const user = await UserModel.findOne({
        where: { email: userEntry.email }
    });

    if (!user) {
        return res
            .status(400)
            .json({ Error: "There's no user with this email" });
    }

    const passMatch = await bcrypt.compare(userEntry.password, user.password);

    if (!passMatch) {
        return res.status(401).json({ Error: 'Wrong password' });
    }

    const { id, username, email, admin } = user;

    return res.json({
        id,
        username,
        email,
        admin,
        token: jwt.sign({ id: user.id }, '339af4f96fd3e55a8917d40b84aaf9a1', {
            expiresIn: '4d'
        })
    });
};

const update = async (req, res) => {
    const userNewData = req.body;

    const schema = Joi.object({
        username: Joi.string().min(3).max(20),
        email: Joi.string().email(),
        password: Joi.string().min(6).max(20),
        phone: Joi.string().max(20)
    });

    try {
        await schema.validateAsync(userNewData);
    } catch (err) {
        return res.status(401).json(err);
    }

    const user = await UserModel.findOne({ where: { id: req.id } });

    if (!user) {
        return res.status(401).json({
            Error: 'You can only update your own information'
        });
    }

    try {
        await UserModel.update(userNewData, {
            returning: true,
            where: { id: req.id }
        }).then(([rowsUpdate, [updatedUser]]) => {
            const { id, username, email, admin, phone } = updatedUser;
            return res.status(202).json({
                message: 'The following user has been updated to:',
                id,
                username,
                email,
                admin,
                phone
            });
        });
    } catch (err) {
        console.log(err);
    }
};

const remove = async (req, res) => {
    const id = req.params.id;
    const { email } = req.body;

    const isAdmin = await UserModel.findOne({
        where: {
            id,
            admin: true
        }
    });

    if (!isAdmin) {
        return res
            .status(401)
            .json({ Error: 'Only an administrator can delete users' });
    }

    const userToDelete = await UserModel.findOne({ where: { id, email } });

    if (!userToDelete) {
        return res.status(400).json({
            Error: 'This user does not exist, check the provided id or email'
        });
    }

    const { username, admin } = userToDelete;

    await UserModel.destroy({
        where: {
            id,
            email
        }
    });

    return res.json({
        message: 'The following user has been removed from the database:',
        id,
        username,
        email,
        admin
    });
};

module.exports = { signUp, signIn, update, remove };
