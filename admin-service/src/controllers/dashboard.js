const asyncHandler = require('express-async-handler');
const db = require('../config/db');
const { get } = require('../routes/dashboard');



//get popular items

const getPopularItems = asyncHandler(async (req, res) => {
    const businessID = req.owner.business_id;
    const { startDate, endDate } = req.params;

    console.log({ "businessID": businessID, "startDate": startDate, "endDate": endDate });

    // SQL Query to retrieve popular items
    const query = `
        SELECT bi.item_id, COUNT(bi.item_id) AS purchase_count
        FROM bill_items bi
        JOIN bill b ON bi.bill_id = b.bill_id
        JOIN business_branch bb ON b.branch_id = bb.branch_id
        WHERE bb.business_id = ? 
        AND b.date_time BETWEEN ? AND ?
        GROUP BY bi.item_id
        ORDER BY purchase_count DESC;
    `;

    try {
        db.query(query, [businessID, startDate, endDate], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                return res.status(200).json(result);
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

       
});


//expired items

const getExpiredItems = asyncHandler(async (req, res) => {
    const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context

    const query =`
            SELECT 
                i.item_id,
                i.item_name,
                i.exp_date,
                bb.branch_name,
                c.category_name,
                c.category_location
            FROM 
                items i
            JOIN 
                business_branch bb ON i.category_id = bb.branch_id 
            JOIN 
                categories c ON i.category_id = c.category_id 
            WHERE 
                bb.business_id = ? 
                AND i.exp_date < CURDATE()`;

    try {
        db.query(query, [businessID], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                return res.status(200).json(result);
            }
        });
        
    } catch (error) {
        console.error("Error fetching expired items:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});




module.exports = { getPopularItems, getExpiredItems };