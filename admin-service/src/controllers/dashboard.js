const asyncHandler = require("express-async-handler");
const db = require("../config/db");


//get popular items

const getPopularItems = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id;
  const { startDate, endDate } = req.params;
  console.log({
    businessID: businessID,
    startDate: startDate,
    endDate: endDate,
  });

    let popularItems = [];

  // SQL Query to retrieve popular items
  const query = `
       SELECT 
    bi.item_id, 
    i.minimum_stock,
    i.image_url,
    i.item_name, 
    i.price, 
    COUNT(bi.item_id) AS purchase_count
FROM 
    bill_items bi
JOIN 
    bill b ON bi.bill_id = b.bill_id
JOIN 
    business_branch bb ON b.branch_id = bb.branch_id
JOIN 
    items i ON bi.item_id = i.item_id -- Join to get item details
WHERE 
    bb.business_id = ? 
    AND b.date_time BETWEEN ? AND ?
GROUP BY 
    bi.item_id, i.item_name, i.price
ORDER BY 
    purchase_count DESC;
    `;

  try {
    db.query(query, [businessID, startDate, endDate], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        popularItems = result;
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  console.log({ popularItems: popularItems });
});

//expired items
const getExpiredItems = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context

  const query = `
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
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//get Number of bills per month

/*
    SELECT 
    DATE_FORMAT(b.date_time, '%Y-%m') AS bill_month, 
    COUNT(b.bill_id) AS number_of_bills
FROM 
    bill b
JOIN 
    business_branch bb ON b.branch_id = bb.branch_id
WHERE 
    bb.business_id = ? 
    AND b.date_time BETWEEN ? AND ?
GROUP BY 
    bill_month
ORDER BY 
    bill_month ASC;
*/

const getNumberOfBillsPerMonth = (req, res) => {
  const { startMonth, endMonth } = req.params;

  // Assuming the business ID is part of the request (added through token validation)
  const business_id = req.owner.business_id;

  // Define the SQL query
  const sqlQuery = `
      SELECT 
        DATE_FORMAT(b.date_time, '%Y-%m') AS bill_month, 
        COUNT(b.bill_id) AS number_of_bills
      FROM 
        bill b
      JOIN 
        business_branch bb ON b.branch_id = bb.branch_id
      WHERE 
        bb.business_id = ? 
        AND b.date_time BETWEEN ? AND ?
      GROUP BY 
        bill_month
      ORDER BY 
        bill_month ASC;
    `;

  // Execute the query with the provided business ID, startMonth, and endMonth
  db.query(
    sqlQuery,
    [business_id, `${startMonth}-01`, `${endMonth}-31`],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      // Send the query results as the response
      res.status(200).json({
        message: `Number of bills for business ${business_id} from ${startMonth} to ${endMonth}`,
        data: results,
      });
    }
  );
};

// Function to get the Service Time Report
const getServiceTimeReport = asyncHandler(async (req, res) => {
    const businessId = req.owner.business_id;
    const { startDate, endDate } = req.query;

    // SQL query to fetch the number of bills created in the given date range
    const query = `
        SELECT 
            DATE_FORMAT(b.date_time, '%Y-%m-%d') AS transaction_date,
            COUNT(b.bill_id) AS number_of_bills
        FROM 
            bill b
        JOIN 
            business_branch bb ON b.branch_id = bb.branch_id
        WHERE 
            bb.business_id = ? 
            AND b.date_time BETWEEN ? AND ?
        GROUP BY 
            transaction_date
        ORDER BY 
            transaction_date ASC;
    `;

    db.query(query, [businessId, startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        // Placeholder for service time calculation logic if needed
        // This can be based on business-specific logic or hardcoded values

        res.status(200).json({
            message: 'Service time report retrieved successfully',
            data: results
        });
    });
});


module.exports = {
  getPopularItems,
  getExpiredItems,
  getNumberOfBillsPerMonth,
  getServiceTimeReport,
};
