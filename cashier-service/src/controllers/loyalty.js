const asyncHandler = require("express-async-handler");
const db = require("../config/db");

const getLoyalityProgram = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM loyalty_programs WHERE business_id = ? ";
  const branch_id = req.business.business_id;

  db.query(query, [branch_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

const checkElegibility = asyncHandler(async (req, res) => {
  const loyalityProgramQuery = "SELECT * FROM loyalty_programs WHERE business_id = ? ";
  const business_id = req.business.business_id;
  console.log(business_id);

 

  const customer_id = req.body.customer_id;

  db.query(loyalityProgramQuery, [business_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const loyalityProgram = result[0];
    const loyalityPointsQuery = "SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ? ";
    console.log(loyalityProgram);

  if (!loyalityProgram) {
    return res.status(404).json({ message: "Loyality Program not found" });
  }

  db.query(loyalityPointsQuery, [customer_id, loyalityProgram.loyalty_program_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.length > 0) {
      const customerLoyalityDetails = result[0];
      if(loyalityProgram.minimum_eligibility_value < customerLoyalityDetails.points){ {
        return res.status(200).json({ eligibility : true , customer_points : customerLoyalityDetails.points });
      }
    } else {
      return res.status(200).json({ eligibility : false ,message: "Customer is not eligible" });
    } 
  }});
  });
  
  

});


  



module.exports = { getLoyalityProgram, checkElegibility };
