const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const billsRouter = express.Router();
const {
  getAllBillsByCustomerId,
  getBillByID,
  getAllBillsByBusinessID,
} = require("../controllers/bills");

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Operations related to bills
 */

/**
 * @swagger
 * /bills:
 *   get:
 *     summary: Get All Bills by Customer ID
 *     description: Returns all the bills for a customer, including bill ID, business name, time, and total amount. Requires authentication.
 *     tags:
 *       - Bills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all bills for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   billId:
 *                     type: string
 *                     description: The unique identifier of the bill
 *                   businessName:
 *                     type: string
 *                     description: The name of the business
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     description: The time the bill was generated
 *                   totalAmount:
 *                     type: number
 *                     format: float
 *                     description: The total amount of the bill
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */

billsRouter.get("/", validateToken, getAllBillsByCustomerId);

/**
 * @swagger
 * /bills/{billID}:
 *   get:
 *     summary: Get Bill by ID
 *     description: Returns a specific bill by ID, including bill ID, business name, time, and total amount. Requires authentication.
 *     tags:
 *       - Bills
 *     parameters:
 *       - in: path
 *         name: billID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the bill
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the bill
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 billId:
 *                   type: string
 *                   description: The unique identifier of the bill
 *                 businessName:
 *                   type: string
 *                   description: The name of the business
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   description: The time the bill was generated
 *                 totalAmount:
 *                   type: number
 *                   format: float
 *                   description: The total amount of the bill
 *       404:
 *         description: Not Found - Bill not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */

billsRouter.get("/:billID", validateToken, getBillByID);

/**
 * @swagger
 * /bills/business/{businessID}:
 *   get:
 *     summary: Get All Bills by Business ID
 *     description: Returns all bills related to a business, including bill ID, business name, time, and total amount. The customer ID will be extracted from the token. Requires authentication.
 *     tags:
 *       - Bills
 *     parameters:
 *       - in: path
 *         name: businessID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the business
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all bills for the business
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   billId:
 *                     type: string
 *                     description: The unique identifier of the bill
 *                   businessName:
 *                     type: string
 *                     description: The name of the business
 *                   time:
 *                     type: string
 *                     format: date-time
 *                     description: The time the bill was generated
 *                   totalAmount:
 *                     type: number
 *                     format: float
 *                     description: The total amount of the bill
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not Found - No bills found for the business
 *       500:
 *         description: Internal Server Error
 */

billsRouter.get("/business/:businessID", validateToken, getAllBillsByBusinessID);

module.exports = billsRouter;
