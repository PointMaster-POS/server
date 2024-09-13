const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const employeeLogginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM employee WHERE employee_email = ?", [email], async (err, result) => {
      if (err) {
        res.status(400).json(err);
        console.log(err);
      } else {
        if (result.length === 0) {
          res.status(401).json({ message: "Invalid email or password" });
        }
        
        const employee = result[0];
        console.log(employee);
        let isMatch = false;

        if (!employee) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        else {
          console.log({employee: employee});

        try {
          isMatch = await bcrypt.compare(password, employee.password);
          if(isMatch) {
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
            res.status(200).json(accessToken);
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal server error" });

        }
      }

        
        
        // if (isMatch) {
        //   const accessToken = jwt.sign(
        //     {
        //       employee: {
        //         employee_name: employee.employee_name,
        //         employee_id: employee.employee_id,
        //         employee_role: employee.role,
        //         email: employee.email,
        //       },
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: "30m" }
        //   );

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
  
       
      }
    }
  );
});


module.exports = {employeeLogginController};