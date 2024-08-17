const express = require("express");
const shopsRouter = express.Router();
const { getAllShops, getShopByID } = require("../controllers/shop");
const validateToken = require("../middleware/validateTokenHandler");

//this should return all shop names, img ect belongs to the customer
//protected route
shopsRouter.get("/", validateToken, getAllShops);

//this should return a shop with shop id, shop name, shop location, shop owner, shop contact - shop details
shopsRouter.get("/:businessID", getShopByID);

module.exports = shopsRouter;
