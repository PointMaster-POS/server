const express = require('express');
const customerRouter = express.Router();
const verifyCashier = require('../middleware/verifyCashier');
const { getCustomer, getCustomerPoints, checkElegibility } = require('../controllers/customer');

/**
 * @swagger
 * /cashier/customer/{phone}:
 *   get:
 *     summary: Get Customer by Phone Number
 *     description: Retrieves customer information based on their phone number.
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: The phone number of the customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved customer information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customerId:
 *                   type: string
 *                   description: The unique identifier of the customer
 *                 name:
 *                   type: string
 *                   description: The name of the customer
 *                 phone:
 *                   type: string
 *                   description: The phone number of the customer
 *       404:
 *         description: Not Found - Customer not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cashier/customer/{phone}/points:
 *   get:
 *     summary: Get Current Customer Points
 *     description: Retrieves the current loyalty points for a customer based on their phone number.
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: The phone number of the customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved customer points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 points:
 *                   type: integer
 *                   description: The current loyalty points of the customer
 *       404:
 *         description: Not Found - Customer not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cashier/customer/{phone}/redeem:
 *   get:
 *     summary: Check Eligibility for Points Redemption
 *     description: Checks whether the customer is eligible to redeem their loyalty points based on their phone number.
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: The phone number of the customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked eligibility for points redemption
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eligible:
 *                   type: boolean
 *                   description: Whether the customer is eligible to redeem points
 *       404:
 *         description: Not Found - Customer not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */



// Get customer by phone number
customerRouter.get('/:phone', verifyCashier, getCustomer);

// Get current customer points
customerRouter.get('/:phone/points', verifyCashier, getCustomerPoints);

// Check eligibility for points redemption
customerRouter.get('/:phone/redeem', verifyCashier, checkElegibility);

module.exports = customerRouter;
