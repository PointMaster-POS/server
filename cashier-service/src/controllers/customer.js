const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const axios = require("axios");

const getCustomer = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM customer WHERE customer_phone = ? ";
  const phone = req.params.phone;
  const business_id = req.business.business_id;
  

  db.query(query, [phone], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
       
        // get customer points from database
        const customer_id = result[0].customer_id;
        const points_query =
          "SELECT points  FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ? ";
        const loyalty_id_query =
          "SELECT loyalty_program_id FROM loyalty_programs WHERE business_id = ? ";

        db.query(loyalty_id_query, [business_id], (err, loyalty_id) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          } else {
            loyalty_id = loyalty_id[0].loyalty_program_id;
            db.query(points_query, [customer_id, loyalty_id], (err, points) => {
                if (err) {
                  return res.status(500).json({ message: err.message });
                } else {
                  if (result.length > 0) {
                    //integrate customer points with customer details
                    return res
                      .status(200)
                      .json({ ...result[0], points: points[0].points });
                  } else {
                    return res.status(404).json({ message: "Customer not found" });
                  }
                }
              });
          }
        });

        
      } else {
        return res.status(404).json({ message: "Customer not found" });
      }
    }
  });
});

// const getCustomerPoints = asyncHandler(async (req, res) => {
//     //get customer points by calling customer service microservice
//     fetch('http://localhost:3000/customer/points', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             res.status(200).json(data);
//         })
//         .catch((error) => {
//             res.status(500).json({ message: error.message });
//      });

// });

module.exports = { getCustomer };
