require('dotenv/config');
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ Error: 'Token not provided' });
    }

    jwt.verify(token, process.env.AUTH_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: err.message });
        }
        const userId = decoded.id;
        req.id = userId;

        return next();
    });
};

module.exports = { authenticate };
