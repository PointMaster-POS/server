const express = require('express');
const employeeRouter = express.Router();
const { employeeLogginController } = require('../controllers/employee');

/**
 * @swagger
 * /employee/login:
 *   post:
 *     summary: Employee Login
 *     tags:
 *       - Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Employee email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Employee password
 *                 example: "himindu123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
employeeRouter.post('/login', employeeLogginController);

module.exports = employeeRouter;
