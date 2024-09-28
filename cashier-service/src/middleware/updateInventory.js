const asyncHandler = require('express-async-handler');
const db = require('../config/db');

const updateInventory = asyncHandler((req, res, next) => {
    const { items_list } = req.body;
  
    if (!items_list || items_list.length === 0) {
      return next(); // If no items, proceed to next function
    }
  
    console.log("Items list: ", items_list);
  
    // Example logic for updating inventory
    items_list.forEach(item => {
      db.query(
        'UPDATE items SET stock = stock - ? WHERE item_id = ?',
        [item.quantity, item.item_id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          console.log(`Inventory updated for item_id: ${item.item_id}`);
        }
      );
    });
  
    next(); // Proceed to the next function after updating inventory
  });
  

  module.exports = updateInventory;