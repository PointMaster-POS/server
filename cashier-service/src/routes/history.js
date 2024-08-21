//get Bill history at the branch

const express = require('express');
const historyRouter = express.Router();
const verifyCashier = require('../middleware/verifyCashier');
const {branchAccess} = require('../middleware/businessAccess');
const {getHistory} = require('../controllers/history');

//get bill history at the branch
//this route should be protected by the auth middleware cashier should be authenticated
historyRouter.get('/',verifyCashier, branchAccess, getHistory);



module.exports = historyRouter;