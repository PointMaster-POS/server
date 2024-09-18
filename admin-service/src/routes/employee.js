const employeeRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee');

//branch id is in the body of the request if owner is creating employee 
//branch id is in the token if manager is creating employee
employeeRouter.post('/manager', validateToken, createEmployee);
employeeRouter.post('/owner', validateToken, createEmployee);

employeeRouter.get('/manager', validateToken, getEmployee);
employeeRouter.get('/owner', validateToken, getEmployee);

employeeRouter.put('/manager', validateToken, updateEmployee);
employeeRouter.put('/owner', validateToken, updateEmployee);

employeeRouter.delete('/manager', validateToken, deleteEmployee);
employeeRouter.delete('/owner', validateToken, deleteEmployee);
module.exports = employeeRouter;