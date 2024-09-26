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
    status,
  } = req.body;

  const cashier_id = req.cashier.employee_id;
  const branch_id = req.branch.branch_id;
  const business_id = req.business.business_id;

  try {
    // Get loyalty program for the business
    const [loyaltyProgram] = await db.query(
      `SELECT * FROM loyalty_programs WHERE business_id = ?`,
      [business_id]
    );

    if (!loyaltyProgram.length) {
      return res.status(404).json({ message: "Loyalty Program not found" });
    }

    // Redeem loyalty points if applicable
    let customer_id;
    if (loyalty_points_redeemed) {
      const [customerData] = await db.query(
        `SELECT customer_id FROM customer WHERE customer_phone = ?`,
        [customer_phone]
      );

      if (!customerData.length) {
        return res.status(404).json({ message: "Customer not found" });
      }

      customer_id = customerData[0].customer_id;

      const [customerLoyalty] = await db.query(
        `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`,
        [customer_id, loyaltyProgram[0].loyalty_program_id]
      );

      if (
        customerLoyalty.length &&
        loyaltyProgram[0].minimum_eligibility_value <=
          customerLoyalty[0].points &&
        total_amount >= customerLoyalty[0].points
      ) {
        const newPoints = customerLoyalty[0].points - total_amount;
        await db.query(
          `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
          [newPoints, customer_id, loyaltyProgram[0].loyalty_program_id]
        );
      }
    }

    // Create the bill
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const billResult = await db.query(
      `INSERT INTO bill (date_time, payment_method, total_price, discount, received, customer_phone, employee_id, notes, branch_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        status,
      ]
    );

    const bill_id = billResult[0].insertId;

    // Add loyalty points if applicable
    if (customer_id) {
      const [customerLoyalty] = await db.query(
        `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`,
        [customer_id, loyaltyProgram[0].loyalty_program_id]
      );

      if (customerLoyalty.length) {
        const newPoints =
          customerLoyalty[0].points +
          (loyaltyProgram[0].points_per_hundred * total_amount) / 100;
        await db.query(
          `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
          [newPoints, customer_id, loyaltyProgram[0].loyalty_program_id]
        );
      }
    }

    // Reduce item quantities in inventory
    for (const item of items_list) {
      await db.query(
        `UPDATE items SET stock = stock - ? WHERE item_id = ?`,
        [item.quantity, item.item_id]
      );
    }

    // Create bill items
    for (const item of items_list) {
      await db.query(
        `INSERT INTO bill_items (bill_id, item_id, quantity) VALUES (?, ?, ?)`,
        [bill_id, item.item_id, item.quantity]
      );
    }

    return res.status(201).json({ message: "Bill created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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

module.exports = { newBill, updateBill };
