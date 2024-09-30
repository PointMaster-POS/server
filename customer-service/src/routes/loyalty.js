const express = require("express");
const loyalityRouter = express.Router();
const {
  getLoyalityPointsByBusinessID,
  getLoyaltyProgram,
  getLoyalityPointsByCustomerID,
} = require("../controllers/loyality");
const validateToken = require("../middleware/validateTokenHandler");


/**
 * @swagger
 * tags:
 *   name: Loyalty
 *   description: Operations related to loyalty points
 */

/**
 * @swagger
 * /loyalty/{businessID}:
 *   get:
 *     summary: Get loyalty points by business ID
 *     description: Returns all the loyalty points of a customer for a specified business.
 *     tags:
 *       - Loyalty
 *     parameters:
 *       - in: path
 *         name: businessID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved loyalty points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   customerID:
 *                     type: string
 *                     description: The ID of the customer
 *                   points:
 *                     type: integer
 *                     description: The amount of loyalty points
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
loyalityRouter.get("/:businessID", validateToken, getLoyalityPointsByBusinessID);

/**
 * @swagger
 * /loyalty:
 *   get:
 *     summary: Get loyalty points by customer ID
 *     description: Returns all the loyalty points of a customer. This route requires authentication.
 *     tags:
 *       - Loyalty
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved loyalty points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   businessID:
 *                     type: string
 *                     description: The ID of the business
 *                   points:
 *                     type: integer
 *                     description: The amount of loyalty points
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
loyalityRouter.get("/", validateToken, getLoyalityPointsByCustomerID);

// still endpoint is not fully created
// /**
//  * @swagger
//  * /loyalty/redeem/{customerID}/{businessID}:
//  *   post:
//  *     summary: Redeem loyalty points at shop
//  *     description: Redeem loyalty points of a customer for a business at the shop.
//  *     tags:
//  *       - Loyalty
//  *     parameters:
//  *       - in: path
//  *         name: customerID
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the customer
//  *       - in: path
//  *         name: businessID
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the business
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               points:
//  *                 type: integer
//  *                 description: The number of points to be redeemed
//  *     responses:
//  *       200:
//  *         description: Points redeemed successfully
//  *       400:
//  *         description: Bad Request - Invalid input
//  *       401:
//  *         description: Unauthorized - Authentication required
//  *       500:
//  *         description: Internal Server Error
//  */
// loyalityRouter.post("/redeem/:customerID/:businessID", redeemLoyalityPointsAtShop);

loyalityRouter.get("/loyalty-program/:businessID", getLoyaltyProgram);

module.exports = loyalityRouter;
