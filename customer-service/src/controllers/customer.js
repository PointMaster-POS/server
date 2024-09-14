const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");


// Register new customer
const registerCustomer = asyncHandler(async (req, res) => {
  // Hash the password
  const saltRounds = 10;
  const {
    customer_name,
    customer_mail,
    customer_phone,
    birthday,
    gender,
    password,
  } = req.body;
  //hashing the password
  const hashed_pw = await bcrypt.hash(password, saltRounds);

  if (!customer_name || !customer_mail || !hashed_pw) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  // Check if the email is already registered
  const checkEmailQuery = `SELECT * FROM customer WHERE customer_mail = ?`;
  db.query(checkEmailQuery, [customer_mail], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If email does not exist, proceed with registration
    const registerCustomerQuery = `INSERT INTO customer (customer_name, customer_mail, customer_phone, birthday, gender, password) VALUES (?,?,?,?,?,?)`;

    db.query(
      registerCustomerQuery,
      [
        customer_name,
        customer_mail,
        customer_phone,
        birthday,
        gender,
        hashed_pw,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          return res
            .status(201)
            .json({ message: "Customer registered successfully" });
        }
      }
    );
  });
});

//controller to get all customers
const getAllCustomers = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM customer";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json(results);
  });
});

//controller to update customer details , by decoding the token and getting the customer id
//protected route
const updateCustomer = asyncHandler(async (req, res) => {
  const { customer_name, customer_mail, customer_phone, birthday, gender } =
    req.body;

    console.log(req.body);

  const query = `UPDATE customer SET customer_name = ?, customer_mail = ?, customer_phone = ?, birthday = ?, gender = ? WHERE customer_id = ?`;

  const customer_id = req.customer.customer_id;
  //query to update customer
  db.query(
    query,
    [
      customer_name,
      customer_mail,
      customer_phone,
      birthday,
      gender,
      customer_id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(200).json({ message: "Customer updated successfully" });
    }
  );
});

//controller to delete customer
//protected route
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;
  const query = `DELETE FROM customer WHERE customer_id = ?`;
  db.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json({ message: "Customer deleted successfully" });
  });
});

const getCustomerPhone = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;
  const query = `SELECT customer_phone FROM customer WHERE customer_id = ?`;
  db.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json(results[0]);
  });
});

const getCustomerDetails = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;
  const query = `SELECT * FROM customer WHERE customer_id = ?`;
  db.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json(results[0]);
  });
});


module.exports = {
  registerCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerPhone,
  getCustomerDetails,
};
