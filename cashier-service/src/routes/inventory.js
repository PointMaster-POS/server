//get all categories related to the business
//get all products related to the category

const express = require("express");
const inventoryRouter = express.Router();
const verifyCashier = require("../middleware/verifyCashier");
const {branchAccess} = require("../middleware/businessAccess");

const {
     getCategories,
     getProducts 
} = require("../controllers/inventory");

//get all categories program of the business
//this route should be protected by the auth middleware cashier should be authenticated
 inventoryRouter.get('/categories',verifyCashier,branchAccess, getCategories);
inventoryRouter.get("/products/:categoryID", verifyCashier, getProducts);

module.exports = inventoryRouter;
