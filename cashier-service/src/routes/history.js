const express = require('express');
const historyRouter = express.Router();
const verifyCashier = require('../middleware/verifyCashier');
const { branchAccess } = require('../middleware/businessAccess');
const { getHistory } = require('../controllers/history');

/**
 * @swagger
 * /cashier/history:
 *   get:
 *     summary: Get Bill History at the Branch
 *     description: Retrieves the history of bills at the branch. This route is protected and requires authentication.
 *     tags:
 *       - History
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bill history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   billId:
 *                     type: string
 *                     description: The unique identifier for the bill
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the bill was issued
 *                   amount:
 *                     type: number
 *                     format: float
 *                     description: The total amount of the bill
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */



// Get bill history at the branch
historyRouter.get('/', verifyCashier, branchAccess, getHistory);

module.exports = historyRouter;
