//get Bill history at the branch

const express = require('express');
const historyRouter = express.Router();


const {getBillHistory} = require('../controllers/history');

//get bill history at the branch
//this route should be protected by the auth middleware cashier should be authenticated
historyRouter.get('/history', getBillHistory);


module.exports = historyRouter;