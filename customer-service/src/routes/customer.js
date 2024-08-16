const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");

router
  .route("/")
  .get(getAllCustomers)
  .post(registerCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);
