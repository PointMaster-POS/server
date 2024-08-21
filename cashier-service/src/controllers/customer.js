const asyncHandler = require('express-async-handler');
const db = require('../config/db');


const getCustomer = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM customer WHERE customer_phone = ? ";
    const phone = req.params.phone;

    db.query(query, [phone], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = { getCustomer };
