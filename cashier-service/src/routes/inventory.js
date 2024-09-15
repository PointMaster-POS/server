const express = require("express");
const inventoryRouter = express.Router();
const verifyCashier = require("../middleware/verifyCashier");
const { branchAccess } = require("../middleware/businessAccess");

const {
  getCategories,
  getProducts,
  getProductByID,
  getProductByBarcode,
} = require("../controllers/inventory");

/**
 * @swagger
 * /cashier/inventory/categories:
 *   get:
 *     summary: Get all categories related to the business
 *     tags: 
 *       - Inventory
 *     security:
 *       - bearerAuth: []  # Ensures authentication with Bearer token
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryID:
 *                     type: string
 *                     description: The ID of the category
 *                   categoryName:
 *                     type: string
 *                     description: The name of the category
 *       401:
 *         description: Unauthorized
 */
inventoryRouter.get("/categories", verifyCashier, branchAccess, getCategories);

/**
 * @swagger
 * /cashier/inventory/products/{categoryID}:
 *   get:
 *     summary: Get all products related to a category
 *     tags: 
 *       - Inventory
 *     security:
 *       - bearerAuth: []  # Ensures authentication with Bearer token
 *     parameters:
 *       - name: categoryID
 *         in: path
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved products for the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productID:
 *                     type: string
 *                     description: The ID of the product
 *                   productName:
 *                     type: string
 *                     description: The name of the product
 *       401:
 *         description: Unauthorized
 */
inventoryRouter.get("/products/:categoryID", verifyCashier, getProducts);

/**
 * @swagger
 * /cashier/inventory/product/{productID}:
 *   get:
 *     summary: Get product details by product ID
 *     tags: 
 *       - Inventory
 *     security:
 *       - bearerAuth: []  # Ensures authentication with Bearer token
 *     parameters:
 *       - name: productID
 *         in: path
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productID:
 *                   type: string
 *                   description: The ID of the product
 *                 productName:
 *                   type: string
 *                   description: The name of the product
 *       401:
 *         description: Unauthorized
 */
inventoryRouter.get("/product/:productID", verifyCashier, getProductByID);

/**
 * @swagger
 * /cashier/inventory/product/barcode/{barcode}:
 *   get:
 *     summary: Get product details by barcode
 *     tags: 
 *       - Inventory
 *     security:
 *       - bearerAuth: []  # Ensures authentication with Bearer token
 *     parameters:
 *       - name: barcode
 *         in: path
 *         required: true
 *         description: Barcode of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product by barcode
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productID:
 *                   type: string
 *                   description: The ID of the product
 *                 productName:
 *                   type: string
 *                   description: The name of the product
 *       401:
 *         description: Unauthorized
 */
inventoryRouter.get("/product/barcode/:barcode", verifyCashier, getProductByBarcode);

module.exports = inventoryRouter;
