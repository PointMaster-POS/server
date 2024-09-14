const express = require("express");
const customerRouter = express.Router();

const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPhone,
  getCustomerDetails,
} = require("../controllers/customer");
const validateToken = require("../middleware/validateTokenHandler");

//this route belongs to the customer service
customerRouter.route("/register").post(registerCustomer);

//this route belongs to the customer service
// router.route("/:id").get(getCustomerById);
customerRouter.route("/all").get(getAllCustomers);

//protected rotes
customerRouter.put("/", validateToken, updateCustomer);
customerRouter.delete("/", validateToken, deleteCustomer);
customerRouter.get("/phone", validateToken, getCustomerPhone);
customerRouter.get("/", validateToken, getCustomerDetails);


module.exports = customerRouter;
