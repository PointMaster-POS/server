const createBusinessRouter = require("express").Router();
const { registerBusiness, submitOwnerDetails } = require("../controllers/registration");

//business registration route

createBusinessRouter.post("/business-details", registerBusiness);
createBusinessRouter.post("/owner-details", submitOwnerDetails);


module.exports = createBusinessRouter;