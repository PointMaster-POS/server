const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const sendEmail = require("../utils/email");
const generatePW = require("generate-password");
const bcrypt = require("bcryptjs");

const getEmployee = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM employee WHERE employee_id = ? ";
  const employee_id = req.params.employee_id;

  db.query(query, [employee_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
        return res.status(200).json(result[0]);
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
  const { employee_name, role, salary, photo_url, employee_email } = req.body;
  const branch_id = req.branch.branch_id;
  const status = 1;
  const password = generatePW.generate({
    length: 10,
    numbers: true,
  });
  const hashedPassword = await bcrypt.hash(password, 10);
  const createEmployeeQuery = `INSERT INTO employee (branch_id, employee_name, role, salary, photo_url, status, employee_email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const checkEmployeeQuery = `SELECT * FROM employee WHERE employee_email = ? AND branch_id = ?`;
  db.query(checkEmployeeQuery, [employee_email, branch_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      if (result.length > 0) {
        return res.status(400).json({ message: "Employee already exists" });
      } else {
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
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              sendEmail(
                employee_email,
                "Employee Account Created",
                `Your account has been created. Your password is ${password}`
              );
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
