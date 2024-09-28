const dashBoardRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { getPopularItems, getExpiredItems} = require('../controllers/dashboard');


dashBoardRouter.get('/business/sale-report/item/:startDate/:endDate', validateToken, getPopularItems);
dashBoardRouter.get('/business/expired-items', validateToken, getExpiredItems);




module.exports = dashBoardRouter;