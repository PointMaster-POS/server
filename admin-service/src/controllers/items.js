const asyncHandler = require("express-async-handler");
const db = require("../config/db");


/*
+---------------+--------------+------+-----+---------+-------+
| item_id       | varchar(36)  | NO   | PRI | NULL    |       |
| category_id   | varchar(36)  | NO   | MUL | NULL    |       |
| item_name     | varchar(255) | NO   |     | NULL    |       |
| minimum_stock | float        | YES  |     | NULL    |       |
| barcode       | varchar(255) | YES  |     | NULL    |       |
| stock         | float        | YES  |     | NULL    |       |
| price         | float        | YES  |     | NULL    |       |
| image_url     | longblob     | YES  |     | NULL    |       |
| exp_date      | date         | YES  |     | NULL    |       |
| discount      | float        | YES  |     | NULL    |       |
| supplier_name
*/

//check if item already exists by barcode and item name

const createItem = asyncHandler(async (req, res) => {
    //check if item already exists
    const { category_id, item_name, minimum_stock, barcode, stock, price, image_url, exp_date, discount, supplier_name } = req.body;
    if (!category_id || !item_name || !minimum_stock || !barcode || !stock || !price || !image_url || !exp_date || !discount || !supplier_name) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const itemCheckQuery = `SELECT * FROM items WHERE barcode = ? AND item_name = ?`;
    const itemCreateQuery = `INSERT INTO items (category_id, item_name, minimum_stock, barcode, stock, price, image_url, exp_date, discount, supplier_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(itemCheckQuery, [barcode, item_name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            if (result.length > 0) {
                return res.status(400).json({ message: "Item already exists" });
            } else {
                db.query(
                    itemCreateQuery,
                    [category_id, item_name, minimum_stock, barcode, stock, price, image_url, exp_date, discount, supplier_name],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        } else {
                            return res.status(201).json({ message: "Item created successfully" });
                        }
                    }
                );
            }
        }
    }
    );
});

const getItemsByCategory = asyncHandler(async (req, res) => {
    const category_id = req.params.category_id;
    const getItemsQuery = `SELECT * FROM items WHERE category_id = ?`;
    db.query(getItemsQuery, [category_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json(result);
        }
    });
});

const updateItem = asyncHandler(async (req, res) => {
    const item_id = req.params.item_id;
    const { category_id, item_name, minimum_stock, barcode, stock, price, image_url, exp_date, discount, supplier_name } = req.body;
    if (!category_id || !item_name || !minimum_stock || !barcode || !stock || !price ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const updateItemQuery = `UPDATE items SET category_id = ?, item_name = ?, minimum_stock = ?, barcode = ?, stock = ?, price = ?, image_url = ?, exp_date = ?, discount = ?, supplier_name = ? WHERE item_id = ?`;
    db.query(
        updateItemQuery,
        [category_id, item_name, minimum_stock, barcode, stock, price, image_url, exp_date, discount, supplier_name, item_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Item not found" });
                }
                return res.status(200).json({ message: "Item updated successfully" });
            }
        }
    );
}
);

const deleteItem = asyncHandler(async (req, res) => {
    const item_id = req.params.item_id;
    const deleteItemQuery = `DELETE FROM items WHERE item_id = ?`;
    db.query(deleteItemQuery, [item_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Item not found" });
            }
            return res.status(200).json({ message: "Item deleted successfully" });
        }
    });
}
);

module.exports = { createItem, getItemsByCategory, updateItem, deleteItem };
