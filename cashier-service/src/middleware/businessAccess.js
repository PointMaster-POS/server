// this is the business access middleware
// get business customer id from the decoded token and get business id from the customer id
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../config/db');

const branchAccess = asyncHandler(async (req, res, next) => {
    console.log("cashier" +req.cashier);
    const query = `
    SELECT branch_id From employee WHERE employee_id = ?
    `
    const cashierID = req.cashier.employee_id;
    db.query(query, [cashierID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            req.branch = result[0];
            console.log("business" +req.business);
            next();
        }
    });
});

const businessAccess = asyncHandler(async (req, res, next) => {
    const query = `
    SELECT business_id From business_branch WHERE branch_id = ?
    `
    const branchID = req.branch.branch_id;
    db.query(query, [branchID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            req.business = result[0];
            console.log("business" +req.business);
            next();
        }
    });
});

module.exports = { branchAccess, businessAccess };

