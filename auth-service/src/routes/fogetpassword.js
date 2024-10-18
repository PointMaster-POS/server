
const express = require('express');
const fogetPasswordController = require('../controllers/fogetpassword');
const fogetPasswordRouter = express.Router();   




fogetPasswordRouter.post('/foget-password-business-owners', fogetPasswordController);

module.exports = fogetPasswordRouter;