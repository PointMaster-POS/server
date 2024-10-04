const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const getCategories = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM categories Where branch_id = ? ";
    console.log(req.branch);
   
    const branch_id = req.branch.branch_id;

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

const getProductByID = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM items Where item_id = ? ";
    const itemID = req.params.productID;

    db.query(query, [itemID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

const getProductByBarcode = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM items Where barcode = ? ";
    const barcode = req.params.barcode;

    db.query(query, [barcode], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

module.exports = { getCategories, getProducts, getProductByID, getProductByBarcode };