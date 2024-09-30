const asyncHandler = require("express-async-handler");
const db = require("../config/db");

//get all businesses that customer has bonded with a loyality program
const getAllShops = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;

  const getShopsQuery = `SELECT b.*
        FROM business b
        JOIN loyalty_programs lp ON b.business_id = lp.business_id
        JOIN customer_loyalty cl ON lp.loyalty_program_id = cl.loyalty_program_id
        WHERE cl.customer_id = ?;`;

  db.query(getShopsQuery, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results);
    }
  });
});

//get Shops by shop id ( this may call to other microservice later)
const getShopByID = asyncHandler(async (req, res) => {
  const business_id = req.params.businessID;

  const getShopQuery = `SELECT * FROM business WHERE business_id = ?`;

  db.query(getShopQuery, [business_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

module.exports = { getAllShops, getShopByID };
