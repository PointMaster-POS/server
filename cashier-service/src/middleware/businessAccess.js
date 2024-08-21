// this is the business access middleware
// get business customer id from the decoded token and get business id from the customer id

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../config/db');


const businessAccess = asyncHandler(async (req, res, next) => {
    console.log("cashier" +req.cashier);
    const query = `
    SELECT branch_id From employee WHERE employee_id = ?
    `
    const cashierID = req.cashier.employee_id;
    db.query(query, [cashierID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            req.business = result[0];
            console.log("business" +req.business);
            next();
        }
    });
});

module.exports = businessAccess;

