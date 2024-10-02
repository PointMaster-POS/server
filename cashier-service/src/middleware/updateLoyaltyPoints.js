const db = require("../config/db");
const asyncHandler = require("express-async-handler");

/* 

const redeemLoyaltyPoints = asyncHandler((req, res, next) => {
  const { loyalty_points_redeemed, total_amount, customer_phone } = req.body;
  const business_id = req.business.business_id;

  if (!loyalty_points_redeemed) {
    return next(); // If no points redeemed, skip to next function
  }

  // Get loyalty program for the business
  db.query(
    "SELECT * FROM loyalty_programs WHERE business_id = ?",
    [business_id],
    (err, loyaltyProgramResult) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const loyaltyProgram = loyaltyProgramResult[0];

      if (!loyaltyProgram) {
        return res.status(404).json({ message: "Loyalty program not found" });
      }

      // Retrieve customer information
      db.query(
        "SELECT customer_id FROM customer WHERE customer_phone = ?",
        [customer_phone],
        (err, customerResult) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          if (customerResult.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
          }

          const customer_id = customerResult[0].customer_id;

          // Fetch loyalty points for the customer
          db.query(
            "SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?",
            [customer_id, loyaltyProgram.loyalty_program_id],
            (err, loyaltyPointsResult) => {
              if (err) {
                return res.status(500).json({ message: err.message });
              }

              if (loyaltyPointsResult.length > 0) {
                const customerLoyaltyDetails = loyaltyPointsResult[0];
                if (
                  loyaltyProgram.minimum_eligibility_value <=
                    customerLoyaltyDetails.points &&
                  total_amount >= customerLoyaltyDetails.points
                ) {
                  const newPoints =
                    customerLoyaltyDetails.points - total_amount;

                  // Update customer loyalty points
                  db.query(
                    "UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?",
                    [newPoints, customer_id, loyaltyProgram.loyalty_program_id],
                    (err, result) => {
                      if (err) {
                        return res.status(500).json({ message: err.message });
                      }

                      console.log("Customer Loyalty Points Updated");
                      next(); // Proceed to next function
                    }
                  );
                } else {
                  return res
                    .status(400)
                    .json({ message: "Insufficient loyalty points" });
                }
              } else {
                return res
                  .status(404)
                  .json({ message: "No loyalty points found" });
              }
            }
          );
        }
      );
    }
  );
});

module.exports = redeemLoyaltyPoints;
    
    */

const updateLoyaltyPoints = asyncHandler((req, res, next) => {
    const { loyalty_points_redeemed, total_amount, customer_phone } = req.body;
    const business_id = req.business.business_id;
    
    const loyaltyProgramQuery = `SELECT * FROM loyalty_programs WHERE business_id = ?`;

    db.query(loyaltyProgramQuery, [business_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        const loyaltyProgram = result[0];

        if (!loyaltyProgram) {
            return res.status(404).json({ message: "Loyalty program not found" });
        }

        const customerQuery = `SELECT customer_id FROM customer WHERE customer_phone = ?`;
        console.log("upto --------> get loyalty program");

        db.query(customerQuery, [customer_phone], (err, customerResult) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (customerResult.length === 0) {
                return res.status(404).json({ message: "Customer not found" });
            }

            const customer_id = customerResult[0].customer_id;
            console.log("upto --------> get customer id", customer_id);

            const loyaltyPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;

            db.query(loyaltyPointsQuery, [customer_id, loyaltyProgram.loyalty_program_id], (err, loyaltyPointsResult) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                if (loyaltyPointsResult.length > 0) {
                    const customerLoyaltyDetails = loyaltyPointsResult[0];
                    console.log("upto --------> get loyalty points", customerLoyaltyDetails , loyaltyProgram.minimum_eligibility_value, customerLoyaltyDetails.points, total_amount);
                    if ( customerLoyaltyDetails) {
                        console.log("upto --------> get loyalty points", loyaltyProgram.points_per_hundred);
                        const newPoints = customerLoyaltyDetails.points + total_amount * loyaltyProgram.points_per_hundred / 100;
                        console.log("upto --------> get new points", newPoints);

                        const updateLoyaltyPointsQuery = `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`;

                        db.query(updateLoyaltyPointsQuery, [newPoints, customer_id, loyaltyProgram.loyalty_program_id], (err, result) => {
                            if (err) {
                                return res.status(500).json({ message: err.message });
                            }

                            console.log("Customer Loyalty Points Updated");
                            next();
                        });
                    } else {
                        return res.status(400).json({ message: "Insufficient loyalty points" });
                    }
                } else {
                   console.log("No loyalty points found");
                    //create new loyalty points
                    const newPoints = total_amount * loyaltyProgram.points_per_hundred / 100;
                    const createLoyaltyPointsQuery = `INSERT INTO customer_loyalty (customer_id, loyalty_program_id, start_date ,points) VALUES (?, ?, ?, ?)`;
                    db.query(createLoyaltyPointsQuery, [customer_id, loyaltyProgram.loyalty_program_id, new Date(), newPoints], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: err.message });
                        }
                        console.log("New Customer Loyalty --------->");

                        next();
                    });
                }
            });
        
        });
    }
    );
}
);

module.exports = updateLoyaltyPoints;