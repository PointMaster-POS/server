const express = require("express");
const shopsRouter = express.Router();
const { getAllShops, getShopByID } = require("../controllers/shop");
const validateToken = require("../middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Operations related to shops
 */

/**
 * @swagger
 * /shop:
 *   get:
 *     summary: Get all shops
 *     description: Returns a list of all shops including shop names and images. Requires authentication.
 *     tags:
 *       - Shops
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved shops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   shopID:
 *                     type: string
 *                     description: The ID of the shop
 *                   shopName:
 *                     type: string
 *                     description: The name of the shop
 *                   shopImage:
 *                     type: string
 *                     description: The URL of the shop's image
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
shopsRouter.get("/", validateToken, getAllShops);

/**
 * @swagger
 * /shop/{businessID}:
 *   get:
 *     summary: Get shop by ID
 *     description: Returns details of a specific shop by its ID including shop name, location, owner, and contact information.
 *     tags:
 *       - Shops
 *     parameters:
 *       - in: path
 *         name: businessID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shop
 *     responses:
 *       200:
 *         description: Successfully retrieved shop details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shopID:
 *                   type: string
 *                   description: The ID of the shop
 *                 shopName:
 *                   type: string
 *                   description: The name of the shop
 *                 shopLocation:
 *                   type: string
 *                   description: The location of the shop
 *                 shopOwner:
 *                   type: string
 *                   description: The owner of the shop
 *                 shopContact:
 *                   type: string
 *                   description: The contact information of the shop
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Internal Server Error
 */
shopsRouter.get("/:businessID", getShopByID);

module.exports = shopsRouter;
