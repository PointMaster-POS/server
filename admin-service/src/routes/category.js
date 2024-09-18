// const categoryRouter = require("express").Router();
// const validateToken = require("../middleware/validateToken");
// const {createCategory, gatALLCategoryInventoryManager, updateCategoryInventoryManager, deleteCategoryInventoryManager, createAllCategoryInventoryManager} = require("../controllers/category");
// const { branchAccess } = require("../middleware/businessAccess");

// /**
//  * @swagger
//  * /category/manager:
//  *   post:
//  *     summary: Create a category by the inventory manager
//  *     tags:
//  *       - Category
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               category_name:
//  *                 type: string
//  *                 description: The name of the category
//  *                 example: "Electronics"
//  *               category_location:
//  *                 type: string
//  *                 description: Category description
//  *                 example: "3rd floor"
//  *     responses:
//  *       200:
//  *         description: Category created successfully
//  *       401:
//  *         description: Unauthorized
//  */
// //if manager the branch_id is in the token if owner the branch_id is in the body
// // categoryRouter.post("/manager", validateToken, branchAccess, createCategory);
// categoryRouter.post("/owner", validateToken, createAllCategoryInventoryManager);

// categoryRouter.get("/owner/:branch_id", validateToken, gatALLCategoryInventoryManager);
// //branch id is in the token if manager is creating item
// categoryRouter.get("/manager", validateToken, branchAccess, gatALLCategoryInventoryManager);

// // categoryRouter.put("/manager", validateToken, branchAccess, updateCategoryInventoryManager);
// categoryRouter.put("/owner/branch_id", validateToken, updateCategoryInventoryManager);


// // categoryRouter.delete("/manager", validateToken, branchAccess, deleteCategoryInventoryManager);
// categoryRouter.delete("/owner/:branch_id", validateToken, deleteCategoryInventoryManager);


// module.exports = categoryRouter;
