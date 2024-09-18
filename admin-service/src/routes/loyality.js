const loyalityRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createLoyality, getLoyality, updateLoyality, deleteLoyality } = require('../controllers/loyality');

//business id is in the token if owner is creating loyality
loyalityRouter.post('/', validateToken, createLoyality);
loyalityRouter.get('/', validateToken, getLoyality);
loyalityRouter.put('/', validateToken, updateLoyality);
loyalityRouter.delete('/', validateToken, deleteLoyality);


module.exports = loyalityRouter;