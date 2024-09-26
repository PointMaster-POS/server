const db = require('../config/db');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    console.log(req.body);
    let { category_name, category_location, branch_id } = req.body; 
    // If branch_id is not provided in the body, use the branch_id from req.employee (for branch managers)
   
    if (!branch_id) {
      
        branch_id = req.branch.branch_id;
    }


    console.log(branch_id);

    // Validate that category_name and category_location are provided
    if (!category_name || !category_location || !branch_id) {
        return res.status(400).json({ message: "Category name, location and branch are required" });
    }

    // Create the category in the database
    const createCategoryQuery = `INSERT INTO categories (category_name, category_location, branch_id, status) VALUES (?, ?, ?, 1)`;

    db.query(createCategoryQuery, [category_name, category_location, branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
            
        } else {
            return res.status(201).json({ message: "Category created successfully" });
        }
    });
});


const getCategoriesOwner = asyncHandler(async (req, res) => {

    console.log("req.branch");
    
    const  branch_id = req.params.branch_id;
    
  
    console.log(branch_id);
    const getCategoriesQuery = `SELECT * FROM categories WHERE branch_id = ? and status = 1`;   

    db.query(getCategoriesQuery, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});

const getCategoriesManager = asyncHandler(async (req, res) => {

    console.log("req.branch");
    
    const  branch_id = req.branch.branch_id;
    
  
    console.log(branch_id);
    const getCategoriesQuery = `SELECT * FROM categories WHERE branch_id = ? and status = 1`;   

    db.query(getCategoriesQuery, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});



const updateCategory = asyncHandler(async (req, res) => {
    let branch_id;
    if( !req.branch){
        branch_id = req.params.branchID;
    }
    else {
        branch_id = req.branch.branch_id;

    }
    const category_id = req.params.categoryID;
    const {  category_name, category_location } = req.body;

    if (!category_name || !category_location) {
        return res.status(400).json({ message: "Category name and location are required" });
    }

    const updateCategoryQuery = `UPDATE categories SET category_name = ?, category_location = ? WHERE category_id = ? AND branch_id = ?`;


    db.query(updateCategoryQuery, [category_name, category_location, category_id, branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.status(200).json({ message: "Category updated successfully" });
        }
    });

});


const deleteCategory = asyncHandler(async (req, res) => {
    let branch_id;
    if( !req.branch){
        branch_id = req.params.branchID;
    }
    else {
        branch_id = req.branch.branch_id;
    }
    const category_id = req.params.categoryID;

    const deleteCategoryQuery = `UPDATE categories SET status = 0 WHERE category_id = ? AND branch_id = ?`;

    db.query(deleteCategoryQuery, [category_id, branch_id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.status(200).json({ message: "Category deleted successfully" });
        }
    });
}   
);

const getAllBranchCategories = asyncHandler(async (req, res) => {
    const branch_id = req.params.branchID;
    const getCategoriesQuery = `SELECT category_id, category_name FROM categories WHERE branch_id = ?`;
    console.log(branch_id);

    db.query(getCategoriesQuery, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});

module.exports = { createCategory , getCategoriesOwner, getCategoriesManager, updateCategory, deleteCategory , getAllBranchCategories};