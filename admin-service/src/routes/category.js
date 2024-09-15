const categoryRouter = require("express").Router();
const validateToken = require("../middleware/validateToken");
const {
  createCategoryInventoryManager,
} = require("../controllers/category");
const { branchAccess } = require("../middleware/businessAccess");

/**
 * @swagger
 * /category/manager:
 *   post:
 *     summary: Create a category by the inventory manager
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "Electronics"
 *               category_location:
 *                 type: string
 *                 description: Category description
 *                 example: "3rd floor"
 *     responses:
 *       200:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
categoryRouter.post("/manager", validateToken, branchAccess, createCategoryInventoryManager);

module.exports = categoryRouter;
