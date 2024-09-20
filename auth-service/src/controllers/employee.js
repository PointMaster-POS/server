const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee"); 
const Business = require("../models/business");
const { Op } = require('sequelize');


const employeeLogginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the email corresponds to an employee
    let employee = await Employee.findOne({ where: { employee_email: email } });

    if (employee) {
      const isMatch = await bcrypt.compare(password, employee.password);
      if (isMatch) {
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
        return res.status(200).json({ accessToken });
      }
    }

    // If not found as an employee, check if it's a business owner
    let business = await Business.findOne({ where: { 
      [Op.or]: [
        { business_owner_mail: email },
        { business_mail: email }
      ]
    }});

    if (business) {
      const isMatch = await bcrypt.compare(password, business.business_password);
      if (isMatch) {
        const accessToken = jwt.sign(
          {
            owner: {
              business_name: business.business_name,
              business_id: business.business_id,
              email: business.business_owner_mail,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30m" }
        );
        return res.status(200).json({ accessToken });
      }
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    
    return res.status(500).json({ message: "Error processing request", error });
  }
});

module.exports = { employeeLogginController };
