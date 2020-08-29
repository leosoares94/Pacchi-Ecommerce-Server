const { Router } = require('express');

const UserController = require('./api/controllers/User');
const ProductController = require('./api/controllers/Product');
const OrderController = require('./api/controllers/Order');
const FileController = require('./api/controllers/File');

const AuthMiddleware = require('./api/middlewares/authentication');
const AvatarMiddleware = require('./api/middlewares/upload');

const routes = new Router();

routes.post('/signup', UserController.signUp);
routes.post('/signin', UserController.signIn);
routes.put('/user', AuthMiddleware.authenticate, UserController.update);
routes.delete('/user/:id', AuthMiddleware.authenticate, UserController.remove);

routes.post(
    '/user/upload',
    AuthMiddleware.authenticate,
    AvatarMiddleware.single('avatar'),
    FileController.addAvatar
);

routes.post(
    '/products',
    AuthMiddleware.authenticate,
    ProductController.insertProduct
);

routes.get('/products', ProductController.listAllAvailableProducts);
routes.get('/products/:type', ProductController.filterProductsByType);
routes.put(
    '/products/:product_code',
    AuthMiddleware.authenticate,
    ProductController.editProduct
);
routes.delete(
    '/products/:product_code',
    AuthMiddleware.authenticate,
    ProductController.removeProduct
);

routes.post('/order', AuthMiddleware.authenticate, OrderController.createOrder);
routes.get('/orders', OrderController.listOrders);
routes.get('/order/:id', OrderController.getOrder);
routes.put('/order/:id', OrderController.toggleOrder);

module.exports = routes;
