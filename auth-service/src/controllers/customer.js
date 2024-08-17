const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const customerLogginController = asyncHandler(async (req, res) => {
    const { email, hashed_password } = req.body;
    db.query("SELECT * FROM customer WHERE customer_mail = ?", [email], (err, result) => {
      if (err) {
        res.status(400).json({ message: "error" });
        console.log(err);
      } else {
        console.log(result);
        const customer = result[0];
        if (bcrypt.compare(hashed_password, customer.password)) {
          const accessToken = jwt.sign(
            {
              employee: {
                customer_name: customer.customer_name,
                customer_id: customer.customer_id,
                customer_mail: customer.customer_mail,
              },
            },
            "panadura",
            { expiresIn: "30m" }
          );

          // const refreshToken = jwt.sign(
          //   {
          //     employee: {
          //       customer_name: customer.customer_name,
          //       customer_id: customer.customer_id,
          //       customer_mail: customer.customer_mail,
          //     },
          //   },
          //   "panadura",
          //   { expiresIn: "120m" }
          // );
  
          res.status(200).json(accessToken);
        } else {
          res.status(401).json({ message: "Login failed" });
        }
      }
    }
  );
});

module.exports = {customerLogginController};
