const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const { sendEmail } = require("../utils/email");
const generatePW = require("generate-password");
const bcrypt = require("bcryptjs");

const getAllEmployees = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM employee WHERE branch_id = ? ";
  const employee_id = req.params.branch_id;

  if (req.owner === undefined && req.employee.role !== "manager") {
    return res.status(400).json({ message: "Unauthorized" });
  }

  db.query(query, [employee_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    }
  });
});

/*
 employee_id | branch_id | employee_name | role | salary | photo_url  | status | employee_email  | password    
*/

const createEmployee = asyncHandler(async (req, res) => {
  const { employee_name, role, salary, birthday, employee_address, phone, photo_url, employee_email } = req.body;
  let branch_id;

  // check if the user is authorized to create employee
  if (req.owner === undefined && req.employee.role !== "manager") {
    return res.status(400).json({ message: "Unauthorized" });
  }

  // if owner is creating employee then branch_id is in the body else it is in the branch
  if (req.owner) {
    branch_id = req.body.branch_id;
  } else {
    branch_id = req.branch.branch_id;
  }

  // check if all fields are present
  if (!employee_name || !role || !salary || !photo_url || !employee_email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // generate password
  const status = 1;
  const password = generatePW.generate({
    length: 10,
    numbers: true,
  });
  const hashedPassword = await bcrypt.hash(password, 10);
  const createEmployeeQuery = `INSERT INTO employee (branch_id, employee_name, role, salary, photo_url, status, employee_email, password, birthday, phone, employee_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const checkEmployeeQuery = `SELECT * FROM employee WHERE employee_email = ? AND branch_id = ?`;

  //check if employee already exists
  db.query(checkEmployeeQuery, [employee_email, branch_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
        return res.status(400).json({ message: "Employee already exists" });
      } else {
        //create employee if not exists
        db.query(
          createEmployeeQuery,
          [
            branch_id,
            employee_name,
            role,
            salary,
            photo_url,
            status,
            employee_email,
            hashedPassword,
            birthday,
            phone,
            employee_address,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              const sendRegistrationMail = async () => {
                try {
                  await sendEmail(
                    employee_email,
                    "PointMaster",
                    "Regaring login credentials",
                    `
                      
  <div style="font-family: Arial, sans-serif; color: #333;">
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
    <img src="../assets/P.png" alt="PointMaster Logo" style="max-width: 100px; height: auto; margin-bottom: 10px;" />
      <h1 style="color: #2c3e50;">Welcome to PointMaster</h1>
    </div>

    <div style="padding: 20px; border: 1px solid #e0e0e0; background-color: #ffffff;">
      <p style="font-size: 16px;">Dear Employee,</p>
      <p style="font-size: 16px;">We are excited to have you onboard! Below are your login credentials to access the PointMaster system:</p>
      <div style="padding: 10px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
        <p><strong>Email:</strong> ${employee_email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p style="font-size: 16px;">Please keep your login credentials secure and do not share them with anyone.</p>
        <p style="font-size: 16px;">You can log in to the PointMaster system using the following link:</p>
        <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #2c3e50; color: #ffffff; text-decoration: none;">Log In</a>
       

      <h2 style="color: #2c3e50; margin-top: 20px;">Benefits of Using PointMaster</h2>
      <ul style="font-size: 16px;">
        <li>Streamlined workflow management for maximum efficiency.</li>
        <li>Real-time insights into sales, inventory, and customer data.</li>
        <li>Access from any location, giving you flexibility.</li>
        <li>Growth opportunities through performance tracking and analytics.</li>
      </ul>

      <p style="font-size: 16px; margin-top: 20px;">We look forward to seeing you succeed with us!</p>
    </div>

    <div style="background-color: #2c3e50; color: #ffffff; padding: 10px; text-align: center;">
      <p>&copy; 2024 PointMaster | All rights reserved.</p>
    </div>
  </div>
          
                      `
                  );
                } catch (error) {
                  console.error("Error in send Registration Email:", error);
                }
              };

              sendRegistrationMail();

              return res
                .status(201)
                .json({ message: "Employee created successfully" });
            }
          }
        );
      }
    }
  });
});

module.exports = { getAllEmployees, createEmployee };
