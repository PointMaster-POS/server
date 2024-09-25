const employeeRouter = require('express').Router();
const validateToken = require('../middleware/validateToken');


const { createEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee');

//branch id is in the body of the request if owner is creating employee 
//branch id is in the token if manager is creating employee
employeeRouter.post('/', validateToken, createEmployee);
employeeRouter.get('/:branch_id', validateToken, getEmployee);
employeeRouter.put('/:employee_id', validateToken, updateEmployee);
employeeRouter.delete('/:employee_id', validateToken, deleteEmployee);

module.exports = employeeRouter;