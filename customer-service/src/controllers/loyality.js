const asyncHandler = require("express-async-handler");
const db = require("../config/db");

//get loyality points by customer id and business id
const getLoyalityPointsByBusinessID = asyncHandler(async (req, res) => {
  const business_id = req.params.businessID;
  const customer_id = req.customer.customer_id;

  const getLoyalityPointsQuery = `SELECT points FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;

  const getLoyalityProgramIDQuery = `SELECT loyalty_program_id FROM loyalty_programs WHERE business_id = ?`;

  db.query( getLoyalityProgramIDQuery, [business_id], (err, loyalty_id) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      db.query(getLoyalityPointsQuery, [customer_id, loyalty_id[0].loyalty_program_id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          return res.status(200).json(results[0]);
        }
      });
    }
  }
 
  );
});

//get loyality points by customer id
const getLoyalityPointsByCustomerID = asyncHandler(async (req, res) => {
  const customer_id = req.customer?.customer_id;

  const getLoyalityPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ?`;

  db.query(getLoyalityPointsQuery, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = {
  getLoyalityPointsByBusinessID,
  getLoyalityPointsByCustomerID,
};
