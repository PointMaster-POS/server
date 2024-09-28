const dashBoardRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { getPopularItems, getExpiredItems, getNumberOfBillsPerMonth } = require('../controllers/dashboard');


dashBoardRouter.get('/business/sale-report/item/:startDate/:endDate', validateToken, getPopularItems);
dashBoardRouter.get('/business/expired-items', validateToken, getExpiredItems);
dashBoardRouter.get('/business/sale-report/number-of-bills/:startMonth/:endMonth', validateToken, getNumberOfBillsPerMonth);




module.exports = dashBoardRouter;