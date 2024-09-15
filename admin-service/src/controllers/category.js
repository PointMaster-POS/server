const db = require('../config/db');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const { category_name } = req.body;
    const createCategoryQuery = `INSERT INTO category (category_name) VALUES (?)`;

    db.query(createCategoryQuery, [category_name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(201).json({ message: "Category created successfully" });
        }
    });
}   );