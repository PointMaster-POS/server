const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, 'panadura', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'User is not Authorized' });
            } else {
                console.log(decoded);
                next();
            }
        });

    }

});

module.exports = validateTokenHandler;