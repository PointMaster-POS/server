const asyncHandler = require("express-async-handler");
const db = require("../config/db");

/* 
loyalty_program_id | business_id | loyalty_program_name | points_per_hundred | redeem_value | by_sales | minimum_eligibility_value | start_date        
*/
const createLoyalty = asyncHandler(async (req, res) => {
  //check if loyalty program already exists
  if (req.owner === undefined) {
    return res.status(400).json({ message: "Unauthorized" });
  }
  const business_id = req.owner.business_id;

  const loyaltyProgramCheckQuery = `SELECT * FROM loyalty_programs WHERE business_id = ?`;

  db.query(loyaltyProgramCheckQuery, [business_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "Loyalty program already exists" });
      } else {
        const {
          loyalty_program_name,
          points_per_hundred,
          redeem_value,
          by_sales,
          minimum_eligibility_value,
          start_date,
        } = req.body;
        if (
          !loyalty_program_name ||
          !points_per_hundred ||
          !redeem_value ||
          !by_sales ||
          !minimum_eligibility_value ||
          !start_date
        ) {
          return res.status(400).json({ message: "All fields are required" });
        }
        const createLoyaltyProgramQuery = `INSERT INTO loyalty_programs (business_id, loyalty_program_name, points_per_hundred, redeem_value, by_sales, minimum_eligibility_value, start_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          createLoyaltyProgramQuery,
          [
            business_id,
            loyalty_program_name,
            points_per_hundred,
            redeem_value,
            by_sales,
            minimum_eligibility_value,
            start_date,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              return res
                .status(201)
                .json({ message: "Loyalty program created successfully" });
            }
          }
        );
      }
    }
  });
});

//endpoint to get loyalty program
const getLoyalty = asyncHandler(async (req, res) => {
  //check if loyalty program already exists
  if (req.owner === undefined) {
    return res.status(400).json({ message: "Unauthorized" });
  }
  //get business id from the owner
  const business_id = req.owner.business_id;

  //query to get loyalty program
  const getLoyaltyProgramQuery = `SELECT * FROM loyalty_programs WHERE business_id = ?`;

  //execute query
  db.query(getLoyaltyProgramQuery, [business_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length === 0) {
        //loyalty program not found
        return res.status(404).json({ message: "Loyalty program not found" });
      }
      //loyalty program found
      return res.status(200).json(result[0]);
    }
  });
});

const updateLoyalty = asyncHandler(async (req, res) => {
  //check if loyalty program already exists
  if (req.owner === undefined) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  //get business id from the owner
  const business_id = req.owner.business_id;

  //get loyalty program details from the request body
  const {
    loyalty_program_name,
    points_per_hundred,
    redeem_value,
    by_sales,
    minimum_eligibility_value,
    start_date,
  } = req.body;
  if (
    !loyalty_program_name ||
    !points_per_hundred ||
    !redeem_value ||
    !by_sales ||
    !minimum_eligibility_value ||
    !start_date
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //query to update loyalty program
  const updateLoyaltyProgramQuery = `UPDATE loyalty_programs SET loyalty_program_name = ?, points_per_hundred = ?, redeem_value = ?, by_sales = ?, minimum_eligibility_value = ?, start_date = ? WHERE business_id = ?`;

  //execute query
  db.query(
    updateLoyaltyProgramQuery,
    [
      loyalty_program_name,
      points_per_hundred,
      redeem_value,
      by_sales,
      minimum_eligibility_value,
      start_date,
      business_id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        if (result.affectedRows === 0) {
          //loyalty program not found
          return res.status(404).json({ message: "Loyalty program not found" });
        }
        //loyalty program updated successfully
        return res
          .status(200)
          .json({ message: "Loyalty program updated successfully" });
      }
    }
  );
});

module.exports = { createLoyalty, getLoyalty, updateLoyalty };
