const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const billsRouter = express.Router();
const {
  getAllBillsByCustomerId,
  getBillByID,
  getAllBillsByBusinessID,
} = require("../controllers/bills");

//this should return all the bills for a customer with bill id, business name, time, Total Ammount
//protected route
billsRouter.get("/", validateToken, getAllBillsByCustomerId);

//this should return a bill with bill id, business name, time, Total Ammount
//protected route
billsRouter.get("/:billID", validateToken, getBillByID);

//this should retuen all the bills related to a business bill id , business name , time , total ammount
//customer id will pass at the token
//protected route
billsRouter.get(
  "/business/:businessID",
  validateToken,
  getAllBillsByBusinessID
);

module.exports = billsRouter;
