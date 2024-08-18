const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const employeeLogginController = asyncHandler(async (req, res) => {
    const { email, hashed_password } = req.body;
    db.query("SELECT * FROM employee WHERE email = ?", [email], (err, result) => {
      if (err) {
        res.status(400).json({ message: "error" });
        console.log(err);
      } else {
        console.log(result);
        const employee = result[0];
        console.log(process.env.ACCESS_TOKEN_SECRET);
        if (bcrypt.compare(hashed_password, employee.password)) {
          const accessToken = jwt.sign(
            {
              employee: {
                employee_name: employee.employee_name,
                employee_id: employee.employee_id,
                employee_role: employee.role,
                email: employee.email,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
          );

          // const refreshToken = jwt.sign(
          //   {
          //     employee: {
          //       employee_name: employee.employee_name,
          //       employee_id: employee.employee_id,
          //       email: employee.email,
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


module.exports = {employeeLogginController};