const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");

//this route belongs to the customer service
router
  .route("/")
  .get(getAllCustomers)
  .post(registerCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

//this route belongs to the customer service
router.route("/:id").get(getCustomerById);

module.exports = router;