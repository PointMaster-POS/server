//get customer from the phone number
//get current customer points
//check elegibility of the customer redeem points

const express = require('express'); 
const customerRouter = express.Router();
const verifyCashier = require('../middleware/verifyCashier');

const {getCustomer, 
   // getCustomerPoints,
   // checkElegibility, 
    } = require('../controllers/customer');

//this update customer points should implement at customer service using a middleware need to implement

customerRouter.get('/:phone', verifyCashier, getCustomer);
// customerRouter.get('/:phone/points', getCustomerPoints); //should call to the customer service
// customerRouter.get('/:phone/redeem', checkElegibility); 

module.exports = customerRouter;