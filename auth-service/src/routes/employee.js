const express = require('express');
const employeeRouter = express.Router();
const { employeeLogginController } = require('../controllers/employee');


employeeRouter.post('/login', employeeLogginController);

module.exports = employeeRouter;
