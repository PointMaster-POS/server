const express = require("express");
const shopsRouter = express.Router();
const { getAllShops, getShopByID } = require("../controllers/shop");

//this should return all shop names, img ect belongs to the customer
shopsRouter.route("/").get(getAllShops);

//this should return a shop with shop id, shop name, shop location, shop owner, shop contact - shop details
shopsRouter.route("/:shopID").post(getShopByID);

module.exports = shopsRouter;
