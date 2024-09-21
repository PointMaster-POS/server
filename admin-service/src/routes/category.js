const categoryRouter = require("express").Router();
const validateToken = require("../middleware/validateToken");
const {
  createCategory,
  getCategories,
  updateCategory
 
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
//if manager the branch_id is in the token if owner the branch_id is in the body
// categoryRouter.post("/manager", validateToken, branchAccess, createCategory);
categoryRouter.post("/", validateToken, branchAccess, createCategory);

 categoryRouter.get("/", validateToken, branchAccess, getCategories);

categoryRouter.put(  "/:branchID/:categoryID", validateToken, branchAccess, updateCategory);


categoryRouter.delete(  "/:categoryID", validateToken, branchAccess, updateCategory);

module.exports = categoryRouter;
