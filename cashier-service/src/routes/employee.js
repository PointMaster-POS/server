const employeeRouter = require('express').Router();
const verifyCashier = require('../middleware/verifyCashier');
const { getEmployee } = require('../controllers/employee');



employeeRouter.get('/', verifyCashier, getEmployee);

module.exports = employeeRouter;