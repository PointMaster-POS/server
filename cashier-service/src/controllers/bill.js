const asyncHandler = require("express-async-handler");
const axios = require("axios");
const db = require("../config/db");



// Create a new bill
const createNewBill = asyncHandler((req, res) => {
  const {
    payment_method,
    total_amount,
    items_list,
    discount, 
    received,
    notes,
    status,
    customer_phone
  } = req.body;

  const cashier_id = req.cashier.employee_id;
  const branch_id = req.branch.branch_id;

  // Insert the bill into the 'bill' table
  db.query(
    'INSERT INTO bill (employee_id, branch_id, total_price, payment_method, discount, received, notes, status, date_time, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      cashier_id,
      branch_id,
      total_amount,
      payment_method,
      discount,
      received,
      notes,
      status,
      new Date(),
      customer_phone
    ],
    (err, billResult) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const bill_id = billResult.insertId;

      // Insert the bill items into 'bill_items' table
      if (items_list && items_list.length > 0) {
        const billItemsValues = items_list.map(item => [
          bill_id,
          item.item_id,
          item.quantity,
        ]);

        db.query(
          'INSERT INTO bill_items (bill_id, item_id, quantity) VALUES ?',
          [billItemsValues],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            res.status(201).json({
              message: 'Bill created successfully with items',
              bill_id: bill_id,
            });
          }
        );
      } else {
        res.status(201).json({
          message: 'Bill created successfully',
          bill_id: bill_id,
        });
      }
    }
  );
});



const updateBill = asyncHandler(async (req, res) => {
  const {
    bill_id,
    payment_method,
    total_amount,
    items_list,
    loyalty_points_redeemed,
    discount,
    received,
    notes,
    customer_phone,
    status,
  } = req.body;

  const cashier_id = req.cashier.employee_id;
  const branch_id = req.branch.branch_id;
  const business_id = req.business.business_id;
  console.log("Items list: ", bill_id);
  // Check if the bill exists and is on hold
  const billQuery = "SELECT * FROM bill WHERE bill_id = ? and status = ?";
  db.query(billQuery, [bill_id, 0], async (err, billResult) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else if (billResult.length === 0) {
      return res
        .status(404)
        .json({
          message: "Held bill not found or That bill is completed successfully",
        });
    } else {
      // Proceed to update the held bill with new items and details
      const existingBill = billResult[0];

      // Get loyalty program for the business
      const loyaltyProgramQuery = `SELECT * FROM loyalty_programs WHERE business_id = ?`;
      db.query(loyaltyProgramQuery, [business_id], async (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        const loyaltyProgram = result[0];
        if (!loyaltyProgram) {
          return res.status(404).json({ message: "Loyalty Program not found" });
        }

        // Update the bill details
        const updateBillQuery = `UPDATE bill SET 
            payment_method = ?, 
            total_price = ?, 
            discount = ?, 
            received = ?, 
            customer_phone = ?, 
            employee_id = ?, 
            notes = ?, 
            branch_id = ?, 
            status = ? 
            WHERE bill_id = ?`;

        db.query(
          updateBillQuery,
          [
            payment_method,
            total_amount,
            discount,
            received,
            customer_phone,
            cashier_id,
            notes,
            branch_id,
            status,
            bill_id,
          ],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            // Process loyalty points if applicable
            if (customer_phone && loyaltyProgram) {
              const customerResponse = await axios.get(
                `http://localhost:3004/customer/${customer_phone}`
              );
              const customer_id = customerResponse.data.customer_id;

              if (customer_id) {
                const loyaltyPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;
                db.query(
                  loyaltyPointsQuery,
                  [customer_id, loyaltyProgram.loyalty_program_id],
                  (err, result) => {
                    if (err) {
                      return res.status(500).json({ message: err.message });
                    }

                    if (result.length > 0) {
                      const customerLoyaltyDetails = result[0];
                      const newPoints =
                        customerLoyaltyDetails.points +
                        (loyaltyProgram.points_per_hundred * total_amount) /
                          100;

                      db.query(
                        `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                        [
                          newPoints,
                          customer_id,
                          loyaltyProgram.loyalty_program_id,
                        ],
                        (err) => {
                          if (err) {
                            return res
                              .status(500)
                              .json({ message: err.message });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }

            // Update item quantities and bill items
            items_list.forEach((item) => {
              // First, update the inventory for each item
              db.query(
                `UPDATE items SET stock = stock - ? WHERE item_id = ?`,
                [item.quantity, item.item_id],
                (err) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  }
                }
              );

              // Next, update or insert bill items for the existing bill
              const updateBillItemsQuery = `INSERT INTO bill_items (bill_id, item_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

              db.query(
                updateBillItemsQuery,
                [bill_id, item.item_id, item.quantity, item.quantity],
                (err) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  }
                }
              );
            });

            // Send success response
            res.status(200).json({ message: "Held bill updated successfully" });
          }
        );
      });
    }
  });
});

module.exports = { createNewBill, updateBill };
