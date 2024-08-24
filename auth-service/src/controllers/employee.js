const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const employeeLogginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
    } else {
    db.query("SELECT * FROM employee WHERE email = ?", [email], (err, result) => {
      if (err) {
        res.status(400).json({ message: "error" });
        console.log(err);
      } else {
        
        const employee = result[0];
        
      
        if (!employee) {
          res.status(401).json({ message: "Login failed" });
        } else {
        bcrypt.compare(password, employee?.password, (err, result) => {
          if (err) {
            res.status(400).json({ message: "error" });
            console.log(err);
          }
          if (result) {
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
      
      });
    }
    }
    }
  );
}
});


module.exports = {employeeLogginController};