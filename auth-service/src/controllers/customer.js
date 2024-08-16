const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const customerLogginController = asyncHandler(async (req, res) => {
    const { email, hashed_password } = req.body;
    db.query("SELECT * FROM employee WHERE email = ?", [email], (err, result) => {
      if (err) {
        res.status(400).json({ message: "error" });
        console.log(err);
      } else {
        console.log(result);
        const employee = result[0];
        if (bcrypt.compare(hashed_password, employee.employee_password)) {
          const accessToken = jwt.sign(
            {
              employee: {
                employee_name: employee.employee_name,
                role: employee.role,
                photo_url: employee.photo_url,
              },
            },
            "panadura",
            { expiresIn: "30m" }
          );
  
          res.status(200).json(accessToken);
        } else {
          res.status(401).json({ message: "Login failed" });
        }
      }
    }
  );
});

module.exports = {customerLogginController};
