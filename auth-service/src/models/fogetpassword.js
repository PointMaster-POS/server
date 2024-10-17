const express = require('express');
const fogetPasswordRouter = express.Router();


const { fogetPasswordController } = require('../controllers/fogetpassword');

fogetPasswordRouter.post('/foget-password-business-owners', fogetPasswordController);

module.exports = fogetPasswordRouter;