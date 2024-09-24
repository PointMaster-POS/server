const loyaltyRouter = require("express").Router();
const validateToken = require("../middleware/validateToken");

const {
  createLoyalty,
  getLoyalty,
  updateLoyalty,
} = require("../controllers/loyalty");

//business id is in the token if owner is creating loyality
loyaltyRouter.post("/new", validateToken, createLoyalty);
loyaltyRouter.get("/", validateToken, getLoyalty);
loyaltyRouter.put("/", validateToken, updateLoyalty);
// loyalityRouter.delete('/', validateToken, deleteLoyality);

module.exports = loyaltyRouter;
