const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        console.log({token : token});
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'User is not Authorized' });
            } else {

                console.log({deco :decoded});
                if(err) {
                    res.status(401).json({message: 'User is not Authorized'});

                }
                req.customer = decoded.customer;
                next();
            }
        });

    }

});

module.exports = validateToken;