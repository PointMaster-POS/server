const businessRouter = require('express').Router();
const { updateBusinessDetails, updateOwnerDetails } = require('../controllers/business');
const validateToken = require('../middleware/validateToken');




//update business details

businessRouter.put('/update-business-details', validateToken, updateBusinessDetails);


//update owner details

businessRouter.put('/update-owner-details', validateToken, updateOwnerDetails);


//export business router
module.exports = businessRouter;    