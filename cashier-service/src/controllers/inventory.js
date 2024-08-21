const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const getCategories = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM categories Where branch_id = ? ";
    const branch_id = req.business.branch_id;

    db.query(query, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM items Where category_id = ? ";
    const categoryID = req.params.categoryID;

    db.query(query, [categoryID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = { getCategories, getProducts };