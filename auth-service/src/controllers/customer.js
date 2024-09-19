const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const customerLogginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  
  // Query the database to find the customer by email
  db.query("SELECT * FROM customer WHERE customer_mail = ?", [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const customer = result[0];

    // Compare the provided password with the hashed password in the database
    try {
      const isMatch = await bcrypt.compare(password, customer.password);

      if (isMatch) {
        // Generate JWT access token
        const accessToken = jwt.sign(
          {
            customer: {
              customer_name: customer.customer_name,
              customer_id: customer.customer_id,
              customer_mail: customer.customer_mail,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30m' }
        );

        // Optionally, generate a refresh token (commented out in your code)
        // const refreshToken = jwt.sign(
        //   {
        //     customer: {
        //       customer_name: customer.customer_name,
        //       customer_id: customer.customer_id,
        //       customer_mail: customer.customer_mail,
        //     },
        //   },
        //   process.env.REFRESH_TOKEN_SECRET, // Should use a different secret for refresh tokens
        //   { expiresIn: '120m' }
        // );

        // Send response with access token
        return res.json({ accessToken });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error comparing passwords' });
    }
  });
});

module.exports = { customerLogginController };
