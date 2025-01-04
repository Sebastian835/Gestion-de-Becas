const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
    const token = req.cookies.authIstlaBecas; 

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
