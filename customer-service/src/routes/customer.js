const express = require("express");
const customerRouter = express.Router();

const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");

//this route belongs to the customer service
customerRouter
  .route("/register")
  .post(registerCustomer);

//this route belongs to the customer service
// router.route("/:id").get(getCustomerById);
customerRouter
  .route("/")
  .put(updateCustomer)
  .get(getAllCustomers)
  .delete(deleteCustomer);

module.exports = customerRouter;
