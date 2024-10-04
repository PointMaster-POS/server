const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Get all bills by customer id (any business any branch)
const getAllBillsByCustomerId = asyncHandler(async (req, res) => {
  const customer_phone = req.customer.customer_phone;

  const getBillsQuery = `
    SELECT 
        b.bill_id, 
        bus.business_id,
        bus.business_name, 
        b.date_time, 
        b.total_price 
    FROM 
        bill b 
    JOIN 
        business_branch bb ON b.branch_id = bb.branch_id 
    JOIN 
        business bus ON bb.business_id = bus.business_id 
    WHERE 
        b.customer_phone = ?;
`;

  db.query(getBillsQuery, [customer_phone], (err, results) => {
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
      //get bill items 
      const getBillItemsQuery = `SELECT * FROM bill_items WHERE bill_id = ?`;
      db.query(getBillItemsQuery, [bill_id], (err, items) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          // results[0].items = items;
          //add bill items list to bill object
          //search employee name from employee_id in employee table
          const getEmployeeNameQuery = `SELECT employee_name FROM employee WHERE employee_id = ?`;
          db.query(getEmployeeNameQuery, [results[0].employee_id], (err, employee) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              results[0].employee_name = employee[0].employee_name;
              results[0].items = items;
              //get branch name from branch_id in business_branch table 
              const getBranchNameQuery = `SELECT branch_name FROM business_branch WHERE branch_id = ?`;
              db.query(getBranchNameQuery, [results[0].branch_id], (err, branch) => {
                if (err) {
                  return res.status(500).json({ message: err.message });
                } else {
                  results[0].branch_name = branch[0].branch_name;
                  return res.status(200).json(results[0]);
                }
              });
            }
          });
         
        }
      });

    }
  });
});

// Get all bills by business id
const getAllBillsByBusinessID = asyncHandler(async (req, res) => {
  const business_id = req.params.businessID;
  const customer_phone = req.customer.customer_phone;
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
  b.customer_phone = ? 
AND 
  bus.business_id = ?`;

  db.query(query, [customer_phone, business_id], (err, results) => {
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
