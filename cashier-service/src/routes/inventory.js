//get all categories related to the business 
//get all products related to the category


const express = require('express');
const inventoryRouter = express.Router();

const { getCategories, getProducts} = require('../controllers/loyality');

//get all categories program of the business
//this route should be protected by the auth middleware cashier should be authenticated
inventoryRouter.get('/categories', getCategories);
inventoryRouter.get('/products/:categoryID', getProducts);

module.exports = inventoryRouter;