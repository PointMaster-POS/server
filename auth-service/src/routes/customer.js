const { customerLogginController } = require('../controllers/customer');
const customerRouter = require('express').Router();

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Customer Login
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Customer email
 *                 example: "himindukularathne@gmail.com"
 *               password:
 *                 type: string
 *                 description: Customer password
 *                 example: "himindu123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
customerRouter.post('/login', customerLogginController);

module.exports = customerRouter;

