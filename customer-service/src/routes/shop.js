const express = require("express");
const shopsRouter = express.Router();
const { getAllShops, getShopByID } = require("../controllers/shop");

shopsRouter.route("/").get(getAllShops);
shopsRouter.route("/:shopID").post(getShopByID);



module.exports = shopsRouter;