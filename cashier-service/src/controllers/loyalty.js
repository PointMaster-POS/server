const asyncHandler = require("express-async-handler");
const db = require("../config/db");

const getLoyalityProgram = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM loyalty_programs WHERE business_id = ? ";
  const branch_id = req.business.business_id;

  db.query(query, [branch_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = { getLoyalityProgram };
