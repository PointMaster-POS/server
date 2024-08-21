//get loyality program of the business

const express = require('express');
const loyaltyRouter = express.Router();
const {getLoyalityProgram} = require('../controllers/loyalty');
const verifyCashier = require('../middleware/verifyCashier');
const {businessAccess, branchAccess} = require('../middleware/businessAccess');

//get looyalty program details of the business 
//this route should be protected by the auth middleware cashier should be authenticated
loyaltyRouter.get('/',verifyCashier, branchAccess, businessAccess,getLoyalityProgram);

module.exports = loyaltyRouter;