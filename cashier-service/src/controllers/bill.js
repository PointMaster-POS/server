const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// need to send backend when the bill is paid
// customer id
// payment method
// total amount
// items list in the bill
// loyalty points redeemed or not
// asign the customer id to the bill
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
  
  //get loyality program for the business
  const loyalityProgramQuery = `SELECT * FROM loyalty_programs WHERE business_id = ? `;
  db.query(loyalityProgramQuery, [business_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      const loyalityProgram = result[0];
      if (!loyalityProgram) {
        return res.status(404).json({ message: "Loyality Program not found" });
      }
      if (loyalty_points_redeemed) {
        console.log(customer_id, loyalityProgram.loyalty_program_id);
    
        const loyalityPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ? `;
        db.query(
          loyalityPointsQuery,
          [customer_id, loyalityProgram.loyalty_program_id],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            
            if (result.length > 0) {
              const customerLoyalityDetails = result[0];
              if (
                loyalityProgram.minimum_eligibility_value <
                customerLoyalityDetails.points
              ) {
                {
                  //deduct loyalty points
                  const newPoints =
                    customerLoyalityDetails.points -
                    (loyalityProgram.points_per_hundred * total_amount) / 100;
                  db.query(
                    `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                    [
                      newPoints,
                      customer_id,
                      loyalityProgram.loyalty_program_id,
                    ],
                    (err, result) => {
                      if (err) {
                        return res.status(500).json({ message: err.message });
                      }
                    }
                  );
                  const createBillQuery = `INSERT INTO bills (payment_method, total_amount, discount, loyalty_points_redeemed, customer_id, cashier_id, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                  db.query(
                    createBillQuery,
                    [
                      customer_phone,
                      payment_method,
                      total_amount,

                        discount,
                      loyalty_points_redeemed,
                      customer_id,
                      cashier_id,
                      branch_id,
                    ],
                    (err, result) => {
                      if (err) {
                        return res.status(500).json({ message: err.message });
                      } else {
                        // add loyality points
                        const newPoints =
                          customerLoyalityDetails.points +
                          (loyalityProgram.points_per_hundred * total_amount) /
                            100;

                        db.query(
                          `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                          [
                            newPoints,
                            customer_id,
                            loyalityProgram.loyalty_program_id,
                          ],
                          (err, result) => {
                            if (err) {
                              return res
                                .status(500)
                                .json({ message: err.message });
                            }
                          }
                        );
                        // reduce quantity of items in inventory
                        db.query(
                          `SELECT * FROM items WHERE branch_id = ? AND item_id - ?`,
                          [branch_id],
                          (err, result) => {
                            if (err) {
                              return res
                                .status(500)
                                .json({ message: err.message });
                            } else {
                              const items = result;
                              items_list.forEach((item) => {
                                const itemInInventory = items.find(
                                  (i) => i.item_id === item.item_id
                                );
                                if (itemInInventory) {
                                  const newQuantity =
                                    itemInInventory.quantity - item.quantity;
                                  db.query(
                                    `UPDATE items SET quantity = ? WHERE item_id = ?`,
                                    [newQuantity, item.item_id],
                                    (err, result) => {
                                      if (err) {
                                        return res
                                          .status(500)
                                          .json({ message: err.message });
                                      }
                                    }
                                  );
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              } else {
                return res
                  .status(200)
                  .json({ message: "Customer is not eligible" });
              }
            }
          }
        );
      } else {
        /*
                                `bill_id` VARCHAR(36) NOT NULL PRIMARY KEY,
                                `branch_id` VARCHAR(36) NOT NULL,
                                `employee_id` VARCHAR(36) NOT NULL,
                                `payment_method` VARCHAR(32),
                                `total_price` FLOAT NOT NULL,
                                `discount` FLOAT,
                                `received` FLOAT,
                                `status` BOOL NOT NULL,
                                `notes` VARCHAR(4096),
                                `date_time` DATETIME NOT NULL,
                                `customer_phone` VARCHAR(36),

        */
        const createBillQuery = `INSERT INTO bill (date_time, payment_method, total_price, discount, received, customer_id, employee_id, notes, branch_id,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              //add loyality points
                const loyalityPointsQuery = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ? `;
                db.query(
                  loyalityPointsQuery,
                  [customer_id, loyalityProgram.loyalty_program_id],
                  (err, result) => {
                    if (err) {
                      return res.status(500).json({ message: err.message });
                    }
                    if (result.length > 0) {
                      const customerLoyalityDetails = result[0];
                      const newPoints =
                        customerLoyalityDetails.points +
                        (loyalityProgram.points_per_hundred * total_amount) /
                          100;

                      db.query(
                        `UPDATE customer_loyalty SET points = ? WHERE customer_id = ? AND loyalty_program_id = ?`,
                        [
                          newPoints,
                          customer_id,
                          loyalityProgram.loyalty_program_id,
                        ],
                        (err, result) => {
                          if (err) {
                            return res.status(500).json({ message: err.message });
                          }
                        }
                      );
                    }
                  }
                );
              // reduce quantity of items in inventory
              db.query(
                `SELECT * FROM items WHERE branch_id = ? AND item_id - ?`,
                [branch_id],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({ message: err.message });
                  } else {
                    const items = result;
                    items_list.forEach((item) => {
                      const itemInInventory = items.find(
                        (i) => i.item_id === item.item_id
                      );
                      if (itemInInventory) {
                        const newQuantity =
                          itemInInventory.quantity - item.quantity;
                        db.query(
                          `UPDATE items SET quantity = ? WHERE item_id = ?`,
                          [newQuantity, item.item_id],
                          (err, result) => {
                            if (err) {
                              return res
                                .status(500)
                                .json({ message: err.message });
                            }
                          }
                        );
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  });
});

module.exports = { newBill };
