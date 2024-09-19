const asyncHandler = require('express-async-handler');
const db = require('../config/db');

const getHistory = asyncHandler(async (req, res) => {
  try {
    const branch_id = req.branch.branch_id;
    
    // Fetch all bills for the given branch
    const bills = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM bill WHERE branch_id = ?";
      db.query(query, [branch_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Loop through each bill and fetch the items for each bill
    const billsWithItems = await Promise.all(
      bills.map(async (bill) => {
        const items = await new Promise((resolve, reject) => {
          // Get the item_ids from bill_items table
          const getItemsQuery = "SELECT item_id FROM bill_items WHERE bill_id = ?";
          db.query(getItemsQuery, [bill.bill_id], (err, data) => {
            if (err) return reject(err);
            
            // Get the item details from the items table using the item_ids
            const itemIds = data.map(item => item.item_id);
            if (itemIds.length === 0) {
              return resolve([]);  // No items for this bill
            }

            db.query("SELECT * FROM items WHERE item_id IN (?)", [itemIds], (err, items) => {
              if (err) return reject(err);
              resolve(items);
            });
          });
        });

        // Combine bill and its items into one object
        return { ...bill, items };
      })
    );

    // Send the response with all bills and their respective items
    res.status(200).json(billsWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getHistory };
