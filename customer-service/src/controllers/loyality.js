const asyncHandler = require('express-async-handler');
const db = require('../config/db');

//get loyality points by customer id and business id
const getLoyalityPointsByBusinessID = asyncHandler(async (req, res) => {
    const business_id = req.params.businessID;
    const customer_id = req.customer.customer_id;

    const getLoyalityPointsQuery = `SELECT points FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;

    db.query(getLoyalityPointsQuery, [customer_id, business_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(results[0]);
        }
    }
    );
});

//get loyality points by customer id 
const getLoyalityPointsByCustomerID = asyncHandler(async (req, res) => {
    const customer_id = req.customer?.customer_id 

    const getLoyalityPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ?`;

    db.query(getLoyalityPointsQuery, [customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(results);
        }
    }
    );
});


module.exports = { getLoyalityPointsByBusinessID, getLoyalityPointsByCustomerID };