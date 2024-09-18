const asyncHandler = require('express-async-handler');
const db = require('../config/db');

//(business_id, branch_name, branch_location, status0
const createBranch = asyncHandler(async (req, res) => {
    const { branch_name, branch_location } = req.body;
    const business_id = req.owner.business_id;
    console.log(business_id);
    const createBranchQuery = `INSERT INTO business_branch (business_id, branch_name, branch_location, status) VALUES (?, ?, ?, 1)`;
    const checkBranchQuery = `SELECT * FROM branches WHERE branch_name = ? AND business_id = ?`;

    db.query(checkBranchQuery, [branch_name, business_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            if (result.length > 0) {
                return res.status(400).json({ message: "Branch already exists" });
            } else {
                db.query(createBranchQuery, [business_id, branch_name, branch_location], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    } else {
                        return res.status(201).json({ message: "Branch created successfully" });
                    }
                });
            }
        }
    });
});

const getBranch = asyncHandler(async (req, res) => {
    const branch_id = req.params.branch_id;
    const getBranchQuery = `SELECT * FROM business_branch WHERE branch_id = ?`;

    db.query(getBranchQuery, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});

const getAllBranches = asyncHandler(async (req, res) => {
    const business_id = req.owner.business_id;
    const getBranchQuery = `SELECT * FROM business_branch WHERE business_id = ?`;

    db.query(getBranchQuery, [business_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});

const updateBranch = asyncHandler(async (req, res) => {
    const branch_id = req.params.branch_id;
    const { branch_name, branch_location } = req.body;
    const updateBranchQuery = `UPDATE business_branch SET branch_name = ?, branch_location = ? WHERE branch_id = ?`;

    db.query(updateBranchQuery, [branch_name, branch_location, branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "Branch Deleted successfully" });
        }
    });
});



const deleteBranch = asyncHandler(async (req, res) => {
    const branch_id = req.params.branch_id;
    const deleteBranchQuery = `Update business_branch SET status = 0 WHERE branch_id = ?`;

    db.query(deleteBranchQuery, [branch_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: "Branch deleted successfully" });
        }
    });
});








module.exports = { createBranch, getBranch, updateBranch, deleteBranch, getAllBranches };