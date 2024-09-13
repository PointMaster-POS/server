//post a bill

const express = require('express');
const billRouter = express.Router();
const {newBill} = require('../controllers/bill');


//bill router to post a bill
//there are several middlewares that can be added to this route
//(1)authMiddleware
//(2) redeem points middleware
//(3) update customer loyality points if not redeem
//(3) then add the bill to the database

billRouter.post('/bill', newBill);

//get all items in bill by bill id
billRouter.get('/bill/:billId', getBillItems);
module.exports = billRouter;
