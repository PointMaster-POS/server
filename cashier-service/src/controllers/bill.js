const asyncHandler = require("express-async-handler");
const axios = require("axios");
const db = require("../config/db");

const newBill = asyncHandler(async (req, res) => {
  const {
    payment_method,
    total_amount,
    items_list,
    loyalty_points_redeemed,
    discount,
    received,
    notes,
    customer_phone,
  } = req.body;

  const cashier_id = req.cashier.employee_id;
  const branch_id = req.branch.branch_id;
  const business_id = req.business.business_id;

  // Get loyalty program for the business
  const loyaltyProgramQuery = `SELECT * FROM loyalty_programs WHERE business_id = ?`;
  db.query(loyaltyProgramQuery, [business_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      const loyaltyProgram = result[0];
      if (!loyaltyProgram) {
        return res.status(404).json({ message: "Loyalty Program not found" });
      }

      if (loyalty_points_redeemed) {
        const loyaltyPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;
        db.query(
          loyaltyPointsQuery,
          [req.body.customer_id, loyaltyProgram.loyalty_program_id],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            if (result.length > 0) {
              const customerLoyaltyDetails = result[0];
              if (
                loyaltyProgram.minimum_eligibility_value <=
                customerLoyaltyDetails.points
              ) {
                const newPoints =
                  customerLoyaltyDetails.points -
                  (loyaltyProgram.points_per_hundred * total_amount) / 100;

                db.query(
                  `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                  [
                    newPoints,
                    req.body.customer_id,
                    loyaltyProgram.loyalty_program_id,
                  ],
                  (err) => {
                    if (err) {
                      return res.status(500).json({ message: err.message });
                    }
                  }
                );
              } else {
                return res
                  .status(400)
                  .json({
                    message: "Customer is not eligible to redeem points",
                  });
              }
            }
          }
        );
      }
      console.log("Items list: ", items_list);
      // Create the bill  and return the bill_id make the query returning the bill_id
      const createBillQuery = `INSERT INTO bill (date_time, payment_method, total_price, discount, received, customer_phone, employee_id, notes, branch_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

      db.query(
        createBillQuery,
        [
          timestamp,
          payment_method,
          total_amount,
          discount,
          received,
          customer_phone,
          cashier_id,
          notes,
          branch_id,
          1,
        ],
        async (err, result) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          } else {
            // Retrieve customer_id using Axios from the customer service
            const bill_id = result.insertId; 
            console.log("Created Bill ID: ", bill_id);
            const customerResponse = await axios.get(
              `http://localhost:3004/customer/${customer_phone}`
            );
            const customer_id = customerResponse.data.customer_id;
            console.log("Customer ID: ", customer_id);
            // Add loyalty points if applicable
            if (customer_id) {
              const loyaltyPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;
              db.query(
                loyaltyPointsQuery,
                [customer_id, loyaltyProgram.loyalty_program_id],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  }
                  //   console.log("Loyalty Points: ", result);
                  if (result.length > 0) {
                    const customerLoyaltyDetails = result[0];
                    const newPoints =
                      customerLoyaltyDetails.points +
                      (loyaltyProgram.points_per_hundred * total_amount) / 100;

                    db.query(
                      `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                      [
                        newPoints,
                        customer_id,
                        loyaltyProgram.loyalty_program_id,
                      ],
                      (err) => {
                        if (err) {
                          return res.status(500).json({ message: err.message });
                        }
                      }
                    );
                    console.log("Customer Loyalty Points Updated");
                  }
                }
              );
            }

            // Reduce item quantities in inventory
            items_list.forEach((item) => {
              db.query(
                `UPDATE items SET stock = stock - ? WHERE item_id = ?`,
                [item.quantity, item.item_id],
                (err) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  }
                }
              );
            });

            // Create bill items
            items_list.forEach((item) => {
              db.query(
                `INSERT INTO bill_items (bill_id, item_id, quantity) VALUES (?, ?, ?)`,
                [bill_id, item.item_id, item.quantity],
                (err) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  }
                }
              );
            });

            res.status(201).json({ message: "Bill created successfully" });
          }
          
        }
      );
    }
  });
});

module.exports = { newBill };
