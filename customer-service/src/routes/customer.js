const express = require("express");
const customerRouter = express.Router();
const {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByPhone,
  getCustomerPointsByPhone
} = require("../controllers/customer");
const validateToken = require("../middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to customers
 */

/**
 * @swagger
 * /customer/register:
 *   post:
 *     summary: Register a new customer
 *     description: Registers a new customer in the system.
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the customer
 *               phone:
 *                 type: string
 *                 description: The phone number of the customer
 *               email:
 *                 type: string
 *                 description: The email address of the customer
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal Server Error
 */
customerRouter.post("/register", registerCustomer);

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Get all customers
 *     description: Returns a list of all customers.
 *     tags:
 *       - Customers
 *     responses:
 *       200:
 *         description: Successfully retrieved all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the customer
 *                   name:
 *                     type: string
 *                     description: The name of the customer
 *                   phone:
 *                     type: string
 *                     description: The phone number of the customer
 *                   email:
 *                     type: string
 *                     description: The email address of the customer
 *       500:
 *         description: Internal Server Error
 */
customerRouter.get("/", getAllCustomers);

/**
 * @swagger
 * /customer:
 *   put:
 *     summary: Update an existing customer
 *     description: Updates the details of an existing customer. Requires authentication.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the customer
 *               name:
 *                 type: string
 *                 description: The name of the customer
 *               phone:
 *                 type: string
 *                 description: The phone number of the customer
 *               email:
 *                 type: string
 *                 description: The email address of the customer
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
customerRouter.put("/", validateToken, updateCustomer);

/**
 * @swagger
 * /customer:
 *   delete:
 *     summary: Delete an existing customer
 *     description: Deletes a customer from the system. Requires authentication.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the customer
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
customerRouter.delete("/", validateToken, deleteCustomer);

customerRouter.get("/:phone", getCustomerByPhone);

customerRouter.get("/points/:phone/:buinessID", getCustomerPointsByPhone);




module.exports = customerRouter;
