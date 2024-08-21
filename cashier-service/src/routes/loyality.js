//get loyality program of the business

const express = require('express');
const loyalityRouter = express.Router();


//get looyalty program details of the business 
//this route should be protected by the auth middleware cashier should be authenticated
loyalityRouter.get('/loyality', getLoyalityProgram);

module.exports = loyalityRouter;