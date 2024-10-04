const { resetPasswordEmployee, resetPasswordCustomer } = require('../controllers/resetpassword');

const passwordResetRouter = require('express').Router();



// Reset Password for Employee
passwordResetRouter.post('/reset-password-employee', resetPasswordEmployee);

// Reset Password for Customer
passwordResetRouter.post('/reset-password-customer', resetPasswordCustomer);

//Reset Password for Owner




module.exports = passwordResetRouter;