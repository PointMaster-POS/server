const asyncHandler = require('express-async-handler');
const db = require('../config/db');


const getCustomer = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM customer WHERE customer_phone = ? ";
    const phone = req.params.phone;

    db.query(query, [phone], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});



const getCustomerPoints = asyncHandler(async (req, res) => {
    //get customer points by calling customer service microservice
    fetch('http://localhost:3000/customer/points', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error.message });
     });
    
});

module.exports = { getCustomer, getCustomerPoints };
