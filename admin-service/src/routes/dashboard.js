const dashBoardRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { getPopularItems, getExpiredItems, getNumberOfBillsPerMonth , getServiceTimeReport, getNumberOfCustomers,  customerProfileWithMostPoints} = require('../controllers/dashboard');


dashBoardRouter.get('/business/sale-report/item/:startDate/:endDate', validateToken, getPopularItems);
dashBoardRouter.get('/business/expired-items', validateToken, getExpiredItems);
dashBoardRouter.get('/business/sale-report/number-of-bills/:startMonth/:endMonth', validateToken, getNumberOfBillsPerMonth);
dashBoardRouter.get('/business/sale-report/service-time/:startDate/:endDate', validateToken, getServiceTimeReport);
dashBoardRouter.get('/business/number-of-customers', validateToken, getNumberOfCustomers);
dashBoardRouter.get('/business/customer-profile-with-most-points', validateToken, customerProfileWithMostPoints);





module.exports = dashBoardRouter;