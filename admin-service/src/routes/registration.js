const createBusinessRouter = require("express").Router();
const { registerBusiness, submitOwnerDetails,  verifyEmailSending, verifyMail } = require("../controllers/registration");

//business registration route

createBusinessRouter.post("/business-details", registerBusiness);
createBusinessRouter.post("/owner-details", submitOwnerDetails);
createBusinessRouter.post("/verify-email-send", verifyEmailSending);
createBusinessRouter.post("/verify-mail", verifyMail);


module.exports = createBusinessRouter;