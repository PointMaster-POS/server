
const {customerLogginController} = require('../controllers/customer');
const customerRouter = require('express').Router();

customerRouter.post('/login', customerLogginController);

module.exports = customerRouter;