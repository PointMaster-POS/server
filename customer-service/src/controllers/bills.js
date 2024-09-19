const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Get all bills by customer id (any business any branch)
const getAllBillsByCustomerId = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;

  const getBillsQuery = `
    SELECT 
        b.bill_id, 
        bus.business_id, 
        b.date_time, 
        b.total_price 
    FROM 
        bill b 
    JOIN 
        business_branch bb ON b.branch_id = bb.branch_id 
    JOIN 
        business bus ON bb.business_id = bus.business_id 
    WHERE 
        b.customer_id = ?;
`;

  db.query(getBillsQuery, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results);
    }
  });
});

// Get infomation of bills by bill id
const getBillByID = asyncHandler(async (req, res) => {
  const bill_id = req.params.billID;

  const getBillQuery = `SELECT * FROM bill WHERE bill_id = ?`;

  db.query(getBillQuery, [bill_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results);
    }
  });
});

// Get all bills by business id
const getAllBillsByBusinessID = asyncHandler(async (req, res) => {
  const business_id = req.params.businessID;
  const customer_id = req.customer.customer_id;
  const query = `SELECT 
  b.bill_id, 
  b.date_time, 
  b.total_price, 
  bb.branch_id, 
  bus.business_id
FROM 
  bill b
JOIN 
  business_branch bb ON b.branch_id = bb.branch_id
JOIN 
  business bus ON bb.business_id = bus.business_id
WHERE 
  b.customer_id = ? 
AND 
  bus.business_id = ?`;

  db.query(query, [customer_id, business_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = {
  getAllBillsByCustomerId,
  getBillByID,
  getAllBillsByBusinessID,
  
};
