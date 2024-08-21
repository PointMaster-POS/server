//get customer from the phone number
//get current customer points
//check elegibility of the customer redeem points

const express = require('express'); 
const customerRouter = express.Router();

const {getCustomer, getCustomerPoints, checkElegibility, } = require('../controllers/customer');

//this update customer points should implement at customer service using a middleware need to implement

customerRouter.get('/customer/:phone', getCustomer);
customerRouter.get('/customer/:phone/points', getCustomerPoints); //should call to the customer service
customerRouter.get('/customer/:phone/redeem', checkElegibility); 

module.exports = customerRouter;