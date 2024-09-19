const asyncHandler = require('express-async-handler');
const db = require('../config/db');


const getEmployee = asyncHandler(async (req, res) => {

    const query = "SELECT employee_id, employee_name, photo_url, role , employee_email FROM employee WHERE employee_id = ? ";
    const employee_id = req.cashier.employee_id;

    db.query(query, [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result[0]);
        }
    });
});


module.exports = { getEmployee };