const express = require('express');
const billRouter = express.Router();
const { newBill, getBillItems } = require('../controllers/bill');

/**
 * @swagger
 * /cashier/bill:
 *   post:
 *     summary: Post a New Bill
 *     description: Creates a new bill and adds it to the database. This route can include authentication, redeem points, and loyalty updates.
 *     tags:
 *       - Bill
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer for whom the bill is being created
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       description: The ID of the item being billed
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the item
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the item
 *             required:
 *               - customerId
 *               - items
 *     responses:
 *       201:
 *         description: Successfully created a new bill
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 billId:
 *                   type: string
 *                   description: The unique identifier for the newly created bill
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */

// Post a new bill
billRouter.post('/bill', newBill);

/**
 * @swagger
 * /cashier/bill/{billId}:
 *   get:
 *     summary: Get Items in a Bill by Bill ID
 *     description: Retrieves all items associated with a specific bill ID.
 *     tags:
 *       - Bill
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bill to retrieve items for
 *     responses:
 *       200:
 *         description: Successfully retrieved bill items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemId:
 *                     type: string
 *                     description: The ID of the item
 *                   quantity:
 *                     type: integer
 *                     description: The quantity of the item
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the item
 *       404:
 *         description: Not Found - Bill not found
 *       500:
 *         description: Internal Server Error
 */





// Get all items in a bill by bill ID
billRouter.get('/bill/:billId', getBillItems);

module.exports = billRouter;
