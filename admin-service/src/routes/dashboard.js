const dashBoardRouter = require("express").Router();
const validateToken = require("../middleware/validateToken");

const {
  getPopularItems,
  getExpiredItems,
  getNumberOfBillsPerMonth,
  getServiceTimeReport,
  getNumberOfCustomers,
  customerProfileWithMostPoints,
  salesByPaymentMethod,
  getBillsBetweenDates,
  getBranchPerformanceReport,
  getItemsWithLowStock,
  getNumberOfEmployeesBusiness
} = require("../controllers/dashboard");

dashBoardRouter.get(
  "/business/sale-report/item/:startDate/:endDate",
  validateToken,
  getPopularItems
);
dashBoardRouter.get("/business/expired-items", validateToken, getExpiredItems);
dashBoardRouter.get(
  "/business/sale-report/number-of-bills/:startMonth/:endMonth",
  validateToken,
  getNumberOfBillsPerMonth
);
dashBoardRouter.get(
  "/business/sale-report/service-time/:startDate/:endDate",
  validateToken,
  getServiceTimeReport
);
dashBoardRouter.get(
  "/business/number-of-customers",
  validateToken,
  getNumberOfCustomers
);
dashBoardRouter.get(
  "/business/customer-profile-with-most-points",
  validateToken,
  customerProfileWithMostPoints
);
dashBoardRouter.get(
  "/business/sales-by-payment-method",
  validateToken,
  salesByPaymentMethod
);
dashBoardRouter.get(
  "/business/bills-between-dates/:startDate/:endDate",
  validateToken,
  getBillsBetweenDates
);

dashBoardRouter.get(
  "/business/branch-performance/:startDate/:endDate",
  validateToken,
  getBranchPerformanceReport
);

dashBoardRouter.get(
    "/business/low-stock-items/:minStock",
    validateToken,
    getItemsWithLowStock

);

dashBoardRouter.get(
  "/business/employees/get-number-of-employees",
  validateToken,
  getNumberOfEmployeesBusiness
);

module.exports = dashBoardRouter;
