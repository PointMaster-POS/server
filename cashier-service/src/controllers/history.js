const asyncHandler = require('express-async-handler');
const db = require('../config/db');

const getHistory = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM bill WHERE branch_id = ? ";
    const branch_id = req.branch.branch_id;

    db.query(query, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});


module.exports = { getHistory };

