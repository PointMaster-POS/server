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
  //need to get items expires withing month

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
                AND i.exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH);
        `;
                

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

//get number of customers of business
const getNumberOfCustomers = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context

  const query = `
    SELECT COUNT(DISTINCT customer_id) AS numberOfCustomers
    FROM customer_loyalty cl
    INNER JOIN loyalty_programs lp ON cl.loyalty_program_id = lp.loyalty_program_id
    WHERE lp.business_id = ?
  `;

  try {
    db.query(query, [businessID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        return res.status(200).json({ numberOfCustomers: result[0].numberOfCustomers });
      }
    });
  } catch (error) {
    console.error("Error fetching number of customers:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});


const customerProfileWithMostPoints = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context

  const query = `
    SELECT c.customer_id, c.customer_name, c.photo_url, c.customer_mail, c.customer_phone, c.birthday, c.gender, cl.totalPoints
    FROM customer c
    INNER JOIN (
      SELECT customer_id, SUM(points) AS totalPoints
      FROM customer_loyalty cl
      INNER JOIN loyalty_programs lp ON cl.loyalty_program_id = lp.loyalty_program_id
      WHERE lp.business_id = ?
      GROUP BY customer_id
      ORDER BY totalPoints DESC
      LIMIT 1
    ) cl ON c.customer_id = cl.customer_id
  `;

  try {
    db.query(query, [businessID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        if (result.length > 0) {
          return res.status(200).json(result[0]);
        } else {
          return res.status(404).json({ message: "No customers found." });
        }
      }
    });
  } catch (error) {
    console.error("Error fetching customer with most points:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const salesByPaymentMethod = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context

  // SQL Query to retrieve sales grouped by payment method and branch
  const query = `
    SELECT b.payment_method, bb.branch_name, COUNT(b.bill_id) AS total_sales
    FROM bill b
    INNER JOIN business_branch bb ON b.branch_id = bb.branch_id
    WHERE bb.business_id = ?
    GROUP BY b.payment_method, bb.branch_name
  `;

  try {
    // Execute the query
    db.query(query, [businessID], (err, result) => {
      if (err) {
        // Send error response if something goes wrong
        return res.status(500).json({ message: err.message });
      } else {
        // Send the resulting data back in the response
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    // Catch any other errors that occur and send an error response
    console.error("Error fetching sales by payment method:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

const getBillsBetweenDates = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context
  const { startDate, endDate } = req.params; // Extract startDate and endDate from query params

  // Ensure both startDate and endDate are provided
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Please provide both startDate and endDate." });
  }

  const query = `
            SELECT 
                DATE(date_time) AS bill_date, 
                COUNT(*) AS number_of_bills 
            FROM 
                bill 
            WHERE 
                branch_id IN (
                  SELECT branch_id 
                  FROM business_branch 
                  WHERE business_id = ?
                )
                AND date_time BETWEEN ? AND ? 
            GROUP BY 
                DATE(date_time) 
            ORDER BY 
                DATE(date_time)`;

  try {
    db.query(query, [businessID, startDate, endDate], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error("Error fetching bills between dates:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

const getBranchPerformanceReport = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; // Assuming the business ID is stored in the request context
  const { startDate, endDate } = req.params; // Get start and end date from request parameters

  const query = `
      SELECT 
          bb.branch_name, 
          SUM(b.total_price) AS total_sales, 
          COUNT(b.bill_id) AS number_of_bills 
      FROM 
          bill b 
      JOIN 
          business_branch bb ON b.branch_id = bb.branch_id 
      WHERE 
          bb.business_id = ? 
          AND b.date_time BETWEEN ? AND ? 
      GROUP BY 
          bb.branch_name;
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
      console.error("Error fetching branch performance data:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


const getItemsWithLowStock = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id; 
  const minStock = req.params.minStock; 

  console.log({ businessID, minStock });
  const query = `
      SELECT 
            i.item_id, 
            i.item_name, 
            i.stock, 
            i.image_url,
            i.status,
            c.category_name,
            c.category_location
        FROM 
            items i
        JOIN 
            categories c ON i.category_id = c.category_id
        WHERE 
            i.stock <= ? 
            AND i.status = 1
            AND i.category_id IN (
                SELECT 
                    category_id 
                FROM 
                    business_branch bb 
                JOIN 
                    categories cat ON bb.branch_id = cat.branch_id 
                WHERE 
                    bb.business_id = ?
            );
  `;

  try {
      db.query(query, [minStock, businessID], (err, result) => {
          if (err) {
              return res.status(500).json({ message: err.message });
          } else {
            console.log(result);
            console.log({minStock});
              return res.status(200).json(result);
          }
      });
  } catch (error) {
      console.error("Error fetching items with low stock:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

//get number of employees for business
const getNumberOfEmployeesBusiness = asyncHandler(async (req, res) => {
  const businessID = req.owner.business_id;

  const query = `
    SELECT COUNT(e.employee_id) AS employeeCount
    FROM employee e
    JOIN business_branch bb ON e.branch_id = bb.branch_id
    WHERE bb.business_id = ?;
  `;

  try {
    db.query(query, [businessID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        const { employeeCount } = result[0];
        return res.status(200).json({ employeeCount });
      }
    });
  } catch (error) {
    console.error("Error fetching the number of employees for the business:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// const 







module.exports = {
  getPopularItems,
  getExpiredItems,
  getNumberOfBillsPerMonth,
  getServiceTimeReport,
  getNumberOfCustomers,
  customerProfileWithMostPoints,
  salesByPaymentMethod,
  getBillsBetweenDates,
  getBranchPerformanceReport,
  getItemsWithLowStock,
  getNumberOfEmployeesBusiness,
};
