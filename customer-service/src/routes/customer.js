const express = require("express");
const customerRouter = express.Router();

const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");
const validateToken = require("../middleware/validateTokenHandler");

//this route belongs to the customer service
customerRouter.route("/register").post(registerCustomer);

//this route belongs to the customer service
// router.route("/:id").get(getCustomerById);
customerRouter.route("/").get(getAllCustomers);

//protected rotes
customerRouter.put("/", validateToken, updateCustomer);
customerRouter.delete("/", validateToken, deleteCustomer);

module.exports = customerRouter;
