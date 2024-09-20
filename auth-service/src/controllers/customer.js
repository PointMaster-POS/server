const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

const customerLogginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Query the database to find the customer by email
    const customer = await Customer.findOne({ where: { customer_mail: email } });

    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, customer.password);

    if (isMatch) {
      // Generate JWT access token
      const accessToken = jwt.sign(
        {
          customer: {
            customer_name: customer.customer_name,
            customer_id: customer.customer_id,
            customer_mail: customer.customer_mail,
            customer_phone: customer.customer_phone,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );

      // Send response with access token
      return res.json({ accessToken });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
});

module.exports = { customerLogginController };
