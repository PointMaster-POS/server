const express = require('express');
const loyaltyRouter = express.Router();
const { getLoyalityProgram } = require('../controllers/loyalty');
const verifyCashier = require('../middleware/verifyCashier');
const { businessAccess, branchAccess } = require('../middleware/businessAccess');


/**
 * @swagger
 * /cashier/loyalty:
 *   get:
 *     summary: Get Loyalty Program Details of the Business
 *     description: Retrieves the details of the loyalty program for the business. This route is protected and requires authentication.
 *     tags:
 *       - Loyalty
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved loyalty program details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 programId:
 *                   type: string
 *                   description: The unique identifier of the loyalty program
 *                 programName:
 *                   type: string
 *                   description: The name of the loyalty program
 *                 description:
 *                   type: string
 *                   description: Description of the loyalty program
 *                 benefits:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: List of benefits provided by the loyalty program
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Access denied
 *       500:
 *         description: Internal Server Error
 */



// Get loyalty program details of the business
loyaltyRouter.get('/', verifyCashier, branchAccess, businessAccess, getLoyalityProgram);

module.exports = loyaltyRouter;
