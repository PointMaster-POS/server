// const db = require('../config/db');
// const asyncHandler = require('express-async-handler');

// const createCategoryInventoryManager = asyncHandler(async (req, res) => {
//     const { category_name, category_location } = req.body;

//     const branch_id = req.branch.branch_id;
//     console.log(branch_id);
//     const createCategoryQuery = `INSERT INTO categories (branch_id, category_name, category_location) VALUES (?, ?, ?)`;



//     db.query(createCategoryQuery, [branch_id, category_name, category_location], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: err.message });
//         } else {
//             return res.status(201).json({ message: "Category created successfully" });
//         }
//     });
// });



// module.exports = { createCategoryInventoryManager };