const express = require("express");
const billsRouter = express.Router();


//this should return all the bills for a customer with bill id, business name, time, Total Ammount
billsRouter.route("/:customerId").get(getAllBillsByCustomerId);

//this should return a bill with bill id, business name, time, Total Ammount
billsRouter.route("/:billID").get(getBillByID);