const express = require('express');
const loyalityRouter = express.Router();

const {  getLoyalityPointsByBusinessID , redeemLoyalityPointsAtShop } = require('../controllers/loyality');

//this should return all the loyality points of a customer for a business
loyalityRouter.route("/:businessID").get(getLoyalityPointsByBusinessID);

//this should redeem loyality points of a customer for business , when customer at the shop and wants to redeem points
//this process will be done at the cashier so the cashier will enter the customer id and business id and the points to be redeemed
//should be call from customer service
loyalityRouter.route("/redeem/:customerID/:businessID").post(redeemLoyalityPointsAtShop);

//this should return all the loyality points of a customer , should be called from cashier or manager
loyalityRouter.get('/:customerID', getLoyalityPointsByCustomerID);

module.exports = loyalityRouter;